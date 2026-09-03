import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from 'react-native';
import { textToSpeech } from '@/lib/ai';
import { getReadAloudPreferences } from '@/lib/readAloud';

export function ListenButton({ text, iconOnly = false, iconSize }: { text: string; iconOnly?: boolean; iconSize?: number }) {
  const [source, setSource] = useState<string | null>(null); const [loading, setLoading] = useState(false); const [muted, setMuted] = useState(false); const player = useAudioPlayer(source);
  const listen = async () => { try { if (source) { const nextMuted = !muted; player.muted = nextMuted; setMuted(nextMuted); return; } setLoading(true); const preferences = await getReadAloudPreferences(); const result = await textToSpeech(text, preferences.voice, preferences.speed); const uri = `data:${result.mimeType};base64,${result.audioBase64}`; setSource(uri); setMuted(false); setTimeout(() => player.play(), 100); } catch (error) { Alert.alert('Audio unavailable', error instanceof Error ? error.message : 'Please try again.'); } finally { setLoading(false); } };
  return <Pressable accessibilityRole="button" accessibilityLabel={muted ? 'Unmute read aloud' : 'Read this aloud'} accessibilityState={{ checked: muted }} hitSlop={8} style={iconOnly ? s.iconButton : s.button} onPress={listen}>{loading ? <ActivityIndicator size="small" color="#bbb" /> : <Ionicons name={muted ? 'volume-mute-outline' : 'volume-medium-outline'} size={iconSize ?? (iconOnly ? 20 : 18)} color="#ddd" />}{!iconOnly && <Text style={s.text}>{muted ? 'Muted' : 'Listen'}</Text>}</Pressable>;
}
const s = StyleSheet.create({ button: { alignSelf: 'flex-start', height: 36, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2b2b2b', borderRadius: 18 }, iconButton: { width: 22, height: 30, alignItems: 'center', justifyContent: 'center' }, text: { color: '#ddd', fontSize: 12, fontWeight: '600' } });
