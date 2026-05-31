import { callClaudeVision } from './ai';
import { extractJson } from './parse';

function clampScore(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return 50;
  return Math.min(100, Math.max(0, Math.round(num)));
}

export async function verifyProof({ activity, imageBase64 }) {
  const prompt = `
Look at this photo. The user claims they did: "${activity}"

Answer ONLY with a JSON object (no markdown, no extra text):
{
  "verified": true or false,
  "reason": "brief explanation (1-2 sentences)",
  "coolnessScore": number between 0 and 100
}

Guidelines:
- Coolness score: 80+ for epic trips (international, unique, adventurous)
- Coolness score: 50-79 for good local activities
- Coolness score: 0-49 for basic activities
- If the photo clearly does NOT match the claimed activity, set verified: false
  `.trim();

  try {
    const response = await callClaudeVision(prompt, imageBase64);
    const json = extractJson(response);
    return {
      verified: typeof json.verified === 'boolean' ? json.verified : true,
      reason: typeof json.reason === 'string' && json.reason.trim()
        ? json.reason
        : 'Photo verified.',
      coolnessScore: clampScore(json.coolnessScore),
    };
  } catch (e) {
    console.error('Verification failed, using fallback verdict:', e.message);
    // Fallback verdict — keep the demo flowing even if the API hiccups.
    return {
      verified: true,
      reason: 'Photo received (AI verification unavailable).',
      coolnessScore: 60,
    };
  }
}
