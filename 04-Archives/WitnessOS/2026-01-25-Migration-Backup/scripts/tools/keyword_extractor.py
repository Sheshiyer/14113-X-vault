import os
import requests
import json
from dotenv import load_dotenv
import re
from collections import defaultdict

load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MODEL_ID = 'deepseek/deepseek-chat-v3.1'

DIRECTORIES = [
    '/Users/magenarayan/twc-vault/03-Resources/Research',
    '/Users/magenarayan/twc-vault/03-Resources/Research-Notes',
    '/Users/magenarayan/twc-vault/02-Areas',
    '/Users/magenarayan/twc-vault/01-Projects/WitnessOS',
    '/Users/magenarayan/twc-vault/01-Projects/Core-Framework'
]

def call_openrouter(prompt):
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': MODEL_ID,
        'messages': [{'role': 'user', 'content': prompt}]
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()['choices'][0]['message']['content']

def extract_keywords(batched_content):
    prompt = f'Extract the top 20 most relevant and precise keywords from the following batched text content. Return them as a comma-separated list: {batched_content[:4000]}'  # Increased limit for batch
    response = call_openrouter(prompt)
    keywords = [kw.strip() for kw in response.split(',') if kw.strip()]
    return keywords

def get_md_files(directory):
    md_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files

def main():
    keywords_by_dir = {}
    for dir_path in DIRECTORIES:
        md_files = get_md_files(dir_path)
        batched_content = ''
        for file_path in md_files:
            with open(file_path, 'r') as f:
                content = f.read()
            batched_content += content + '\n\n'
        if batched_content:
            keywords = extract_keywords(batched_content)
            keywords_by_dir[dir_path] = sorted(set(keywords))
    
    with open('/Users/magenarayan/twc-vault/keywords.json', 'w') as f:
        json.dump(keywords_by_dir, f, indent=4)
    print('Keywords extracted and saved to keywords.json')

if __name__ == '__main__':
    if not OPENROUTER_API_KEY:
        print('Please set OPENROUTER_API_KEY in .env')
    else:
        main()