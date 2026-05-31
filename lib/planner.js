import { callClaude } from './ai';
import { extractJson } from './parse';

const FALLBACK_PLAN = {
  packingList: ['Camera', 'Passport', 'Comfortable shoes', 'Water', 'Sunscreen'],
  bestDay: 'Saturday',
  steps: ['Book flights', 'Prepare itinerary', 'Pack bags', 'Have fun!'],
};

// Make sure whatever Claude returns matches the frozen plan shape.
function normalizePlan(raw) {
  return {
    packingList: Array.isArray(raw.packingList) && raw.packingList.length
      ? raw.packingList.map(String)
      : FALLBACK_PLAN.packingList,
    bestDay: typeof raw.bestDay === 'string' && raw.bestDay.trim()
      ? raw.bestDay
      : FALLBACK_PLAN.bestDay,
    steps: Array.isArray(raw.steps) && raw.steps.length
      ? raw.steps.map(String)
      : FALLBACK_PLAN.steps,
  };
}

export async function generatePlan({ activity, members = [], location = 'current' }) {
  const memberNames = members.map(m => m.name).join(', ') || 'a group of friends';

  const prompt = `
You are a trip planning AI. Generate a concise, fun travel plan for:
- Activity: ${activity}
- Participants: ${memberNames}
- Location: ${location}

Return ONLY a JSON object (no markdown, no extra prose) with exactly this shape:
{
  "packingList": ["item1", "item2", ...],
  "bestDay": "Saturday" or a specific date,
  "steps": ["Step 1: ...", "Step 2: ...", ...]
}

Keep the packing list to 5-7 items and steps to 3-5 entries.
  `.trim();

  try {
    const response = await callClaude(prompt);
    return normalizePlan(extractJson(response));
  } catch (e) {
    console.error('Plan generation failed, using fallback:', e.message);
    return FALLBACK_PLAN;
  }
}
