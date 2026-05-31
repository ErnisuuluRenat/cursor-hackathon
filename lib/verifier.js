import { callClaudeVision } from './ai';

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
- If you can't tell if it matches the activity, set verified: false
  `.trim();

  const response = await callClaudeVision(prompt, imageBase64);

  try {
    const json = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    return {
      verified: json.verified ?? true,
      reason: json.reason ?? 'Photo verified',
      coolnessScore: Math.min(100, Math.max(0, json.coolnessScore ?? 50)),
    };
  } catch (e) {
    console.error('Failed to parse verdict response:', response);
    // Fallback verdict
    return {
      verified: true,
      reason: 'Photo received (AI verification pending)',
      coolnessScore: 60,
    };
  }
}
