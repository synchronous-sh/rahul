import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { transcribeAudio } from '@/lib/ai';

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });

export function VoiceInputButton({ onResult }: { onResult: (text: string) => void }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY); const status = useAudioRecorderState(recorder); const busy = status.isRecording;
  const toggle = async () => {
    try {
      if (busy) {
        await recorder.stop();
        if (!recorder.uri) throw new Error('No recording was created.');
        const blob = await (await fetch(recorder.uri)).blob(); const dataUrl = await blobToDataUrl(blob); const [header, audioBase64] = dataUrl.split(','); const mimeType = header.match(/data:(.*?);/)?.[1] ?? 'audio/m4a';
        const result = await transcribeAudio(audioBase64, mimeType); onResult(result.text);
      } else {
        const permission = await requestRecordingPermissionsAsync(); if (!permission.granted) { Alert.alert('Microphone access needed', 'Enable microphone access to search by voice.'); return; }
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await recorder.prepareToRecordAsync(); recorder.record();
      }
    } catch (error) { Alert.alert('Voice search unavailable', error instanceof Error ? error.message : 'Please try again.'); }
  };
  return <Pressable onPress={toggle} accessibilityLabel={busy ? 'Stop recording' : 'Search with voice'} style={[s.button, busy && s.recording]}><Ionicons name={busy ? 'stop' : 'mic-outline'} size={18} color={busy ? '#000' : '#bbb'} /></Pressable>;
}
const s = StyleSheet.create({ button: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15 }, recording: { backgroundColor: '#fff' } });
