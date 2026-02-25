import os
import shutil
from bs4 import BeautifulSoup

SOURCE_DIR = "/Users/sheshnarayaniyer/twc-vault/03-Resources/Unsorted/html/"
VAULT_ROOT = "/Users/sheshnarayaniyer/twc-vault/"

# Valid files mapping: Source Filename -> (Target Relative Path)
VALID_FILES = {
    "TEKAVO Computer Table with Keyboard Tray for Home Office, Office desk… (01j52r58farhj4qdgzgs0pcez6).html": "03-Resources/Lifestyle/Home/Furniture/Tekavo-Table.md",
    "Templates (01j137vj6z6p1a68bf6bpmms44).html": "03-Resources/Technical/Tools/Productivity/Templates.md",
    "Tempo (01j0thhhgxx30cv35x2e5wm3c3).html": "03-Resources/Technical/Tools/Productivity/Tempo-Email.md",
    "Tesla's Secret finally understood (Gerard Morin) DEBUNKED!! (01j0thhjnancwges6b6t3sn0pp).html": "03-Resources/Creative-Ideas/Philosophy/Tesla-Secret.md",
    "The AI tool for (01j1j9d9y7f9z19bvfbtcb6w5p).html": "03-Resources/Technical/AI-ML/Tools/AI-Tool-For.md",
    "The Complete Linux Course: Beginner to Power User! (01j0thhk57ca1b5ztrar0dqjrq).html": "03-Resources/Technical/Linux/Course/Complete-Linux-Course.md",
    "The Complete Notion API Crash Course for Beginners (01j4x9s0b0vpka291g2va2mevt).html": "03-Resources/Technical/Tools/Notion/API-Course.md",
    "The Complete Starter Guide To Tumblr Marketing (01j0thhjvee8qant72sx3t5vn3).html": "03-Resources/Business/Marketing/Social-Media/Tumblr-Guide.md",
    "The Fable of the Fox and the Unliberated Animals (01j427rw56nmm6qkc2ezkms8th).html": "03-Resources/Creative-Ideas/Stories/Fable-Fox.md",
    "The Great American Solar Eclipse, the Devil's Comet and the... (01j11th3kpcyt8h6ccmc7y1r5k).html": "03-Resources/Sacred-Science/Astrology/Solar-Eclipse.md",
    "The Next Generation of Video Creation (01j1j9dac3vhb3rry0rzadyqyc).html": "03-Resources/Technical/AI-ML/Generative-Art/Video/Next-Gen-Video.md",
    "The Practical Fractal: The Holy Grail to Trading by Bill Williams PhD… (01j0thhg38bvt474rr35634ypm).html": "03-Resources/Business/Finance/Trading/Fractal-Trading.md",
    "The Stocks (01j3gmhm1pkx7pybreez7yjn1e).html": "03-Resources/Business/Finance/Trading/The-Stocks.md",
    "The Technological Singularity (01j428g8bbxt8amtnne40bsh0f).html": "03-Resources/Creative-Ideas/Philosophy/Singularity.md",
    "The easiest way to extract and monitor data from any website. (01j1j9d9f3fcjgy8659hhn1cnq).html": "03-Resources/Technical/Web-Dev/Scraping/Easy-Extract.md",
    "The easiest way to use AI for creating texts, graphics, and solving ot… (01j2fyv7y4277j86gdv4cpbggz).html": "03-Resources/Technical/AI-ML/Tools/Easy-AI.md",
    "This browser is no longer supported. (01j0thhfz038rytz1qzhv7nwa5).html": "03-Resources/Technical/AI-ML/Tools/2023-AI-Tools-Thread.md",
    "This is Napoleon Hill (01j0yds078vkwfn26f02zkfrsy).html": "03-Resources/Creative-Ideas/Philosophy/Napoleon-Hill.md",
    "This is the Atlas of Cognitive Disorders (01j1hgkk0ffxtqtgr1pg5v8fad).html": "03-Resources/Lifestyle/Health/Cognitive-Atlas.md",
    "Thousands of models contributed by our community (01jdr4fjc4hah56ba071sekhfz).html": "03-Resources/Technical/AI-ML/Models/Thousands-Models.md",
    "Three JS Cheat Sheet Guide (01j1j9d95t3865aq8nts5vxdw5).html": "03-Resources/Technical/Web-Dev/ThreeJS/Cheat-Sheet.md",
    "Tost AI (01jdr25xtaksys39fpf5fqpxyz).html": "03-Resources/Technical/AI-ML/Tools/Tost-AI.md",
    "Transform your blog posts into stunning, shareable infographics, power… (01j54x0deb2j41hzepfnyzhrv7).html": "03-Resources/Skills/Content-Creation/Blog-Transformation.md",
    "Trying to do a gut detox without using binders is... (01j0sn7d0fcgb11a1beh9va675).html": "03-Resources/Lifestyle/Health/Gut-Detox.md",
    "Turn Your Ideas into Visual Stories (01j1j9d9zrkz5r76h9zrgm68v5).html": "03-Resources/Technical/AI-ML/Generative-Art/Visual-Stories.md",
    "Turn your into powerful animated visuals. (01j4x9qy9g55m3h3fwfvbx97mt).html": "03-Resources/Design/Animation/Animated-Visuals.md",
    "Types of Databases (01j0w90v3p3jys3kvz0fndqkdd).html": "03-Resources/Technical/Development/Databases/Types.md",
    "UNDERSTANDING COMEDY ft.@SamayRainaOfficial (01jd0yxzffcc7avrj9ksm0syrs).html": "03-Resources/Entertainment/Comedy/Understanding-Comedy.md",
    "Udio | AI Music Generator - Official Website (01jejvpxexgk6jxtyxhcy78p4a).html": "03-Resources/Technical/AI-ML/Audio/Udio.md",
    "Unique, worry-free model photos (01j2retv1t4gdhsd1bj3h6169m).html": "03-Resources/Technical/AI-ML/Generative-Art/Images/Unique-Photos.md",
    "Use Spot Instances for Any Workload (01jbpweh80y41f0rzj949df2a6).html": "03-Resources/Technical/Cloud/AWS/Spot-Instances.md",
    "Used by analysts at some of the world's largest financial institutions (01j1j9daaqawbf72wdsr64771p).html": "03-Resources/Business/Finance/Tools/Analyst-Tools.md",
    "Useful Research links (01j0xw09bvnfe3wf5w748kyknp).html": "03-Resources/Reference/Research-Links.md",
    "Visualize Your Colors & Fonts On a Real Site (01j97bchdb31janvfwp6rthmbh).html": "03-Resources/Design/Tools/Color-Visualizer.md",
    "Visualizing transformers and attention | Talk for TNG Big Tech Day '24 (01jdj7wmxx6qnzfsxyh63ykfk4).html": "03-Resources/Technical/AI-ML/LLMs/Visualizing-Transformers.md"
}

