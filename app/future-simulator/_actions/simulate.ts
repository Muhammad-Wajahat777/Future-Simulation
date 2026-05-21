'use server';

import { createClient } from '../_lib/supabase';
import { Outcomes, SimulationRecord } from '../_lib/types';

type GroqErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: string | number;
  };
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterSeconds(headers: Headers): number | null {
  const retryAfter = headers.get('retry-after');

  if (!retryAfter) {
    return null;
  }

  const seconds = Number.parseFloat(retryAfter);
  if (Number.isNaN(seconds)) {
    return null;
  }

  return Math.max(1, Math.ceil(seconds));
}

function buildGroqUserFacingError(status: number, rawText: string): Error {
  let payload: GroqErrorPayload | null = null;

  try {
    payload = JSON.parse(rawText) as GroqErrorPayload;
  } catch {
    payload = null;
  }

  const message = payload?.error?.message?.trim();

  if (status === 429) {
    return new Error(
      'Groq rate limit reached. Please wait a moment and try again. If this keeps happening, slow down requests or check your Groq plan.'
    );
  }

  if (status === 401 || status === 403) {
    return new Error('Groq API key is invalid or lacks permission. Check GROQ_API_KEY and project access.');
  }

  if (message) {
    return new Error(`Groq API error (${status}): ${message}`);
  }

  return new Error(`Groq API error (${status}).`);
}

function extractJsonObject(text: string): string {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Gemini returned an invalid response format.');
  }

  return cleaned.slice(start, end + 1);
}

function assertOutcomes(value: unknown): asserts value is Outcomes {
  if (!value || typeof value !== 'object') {
    throw new Error('Groq response is not a valid JSON object.');
  }

  const obj = value as Record<string, unknown>;
  const keys = ['best_case', 'average_case', 'worst_case'] as const;

  for (const key of keys) {
    const entry = obj[key] as Record<string, unknown> | undefined;

    if (!entry || typeof entry !== 'object' || typeof entry.scenario !== 'string') {
      throw new Error(`Groq response is missing ${key}.scenario`);
    }
  }
}

async function callGroq(situation: string, decisions: string[]): Promise<Outcomes> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in your environment.');
  }

  const prompt = [
    'You are a future simulator. Analyze the user context and decision options.',
    'Return exactly one JSON object with this exact shape and no extra text:',
    '{',
    '  "best_case": { "scenario": "..." },',
    '  "average_case": { "scenario": "..." },',
    '  "worst_case": { "scenario": "..." }',
    '}',
    '',
    'Rules:',
    '- Each scenario must be one paragraph of 4-6 sentences.',
    '- Best case should be positive and plausible.',
    '- Average case should be realistic/neutral.',
    '- Worst case should be cautionary but plausible.',
    '- Tailor all outcomes to the exact situation and decision options.',
    '',
    `Situation: ${situation}`,
    'Decision options:',
    ...decisions.map((item, index) => `${index + 1}. ${item}`),
  ].join('\n');

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 1500,
          messages: [
            {
              role: 'system',
              content:
                'You are a careful strategic analyst. Follow instructions exactly and output only valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const rawError = await response.text();
      if (response.status === 429 && attempt < 2) {
        const retryDelaySeconds = parseRetryAfterSeconds(response.headers) ?? 60;
        const retryDelayMs = retryDelaySeconds * 1000;
        await delay(retryDelayMs);
        continue;
      }

      lastError = buildGroqUserFacingError(response.status, rawError);
      break;
    }

    const payload = await response.json();
    const rawText: string = payload?.choices?.[0]?.message?.content ?? '';

    const jsonText = extractJsonObject(rawText);
    const parsed = JSON.parse(jsonText);
    assertOutcomes(parsed);

    return parsed;
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Groq request failed due to an unknown error.');
}

export async function runSimulation(
  situation: string,
  decisions: string[]
): Promise<{ success: true; data: SimulationRecord } | { success: false; error: string }> {
  try {
    const cleanSituation = situation.trim();
    const cleanDecisions = decisions.map((item) => item.trim()).filter(Boolean);

    if (!cleanSituation) {
      return { success: false, error: 'Please describe your current situation.' };
    }

    if (cleanDecisions.length < 3) {
      return { success: false, error: 'Please provide at least 3 decision options.' };
    }

    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return { success: false, error: 'Please sign in again before running a simulation.' };
    }

    const outcomes = await callGroq(cleanSituation, cleanDecisions);

    const { data, error } = await supabase
      .from('simulations')
      .insert({
        user_id: userData.user.id,
        situation: cleanSituation,
        decisions: cleanDecisions,
        outcomes,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: data as SimulationRecord };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return { success: false, error: message };
  }
}

export async function fetchSimulations(): Promise<SimulationRecord[]> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SimulationRecord[];
}
