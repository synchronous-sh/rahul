import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { BrandMark } from '@/components/BrandMark';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), 1400);
    return () => clearTimeout(timer);
  }, []);

  return <View style={styles.screen}><BrandMark size={72} /><Text style={styles.name}>CURIOUS</Text><ActivityIndicator style={styles.loader} color={colors.secondary} size="small" /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.white, fontSize: 12, fontWeight: '700', letterSpacing: 4, marginTop: 20, marginLeft: 4 },
  loader: { position: 'absolute', bottom: 72 },
});
