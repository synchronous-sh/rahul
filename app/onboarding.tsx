import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { PrimaryButton } from '@/components/ui';
import { useAppState } from '@/state/AppState';
const topics = ['AI', 'Business', 'Finance', 'Science', 'History', 'Space', 'Psychology', 'Cooking', 'Technology', 'Sports', 'Economics', 'Design'];
export default function Onboarding() {
  const [selected, setSelected] = useState<string[]>([]); const { finishOnboarding } = useAppState();
  const toggle = (topic: string) => { Haptics.selectionAsync(); setSelected(s => s.includes(topic) ? s.filter(x => x !== topic) : [...s, topic]); };
  return <SafeAreaView style={styles.screen}><View style={styles.body}><Text style={styles.title}>What are you curious about?</Text><Text style={styles.subtitle}>Pick a few things. You can change this anytime.</Text><View style={styles.pills}>{topics.map(topic => { const active = selected.includes(topic); return <Pressable key={topic} onPress={() => toggle(topic)} style={[styles.pill, active && styles.activePill]}><Text style={[styles.pillText, active && styles.activeText]}>{topic}</Text></Pressable>; })}</View></View><View style={styles.footer}><PrimaryButton disabled={selected.length < 3} onPress={() => { finishOnboarding(selected); router.replace('/(tabs)/explore'); }}>Continue</PrimaryButton></View></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.black }, body: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 }, title: { color: colors.white, textAlign: 'center', fontSize: 35, lineHeight: 40, fontWeight: '700', letterSpacing: -1 }, subtitle: { color: colors.secondary, textAlign: 'center', fontSize: 16, marginTop: 12, marginBottom: 38 }, pills: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }, pill: { borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', backgroundColor: colors.card, borderRadius: 24, paddingHorizontal: 19, paddingVertical: 12 }, activePill: { backgroundColor: colors.white, transform: [{ scale: 1.03 }] }, pillText: { color: colors.white, fontSize: 15 }, activeText: { color: colors.black, fontWeight: '600' }, footer: { paddingHorizontal: 20, paddingBottom: 8 } });
