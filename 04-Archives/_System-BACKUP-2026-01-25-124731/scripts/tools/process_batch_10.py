import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Best Books Worth Reading Again and Again Every Year (01j14d3p617d1bdjgpn2z88gkz).html": "03-Resources/Research/Research-Library/Books/Best-Books-Annual.md",
    "Best Personal Development Books Everyone Should Read Atleast Once (01j10bxh1z7zn0h6r47hxjapxb).html": "03-Resources/Research/Research-Library/Books/Self-Help/Best-Personal-Development-Books.md",
    "Books Recommended By Billionaire's You Must Read (01j11tcckapkr28pr07kkvrrx3).html": "03-Resources/Research/Research-Library/Books/Billionaire-Recommendations.md",
    "Books That Will Increase Your Intelligence in 2024 (01j0yjxrv5hc0h80h3gxk3hgk6).html": "03-Resources/Research/Research-Library/Books/Intelligence-Books-2024.md",
    "Books Worth Reading Again and Again (01j106dzybh9fz2p25hvk5q9dg).html": "03-Resources/Research/Research-Library/Books/Re-readable-Books.md",
    "Build email lists from Linkedin or the entire web (01j1j9da59yv45mqqyj29sf6f1).html": "03-Resources/Business/Marketing/Email-Marketing/Linkedin-Email-Lists.md",
    "Build file handling in minutes (01j6djpa2hvkr0m1wevm9pjyww).html": "03-Resources/Technical/Development/File-Handling-Guide.md",
    "Buy Scripts, Themes, Plugins, Prints, Apps and more | CodeGrape (01jdr410ysh7de2vr2abqkdjnh).html": "03-Resources/Technical/Web-Dev/Resources/CodeGrape-Marketplace.md",
    "COURSES (01jdr51p98am0c5t3nfrw5ktxm).html": "03-Resources/Technical/Education/Courses/Courses-List.md",
    "Claude 3.5 Sonnet is wild (01j34fykq0hk8etmsratnt9jr3).html": "03-Resources/Technical/AI-ML/Claude-3.5-Sonnet-Review-Full.md",
    "Collections (01j0thhj4x206acpvdyfj4z9pn).html": "03-Resources/Design/Resources/Design-Collections.md",
    "Complete Startup System, now with contextual AI! (01j3p1hqhaxkdpxpg80g6w3dd9).html": "03-Resources/Business/Startups/Startup-System.md",
    "Compose anything. Connect everything. (01j35pmxzknfnpgm7h9frfazpm).html": "03-Resources/Technical/Tools/Compose-Connect.md",
    "Computer Generates Human Faces (01j0thhh0db5zerjgx71ad9m84).html": "03-Resources/Technical/AI-ML/Generative-Faces.md",
    "Convert audio content into blog posts, using AI (01j1j9d9cw69n20n7s8hhwz6w9).html": "03-Resources/Skills/Content-Creation/Audio-to-Blog.md",
    "Digital Inspiration (01j0thhjed3vy3nvtscdn2dc7q).html": "03-Resources/Technical/Tools/Digital-Inspiration-Useful-Websites.md"
}

# Junk files to delete
JUNK_FILES = [
    "Best Personal Development Books Everyone Should Read Atleast Once (01j1fvw0gfzg57rjzb1gwqwsey).html",
    "Books That Will Increase Your Intelligence in 2024 (01j1fvw0f6cca34nk7p4h3xrh9).html",
    "Books Worth Reading Again and Again (01j1fvw0hmrq036kjkyw9c9krv).html",
    "Claude can make over 12 different types of visual charts, that are imm… (01j25p6a3ehaamqv3n62nwnaz9).html",
    "Confirm your AI Valley signup (01jdr4zvycftc0vrh26hwvdj7f).html",
    "Contact @tommontalk (01j1evdrakhjcn3pksfq1v17sp).html",
    "Create amazing (01j3mmqatn5979wtrjwe2dvvn8).html",
    "Create and Edit Images like a pro without being one. (01j6zz7q6zmc7vkyawzqd8ezxs).html",
    "Create videos for Socials (01j1j9d8za0be15dfhbfwzgtxj).html",
    "Create. Together. (01j41v8fpsrpdy5mj9mjrh9aqd).html",
    "Cross-searching for high-quality free stock photo site (01j1j9dahpvn2gq68mysvn47hy).html",
    "Customized Video Making for Everyone (01j1j9d9skc8z6zwgtqhnhss5t).html",
    "DO YOU (01j0smva1v16fvm80gpn4yeptq).html",
    "Demo 3 (01j0thhhg0y8pj0hgc3cr0fr2a).html",
    "Discover the hottest new trends. (01j0w98xekde96sj4krpvpr78w).html",
    "Dota 2 Anime Mods Showcase (01j0thhkjm00dqxcvj23v5265x).html",
    "Download VOSviewer (01jcqsbq46v1rn47fch917nkzf).html",
    "Drippi (01j1j9d9hdnqzpra8g6m1vn6bw).html",
    "Droxy (01j1j9d8vyh4xs2vr0mqx9s8nd).html"
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
    print("Starting Batch 10 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 10 Processing Complete.")

if __name__ == "__main__":
    main()
