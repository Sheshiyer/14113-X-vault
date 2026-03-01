"""
walker.py — File walker and graph analysis for PARA Vault.
"""
from __future__ import annotations
import hashlib
import os, time, sys, re
from pathlib import Path
from typing import Generator, List, Set
from chunker import infer_para, infer_domain

_SKIP_DIRS = {".git", ".obsidian", ".venv-meru", ".venv", "node_modules", "__pycache__", ".DS_Store"}
DEFAULT_EXTENSIONS = {".md", ".txt"}
ALL_EXTENSIONS = {".md", ".txt", ".pdf", ".epub", ".docx"}

def walk_vault(
    root: str | Path,
    extensions: set[str] | None = None,
    min_bytes: int = 100,
) -> Generator[tuple[str, str], None, None]:
    """Walk the vault yielding (abs_path, rel_path) for indexable files.

    Parameters
    ----------
    extensions : set[str] or None
        File extensions to include. Defaults to DEFAULT_EXTENSIONS (.md, .txt).
        Pass ALL_EXTENSIONS to include binary formats.
    min_bytes : int
        Minimum file size in bytes.
    """
    if extensions is None:
        extensions = DEFAULT_EXTENSIONS
    root = str(root)
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in _SKIP_DIRS and not d.startswith(".venv")]
        for fname in filenames:
            ext = os.path.splitext(fname)[1].lower()
            if ext in extensions:
                abs_path = os.path.join(dirpath, fname)
                try:
                    if os.path.getsize(abs_path) >= min_bytes:
                        yield abs_path, os.path.relpath(abs_path, root)
                except OSError:
                    continue

def detect_islands(root: str | Path, mocs: List[str]) -> List[str]:
    """Find files with no inbound links from the root MOCs."""
    root = Path(root)
    all_md = {Path(p).stem for _, p in walk_vault(root, extensions={".md"})}
    linked = set()
    link_pattern = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
    
    for moc in mocs:
        p = root / moc
        if p.exists():
            linked.update(link_pattern.findall(p.read_text(errors='ignore')))
    
    # Islands are markdown files not in the linked set
    islands = [name for name in all_md if name not in linked and name not in [Path(m).stem for m in mocs]]
    return islands

def get_moc_links(root: str | Path) -> Set[str]:
    """Extract all wikilink targets from all root MOC and Index files."""
    links = set()
    root_path = Path(root)
    
    # Identify all Map of Content and Index files in the root
    moc_files = list(root_path.glob("*-MOC.md")) + list(root_path.glob("*-Index.md"))
    # Always include the master System-MOC if it doesn't match the glob
    if (root_path / "System-MOC.md") not in moc_files:
        moc_files.append(root_path / "System-MOC.md")

    pattern = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
    
    for moc_path in moc_files:
        if not moc_path.exists():
            continue
        try:
            content = moc_path.read_text(errors='ignore')
            found = pattern.findall(content)
            links.update(found)
        except:
            pass
    return links

_MOC_LINKS = None


def _compute_prana_signals(rel_path, vault_root=None, text=None):
    abs_path = os.path.join(vault_root or os.getcwd(), rel_path)
    now = time.time()
    age_days = 3650.0
    try:
        mtime = os.path.getmtime(abs_path)
        age_days = max(0.0, (now - mtime) / 86400.0)
    except Exception:
        pass

    body = str(text or "")
    link_count = len(re.findall(r"\[\[[^\]]+\]\]", body))
    link_signal = min(link_count / 8.0, 1.0)
    recency_signal = 1.0 / (1.0 + (age_days / 30.0))
    prana_score = (0.55 * link_signal) + (0.45 * recency_signal)

    return {
        "link_count": int(link_count),
        "age_days": round(age_days, 3),
        "recency_score": round(recency_signal, 4),
        "prana_score": round(prana_score, 4),
    }

def build_meta(rel_path, heading, frontmatter, chunk_idx, vault_root=None, text=None, quality_score=1.0):
    global _MOC_LINKS
    if _MOC_LINKS is None:
        # Dynamically determine the vault root if not provided
        root = vault_root or os.getcwd()
        _MOC_LINKS = get_moc_links(root)

    tags = []
    if frontmatter:
        raw = frontmatter.get("tags") or frontmatter.get("tag") or []
        tags = raw if isinstance(raw, list) else [raw]
    
    para = infer_para(rel_path)
    is_archive = para == "Archives"
    
    # Base Priority weighting
    priority = 1.0
    if is_archive:
        priority = 0.5
    elif para == "Projects":
        priority = 1.5
    elif para == "Areas":
        priority = 1.2
    
    # Enhancement #2: MOC-Guided "High-Prana" Boost
    file_stem = Path(rel_path).stem
    if file_stem in _MOC_LINKS:
        priority += 0.5  # Boost files explicitly linked in the System MOC

    # Day 5: Quality Signal Boost
    priority *= (0.5 + (quality_score * 0.5))
    prana = _compute_prana_signals(rel_path, vault_root=vault_root, text=text)
    priority *= (0.75 + (0.5 * prana["prana_score"]))

    meta = {
        "path": rel_path,
        "para": para,
        "is_archive": is_archive,
        "priority": round(priority, 3),
        "quality_score": quality_score,
        "prana_score": prana["prana_score"],
        "recency_score": prana["recency_score"],
        "age_days": prana["age_days"],
        "link_count": prana["link_count"],
        "domain": infer_domain(rel_path),
        "heading": heading,
        "frontmatter_tags": [str(t) for t in tags],
        "chunk_index": chunk_idx,
        "enneagram_uuid": f"E{para[0]}{len(rel_path)}"
    }
    if text:
        text_str = str(text)
        meta["text"] = text_str
        meta["content_hash"] = hashlib.sha256(text_str.encode("utf-8")).hexdigest()
    return meta

def safe_read(path):
    try:
        with open(path, encoding="utf-8") as f: return f.read()
    except:
        with open(path, encoding="latin-1") as f: return f.read()

def is_noisy(content): return False
def prepend_context(text, rel, head): return f"File: {rel}\nSection: {head}\n{text}" if head else f"File: {rel}\n{text}"

class ProgressTracker:
    def __init__(self, total, every=500): self.total, self.every, self.start = total, every, time.monotonic()
    def update(self, curr): pass
    def finish(self): pass
