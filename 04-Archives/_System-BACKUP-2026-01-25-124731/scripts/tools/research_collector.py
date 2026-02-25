import os
import requests
import json
from dotenv import load_dotenv
import feedparser
import random

load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MODEL_ID = 'deepseek/deepseek-chat-v3.1'  # Updated to use free model

KEYWORDS_FILE = '/Users/magenarayan/twc-vault/keywords.json'

def load_keywords():
    with open(KEYWORDS_FILE, 'r') as f:
        all_keywords = json.load(f)
    combined_keywords = []
    for kws in all_keywords.values():
        combined_keywords.extend(kws)
    return combined_keywords

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

def call_mcp(server_name, tool_name, args):
    # Simulated MCP call; in real integration, use actual API
    print(f'Calling MCP: {server_name}/{tool_name} with args {args}')
    # Replace with actual MCP integration logic
    return 'MCP response data'

def collect_research(topic):
    keywords = load_keywords()
    enhanced_topic = f'{topic} {' '.join(random.sample(keywords, min(5, len(keywords))))}'
    # Gather data from arXiv API
    arxiv_url = f'http://export.arxiv.org/api/query?search_query=all:{enhanced_topic}&start=0&max_results=5'
    response = requests.get(arxiv_url)
    feed = feedparser.parse(response.text)
    search_results = '\n'.join([f"Title: {entry.title}\nAbstract: {entry.summary}" for entry in feed.entries])
    
    # Call MCP for context
    mcp_data = call_mcp('mcp.config.usrlocalmcp.context7', 'get-library-docs', {'context7CompatibleLibraryID': '/some/library', 'topic': enhanced_topic})
    
    # Process with AI
    prompt = f'Summarize and enhance: {search_results} + {mcp_data}'
    ai_summary = call_openrouter(prompt)
    
    # Append to Markdown file
    with open('/Users/magenarayan/twc-vault/03-Resources/Research/research.md', 'a') as f:
        f.write(f'## {topic}\n{ai_summary}\n\n')

if __name__ == '__main__':
    if not OPENROUTER_API_KEY:
        print('Please set OPENROUTER_API_KEY in .env')
    else:
        collect_research('consciousness models')