import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Ableton Live Ultimate Course 01 - Intro (01j0thhhpgvng8fbh3jbr1x82p).html": "03-Resources/Creative-Ideas/Music-Production/Ableton-Course-Intro.md",
    "About (01j0yd9z1g22dmxpc15ks04c0w).html": "03-Resources/Business/Companies/Crystallize-About.md",
    "Abacus.AI - (01j35sm7s94fgy4ychpcpf8b9b).html": "03-Resources/Technical/AI-ML/Abacus-AI-ChatLLM.md",
    "Almost everyone who is single is single for the same reason (01j0thhkmyw0p2x2ab7q46bsnr).html": "03-Resources/Research/Research-Library/Books/Psychology/Singlehood-Psychology.md",
    "AutoGen Studio: Interactively Explore Multi-Agent Workflows (01j0yd9z5dhxh1py9hjp4kjch4).html": "03-Resources/Technical/AI-ML/AutoGen-Studio.md",
    "Automate Success With AI Dropshipping (01j30f8cr4j0tpcbkck1na84kp).html": "03-Resources/Business/E-commerce/AI-Dropshipping.md",
    "Best Online Resume Builder (01j1j9d9ryx0evgj9mb2zqjkhz).html": "03-Resources/Career/Tools/Best-Online-Resume-Builder.md",
    "Bootcamps (01j0thhgbgxra90y46r7vj95n6).html": "03-Resources/Technical/Education/Coding-Bootcamps.md",
    "Build More, Research Less (01j0w982hd9hv80jb4sdtzwaan).html": "03-Resources/Productivity/Build-More-Research-Less.md",
    "Build an AI-NLP TV Series Analysis System with Hugging Face, Chatbots… (01j6dk2trep5vbk3qvk0emyj8a).html": "03-Resources/Technical/AI-ML/AI-NLP-TV-Series-Analysis.md",
    "Category: Design (01j0thhj6rj8a7wazwtt5vwsae).html": "03-Resources/Design/Resources/Design-Category.md",
    "Cecilia (01j0thhke0h4q59a0hkhcfdqvk).html": "03-Resources/Creative-Ideas/Music-Production/Cecilia-Audio-Processing.md",
    "ChatGPT can now 'see' and hear you in real-time (01jf078x9rsg814mdjyph1khwe).html": "03-Resources/Technical/AI-ML/ChatGPT-RealTime-Vision-Voice.md",
    "Claude 3.5 Sonnet is wild (01j34fr1ah093f7pjk5z55h7hh).html": "03-Resources/Technical/AI-ML/Claude-3.5-Sonnet-Review.md",
    "Complete List of HTML Meta Tags (01j0thhhwd94pjysr5pyjtx8b5).html": "03-Resources/Technical/Web-Dev/HTML-Meta-Tags.md"
}

# Junk files to delete
JUNK_FILES = [
    "AI-powered eBook writer (01j1j9d9njsdfq4v7zb5nzckj2).html",
    "ARC- (01jdr4a7vnfdcwfe1prgk61031).html",
    "Airpods killer is here ! (01jar9367q89ne7mhpqqz91te4).html",
    "Amazon.com (01j0thhh2ehkenqb80kwmw2gvd).html",
    "Atlantis Land Surabaya 3D Model (01j1j9d97e5ncvkj0s2a9bry05).html",
    "Bill Evans   Sunday at the Village Vanguard Not Now Music 1 (01j0thhgp2dxf5rpfkn410ktqf).html",
    "Biteable (01j0thhjdbhs6ptda9dftzvf2g).html",
    "Boost your views (01j0thhj2w2fdz5j9b66sf4zwq).html",
    "Brancher.ai (01jdr4cx228s5xy3b2mjn8y0fe).html",
    "BuildShip (01j1j9dbm1pmvg78mbjcwrh4vt).html",
    "Cal (01j55pq4ssrdms32dfxs7w426v).html",
    "Cartwheel (01j71w6kgjgaf38ddybjh7wf4s).html",
    "Celestials - Nft Template  Framer Marketplace (01je2k7vmz1y2kr1e1jwh65102).html",
    "ChatGPT Chrome Extension (01j1j9da6jbxsf1gtec038720q).html",
    "ChatGPT PROMPTs Splitter (01j1j9da8q968ma0j1zfkeghyc).html",
    "ChatGPT Prompting cheatsheet  (01j0smtcq6xj59dcgw8gejhx6h).html",
    "Check This Out! How to get unlimited leads from Instagram for free! Co… (01j3gmdc59twqpa6enjbjmmctv).html",
    "Checklists (01j2wbafa972japm4s6qp0q47a).html",
    "Choose a Manychat plan thats right for you (01j2vtksh2hb3t2wtnegd38qy6).html",
    "Choose the plan that works for you (01j1j9dagw0ps74cp0pqe8e7k3).html",
    "Claude 3.5 Sonnet is wild (01j34ftder6a10ks6hyw35yt70).html",
    "Code Snippets (01j0thhgxdvvqnhty4ggy2a6j2).html",
    "Coding Games and Programming Challenges to Code Better (01j0thhhmg4makdvmqbzgeed72).html",
    "Colordot for iOS (01j0thhgy7127e3061txsvce7v).html",
    "Colordot for iOS (01j0thhh9qghf5ewvt2qpks99e).html"
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
    print("Starting Batch 9 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 9 Processing Complete.")

if __name__ == "__main__":
    main()
