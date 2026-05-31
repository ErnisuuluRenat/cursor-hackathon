import { callClaudeChat } from './ai';
import { extractJson } from './parse';

const FALLBACK_PLAN = {
  quest: 'Summer Adventure',
  bestDay: 'Saturday',
  duration: '1 day',
  budget: { total: '~$50 per person', accommodation: '$0', transport: '$10', food: '$20', activities: '$20' },
  accommodation: [],
  route: [{ type: 'car', from: 'Home', to: 'Destination', duration: '1h', cost: '$10' }],
  packingList: ['Camera', 'Water', 'Snacks', 'Comfortable shoes', 'Sunscreen'],
  itinerary: [{ day: 1, title: 'Adventure Day', activities: ['Meet up', 'Go explore', 'Have fun!'] }],
};

// System prompt — acts as the quest planner in conversation
export const PLANNER_SYSTEM = `You are an enthusiastic AI quest planner for a group of friends.

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

Keep messages short (2-4 sentences). Be enthusiastic and fun. Ask one or two questions at a time.`;

// Extract the structured plan from a message that contains <PLAN>...</PLAN>
export function extractPlanFromMessage(text) {
  const match = text.match(/<PLAN>([\s\S]*?)<\/PLAN>/);
  if (!match) return null;
  try {
    const raw = extractJson(match[1].trim());
    return normalizePlan(raw);
  } catch {
    return null;
  }
}

function normalizePlan(raw) {
  return {
    quest: raw.quest || FALLBACK_PLAN.quest,
    bestDay: raw.bestDay || FALLBACK_PLAN.bestDay,
    duration: raw.duration || FALLBACK_PLAN.duration,
    budget: raw.budget || FALLBACK_PLAN.budget,
    accommodation: Array.isArray(raw.accommodation) ? raw.accommodation : FALLBACK_PLAN.accommodation,
    route: Array.isArray(raw.route) ? raw.route : FALLBACK_PLAN.route,
    packingList: Array.isArray(raw.packingList) && raw.packingList.length
      ? raw.packingList.map(String)
      : FALLBACK_PLAN.packingList,
    itinerary: Array.isArray(raw.itinerary) ? raw.itinerary : FALLBACK_PLAN.itinerary,
  };
}

// One-shot fallback for when the chat isn't used (e.g. tests)
export async function generatePlan({ activity, members = [], location = 'current' }) {
  const memberNames = members.map(m => m.name).join(', ') || 'a group of friends';
  const messages = [
    {
      role: 'user',
      content: `Plan an adventure: "${activity}" for ${memberNames} near ${location}. Everyone is free Saturday. Budget is moderate.`,
    },
  ];
  try {
    const response = await callClaudeChat(messages, PLANNER_SYSTEM);
    const plan = extractPlanFromMessage(response);
    return plan || FALLBACK_PLAN;
  } catch (e) {
    console.error('Plan generation failed, using fallback:', e.message);
    return FALLBACK_PLAN;
  }
}
