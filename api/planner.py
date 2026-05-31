import json
import re
from .ai import call_claude_chat

FALLBACK_PLAN = {
    'quest': 'Summer Adventure',
    'bestDay': 'Saturday',
    'duration': '1 day',
    'budget': {
        'total': '~$50 per person',
        'accommodation': '$0',
        'transport': '$10',
        'food': '$20',
        'activities': '$20'
    },
    'accommodation': [],
    'route': [{ 'type': 'car', 'from': 'Home', 'to': 'Destination', 'duration': '1h', 'cost': '$10' }],
    'packingList': ['Camera', 'Water', 'Snacks', 'Comfortable shoes', 'Sunscreen'],
    'itinerary': [{ 'day': 1, 'title': 'Adventure Day', 'activities': ['Meet up', 'Go explore', 'Have fun!'] }],
}

PLANNER_SYSTEM = """You are an enthusiastic AI quest planner for a group of friends.

Your job is to plan a group adventure through natural conversation. You should:
1. Greet the group and ask about the adventure idea if not yet specified.
2. Ask each person about their availability (which days work, which don't).
3. Ask about budget range (cheap, moderate, splurge).
4. Ask about any preferences or constraints (e.g. no hiking, vegetarian food, need accommodation).
5. Once you have enough info from everyone (or after ~4-6 exchanges), finalize the plan.

When you are ready to finalize, end your message with the word PLAN_READY and a JSON block:
<PLAN>
{
  "quest": "Short epic title for the adventure",
  "bestDay": "The specific day that works for everyone, with reasoning",
  "duration": "e.g. 1 day / 2 days 1 night",
  "budget": {
    "total": "~$X per person",
    "accommodation": "$X",
    "transport": "$X",
    "food": "$X",
    "activities": "$X"
  },
  "accommodation": [
    { "name": "...", "type": "hotel/hostel/camping/airbnb", "price": "$X/night", "tip": "..." }
  ],
  "route": [
    { "type": "bus/train/car/flight", "from": "...", "to": "...", "duration": "...", "cost": "$X" }
  ],
  "packingList": ["item1", "item2", "item3", "item4", "item5"],
  "itinerary": [
    { "day": 1, "title": "Day title", "activities": ["activity 1", "activity 2", "activity 3"] }
  ]
}
</PLAN>

Keep messages short (2-4 sentences). Be enthusiastic and fun. Ask one or two questions at a time."""

def extract_json(text):
    match = re.search(r'```json\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    match = re.search(r'```\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    return text.strip()

def normalize_plan(raw):
    return {
        'quest': raw.get('quest', FALLBACK_PLAN['quest']),
        'bestDay': raw.get('bestDay', FALLBACK_PLAN['bestDay']),
        'duration': raw.get('duration', FALLBACK_PLAN['duration']),
        'budget': raw.get('budget', FALLBACK_PLAN['budget']),
        'accommodation': raw.get('accommodation', FALLBACK_PLAN['accommodation']) if isinstance(raw.get('accommodation'), list) else FALLBACK_PLAN['accommodation'],
        'route': raw.get('route', FALLBACK_PLAN['route']) if isinstance(raw.get('route'), list) else FALLBACK_PLAN['route'],
        'packingList': [str(item) for item in raw.get('packingList', [])] if isinstance(raw.get('packingList'), list) and raw.get('packingList') else FALLBACK_PLAN['packingList'],
        'itinerary': raw.get('itinerary', FALLBACK_PLAN['itinerary']) if isinstance(raw.get('itinerary'), list) else FALLBACK_PLAN['itinerary'],
    }

def extract_plan_from_message(text):
    match = re.search(r'<PLAN>([\s\S]*?)<\/PLAN>', text)
    if not match:
        return None
    try:
        json_str = extract_json(match.group(1).strip())
        raw_plan = json.loads(json_str)
        return normalize_plan(raw_plan)
    except Exception as e:
        print('Failed to parse plan from chat message:', e)
        return None

def generate_plan(activity, members):
    member_names = ', '.join([m.get('name', '') for m in members if m.get('name')])
    if not member_names:
        member_names = 'a group of friends'
    messages = [
        {
            'role': 'user',
            'content': f'Plan an adventure: "{activity}" for {member_names} near current. Everyone is free Saturday. Budget is moderate.',
        }
    ]
    try:
        # Import call_claude_chat locally to avoid circular dependency
        from .ai import call_claude_chat
        response = call_claude_chat(messages, PLANNER_SYSTEM)
        plan = extract_plan_from_message(response)
        return plan if plan else FALLBACK_PLAN
    except Exception as e:
        print('Plan generation failed, using fallback:', str(e))
        return FALLBACK_PLAN
