import json
import re
from .ai import call_claude_vision

FALLBACK_VERDICT = {
    'verified': True,
    'reason': 'Photo received (AI verification pending)',
    'coolnessScore': 60,
}

def extract_json(text):
    # Regex to find JSON block, possibly wrapped in markdown code fences
    match = re.search(r'```json\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    match = re.search(r'```\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    return text.strip()

def verify_proof(activity, image_base64):
    prompt = f"""Look at this photo. The user claims they did: "{activity}"

Answer ONLY with a JSON object (no markdown, no extra text):
{{
  "verified": true or false,
  "reason": "brief explanation (1-2 sentences)",
  "coolnessScore": number between 0 and 100
}}

Guidelines:
- Coolness score: 80+ for epic trips (international, unique, adventurous)
- Coolness score: 50-79 for good local activities
- Coolness score: 0-49 for basic activities
- If you can't tell if it matches the activity, set verified: false"""

    try:
        response = call_claude_vision(prompt, image_base64)
        json_str = extract_json(response)
        raw_data = json.loads(json_str)
        
        # Keep closeness to original verifier.js validation logic
        verified = raw_data.get('verified')
        if not isinstance(verified, bool):
            verified = True
            
        reason = raw_data.get('reason')
        if not isinstance(reason, str) or not reason.strip():
            reason = 'Photo verified'
            
        try:
            coolness_score = int(raw_data.get('coolnessScore', 50))
        except (ValueError, TypeError):
            coolness_score = 50
            
        coolness_score = min(100, max(0, coolness_score))
        
        return {
            'verified': verified,
            'reason': reason,
            'coolnessScore': coolness_score,
        }
    except Exception as e:
        print('Verification failed, using fallback:', str(e))
        return FALLBACK_VERDICT
