#!/usr/bin/env python3
"""
MOC Link Suggester — Suggests MOC connections for unlinked vault files

Uses multiple signals:
1. Folder proximity (same folder or parent has MOC)
2. Keyword overlap between file and MOC content
3. PARA category matching
"""

import os
import re
import yaml
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
import argparse


class MOCSuggester:
    def __init__(self, vault_path: str):
        self.vault_path = Path(vault_path).expanduser().resolve()
        self.mocs: Dict[str, dict] = {}  # moc_path -> {title, links, keywords, para_category}
        self.unlinked_files: List[Path] = []
        self.suggestions: List[dict] = []
        
        # PARA folder patterns
        self.para_patterns = {
            'projects': ['project', 'projects'],
            'areas': ['area', 'areas'],
            'resources': ['resource', 'resources'],
            'archive': ['archive', 'archives']
        }
    
    def is_moc_file(self, file_path: Path, content: str) -> bool:
        """Check if file is a MOC via multiple heuristics."""
        # Check YAML frontmatter
        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = yaml.safe_load(parts[1])
                    if frontmatter and isinstance(frontmatter, dict):
                        fm_type = frontmatter.get('type', '').lower()
                        fm_tags = frontmatter.get('tags', [])
                        if isinstance(fm_tags, str):
                            fm_tags = [fm_tags]
                        if fm_type == 'moc' or 'moc' in fm_tags:
                            return True
            except yaml.YAMLError:
                pass
        
        # Check filename patterns
        fname = file_path.name.lower()
        if 'moc' in fname or fname.endswith('_index.md') or fname.endswith('-index.md'):
            return True
        
        return False
    
    def extract_wiki_links(self, content: str) -> Set[str]:
        """Extract wiki links [[Page]] or [[Page|Display]]."""
        pattern = r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]'
        return set(re.findall(pattern, content))
    
    def extract_keywords(self, content: str) -> Set[str]:
        """Extract meaningful keywords from content."""
        # Remove frontmatter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                content = parts[2]
        
        # Remove wiki links but keep the text
        content = re.sub(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]', r'\1', content)
        
        # Extract words (alphanumeric, 3+ chars)
        words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
        
        # Common stop words to filter
        stop_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'etc', 'viz'}
        
        return set(w for w in words if w not in stop_words)
    
    def get_para_category(self, file_path: Path) -> Optional[str]:
        """Determine PARA category from file path."""
        path_lower = str(file_path).lower()
        for category, patterns in self.para_patterns.items():
            if any(p in path_lower for p in patterns):
                return category
        return None
    
    def scan_vault(self):
        """Scan vault for MOCs and unlinked files."""
        print(f"🔍 Scanning vault: {self.vault_path}")
        
        all_md_files = list(self.vault_path.rglob('*.md'))
        all_links = defaultdict(set)  # linked_file -> set of mocs that link to it
        
        # First pass: identify MOCs and collect their links
        for md_file in all_md_files:
            try:
                content = md_file.read_text(encoding='utf-8')
                
                if self.is_moc_file(md_file, content):
                    rel_path = str(md_file.relative_to(self.vault_path))
                    links = self.extract_wiki_links(content)
                    keywords = self.extract_keywords(content)
                    para = self.get_para_category(md_file)
                    
                    # Get MOC title
                    title = md_file.stem
                    if content.startswith('---'):
                        try:
                            parts = content.split('---', 2)
                            if len(parts) >= 3:
                                fm = yaml.safe_load(parts[1])
                                if fm and 'title' in fm:
                                    title = fm['title']
                        except:
                            pass
                    
                    self.mocs[rel_path] = {
                        'path': md_file,
                        'title': title,
                        'links': links,
                        'keywords': keywords,
                        'para_category': para
                    }
                    
                    # Track which files are linked
                    for link in links:
                        linked_path = link.replace(' ', '-')
                        all_links[linked_path].add(rel_path)
                        
            except Exception as e:
                continue
        
        # Second pass: find unlinked files
        for md_file in all_md_files:
            rel_path = str(md_file.relative_to(self.vault_path))
            
            # Skip MOCs
            if rel_path in self.mocs:
                continue
            
            # Check if linked from any MOC
            file_stem = md_file.stem
            is_linked = False
            
            for link_targets in all_links.values():
                for moc_path in link_targets:
                    moc_obj = self.mocs.get(moc_path, {})
                    moc_links = moc_obj.get('links', set())
                    if file_stem in moc_links or rel_path.replace('.md', '') in moc_links:
                        is_linked = True
                        break
                if is_linked:
                    break
            
            if not is_linked:
                self.unlinked_files.append(md_file)
        
        print(f"   Found {len(self.mocs)} MOCs")
        print(f"   Found {len(self.unlinked_files)} unlinked files")
    
    def calculate_folder_proximity(self, file_path: Path, moc_path: Path) -> float:
        """Calculate folder proximity score (0-1)."""
        file_parents = set(file_path.parents)
        moc_parents = set(moc_path.parents)
        
        # Direct parent match = highest score
        if file_path.parent == moc_path.parent:
            return 1.0
        
        # Common ancestor
        common = file_parents & moc_parents
        if common:
            depth = max(len(p.parts) for p in common)
            return 0.5 + (0.5 * depth / 10)  # Decay with depth
        
        return 0.0
    
    def calculate_keyword_overlap(self, file_keywords: Set[str], moc_keywords: Set[str]) -> float:
        """Calculate Jaccard similarity of keywords."""
        if not file_keywords or not moc_keywords:
            return 0.0
        
        intersection = len(file_keywords & moc_keywords)
        union = len(file_keywords | moc_keywords)
        
        return intersection / union if union > 0 else 0.0
    
    def suggest_mocs(self, limit: int = 20, top_k: int = 3):
        """Generate MOC suggestions for unlinked files."""
        print(f"\n💡 Generating suggestions (limit: {limit} files)...")
        
        for i, file_path in enumerate(self.unlinked_files[:limit]):
            try:
                content = file_path.read_text(encoding='utf-8')
                file_keywords = self.extract_keywords(content)
                file_para = self.get_para_category(file_path)
                rel_path = str(file_path.relative_to(self.vault_path))
                
                scores = []
                
                for moc_rel, moc_data in self.mocs.items():
                    score = 0.0
                    reasons = []
                    
                    # Folder proximity (0-1, weight: 0.4)
                    prox = self.calculate_folder_proximity(file_path, moc_data['path'])
                    if prox > 0:
                        score += prox * 0.4
                        if prox == 1.0:
                            reasons.append("same folder")
                        else:
                            reasons.append("nearby folder")
                    
                    # Keyword overlap (0-1, weight: 0.4)
                    kw_sim = self.calculate_keyword_overlap(file_keywords, moc_data['keywords'])
                    if kw_sim > 0:
                        score += kw_sim * 0.4
                        reasons.append(f"keyword match ({kw_sim:.0%})")
                    
                    # PARA category match (0 or 1, weight: 0.2)
                    if file_para and moc_data['para_category'] == file_para:
                        score += 0.2
                        reasons.append(f"same {file_para}")
                    
                    if score > 0.1:  # Minimum threshold
                        scores.append({
                            'moc_path': moc_rel,
                            'moc_title': moc_data['title'],
                            'score': score,
                            'reasons': reasons
                        })
                
                # Sort by score and take top_k
                scores.sort(key=lambda x: x['score'], reverse=True)
                top_suggestions = scores[:top_k]
                
                self.suggestions.append({
                    'file': rel_path,
                    'suggestions': top_suggestions
                })
                
            except Exception as e:
                continue
        
        print(f"   Generated suggestions for {len(self.suggestions)} files")
    
    def output_results(self, format: str = 'text'):
        """Output suggestions in various formats."""
        if format == 'json':
            import json
            print(json.dumps(self.suggestions, indent=2))
        else:
            print("\n" + "="*70)
            print("MOC LINK SUGGESTIONS")
            print("="*70)
            
            for item in self.suggestions:
                print(f"\n📄 {item['file']}")
                
                if not item['suggestions']:
                    print("   ⚠️  No strong suggestions found")
                    continue
                
                for i, sugg in enumerate(item['suggestions'], 1):
                    conf_emoji = "🟢" if sugg['score'] > 0.6 else "🟡" if sugg['score'] > 0.3 else "🔴"
                    print(f"   {conf_emoji} #{i} [[{sugg['moc_title']}]] (confidence: {sugg['score']:.0%})")
                    print(f"      Reasons: {', '.join(sugg['reasons'])}")
            
            print("\n" + "="*70)
            print(f"Total files analyzed: {len(self.suggestions)}")
            print(f"Suggestion confidence: 🟢 High (>60%)  🟡 Medium (30-60%)  🔴 Low (<30%)")
            print("="*70)
    
    def run(self, limit: int = 20, top_k: int = 3, output_format: str = 'text'):
        """Main entry point."""
        self.scan_vault()
        self.suggest_mocs(limit=limit, top_k=top_k)
        self.output_results(format=output_format)


def main():
    parser = argparse.ArgumentParser(
        description='Suggest MOC links for unlinked vault files'
    )
    parser.add_argument(
        '--vault', '-v',
        default='/Volumes/madara/2026/twc-vault',
        help='Path to the vault (default: /Volumes/madara/2026/twc-vault)'
    )
    parser.add_argument(
        '--limit', '-l',
        type=int,
        default=20,
        help='Maximum number of unlinked files to analyze (default: 20)'
    )
    parser.add_argument(
        '--top', '-t',
        type=int,
        default=3,
        help='Number of MOC suggestions per file (default: 3)'
    )
    parser.add_argument(
        '--json', '-j',
        action='store_true',
        help='Output as JSON'
    )
    
    args = parser.parse_args()
    
    suggester = MOCSuggester(args.vault)
    suggester.run(
        limit=args.limit,
        top_k=args.top,
        output_format='json' if args.json else 'text'
    )


if __name__ == '__main__':
    main()
