import os
import requests
import json
from dotenv import load_dotenv
import sys

load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

def call_openrouter(prompt, model_id):
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': model_id,
        'messages': [{'role': 'user', 'content': prompt}]
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()['choices'][0]['message']['content']

def generate_documentation(topic, model_id, output_path):
    prompt = f'Generate comprehensive documentation on the topic: {topic}. Include sections for introduction, key concepts, detailed explanations, examples, and references. Format as Markdown.'
    documentation = call_openrouter(prompt, model_id)
    
    with open(output_path, 'w') as f:
        f.write(documentation)
    
    print(f'Documentation generated and saved to {output_path}')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python doc_generator.py <topic> <model_id> [output_path]')
        sys.exit(1)
    
    topic = sys.argv[1]
    model_id = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else f'/Users/magenarayan/twc-vault/03-Resources/Documentation/{topic.replace(" ", "_")}.md'
    
    if not OPENROUTER_API_KEY:
        print('Please set OPENROUTER_API_KEY in .env')
    else:
        generate_documentation(topic, model_id, output_path)