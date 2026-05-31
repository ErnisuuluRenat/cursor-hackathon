const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = 'gemini-2.0-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function apiUrl(endpoint) {
  if (!GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not set');
  return `${BASE_URL}/${MODEL}:${endpoint}?key=${GOOGLE_API_KEY}`;
}

async function post(endpoint, body) {
  const response = await fetch(apiUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Gemini API error ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Gemini uses "model" instead of "assistant"
function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

function detectMediaType(imageBase64) {
  const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,/.exec(imageBase64);
  return match ? match[1] : 'image/jpeg';
}

export async function callClaude(prompt) {
  return post('generateContent', {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
}

// Multi-turn conversation — messages is [{role, content}, ...]
export async function callClaudeChat(messages, systemPrompt) {
  return post('generateContent', {
    system_instruction: systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined,
    contents: messages.map(m => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    })),
  });
}

export async function callClaudeVision(prompt, imageBase64) {
  const mediaType = detectMediaType(imageBase64);
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  return post('generateContent', {
    contents: [{
      role: 'user',
      parts: [
        { inline_data: { mime_type: mediaType, data: cleanBase64 } },
        { text: prompt },
      ],
    }],
  });
}
