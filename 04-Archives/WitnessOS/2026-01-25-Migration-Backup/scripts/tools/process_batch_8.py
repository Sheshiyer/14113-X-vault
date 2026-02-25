import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "10 Online Marketing Tools Thatll Accelerate Growth of a New Business (01j0thhkgqz2b57xtbt3aamv4d).html": "03-Resources/Business/Marketing/10-Online-Marketing-Tools.md",
    "19 Side Jobs to Make Extra Money from Home (01j0thhk7czscptv13j5we4f70).html": "03-Resources/Career/Side-Hustles/19-Side-Jobs.md",
    "247 Studio (01j3gna60kmq6fhycmv9aecng7).html": "03-Resources/Creative-Ideas/247-Studio.md",
    "30 days of content in 5 minutes (01jcqv5vn76ryyt8zbq2vkbf56).html": "03-Resources/Skills/Content-Creation/30-Days-Content.md",
    "4 Amazing Books That Will Challenge Your Thinking (01j1hj4cra5k0ycs4zrjq2q623).html": "03-Resources/Research/Research-Library/Books/Reading-List-Thinking.md",
    "6 Books Recommended by Nobel Prize Winner Psychologist & The... (01j1hjtbx572xzxzn641xktcv3).html": "03-Resources/Research/Research-Library/Books/Reading-List-Nobel.md",
    "84% of those who negotiate their salaries achieve higher pay (01j0sn98ecgcvfjrm17jp9nmhj).html": "03-Resources/Career/Negotiation/Salary-Negotiation-Stats.md",
    "AI Voice Generator: Most Realistic Text to Speech AI (01j1j9da247pb2xq776ydgbkg9).html": "03-Resources/Technical/AI-ML/AI-Voice-Generator.md",
    "AI just killed Sales Reps officially? (01j0sm0d27fvwf2fjn16m0jxfw).html": "03-Resources/Business/Sales/AI-Sales-Reps.md"
}

# Junk files to delete
JUNK_FILES = [
    "\"Page Saved!\" Here are some tips to get started with Pocket (01j0thhge1b95drcqf7ttpawmz).html",
    "10 Storytelling tips from Elon Musk to nail your next... (01j11t6g1zkdjh5v5vehbbdcf2).html",
    "15 BEST Amazon Products This Month #shorts #productreview #justicebuys… (01j17vf2tffq6hsfscfp3r1zpm).html",
    "4 (01j0yjxs3fc1fjxv0h7wn6anbw).html",
    "5 ChatGPT Prompts to Help You Get Rich in 2024 (01j0thgn591keabz1nq3s546ys).html",
    "6.86 updated stack timings map (01j0thhkhhexed4sjddp93jz3d).html",
    "7. You can verify emails for free using google chips This method is fo… (01j0zhbnp51mm2tpzw1gwv2y46).html",
    ": ( Goodbye. (01j0thhhsvgxb4b39gb7567vpp).html",
    "A celestial disguised as a cat (01j1hg7pv47rv0vr0zdegpq73s).html",
    "AI Playlist Generator (01j1j9da789rbpctskr4arn5d0).html",
    "AI is getting out of hand. Drop down your favourite AI tool below  (01j25jynj79fan8pbjjb93fxkx).html"
]

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

def delete_junk_file(filename):
    source_path = os.path.join(SOURCE_DIR, filename)
    if os.path.exists(source_path):
        try:
            os.remove(source_path)
            print(f"Deleted junk file: {filename}")
        except Exception as e:
            print(f"Error deleting {filename}: {e}")
    else:
        print(f"Junk file not found (already deleted?): {filename}")

def main():
    print("Starting Batch 8 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 8 Processing Complete.")

if __name__ == "__main__":
    main()
