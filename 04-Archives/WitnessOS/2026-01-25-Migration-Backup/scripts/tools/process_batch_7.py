import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "\"Research agent 3.0 - Build a group of AI researchers\" - Here is how (01j0thhfxsq93yy9kdxxb9dew1).html": "03-Resources/Technical/AI-ML/Research-Agent-3.0.md",
    "1-800-CHATGPT (01jffkp8dbc9fw00ang3zma78g).html": "03-Resources/Technical/AI-ML/1-800-CHATGPT.md",
    "12 Predictions for AI in 2025 (01jgegfh0s67ykwxt28999t353).html": "03-Resources/Technical/AI-ML/AI-Predictions-2025.md",
    "17 tips for great copywriting (01jcqsc0c9r2jt2r5hdhbp92tv).html": "03-Resources/Skills/Writing/17-Tips-For-Great-Copywriting.md",
    "6 Community Management Trends To Know in 2024 (01j2kfqh74cdxsfnxafwyk6k2n).html": "03-Resources/Business/Community-Management/Trends-2024.md",
    "8 Remote Jobs That Are Always Hiring Without an Interview! (01j1j5g777tp91b08xnva88mem).html": "03-Resources/Career/Remote-Jobs.md",
    "A Selection of Fonts That Future-Proof Your Web Design (01j6dqj3wbrv17d28666r9gqp0).html": "03-Resources/Design/Typography/Future-Proof-Fonts.md",
    "AI Turns Photos Into 3D Real Worlds (01je6dbg5p3sgfap6pwe299bsj).html": "03-Resources/Technical/AI-ML/AI-Photos-To-3D.md",
    "Amazon SEO Guide, Gemini Deep Research and More! (01jfjn2gkydpc2qjqq8ccdh1qk).html": "03-Resources/Business/Marketing/Amazon-SEO-Gemini.md",
    "Amazon announces AI supercomputer (01je927z705j43wfxvfaka2mjy).html": "03-Resources/Technical/AI-ML/Amazon-AI-Supercomputer.md",
    "Amazon's new multi-modal AI 'Olympus' (01jdw3x8nvgmfamn55h4vcc4yc).html": "03-Resources/Technical/AI-ML/Amazon-Olympus-AI.md",
    "An Experiment in RealityThe Three Abrahamic Covenants and the Car Pas… (01j1j9db6hpwdhxz2xmef9dg25).html": "03-Resources/Spirituality-Esoteric/Religion/Abrahamic-Covenants-Experiment.md",
    "Astrolink: Do your Birth Chart 4+ (01jf061jqc8af6mr18ypzy239m).html": "03-Resources/Sacred-Science/Astrology/Astrolink-Birth-Chart.md",
    "Become a WordPress Developer: Unlocking Power with Code (01j0thhj8jb8h1zjr5p4crh1jh).html": "03-Resources/Technical/Development/WordPress-Developer-Guide.md",
    "Behaviorism (01j427n68kwxyh9tvnra9pbx8h).html": "03-Resources/Research/Research-Library/Books/Psychology/Behaviorism.md"
}

def html_to_markdown(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style", "meta", "link", "noscript"]):
        script.decompose()
        
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
    print("Starting Batch 7 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    print("Batch 7 Processing Complete.")

if __name__ == "__main__":
    main()
