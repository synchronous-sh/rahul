import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';

export function Label({ children }: React.PropsWithChildren) { return <Text style={styles.label}>{children}</Text>; }
export function ScreenTitle({ children }: React.PropsWithChildren) { return <Text style={styles.title}>{children}</Text>; }
export function Progress({ value, style }: { value: number; style?: ViewStyle }) { return <View style={[styles.track, style]}><View style={[styles.fill, { width: `${Math.min(100, value)}%` }]} /></View>; }
export function IconButton({ name, active, onPress, label }: { name: React.ComponentProps<typeof Ionicons>['name']; active?: boolean; onPress?: () => void; label?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { Haptics.selectionAsync(); onPress?.(); }} style={({ pressed }) => [styles.iconButton, pressed && { transform: [{ scale: .92 }] }]}><Ionicons name={active ? name : (`${name}-outline` as any)} size={25} color={colors.white} /></Pressable>;
}
export function PrimaryButton({ children, onPress, disabled }: React.PropsWithChildren<{ onPress: () => void; disabled?: boolean }>) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primary, disabled && { opacity: .35 }, pressed && { opacity: .8 }]}><Text style={styles.primaryText}>{children}</Text></Pressable>;
}
const styles = StyleSheet.create({
  title: { color: colors.white, fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -.8 },
  label: { color: colors.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  track: { height: 4, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.white, borderRadius: 4 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  primary: { height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: colors.black, fontSize: 16, fontWeight: '700' },
});
