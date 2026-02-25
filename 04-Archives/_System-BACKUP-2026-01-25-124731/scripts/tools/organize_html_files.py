import os
import re
from bs4 import BeautifulSoup

# Define the base directories
unsorted_dir = "03-Resources/Unsorted/html"
resources_dir = "03-Resources"

# Define keywords for categorization
category_keywords = {
    "Technical/AI": ["ai", "artificial intelligence", "gpt", "neural network"],
    "Technical/Developer-Tools": ["github", "javascript", "ide", "api", "developer"],
    "Technical/Software": ["software", "backup", "browser", "app"],
    "Business/Marketing": ["marketing", "leads", "seo", "entrepreneur", "valuation"],
    "Entertainment/Music": ["music", "album", "songs"],
    "Sacred-Science/Sacred-Geometry": ["torus", "sacred geometry", "spiritual"],
    "Productivity/Writing": ["writing", "scripts", "author"],
    "Content/Video-Production": ["youtube", "video", "stream"],
}

def get_category(text_content):
    """Determines the category of a file based on its content."""
    text_content = text_content.lower()
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            if keyword in text_content:
                return category
    return "Uncategorized"

def sanitize_filename(filename):
    """Sanitizes a string to be used as a filename."""
    # Remove the unique ID in parentheses
    filename = re.sub(r'\s*\([^)]*\)', '', filename)
    # Replace spaces and special characters with hyphens
    filename = re.sub(r'[^a-zA-Z0-9\s-]', '', filename).strip()
    filename = re.sub(r'\s+', '-', filename)
    return filename.lower()

def main():
    """Organizes the HTML files in the unsorted directory."""
    if not os.path.exists(unsorted_dir):
        print(f"Directory not found: {unsorted_dir}")
        return

    for filename in os.listdir(unsorted_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(unsorted_dir, filename)

            # Check if the file still exists before processing
            if not os.path.exists(filepath):
                continue

            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            soup = BeautifulSoup(content, 'html.parser')
            text_content = soup.get_text()

            category = get_category(text_content)
            new_filename = sanitize_filename(filename.replace(".html", "")) + ".html"
            
            if category != "Uncategorized":
                new_dir = os.path.join(resources_dir, category)
                os.makedirs(new_dir, exist_ok=True)
                new_filepath = os.path.join(new_dir, new_filename)

                print(f"Moving {filepath} to {new_filepath}")
                os.rename(filepath, new_filepath)
            else:
                print(f"Could not categorize {filename}")

if __name__ == "__main__":
    main()
