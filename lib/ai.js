const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';
const API_URL = 'https://api.anthropic.com/v1/messages';

function authHeaders() {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }
  return {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  };
}

async function postMessages(body) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ model: MODEL, max_tokens: 1000, ...body }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Claude API error ${response.status}: ${response.statusText} ${detail}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// Pull the media type out of a data URL (defaults to jpeg for raw base64).
function detectMediaType(imageBase64) {
  const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,/.exec(imageBase64);
  return match ? match[1] : 'image/jpeg';
}

export async function callClaude(prompt) {
  return postMessages({
    messages: [{ role: 'user', content: prompt }],
  });
}

export async function callClaudeVision(prompt, imageBase64) {
  const mediaType = detectMediaType(imageBase64);
  // Remove data:image/...;base64, prefix if present
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  return postMessages({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: cleanBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });
}
