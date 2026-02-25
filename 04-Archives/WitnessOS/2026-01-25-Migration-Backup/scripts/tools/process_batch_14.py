import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "NEXT100 by Antler (01j3518gwze50v99wvdw7azy2y).html": "03-Resources/Business/Startup/Antler-Next100.md",
    "Never edit shorts again. (01j1j9d8xprzbsa76vrer4kkt1).html": "03-Resources/Skills/Content-Creation/Video/Shorts-Editing.md",
    "New freedoms of imagination (01j4x9r8q5yqhny2gqkvm58tck).html": "03-Resources/Creative-Ideas/Philosophy/Imagination.md",
    "Nice, another Meeting! Said no one. Ever. (01j1j9da2yhc8kja2pstvf4brs).html": "03-Resources/Technical/Tools/Productivity/Meeting-Optimization.md",
    "Nvidia revealed $3000 AI supercomputer (01jh33mpdzgfcppn7xja8ze0qj).html": "03-Resources/Technical/Hardware/Nvidia-AI-Supercomputer.md",
    "Nylas N1 - A Premium Email Client For Linux (01j0thhkb5ntqbnq3jee5nybjb).html": "03-Resources/Technical/Linux/Software/Nylas-N1.md",
    "OpenAI teases 12 days of mystery product launches (01jebj0dekymb563m4y15y13t8).html": "03-Resources/Technical/AI-ML/News/OpenAI-12-Days.md",
    "OpenAI teases AI Agent (01jev1ftmh1e2ypnw5ypbcara1).html": "03-Resources/Technical/AI-ML/News/OpenAI-Agent.md",
    "OpenAI unveiled its 03 model family (01jfsx78s01zpep201y859snfe).html": "03-Resources/Technical/AI-ML/News/OpenAI-o3.md",
    "OpenAI unveiled the full-version of O1 (01jee4ff54fb8xsc6a0ej4r9k7).html": "03-Resources/Technical/AI-ML/News/OpenAI-o1.md",
    "OpenAI x Superintelligence (01jgxyh4yqgf6361ersekjh7z4).html": "03-Resources/Technical/AI-ML/News/OpenAI-Superintelligence.md",
    "OpenArt (01j6772x5sbw6hezpb4st15qfe).html": "03-Resources/Technical/AI-ML/Generative-Art/OpenArt.md",
    "Origami: 12 Free Animated 3D Objects (01j6dqe3jkanxgqva0v71w254e).html": "03-Resources/Design/Assets/3D/Origami-Animations.md",
    "Our AI Open Call is Starting SoonTheres Still Time to Join!  (01jevdsaeyawd8fmgpdq07jh6s).html": "03-Resources/Business/Marketing/Trends/AI-Open-Call.md",
    "PHONEY FEMINISM (01j1j9dapgzzdfh4df5cxh6971).html": "03-Resources/Society-Culture/Feminism/Phoney-Feminism.md",
    "Phenaki: Variable Length Video Generation from Open Domain Textual Des… (01jdr4dwcvwkq2pf35vm96pptj).html": "03-Resources/Technical/AI-ML/Generative-Art/Video/Phenaki.md",
    "PicFinder.AI - Unleash Your Creativity with AI-Generated Images (01jdr4g0b8tjeztjv3xgswh45t).html": "03-Resources/Technical/AI-ML/Generative-Art/Images/PicFinder.md",
    "Pingdom Tools (01j0thhhaqhpppkw7v32w2g43a).html": "03-Resources/Technical/Web-Dev/Tools/Pingdom.md",
    "Planetary Hours 4+ (01jf060qj4e3zaj4xgg322aj2x).html": "03-Resources/Sacred-Science/Astrology/Planetary-Hours.md",
    "PlayPhrase.me: Site for cinema archaeologists. (01jcqs9t83fxf922t3175524xc).html": "03-Resources/Entertainment/Movies/PlayPhrase.md",
    "PlaylistAI - Playlist Maker (01j1j9da810pvwqpg4qwh0yvyb).html": "03-Resources/Technical/AI-ML/Audio/PlaylistAI.md",
    "Present like a deck (01j1j9da0rej71yrvxnbe0zyha).html": "03-Resources/Technical/Tools/Productivity/Presentations/Deck-Presentations.md",
    "Professional Presentations in Seconds with AI (01j2ret1zm8r3183sq670vqhpr).html": "03-Resources/Technical/Tools/Productivity/Presentations/AI-Presentations.md",
    "Professional business headshots, without a physical photo shoot (01j1j9dabbcazgcghzc4jzehaj).html": "03-Resources/Technical/AI-ML/Generative-Art/Images/AI-Headshots.md",
    "Prompts Made Easy with ChatGPT Prompt Generator (01jdr4y1p1v8p0q3k0568x9cqr).html": "03-Resources/Technical/AI-ML/Prompt-Engineering/ChatGPT-Generator.md"
}

# Junk files to delete
JUNK_FILES = [
    "Natural Stone Bracelets (01j14pgv5pgcky50667wyafwe5).html",
    "Nils Frahm | A Winged Victory for the Sullen | BBC Proms 2015 | Full p… (01j0thhgg3wny345q3yw7yh9nj).html",
    "NoLatency (01j0thhhcsvc825bbk6yp241ep).html",
    "OpenPod (01je2h5bnfv41r5h55xv6dpczx).html",
    "Please turn off your ad blocker (01j0thhgtb1cn3edc54f6vy4tq).html",
    "Porcupine Tree - ON THE SUNDAY OF LIFE (1992) full album (01j0thhgqm6rjxjthehkj0aegx).html",
    "Porcupine Tree - Stupid Dream [Full Album] (01j0thhghav9ehnzz5j4apcv2k).html",
    "Porcupine Tree - Yellow Hedgerow Dreamscape [Full Album] (1994) (01j0thhgmkyy38zw46mxkfvf1d).html",
    "Public Work by Cosmos (01jd3rrp979ex49bgesgv0ybbv).html"
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
    print("Starting Batch 14 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 14 Processing Complete.")

if __name__ == "__main__":
    main()
