import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export async function generateAiText(prompt: string) {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      message: 'AI is not configured yet. Add GEMINI_API_KEY to the API environment and restart the server.',
      text: '',
    };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 },
      }),
    });

    const result = (await response.json()) as {
      error?: { message?: string; status?: string };
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    if (!response.ok) {
      return {
        success: false,
        message: response.status === 401 || response.status === 403
          ? 'The configured Gemini key was rejected. Update GEMINI_API_KEY in the API environment and restart the server.'
          : result.error?.message || 'Gemini could not complete the request. Please try again.',
        text: '',
      };
    }

    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
    return { success: Boolean(text), text, ...(text ? {} : { message: 'Gemini returned an empty response.' }) };
  } catch {
    return { success: false, message: 'Could not reach Gemini. Please try again.', text: '' };
  }
}