# Junk files to delete
JUNK_FILES = [
    "TIRED of Low-Paying Freelance Gigs?  These websites will give you enou… (01j0zj152f5wm8pgd5efvq8wyz).html",
    "The AI Learning Center (01j2axke7m9j6vmpckg73f7a8g).html",
    "The Re-Stoned - Stories Of The Astral Lizard(Full Album) (01j0thhget3c76abk41qmvc8mq).html",
    "The top rated social network for Lightfield images. (01j1j9d9r8qx1mrj9qj09q5ng9).html",
    "This AI tool helps you create a powerful brand story where your audien… (01j25jhp9vegfr0txkfycmsqh4).html",
    "This Prompt is SO GOOD it Should be Illegal  Comment PROMPT and I will… (01j0zj2pgry4b5f13y21drzwy1).html",
    "This is Napoleon Hill (01j1fvw0dp7p4d809en2ezz1qw).html",
    "This is how presentations are supposed to be done . #presentations #ga… (01j0zhwpp6cemx44c2wgf19xq0).html",
    "Toys & Games (01j0thhh6kp39v6ytez1vezhqf).html",
    "UX - UI Designer  Jan Mraz (01j0zhpsjv9mnq95zk9vaz2pq7).html",
    "UX - UI Designer  Jan Mraz (01j0zhvmezt700cvhdg1bemn0v).html",
    "UX-UI Brainy Circle | New tutorial (01j0zhxa20g1czd4ewwm2fxc6v).html",
    "Using Three JS in React apps or just in general has always been prett… (01j2axa5qmp63bry81hxww9cp0).html",
    "Want to create the experience you just saw on your own site? (01j0thhjf94dd3ehpxnhhfek16).html"
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
    print("Starting Batch 16 Processing...")
    
    # Process valid files
    for filename, target_path in VALID_FILES.items():
        process_file(filename, target_path)

    # Delete junk files
    print("\nDeleting junk files...")
    for filename in JUNK_FILES:
        delete_junk_file(filename)

    print("Batch 16 Processing Complete.")

if __name__ == "__main__":
    main()
