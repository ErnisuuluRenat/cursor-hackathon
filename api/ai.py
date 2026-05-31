import os
import urllib.request
import json
from pathlib import Path

def load_env():
    # Look for .env.local in the root directory (parent of api/)
    env_path = Path(__file__).resolve().parent.parent / '.env.local'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ[key.strip()] = val.strip()

load_env()
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

MODEL = 'claude-sonnet-4-20250514'
API_URL = 'https://api.anthropic.com/v1/messages'

def auth_headers():
    if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == 'your-api-key-here':
        raise ValueError('ANTHROPIC_API_KEY not set in .env.local')
    return {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
    }

def post_messages(body):
    headers = auth_headers()
    payload = {
        'model': MODEL,
        'max_tokens': 1000,
        **body
    }
    
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return res_data['content'][0]['text'] if res_data.get('content') else ''
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        raise Exception(f"Claude API error {e.code}: {e.reason} - {error_body}")
    except Exception as e:
        raise Exception(f"Claude request failed: {str(e)}")

def call_claude(prompt):
    return post_messages({
        'messages': [{'role': 'user', 'content': prompt}]
    })

def call_claude_chat(messages, system_prompt):
    return post_messages({
        'system': system_prompt,
        'messages': messages
    })

def call_claude_vision(prompt, image_base64):
    # Detect and normalize media type
    media_type = 'image/jpeg'
    if image_base64.startswith('data:'):
        # Extract media type (e.g. data:image/png;base64,...)
        parts = image_base64.split(';base64,')
        if len(parts) == 2:
            media_type = parts[0].replace('data:', '')
            image_base64 = parts[1]
            
    # Clean any leftover newlines/whitespace
    clean_base64 = image_base64.strip()
    
    return post_messages({
        'messages': [
            {
                'role': 'user',
                'content': [
                    {
                        'type': 'image',
                        'source': {
                            'type': 'base64',
                            'media_type': media_type,
                            'data': clean_base64,
                        }
                    },
                    {
                        'type': 'text',
                        'text': prompt,
                    }
                ]
            }
        ]
    })
