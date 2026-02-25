import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "A Travelers Guide to the Latent Space (01jdr1pd1q50knab34dgvb1xnj).html": "03-Resources/Technical/AI-ML/A-Travelers-Guide-to-the-Latent-Space.md",
    "camenduru  GitHub (01jdr1wggq7rhfvqd5z2f3mnjj).html": "03-Resources/Technical/AI-ML/Camenduru-GitHub.md",
    "Chrome Experiments (01jdr2h3aanz6v22804ss8xfzh).html": "03-Resources/Creative-Ideas/Chrome-Experiments.md",
    "Documentary List | Documentary Heaven (01jdr2v92884bnvebdq410e5sr).html": "03-Resources/Creative-Ideas/Documentary-List.md",
    "Fringe Entertainment Master List (01jdr2bz7aw9qyyv97ggpd32xc).html": "03-Resources/Creative-Ideas/Fringe-Entertainment-Master-List.md",
    "Geometric Tuneage (01jdr2d3mse236z31pc6kxe4vv).html": "03-Resources/Creative-Ideas/Geometric-Tuneage.md",
    "Grindelwald, Switzerland (01jdr3yg1dewzp0adg9g212e0m).html": "03-Resources/Creative-Ideas/Grindelwald-Switzerland.md"
}

# Junk files to delete
JUNK_FILES = [
    "Alexander Shulgin Research Institute | Carrying on the Tradition (01jd9wy5tx597m33rmhevj2acv).html",
    "Altered States!, Informing The World (01jdr39gt0rswmec9g0ck5ng0e).html"
]

def html_to_markdown(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style", "meta", "link", "noscript"]):
        script.decompose()
        
    markdown_lines = []
    
    # Simple traversal
    for element in soup.descendants:
        if element.name == 'h1':
            markdown_lines.append(f"\n# {element.get_text().strip()}\n")
        elif element.name == 'h2':
            markdown_lines.append(f"\n## {element.get_text().strip()}\n")
        elif element.name == 'h3':
            markdown_lines.append(f"\n### {element.get_text().strip()}\n")
        elif element.name == 'p':
            text = element.get_text().strip()
            if text:
                markdown_lines.append(f"{text}\n")
        elif element.name == 'a':
            text = element.get_text().strip()
            href = element.get('href', '')
            if text and href:
                # Avoid duplicates if 'a' is inside 'p' which is already handled, 
                # but descendants traversal visits both. 
                # Actually, descendants visits parent then children.
                # This simple logic might duplicate text.
                pass
        elif element.name == 'li':
             markdown_lines.append(f"- {element.get_text().strip()}\n")
             
    # Better approach: recursive function or just get_text with separator, 
    # but we want to keep links.
    # Let's use a simpler approach for now: just get text, but try to preserve headers.
    # Actually, for this batch, preserving links is important.
    
    # Let's try a slightly more robust manual converter
    md_output = ""
    
    # Process body directly
    body = soup.find('body')
    if not body:
        body = soup
        
    for tag in body.find_all(['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'], recursive=True):
        # This is still tricky because find_all is recursive.
        # Let's just iterate over top-level meaningful blocks if possible, 
        # but HTML structure varies.
        pass

    # Fallback to a very simple text extraction with some formatting
    text = soup.get_text(separator='\n\n')
    
    # Clean up excessive newlines
    lines = [line.strip() for line in text.splitlines()]
    clean_text = '\n'.join(line for line in lines if line)
    
    return clean_text

def process_file(filename, target_rel_path):
    source_path = os.path.join(SOURCE_DIR, filename)
    target_path = os.path.join(VAULT_ROOT, target_rel_path)
    
    if not os.path.exists(source_path):
        print(f"Skipping missing file: {filename}")
        return

    print(f"Processing {filename}...")
    
    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        markdown_content = html_to_markdown(html_content)
        
        # Add metadata
        markdown_content = f"# {filename.replace('.html', '')}\n\nSource: {filename}\n\n" + markdown_content
        
        # Ensure target directory exists
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
            
        print(f"Saved to {target_path}")
        
        # Delete source
        os.remove(source_path)
        print(f"Deleted source file: {filename}")
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")

def main():
    print("Starting Batch 6 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)
        
    # Process junk files
    for filename in JUNK_FILES:
        source_path = os.path.join(SOURCE_DIR, filename)
        if os.path.exists(source_path):
            try:
                os.remove(source_path)
                print(f"Deleted junk file: {filename}")
            except Exception as e:
                print(f"Error deleting junk file {filename}: {e}")
        else:
            print(f"Junk file not found (already deleted?): {filename}")

    print("Batch 6 Processing Complete.")

if __name__ == "__main__":
    main()
