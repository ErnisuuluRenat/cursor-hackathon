import { callClaude } from './ai';

export async function generatePlan({ activity, members, location }) {
  const memberNames = members.map(m => m.name).join(', ');

  const prompt = `
You are a trip planning AI. Generate a concise travel plan for:
- Activity: ${activity}
- Participants: ${memberNames}
- Location: ${location}

Return a JSON object (ONLY JSON, no markdown) with:
{
  "packingList": ["item1", "item2", ...],
  "bestDay": "Saturday" or specific date,
  "steps": ["Step 1: ...", "Step 2: ...", ...]
}

Keep it concise and fun.
  `.trim();

  const response = await callClaude(prompt);

  try {
    const json = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    return json;
  } catch (e) {
    console.error('Failed to parse plan response:', response);
    return {
      packingList: ['Camera', 'Passport', 'Comfortable shoes'],
      bestDay: 'Saturday',
      steps: ['Book flights', 'Prepare itinerary', 'Pack bags', 'Have fun!'],
    };
  }
}
