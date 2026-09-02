import { supabase } from '@/lib/supabase';

async function ensureAuthenticated() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const result = await supabase.auth.signInAnonymously({ options: { data: { is_guest: true } } });
  if (result.error || !result.data.session) throw result.error ?? new Error('Could not start a secure session.');
  return result.data.session;
}

export async function invokeAI<T>(functionName: string, body: object): Promise<T> {
  await ensureAuthenticated();
  const { data, error } = await supabase.functions.invoke(functionName, { body });
  if (error) {
    const context = (error as { context?: Response }).context;
    if (context && typeof context.clone === 'function') {
      try {
        const payload = await context.clone().json();
        throw new Error(payload?.error || error.message || 'The AI service is unavailable.');
      } catch (cause) {
        if (cause instanceof Error && cause.message !== 'Unexpected end of JSON input') throw cause;
      }
    }
    throw new Error(error.message || 'The AI service is unavailable.');
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export type GeneratedLesson = { title: string; objective: string; estimatedMinutes: number; slides: Array<{ title: string; body: string; visualPrompt?: string; keyPoint?: string }>; quiz: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }> };
export type GeneratedCourse = { id: string; title: string; description: string; category: string; difficulty: string; learningStyle: string; units: Array<{ title: string; description: string; lessons: GeneratedLesson[] }> };

export const createCustomCourse = (input: { title: string; description: string; category: string; difficulty: string; learningStyle: string; lessonLength: string; goal: string; references?: Array<{ name: string; mimeType?: string; size?: number }> }) => invokeAI<{ course: GeneratedCourse }>('create-custom-course', input);
export const askAI = (question: string, context?: string) => invokeAI<{ answer: string; followUps: string[] }>('ask-ai', { question, context });
export const semanticSearch = <T extends { id: string; title: string; text: string }>(query: string, candidates: T[]) => invokeAI<{ results: Array<T & { score: number }> }>('semantic-search', { query, candidates });
export const textToSpeech = (text: string, voice = 'marin', speed = 1) => invokeAI<{ audioBase64: string; mimeType: string }>('text-to-speech', { text, voice, speed });
export const transcribeAudio = (audioBase64: string, mimeType: string) => invokeAI<{ text: string }>('transcribe-audio', { audioBase64, mimeType });
