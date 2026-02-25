import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "Cooking is about using simple, high-quality ingredients and transformi… (01j1j9dbg0eagp8amdk8fc52yv).html": "03-Resources/Creative-Ideas/Cooking/Simple-Cooking-Philosophy.md",
    "Copy and Paste icons into your Webflow projects. (01j1j9dan2ny7ts2xgef420njk).html": "03-Resources/Design/Resources/Webflow-Icons.md",
    "Create AI images with character consistency (01j0w97drscptr5s5ysqek6ht2).html": "03-Resources/Technical/AI-ML/Generative-Art/Character-Consistency-Guide.md",
    "Create Logos in Seconds With Generative A.I (01j1j9d9t8t22krsnzt9aa8fj1).html": "03-Resources/Design/Tools/AI-Logo-Generators.md",
    "DALLE, GPT-3, Midjourney, Stable Diffusion Prompt Marketplace (01j1j9d9qjed2bkngd8gd72dpc).html": "03-Resources/Technical/AI-ML/Prompt-Engineering/Prompt-Marketplaces.md",
    "DEF CON 32 - Counter Deception: Defending Yourself in a World  Full of… (01jb7mp5mgmfycy960zxywswdj).html": "03-Resources/Technical/Security/DEFCON-32-Counter-Deception.md",
    "Day 20: Write Better With AI (01j3752e2t7p100f7rqqycprjz).html": "03-Resources/Skills/Writing/AI-Writing-Tips.md",
    "Demis Hassabis: creativity and AI  The Rothschild Foundation Lecture (01j427npnkk27wsnnntgkkg6y5).html": "03-Resources/Technical/AI-ML/Demis-Hassabis-Lecture.md",
    "Discover the best affiliate programs that pay the highest commission. (01j1j9d9jf0yjrsyg47byzjyn1).html": "03-Resources/Business/Marketing/Affiliate/Best-Affiliate-Programs.md",
    "Display typefaces (01j1j9daf82sv01fcbfs73551s).html": "03-Resources/Design/Typography/Display-Typefaces.md",
    "Do You Know How Mobile Apps Are Released? (01j37nbpk6r45w09ftqxte6sss).html": "03-Resources/Technical/Mobile-Dev/App-Release-Process.md",
    "Docker Essentials: A Developer Introduction (01j0xw66p7fa9g6dhy26zq96tc).html": "03-Resources/Technical/DevOps/Docker-Essentials.md",
    "Easier and Faster with No-Code (01j0w93mqma5zx4fj7dty52s5z).html": "03-Resources/Technical/No-Code/No-Code-Tools.md",
    "Electrical Engineering: Basic Concepts  (5 of 7) Voltage (01j0thhjm0a9h3f4m1a36r726j).html": "03-Resources/Technical/Engineering/Electrical/Voltage-Basics.md",
    "Empower Open-Source AI: Subscribe to the Smart Connect Official Service (01jd8ec7300jzqfmvc2ctyar1n).html": "03-Resources/Technical/AI-ML/Open-Source-AI.md",
    "Endless collection of delightful details (01jcqs638wppfcgvawg0bktgdr).html": "03-Resources/Design/Inspiration/Delightful-Details.md",
    "Enhance faces: retouch and repair faces from AI image generators or ol… (01jdr48v0qc3hsgr69mar4gpch).html": "03-Resources/Technical/AI-ML/Generative-Art/Face-Enhancement.md",
    "Episode 307: Egypt & Anatolia New Discoveries (Ralph Ellis) (01j1j9daxh9betj9cy23d8z5cc).html": "03-Resources/Research/History/Egypt-Anatolia-Discoveries.md",
    "EternaLEnVy's Anime List - MyAnimeList.net (01j0thhk1cr84pr1927webfxfq).html": "03-Resources/Entertainment/Anime/EternaLEnVy-List.md",
    "Facebook Names Dataset (01j0thhj60ty0gpp8tsz32cjkk).html": "03-Resources/Technical/Data-Science/Datasets/Facebook-Names.md",
    "Favicon Generator. For real. (01j0thhgvddtvmy5fvvtv5xxa9).html": "03-Resources/Technical/Web-Dev/Tools/Favicon-Generator.md",
    "Fiji: ImageJ, with \"Batteries Included\" (01j0thhjg5b64xyrqk43n4vs8b).html": "03-Resources/Technical/Tools/Image-Processing/Fiji-ImageJ.md",
    "Find hidden gold mines that make you money (01j2wp8rk6av2dr4mj890yn6x9).html": "03-Resources/Business/Entrepreneurship/Niche-Finding.md",
    "Find your next 100 superfans (01j1j9d93ghj3h3t2jkcrxrx4h).html": "03-Resources/Business/Marketing/Audience-Building/Finding-Superfans.md",
    "Firefox Browser Add-ons (01j0thhkm11wafwmyaaspwsqcj).html": "03-Resources/Technical/Tools/Browser-Extensions/Firefox-Addons.md",
    "Founders meet investors, and vice-versa. (01j0w94pt2y10kkfrs9497t7j4).html": "03-Resources/Business/Startups/Funding/Founders-Investors.md",
    "Free AI - Text prompt to SVG (01j1j9d96nehm9h24ygr7yzh7f).html": "03-Resources/Technical/AI-ML/Generative-Art/Text-to-SVG.md",
    "Free Online AI Subtitle Generator (01j1j9d9v4vnb1jwp890bwrz15).html": "03-Resources/Skills/Content-Creation/Video/AI-Subtitles.md",
    "Free Text to Speech & AI Voice Generator | ElevenLabs (01jdr4gmjy7g0tgxwnb2hwr6bp).html": "03-Resources/Technical/AI-ML/Audio/ElevenLabs-TTS.md",
    "Free vs. Paid Online Communities: Which Is Right for You? [Expert Tips] (01j2kfqh8k0r64d0cj7g2jn4ne).html": "03-Resources/Business/Community-Building/Free-vs-Paid.md",
    "Freelance Dashboard (01j0yd9z36yeke9jy37qpf2t9d).html": "03-Resources/Career/Freelancing/Dashboard-Template.md",
    "Freshly hand-picked websites (01jdr6bfapyaxvc8d6m3n31mma).html": "03-Resources/Technical/Tools/Curated-Websites.md",
    "From gratitude to growth: This Thanksgiving, were sharing exclusive to… (01jdwfjmv6xjqwye4cc8y8fhaj).html": "03-Resources/Self-Improvement/Gratitude-Growth.md",
    "Full Image Reveal Effect (01j0thhhkn9npmcc19v6mbvms6).html": "03-Resources/Technical/Web-Dev/CSS-Effects/Image-Reveal.md"
}

