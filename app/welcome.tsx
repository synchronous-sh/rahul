import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useAppState } from '@/state/AppState';
import { BrandMark } from '@/components/BrandMark';

export default function Welcome() {
  const { interests, finishOnboarding } = useAppState();
  const entering = useRef(false);
  const enter = () => {
    if (entering.current) return;
    entering.current = true;
    // Navigation must never depend on optional feedback or persistence work.
    router.replace('/(tabs)/explore');
    Haptics.selectionAsync().catch(() => undefined);
    if (!interests.length) {
      try { finishOnboarding(['AI', 'Finance', 'Science', 'Business', 'History']); } catch { /* The local demo remains usable. */ }
    }
  };

  useEffect(() => {
    const fallback = setTimeout(enter, 4500);
    return () => clearTimeout(fallback);
  }, []);

  return <SafeAreaView style={styles.screen}><View style={styles.hero}><View style={styles.mark}><BrandMark size={54} /></View><Text style={styles.title}>Learn something worth knowing.</Text><Text style={styles.subtitle}>A personalized feed for ideas, news, and deeper understanding.</Text></View><View style={styles.actions}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Sign up and enter app" activeOpacity={0.55} style={styles.primary} onPressIn={enter} onPress={enter}><Text style={styles.primaryText}>Sign up</Text><Ionicons name="arrow-forward" size={19} color={colors.black} /></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel="Log in and enter app" activeOpacity={0.55} style={styles.secondary} onPressIn={enter} onPress={enter}><Text style={styles.secondaryText}>Log in</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel="Continue as guest" activeOpacity={0.5} style={styles.guest} onPressIn={enter} onPress={enter}><Text style={styles.guestText}>Continue as guest</Text></TouchableOpacity><Text style={styles.note}>You can connect an account anytime from your profile.</Text></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, paddingHorizontal: 22 },
  hero: { flex: 1, justifyContent: 'center', paddingBottom: 36 },
  mark: { marginBottom: 30 },
  title: { color: colors.white, fontSize: 40, lineHeight: 44, fontWeight: '700', letterSpacing: -1.2, maxWidth: 340 },
  subtitle: { color: colors.secondary, fontSize: 17, lineHeight: 25, marginTop: 18, maxWidth: 335 },
  actions: { paddingBottom: 12 },
  primary: { height: 58, borderRadius: 29, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  secondary: { height: 58, borderRadius: 29, borderWidth: 1, borderColor: 'rgba(255,255,255,.24)', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  secondaryText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  guest: { height: 50, alignItems: 'center', justifyContent: 'center' },
  guestText: { color: colors.secondary, fontSize: 15, fontWeight: '600' },
  note: { color: colors.tertiary, textAlign: 'center', fontSize: 11, marginTop: 2 },
});
