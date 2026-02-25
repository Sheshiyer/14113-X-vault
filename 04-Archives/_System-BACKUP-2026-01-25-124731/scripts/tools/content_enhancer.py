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

def enhance_content(file_path):
    with open(file_path, 'r') as f:
        original_content = f.read()
    
    prompt = f'Analyze this content and enhance it by improving clarity, adding relevant insights, summaries, and structural improvements while preserving original meaning: {original_content}'
    enhanced_content = call_openrouter(prompt)
    
    with open(file_path, 'w') as f:
        f.write(enhanced_content)
    
    print(f'Enhanced {file_path}')

if __name__ == '__main__':
    if not OPENROUTER_API_KEY:
        print('Please set OPENROUTER_API_KEY in .env')
    else:
        # Example usage
        enhance_content('/Users/magenarayan/twc-vault/03-Resources/Research/research.md')