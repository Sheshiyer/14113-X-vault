import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Jazz for Beginners  Theory & Practice (01jdr2ykr2ppvv1xbdrmecksxn).html": "03-Resources/Creative-Ideas/Music/Jazz-Theory.md",
    "Jitsi  GitHub (01j6djj41csnexbaxeavw56tac).html": "03-Resources/Technical/Tools/Communication/Jitsi.md",
    "khoj-ai-khoj (01jd3tdcf1zjhm2t3p4vxak80c).html": "03-Resources/Technical/AI-ML/Agents/Khoj-AI.md",
    "Langorhythm 2.0 - Text to music generator (01jdr1q7mvjbk1ay7kcfk70dyv).html": "03-Resources/Technical/AI-ML/Audio/Langorhythm.md",
    "Level up your meetings. Effortlessly. (01j1j9da4je1102n6ba947twxy).html": "03-Resources/Technical/Tools/Productivity/Meeting-Tools.md",
    "Leverage AI to grow on LinkedIn (01j3arten941rf1ccvrmce41k3).html": "03-Resources/Business/Marketing/Social-Media/LinkedIn-AI.md",
    "Listen.lt | Smart Links for Music (01j1j9d947cfg4h9jxjnmgvkj4).html": "03-Resources/Creative-Ideas/Music/Tools/Listen-lt.md",
    "LlamaCoder (01j4phjwd4wwy00wvcqh6vy0ea).html": "03-Resources/Technical/AI-ML/Coding/LlamaCoder.md",
    "LTX-Video-Playground - a Hugging Face Space by Lightricks (01je2harenyx5qhna87b91qj1k).html": "03-Resources/Technical/AI-ML/Generative-Art/Video/LTX-Video.md",
    "MRHIGH3R (01ja8nbe35r57866k54d6twwq3).html": "03-Resources/Unsorted/Profiles/MRHIGH3R.md",
    "Made with Phia. (01j7xzmysnm458qtm8g64hthjm).html": "03-Resources/Design/Tools/Phia.md",
    "Magic UI (01jcqsck3a5868p0y7hbpfwq74).html": "03-Resources/Design/Web-Design/UI-Libraries/Magic-UI.md",
    "Make the Impossible (01j1j9da1gk2j28t6k59swyga3).html": "03-Resources/Technical/AI-ML/Generative-Art/Video/RunwayML-Tools.md",
    "Make the web work for you (01j6zzmhhdtnqhhn0ca4pvt971).html": "03-Resources/Technical/Tools/Productivity/Web-Automation.md",
    "Marketing Predictions 2025, AI Open Call and More! (01jeej59b28kybsnv1n54gtk79).html": "03-Resources/Business/Marketing/Trends/Predictions-2025.md",
    "Measurement Conversions - World History Encyclopedia (01jda9ke980zvfwz8yd631c2ft).html": "03-Resources/Reference/Measurement-Conversions.md",
    "Meet Seona: Your Personal AI SEO Agency (01j106x73sxzcmm1e77c7tg83m).html": "03-Resources/Business/Marketing/SEO/Seona-AI.md",
    "Meme Soundboard (01j1j9dak8jp3e6a4dwkr40hfs).html": "03-Resources/Entertainment/Memes/Soundboard-Categories.md",
    "Midjourney Prompt Helper (01j4x9pf1dp3v495v4tfyx3cb8).html": "03-Resources/Technical/AI-ML/Prompt-Engineering/Midjourney-Helper.md",
    "Monica can help (01j1j9da3ph05e23vgr83p32hs).html": "03-Resources/Technical/AI-ML/Agents/Monica-AI.md",
    "Morphing Background Shapes (01j0thhhhvj4tkjkcm3zbs7nd4).html": "03-Resources/Design/Web-Design/Animations/Morphing-Shapes.md",
    "mushroom tinctures' EN visual keyword research & content ideas : Answ… (01jd3s2jmw5804g8vxrt7thjj3).html": "03-Resources/Lifestyle/Health/Mushroom-Tinctures-SEO.md"
}

# Junk files to delete
JUNK_FILES = [
    "Jobs (01j0thhk8hprknm6he3wa1daxd).html",
    "KLING AI (01j50r2vrc2rhbwnnvn96ap6x9).html",
    "kimani digital -- QUINTY (01j23br377mr9cp5nbm3h9zfwz).html",
    "kimani digital -- QUINTY (01j25jbah5k3jsvv8fbzdjza65).html",
    "Light-activated Drugs on JSTOR (01j0thhg7b2bkj6akva3z6b796).html",
    "Literature Review: What? (01j14d6mjj9mntxb0hs9zp9j9r).html",
    "Loading (01j0thhh3waf37mm4qk6hnn36m).html",
    "Loading chunk src_components_API_Block_APIBlock_js-src_helper_methods… (01j1j9d9xfv4pv6es0q80w27vg).html",
    "Meet Seona: Your Personal AI SEO Agency (01j1j9d9apzm6bv37f5j3qa123).html",
    "MyCaptain | Best UI UX plugins in 2024 Want to build your career in UI… (01j2t406r1fe0cwn1dhwx51r1b).html"
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
    print("Starting Batch 13 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 13 Processing Complete.")

if __name__ == "__main__":
    main()
