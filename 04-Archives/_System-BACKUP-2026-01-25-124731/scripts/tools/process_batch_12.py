import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Getting Started with Reader (01j0skp6ydk0f77qctmygv36dy).html": "03-Resources/Technical/Tools/Readwise/Reader-Guide.md",
    "GitHub - coollabsio-coolify: An open-source & self-hostable Heroku - N… (01j6djhtw2aqq16t37mj0zgr00).html": "03-Resources/Technical/DevOps/Coolify.md",
    "GitHub - dokku-dokku: A docker-powered PaaS that helps you build and m… (01j6djhjrekknygdq0pyevsr5a).html": "03-Resources/Technical/DevOps/Dokku.md",
    "GitHub - instantdb-instant (01j6djhckyf4b9r96hgw0g98yq).html": "03-Resources/Technical/Development/Databases/InstantDB.md",
    "GitHub - majacinka-autogen-experiments (01j0yd9z64p0d2dshg2aycmjqq).html": "03-Resources/Technical/AI-ML/Agents/Autogen-Experiments.md",
    "GitHub: Lets build from here  GitHub (01j0thhh8rzbj95yasrb2yqsq2).html": "03-Resources/Technical/Development/GitHub-Guide.md",
    "GoblinTools (01j2fyxfxz7zjmhzg89ygkx7ky).html": "03-Resources/Technical/Tools/Productivity/GoblinTools.md",
    "Golden Gate Claude (01j427tyrer6deh4egx0p8dcs0).html": "03-Resources/Technical/AI-ML/LLMs/Anthropic/Golden-Gate-Claude.md",
    "Goodbye to Notion, Figma, and MS Paint (01j11tmez3xaeyysakjh3f991c).html": "03-Resources/Technical/Tools/Productivity/Notion-Alternatives.md",
    "Google AI Updates, Top Tools, and Must-See Marketing Guides! (01jgpn9jhzw7w8bas8hgy6kc8t).html": "03-Resources/Technical/AI-ML/News/Google-AI-Updates-Dec-2024.md",
    "Google Unveils AI Agent Based on Gemini 2.0 (01jexjtwph9x18d8rqgh8d22nd).html": "03-Resources/Technical/AI-ML/News/Google-AI-Agent-Gemini-2.md",
    "Google enters the humanoid game (01jfj5zvvztpmg8y3j1ffj5j8q).html": "03-Resources/Technical/Robotics/Google-Humanoid.md",
    "Google unveils VEO 2 to rival OpenAI's Sora (01jfafr7a36negxm012z1j5254).html": "03-Resources/Technical/AI-ML/Generative-Art/Video/Google-VEO-2.md",
    "Google's quantum breakthrough (01jere7916y4r499ps6g9x5wtn).html": "03-Resources/Technical/Quantum-Computing/Google-Breakthrough.md",
    "Grow a high-quality Twitter audience. Fast. (01j2retdwxf6ztms657ayt737y).html": "03-Resources/Business/Marketing/Social-Media/Twitter-Growth.md",
    "HOW-TO:Install Kodi for Linux (01j0thhkd3qfzcd7ttra1xyd5v).html": "03-Resources/Technical/Linux/Kodi-Installation.md",
    "Have you started your first Canvas yet? (01j0sneswh995b4vkwk2a0fc8k).html": "03-Resources/Technical/Tools/Obsidian/Canvas-Tips.md",
    "Headless eCommerce (01j0thhftqh8zfg93s9cq2pyk0).html": "03-Resources/Technical/Web-Dev/E-Commerce/Headless-Commerce.md",
    "Home - Gene Keys (01jdr3n1b4k54xne624q15ee8m).html": "03-Resources/Self-Improvement/Spirituality/Gene-Keys.md",
    "Hover Motion Intro Animation (01j6dqhke4qjbqtwqvxsvb3s7b).html": "03-Resources/Design/Web-Design/Animations/Hover-Motion.md",
    "How Big Tech Ships Code to Production (01j4ypz10dkbx1ysdt027pkn3t).html": "03-Resources/Technical/DevOps/Deployment/Big-Tech-Shipping.md",
    "How LLMs are and are not myopic (01j427v83enresdbpbqjjnssap).html": "03-Resources/Technical/AI-ML/LLMs/Research/LLM-Myopia.md",
    "How Sintra Bots are different from regular ChatGPT... (01j14ptrm8a7x6f1avtdzksk5j).html": "03-Resources/Technical/AI-ML/Agents/Sintra-Bots.md",
    "How To Craft Your Own Herbal Smoking Blends (01j0thhhxg87fr738pag0g821f).html": "03-Resources/Lifestyle/Herbalism/Smoking-Blends.md",
    "How to Install Joomla on a Local Server (01j0thhk9ajwjm18vs956z99d4).html": "03-Resources/Technical/Web-Dev/CMS/Joomla-Installation.md",
    "How to Install KDE Plasma 5.17 in Ubuntu, Linux Mint, Fedora and OpenS… (01j0thhkfqey989yckffx4r676).html": "03-Resources/Technical/Linux/Desktop-Environments/KDE-Plasma-Install.md",
    "How to Optimize Windows 10 for Gaming and Performance (01j0thhj7mzwpn1vczbcbykaf5).html": "03-Resources/Technical/OS/Windows/Optimization-Guide.md",
    "How to Transcribe Audio to Text with ChatGPT and Notion (01j1j9bmw4mmn5b78cf1xseq97).html": "03-Resources/Skills/Content-Creation/Audio/Transcription-Guide.md",
    "How to: Basic Naruto Hand-Signs! | Naruto Amino (01jdr38v5rjgyfav3gtzwgdh9t).html": "03-Resources/Entertainment/Anime/Naruto-Hand-Signs.md",
    "I built my Own Web Scrapper (01j3pf92qrqmec46fba519syk5).html": "03-Resources/Technical/Development/Web-Scraping/Custom-Scraper.md",
    "I haven't seen you (01jg7zbvnb65t4ykq828ywe04b).html": "03-Resources/Unsorted/Newsletters/I-Havent-Seen-You.md",
    "I tested GPT-4o and Claude Sonnet 3.5 with same mega... (01j1j5b5avzrrnc93g17197730).html": "03-Resources/Technical/AI-ML/LLMs/Comparisons/GPT4o-vs-Claude3.5.md",
    "I've tried 150+ GPTs (01j11tpkv4hps2jcp5cqc72ecs).html": "03-Resources/Technical/AI-ML/LLMs/GPTs/GPT-Reviews.md",
    "Importing Data (01j0yd9zbs6pze7b9dfsndwt39).html": "03-Resources/Technical/Data-Science/Data-Importing.md",
    "Installing Seafile (Secure Cloud Storage) with MySQL Database in RHEL… (01j0thhkc6pdwntcsdc030nfy1).html": "03-Resources/Technical/Self-Hosted/Seafile-Installation.md",
    "Interview Prep AI (01j1j9d9vygrtyb4zr7gy3dxzg).html": "03-Resources/Technical/Tools/Career/Interview-Prep-AI.md",
    "Investing cheat sheet: (01j1hgv26b0pcc7r6krvazwdfn).html": "03-Resources/Business/Finance/Investing-Cheat-Sheet.md",
    "Invisibility (01j3p27g9vwbn80an0asngy1th).html": "03-Resources/Technical/AI-ML/Tools/Invisibility-AI.md"
}

# Junk files to delete
JUNK_FILES = [
    "Hearing is believing (01j1j9d903vhj0seyxcdhwshbk).html",
    "Heres one of the best resources for you to do thorough market research… (01j0zj4643cpefv1fscwx8bdpe).html",
    "How to Generate over 100,000 Leads Automatically  Comment Skool to get… (01j0zj50q0cvh77x7x3ynxczd2).html",
    "How to create 3D mockup animation with no skills #graphicdesign #graph… (01j0zhb1d58yes0srgzhxg6t6z).html",
    "How to make Tesla Coil at home - Wireless Energy Transmission - DIY Ho… (01j0thhjjj6140yr8sj0cetvtw).html",
    "Ideogram (01j52hrrtxktvcw005pa5wvm97).html",
    "Image Glitch Effect (01j0thhhjxs2q2c397pa752zav).html",
    "Infinity Loader (01j0thhhesg0qynn14wsfggnw9).html",
    "Introduction to OpenRewrite (01j0yd9zcmhegwykkn0w2gvv56).html"
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
    print("Starting Batch 12 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 12 Processing Complete.")

if __name__ == "__main__":
    main()
