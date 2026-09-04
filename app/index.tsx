import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { BrandMark } from '@/components/BrandMark';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_KEY, needsOnboarding } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Index() {
  useEffect(() => {
    let active = true;
    const route = async () => {
      const started = Date.now();
      const [{ data }, guest] = await Promise.all([supabase.auth.getSession(), AsyncStorage.getItem(GUEST_KEY)]);
      const elapsed = Date.now() - started;
      if (elapsed < 1200) await new Promise(resolve => setTimeout(resolve, 1200 - elapsed));
      if (!active) return;
      const user = data.session?.user;
      if (!user) router.replace('/welcome');
      else if (guest === 'true' || user.is_anonymous) router.replace('/(tabs)/explore');
      else if (await needsOnboarding(user.id)) router.replace('/onboarding');
      else router.replace('/(tabs)/explore');
    };
    route().catch(() => active && router.replace('/welcome'));
    return () => { active = false; };
  }, []);

  return <View style={styles.screen}><View style={styles.lockup}><BrandMark size={58} /><Text style={styles.name}>SYNCHRONOUS</Text></View><ActivityIndicator style={styles.loader} color={colors.secondary} size="small" /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  lockup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  name: { color: colors.white, fontSize: 14, fontWeight: '700', letterSpacing: 4 },
  loader: { position: 'absolute', bottom: 72 },
});