# Junk files to delete
JUNK_FILES = [
    "EXCLUSIVE PROGRAM   (01j0thhjc8xgt4z1j2na84x8vf).html",
    "Fmovies - Watch Free Movies Series and TV Shows HD Online (01jefx891egff8pcv0pedtfgwe).html",
    "Features (01j1j9d8ym20tx64151d2ehcr1).html",
    "Fn7 Application (01j1tqye69nh61nanvh4vhknxv).html",
    "Free High quality mockups  minimalmockups.com  Follow for more design… (01j2qfa1sp3jkxnhktfp1j87ye).html",
    "GLTF -> React Three Fiber (01j1j9da9d1r6bg6gtkr94y1pb).html",
    "Generate 3D in a snap with the new Spline Ai. 3D you can then add to y… (01j0zhm2qz0200rzd3d95xyhv6).html",
    "Generate vector art, 3D images and more (01j677agzshr8d37prfzb1xya2).html",
    "Generate your ideal color palette (01j4x9rnmq3zcmnkxqt4t9anfq).html",
    "Get ClickUp Free (01jdr4yv3wfww5wkbstqrpwby7).html",
    "Get to know structure reference in adobe firefly! This feature is real… (01j0zhfw24xfy29tnrwpckg4pk).html",
    "Get visuals from your text (01jd3ry87kxefn0tgfdekwarwf).html",
    "Easier and Faster with No-Code (01j1j9d9e6r3n6710wk2ewtzg0).html",
    "Enhance your design projects with these multiple checklists of top des… (01j0zhsc8her73r1qj8518f48t).html",
    "Explore | Are.na (01jd3t08m1p5q5nwnxcmp024pp).html"
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
    print("Starting Batch 11 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 11 Processing Complete.")

if __name__ == "__main__":
    main()
