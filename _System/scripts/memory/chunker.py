"""
chunker.py — Core chunking & metadata library for PARA Vault Memory Index.
"""
from __future__ import annotations
import re
from dataclasses import dataclass
from pathlib import PurePosixPath
from typing import Optional
import yaml

@dataclass(slots=True)
class Chunk:
    heading: Optional[str]
    text: str
    char_offset: int

MAX_CHUNK_CHARS = 1200
WINDOW_SIZE = 1000
WINDOW_OVERLAP = 200
_HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
_PARA_MAP = {"01-Projects": "Projects", "02-Areas": "Areas", "03-Resources": "Resources", "04-Archives": "Archives", "_System": "System"}
_KNOWN_DOMAINS = {
    "knowledge/research", "skills-development", "health/wellness", "health/medicinal-mushrooms",
    "health/hormonal-health", "health/natural-medicine", "health/biohacking", "occult/esoteric-knowledge",
    "occult/ceremonial-magic", "occult/hermetic-alchemy", "occult/thelemic-tradition", "occult/divination-healing",
    "general/uncategorized", "technology/engineering", "technology/mems", "technology/electromagnetics",
    "alternative-science/hidden-history", "alternative-science/exploration", "alternative-science/water-science",
    "alternative-science/sacred-geometry", "alternative-science/biogeometry", "critical-thinking/hidden-knowledge",
    "critical-thinking/power-analysis", "critical-thinking/david-icke", "phassion/research",
    "spirituality/mysticism", "spirituality/personal-journey", "consciousness/altered-states",
    "consciousness/psychedelics", "consciousness/lucid-dreaming", "personal-development/growth",
    "nature/permaculture", "law/legal-systems", "philosophy/esoteric-philosophy", "economics/banking-systems"
}

def split_by_headings(text):
    matches = list(_HEADING_RE.finditer(text))
    if not matches: return [(None, text.strip())] if text.strip() else []
    sections = []
    pre = text[:matches[0].start()].strip()
    if pre: sections.append((None, pre))
    for i, m in enumerate(matches):
        heading = m.group(2).strip()
        start, end = m.end(), matches[i+1].start() if i+1 < len(matches) else len(text)
        body = text[start:end].strip()
        if body or heading: sections.append((heading, body))
    return sections

def split_paragraphs(text, max_chars=MAX_CHUNK_CHARS):
    raw_paras = re.split(r"\n{2,}", text)
    result = []
    for para in raw_paras:
        para = para.strip()
        if not para: continue
        if len(para) <= max_chars: result.append(para)
        else: result.extend(sliding_window(para, WINDOW_SIZE, WINDOW_OVERLAP))
    return result

def sliding_window(text, size=WINDOW_SIZE, overlap=WINDOW_OVERLAP):
    if len(text) <= size: return [text.strip()] if text.strip() else []
    chunks, step, pos = [], size - overlap, 0
    while pos < len(text):
        window = text[pos : pos + size].strip()
        if window: chunks.append(window)
        pos += step
    return chunks

def chunk_markdown(text):
    sections, chunks, search_start = split_by_headings(text), [], 0
    for heading, body in sections:
        if not body: continue
        idx = text.find(body[:80], search_start)
        base_offset = idx if idx >= 0 else search_start
        if len(body) <= MAX_CHUNK_CHARS: chunks.append(Chunk(heading=heading, text=body, char_offset=base_offset))
        else:
            paras, para_offset = split_paragraphs(body, MAX_CHUNK_CHARS), base_offset
            for para in paras:
                p_idx = text.find(para[:60], para_offset)
                offset = p_idx if p_idx >= 0 else para_offset
                chunks.append(Chunk(heading=heading, text=para, char_offset=offset))
                para_offset = offset + len(para)
        search_start = base_offset + len(body)
    return chunks

def chunk_txt(text):
    paras, chunks, offset = split_paragraphs(text, MAX_CHUNK_CHARS), [], 0
    for para in paras:
        idx = text.find(para[:60], offset)
        real_offset = idx if idx >= 0 else offset
        chunks.append(Chunk(heading=None, text=para, char_offset=real_offset))
        offset = real_offset + len(para)
    return chunks

_FM_RE = re.compile(r"\A---\s*\n(.*?\n)---\s*\n?", re.DOTALL)
def extract_frontmatter(text):
    m = _FM_RE.match(text)
    if not m: return None, text
    try:
        data = yaml.safe_load(m.group(1))
        return (data, text[m.end():]) if isinstance(data, dict) else (None, text)
    except: return None, text

def infer_para(rel_path):
    if rel_path.startswith("EXTERNAL/"):
        return "Annamaya"
    parts = PurePosixPath(rel_path).parts
    return _PARA_MAP.get(parts[0], "Root") if parts else "Root"

def infer_domain(rel_path):
    parts = list(PurePosixPath(rel_path).parts)
    if not parts: return "General/Uncategorized"
    if parts[0].lower() in [k.lower() for k in _PARA_MAP.keys()]: parts = parts[1:]
    if parts: parts = parts[:-1]
    if not parts: return "General/Uncategorized"
    if len(parts) >= 2:
        cand = f"{parts[0]}/{parts[1]}"
        if cand.lower() in _KNOWN_DOMAINS: return cand
    return parts[0]
