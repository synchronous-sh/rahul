import AsyncStorage from '@react-native-async-storage/async-storage';

export const OPENAI_VOICES = ['marin', 'cedar', 'coral', 'alloy', 'ash', 'ballad', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse'] as const;
export type OpenAIVoice = typeof OPENAI_VOICES[number];
export const READ_ALOUD_SPEEDS = [0.75, 1, 1.25, 1.5] as const;
export type ReadAloudSpeed = typeof READ_ALOUD_SPEEDS[number];
export type ReadAloudPreferences = { voice: OpenAIVoice; speed: ReadAloudSpeed };

const KEY = 'synchronous-read-aloud-preferences-v1';
export const DEFAULT_READ_ALOUD: ReadAloudPreferences = { voice: 'marin', speed: 1 };

export async function getReadAloudPreferences(): Promise<ReadAloudPreferences> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_READ_ALOUD;
    const parsed = JSON.parse(raw) as Partial<ReadAloudPreferences>;
    return {
      voice: OPENAI_VOICES.includes(parsed.voice as OpenAIVoice) ? parsed.voice as OpenAIVoice : DEFAULT_READ_ALOUD.voice,
      speed: READ_ALOUD_SPEEDS.includes(parsed.speed as ReadAloudSpeed) ? parsed.speed as ReadAloudSpeed : DEFAULT_READ_ALOUD.speed,
    };
  } catch { return DEFAULT_READ_ALOUD; }
}

export const saveReadAloudPreferences = (preferences: ReadAloudPreferences) => AsyncStorage.setItem(KEY, JSON.stringify(preferences));
