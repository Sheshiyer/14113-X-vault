#!/usr/bin/env python3
"""
Vault Stats CLI - Improved MOC Detection

Calculates PARA distribution and true MOC coverage by parsing wiki-links.
"""

import os
import re
import argparse
from collections import defaultdict
from pathlib import Path


def parse_yaml_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}
    
    try:
        end_idx = content.find('---', 3)
        if end_idx == -1:
            return {}
        
        yaml_content = content[3:end_idx].strip()
        frontmatter = {}
        
        for line in yaml_content.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                frontmatter[key.strip()] = value.strip().strip('"').strip("'")
        
        return frontmatter
    except Exception:
        return {}


def extract_wiki_links(content):
    """Extract wiki-links from markdown content.
    
    Matches patterns like:
    - [[Page-Name]]
    - [[Page-Name|Display Text]]
    """
    pattern = r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]'
    matches = re.findall(pattern, content)
    return [match.strip() for match in matches]


def is_moc_file(filepath, content, filename):
    """Determine if a file is an MOC based on multiple heuristics."""
    # Check YAML frontmatter
    frontmatter = parse_yaml_frontmatter(content)
    if frontmatter.get('type', '').lower() == 'moc':
        return True
    
    # Check filename patterns
    name_lower = filename.lower()
    if 'moc' in name_lower:
        return True
    if name_lower == '_index.md':
        return True
    if name_lower == '00-index.md':
        return True
    if name_lower.endswith('-index.md'):
        return True
    
    return False


def calculate_vault_stats(vault_path, verbose=False):
    """Calculate comprehensive vault statistics."""
    vault = Path(vault_path)
    
    if not vault.exists():
        print(f"Error: Vault path does not exist: {vault_path}")
        return
    
    # PARA categories
    para_categories = ['01-Projects', '02-Areas', '03-Resources', '04-Archives']
    para_display = {
        '01-Projects': 'Projects',
        '02-Areas': 'Areas',
        '03-Resources': 'Resources',
        '04-Archives': 'Archives'
    }
    
    stats = {cat: {'count': 0, 'size': 0} for cat in para_categories}
    stats['other'] = {'count': 0, 'size': 0}
    
    # Track files
    all_files = []
    md_files = []
    moc_files = []
    file_links = {}  # filename (without extension) -> set of files that link to it
    file_path_map = {}  # filename (without extension) -> full path
    
    print("🔍 Scanning vault...")
    
    # First pass: collect all files and identify MOCs
    for root, dirs, files in os.walk(vault):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            filepath = Path(root) / file
            relative_path = filepath.relative_to(vault)
            
            all_files.append(relative_path)
            
            # Categorize by PARA
            relative_str = str(relative_path)
            category = 'other'
            for para in para_categories:
                if para in relative_str:
                    category = para
                    break
            
            stats[category]['count'] += 1
            
            # Track markdown files
            if file.endswith('.md'):
                md_files.append(relative_path)
                file_stem = file[:-3]  # Remove .md
                file_path_map[file_stem] = relative_path
                
                # Read content and check if MOC
                try:
                    content = filepath.read_text(encoding='utf-8', errors='ignore')
                    if is_moc_file(filepath, content, file):
                        moc_files.append(relative_path)
                except Exception as e:
                    if verbose:
                        print(f"  Warning: Could not read {relative_path}: {e}")
    
    print(f"   Found {len(all_files)} total files, {len(md_files)} markdown files")
    print(f"   Identified {len(moc_files)} MOC files")
    
    # Second pass: extract links from MOC files
    print("🔗 Analyzing MOC links...")
    
    for moc_path in moc_files:
        try:
            content = (vault / moc_path).read_text(encoding='utf-8', errors='ignore')
            links = extract_wiki_links(content)
            
            for link in links:
                # Link might have aliases separated by |
                target = link.split('|')[0].strip()
                if target not in file_links:
                    file_links[target] = set()
                file_links[target].add(str(moc_path))
        except Exception as e:
            if verbose:
                print(f"  Warning: Could not parse links in {moc_path}: {e}")
    
    # Calculate MOC coverage
    non_moc_md_files = [f for f in md_files if f not in moc_files]
    linked_files = []
    unlinked_files = []
    
    for md_file in non_moc_md_files:
        file_stem = md_file.name[:-3]
        # Check if this file is linked from any MOC
        if file_stem in file_links:
            linked_files.append(md_file)
        else:
            unlinked_files.append(md_file)
    
    # Calculate PARA distribution percentages
    total_files = len(all_files)
    print("\n" + "="*50)
    print("📊 VAULT STATISTICS")
    print("="*50)
    
    print(f"\n📁 Total Files: {total_files}")
    print(f"📝 Markdown Files: {len(md_files)}")
    print(f"🗺️  MOC Files: {len(moc_files)}")
    print(f"📄 Non-MOC Markdown: {len(non_moc_md_files)}")
    
    print("\n📊 PARA Distribution:")
    for category in para_categories:
        count = stats[category]['count']
        percentage = (count / total_files * 100) if total_files > 0 else 0
        display_name = para_display[category]
        print(f"   {display_name}: {percentage:.1f}% ({count} files)")
    
    if stats['other']['count'] > 0:
        count = stats['other']['count']
        percentage = (count / total_files * 100) if total_files > 0 else 0
        print(f"   Other: {percentage:.1f}% ({count} files)")
    
    # MOC Coverage
    if non_moc_md_files:
        coverage = (len(linked_files) / len(non_moc_md_files)) * 100
    else:
        coverage = 100.0
    
    print(f"\n🔗 MOC Coverage: {coverage:.1f}%")
    print(f"   Linked files: {len(linked_files)}")
    print(f"   Unlinked files: {len(unlinked_files)}")
    
    # Show unlinked files
    if unlinked_files:
        print("\n⚠️  Unlinked Files (not linked from any MOC):")
        display_limit = None if verbose else 20
        for i, unlinked in enumerate(unlinked_files[:display_limit] if display_limit else unlinked_files):
            print(f"   - {unlinked}")
        
        if display_limit and len(unlinked_files) > display_limit:
            print(f"   ... and {len(unlinked_files) - display_limit} more")
            print(f"   (Use --verbose to see all)")
    
    print("\n" + "="*50)


def main():
    parser = argparse.ArgumentParser(
        description='Vault Stats CLI - PARA distribution and MOC coverage analyzer'
    )
    parser.add_argument(
        '--vault', '-v',
        default='/Volumes/madara/2026/twc-vault',
        help='Path to the vault directory (default: /Volumes/madara/2026/twc-vault)'
    )
    parser.add_argument(
        '--verbose', '-V',
        action='store_true',
        help='Show all unlinked files and warnings'
    )
    
    args = parser.parse_args()
    calculate_vault_stats(args.vault, args.verbose)


if __name__ == "__main__":
    main()
