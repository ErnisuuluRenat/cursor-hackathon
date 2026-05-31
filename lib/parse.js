// Robust JSON extraction from LLM output.
// Claude sometimes wraps JSON in ```json fences or adds a sentence before/after.
// This pulls out the first balanced {...} block and parses it.

export function extractJson(text) {
  if (!text) throw new Error('Empty response');

  // Strip markdown code fences first.
  const cleaned = text.replace(/```json\s*|\s*```/g, '').trim();

  // Fast path: the whole thing is JSON.
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // fall through to bracket scan
  }

  // Scan for the first balanced object.
  const start = cleaned.indexOf('{');
  if (start === -1) throw new Error('No JSON object found');

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.slice(start, i + 1));
      }
    }
  }

  throw new Error('No balanced JSON object found');
}
