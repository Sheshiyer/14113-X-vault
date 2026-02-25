import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MODEL_ID = 'deepseek/deepseek-chat-v3.1'  # Updated to use free model

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

def load_taxonomy(taxonomy_path):
    with open(taxonomy_path, 'r') as f:
        return f.read()

def analyze_and_tag(file_path, taxonomy):
    with open(file_path, 'r') as f:
        content = f.read()
    
    prompt = f'Given this taxonomy: {taxonomy}\n\nAnalyze the following content and suggest 3-5 relevant tags: {content}'
    suggested_tags = call_openrouter(prompt)
    
    with open(file_path, 'a') as f:
        f.write(f'\n\n## Tags\n{suggested_tags}')

if __name__ == '__main__':
    if not OPENROUTER_API_KEY:
        print('Please set OPENROUTER_API_KEY in .env')
    else:
        taxonomy = load_taxonomy('/Users/magenarayan/twc-vault/_System/Tags/taxonomy.md')
        # Example usage
        analyze_and_tag('/Users/magenarayan/twc-vault/03-Resources/Research/new_document.md', taxonomy)