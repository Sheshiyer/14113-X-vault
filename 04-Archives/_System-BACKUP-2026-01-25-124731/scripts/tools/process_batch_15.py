import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Query anything (Notion, GitHub, CSV, JSON, HN, etc) via SQL (01j4qb6znzxcb12fvzn0kkz7tp).html": "03-Resources/Technical/Tools/Database/Anyquery.md",
    "R.I.P Web Developers! (01j0yjyzbx5qy6d4fq92792c5m).html": "03-Resources/Technical/Web-Dev/News/Web-Dev-Future.md",
    "Rahul Sharma (01je2p958qejk436nbxywq293c).html": "03-Resources/Unsorted/Profiles/Rahul-Sharma.md",
    "Raise the Red Lantern (01j978jk2qj6168e3g61sdp8mq).html": "03-Resources/Entertainment/Movies/Raise-the-Red-Lantern.md",
    "Reader: Frequently Asked Questions (01j0skp7jj0bq8bz1q7320g9c0).html": "03-Resources/Technical/Tools/Readwise/Reader-FAQ.md",
    "Recommended Books (01j1j9dbd6fyf8gved1b3kjp6a).html": "03-Resources/Reference/Books/Recommended-Reading.md",
    "Remote work is Future (01j0w7v03t2bq4pvkm4dck1eg3).html": "03-Resources/Business/Work/Remote-Work.md",
    "Role play with large language models (01j428gz4g1ze98kmsxtkb202n).html": "03-Resources/Technical/AI-ML/LLMs/Roleplay.md",
    "Save from anywhere with our extensions (01jd3szrdyz4m5hy8pvy6sj1hm).html": "03-Resources/Technical/Tools/Productivity/Raindrop-Extensions.md",
    "Say Goodbye To Your Copywriter And Ghostwriter (01j1j9d9fv9kc75ap316eqdpsf).html": "03-Resources/Technical/AI-ML/Writing/Tugan-AI.md",
    "Search through all assets (01j6778y6wvtvq50shjk3cvqxd).html": "03-Resources/Design/Assets/Search-Assets.md",
    "See How SparkToro Works In 2 Minutes (01j1j9daa2gn87j83m98hjrvvn).html": "03-Resources/Business/Marketing/Tools/SparkToro.md",
    "See how consumers engage with your (01j2rf7p7jjzk87x35bvja2nqx).html": "03-Resources/Business/Marketing/Analytics/Consumer-Engagement.md",
    "Selection-Inference: Exploiting Large Language Models for Interpretabl… (01j4281wbks2qn6bnjrmahha23).html": "03-Resources/Technical/AI-ML/Research/Selection-Inference.md",
    "ServerlessPostgres (01j6djp2sbh95rp96vf39xtbkf).html": "03-Resources/Technical/Development/Databases/Serverless-Postgres.md",
    "Set up a Hindu Undivided Family (HUF) to cut your... (01j0snbeph8hfr35xa0x276h6p).html": "03-Resources/Business/Finance/India/HUF-Tax-Benefits.md",
    "Simulators (01j428gk1ajtm7y4qh95a4agy9).html": "03-Resources/Technical/AI-ML/Simulation/Simulators.md",
    "Snack Prompt | Discover The Best ChatGPT Prompts (01jdr4ayfz222y9bffxsdxkh4v).html": "03-Resources/Technical/AI-ML/Prompt-Engineering/Snack-Prompt.md",
    "Social Media Trends, AI Tools, and Expert Marketing Tutorials! (01jh8n49enf35312mpxx0ja03g).html": "03-Resources/Business/Marketing/Social-Media/Trends-2025.md",
    "Sora v2 release is impending (01jenyex3hwn2t6z3h8vc6x6xz).html": "03-Resources/Technical/AI-ML/News/Sora-v2.md",
    "Still using old-school web hosting services? (01j0yk398an6mey6vm6dj6ag3e).html": "03-Resources/Technical/Web-Dev/Hosting/Modern-Hosting.md",
    "Suresh Surenthiran (01j3q7phhkpee4kwgrjxw57gqv).html": "03-Resources/Unsorted/Profiles/Suresh-Surenthiran.md"
}

# Junk files to delete
JUNK_FILES = [
    "Raag Search (01j0thhhyc0kwwh0ehc7jgnvn8).html",
    "Retell AI (01jerv1fdwkv7s52g6s2z1fhsd).html",
    "Royalty Free AI Music Generator. (01j106tnd8bhmps6dejynhj0gx).html",
    "Royalty Free AI Music Generator. (01j1j9d9be4n7syd3zb0z3p6qs).html",
    "SEOChat (01j0thhk0keyy82hn2mb0ns6ft).html",
    "SPACE TYPE GENERATOR (01j1j9daej7yy3dqdqhhfxdvg9).html",
    "Same Energy | Visual Search Engine (01jd3szk6nt2xjqdz2abc65m0c).html",
    "Setting (01j1075jqke4m0kr27zgryg3qp).html",
    "Simple Multi-Item Slider Category slider with CSS animations (01j0thhhdsxjpnez7whrrm95w0).html",
    "Site Not Found (01j0thhk38411tv0cgrgpv4crz).html",
    "Smaller PDFs in your browser! (01j1j9dam264ecejwfz6emza9y).html",
    "Support us on Product Hunt (01j0w963n7m7ex6xbvf7w9rq7j).html"
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
    print("Starting Batch 15 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 15 Processing Complete.")

if __name__ == "__main__":
    main()
