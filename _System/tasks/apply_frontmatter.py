import os
from pathlib import Path

AREAS_ROOT = Path("02-Areas")

MAPPING = {
    "Consciousness-Models": {"category": "Consciousness", "subcategory": "Models", "enneagram": "Type 9"},
    "Creative-Ideas": {"category": "Creative", "subcategory": "Ideas", "enneagram": "Type 4"},
    "Logic-Gate-Linguistics": {"category": "Knowledge", "subcategory": "Linguistics", "enneagram": "Type 5"},
    "Muse-Enneagram-Framework": {"category": "Knowledge", "subcategory": "Enneagram", "enneagram": "Type 5"},
    "Pattern-Studies": {"category": "Knowledge", "subcategory": "Patterns", "enneagram": "Type 5"},
    "Skills-Development": {"category": "Skills-Development", "subcategory": "General", "enneagram": "Type 5"},
    "Technical-Mystical-Integration": {"category": "Technology", "subcategory": "Mystical-Integration", "enneagram": "Type 5"},
    "Technology-Surveillance": {"category": "Technology", "subcategory": "Surveillance", "enneagram": "Type 8"},
    "TheWhyChromosome-Brand": {"category": "Projects", "subcategory": "Brand", "enneagram": "Type 5"},
    "ThoughtSeed-Operations": {"category": "Projects", "subcategory": "Operations", "enneagram": "Type 5"},
    "personal-development": {"category": "Personal-Development", "subcategory": "Growth", "enneagram": "Type 2"},
    "writing-practice": {"category": "Creative", "subcategory": "Writing", "enneagram": "Type 4"},
    "Bioelectric-Body": {"category": "Health", "subcategory": "Bioelectric", "enneagram": "Type 3"},
    "Content-System": {"category": "Projects", "subcategory": "Content", "enneagram": "Type 5"},
    "Technical-Mystical-Integration": {"category": "Technology", "subcategory": "Mystical-Integration", "enneagram": "Type 5"}
}

def apply_frontmatter():
    count = 0
    for root, dirs, files in os.walk(AREAS_ROOT):
        # Skip hidden
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        rel_path = Path(root).relative_to(AREAS_ROOT)
        top_dir = rel_path.parts[0] if rel_path.parts else ""
        
        if top_dir not in MAPPING:
            continue
            
        meta = MAPPING[top_dir]
        
        for file in files:
            if not file.endswith(".md"):
                continue
                
            file_path = Path(root) / file
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if content.startswith("---"):
                    continue
                    
                # Build frontmatter
                type_val = "moc" if "index" in file.lower() or "hub" in file.lower() else "note"
                
                frontmatter = f"""---
type: {type_val}
category: {meta['category']}
subcategory: {meta['subcategory']}
enneagram: {meta['enneagram']}
status: active
---

"""
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(frontmatter + content)
                
                count += 1
                if count % 10 == 0:
                    print(f"Processed {count} files...")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                
    print(f"Finished. Applied frontmatter to {count} files.")

if __name__ == "__main__":
    apply_frontmatter()
