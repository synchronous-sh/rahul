import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BrandMark } from '@/components/BrandMark';
import { colors } from '@/constants/theme';
import { continueAsGuest, needsOnboarding, sendPasswordReset, signInWithIdentifier, signInWithOAuth, signUpWithPassword } from '@/lib/auth';

type Mode = 'login' | 'signup';
export default function Welcome() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const run = async (key: string, action: () => Promise<void>) => { if (loading) return; setLoading(key); try { await action(); } catch (error) { Alert.alert('Unable to continue', error instanceof Error ? error.message : 'Please try again.'); } finally { setLoading(null); } };
  const finishAuth = async (userId?: string, newAccount = false) => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined); if (newAccount || (userId && await needsOnboarding(userId))) router.replace('/onboarding'); else router.replace('/(tabs)/explore'); };
  const submit = () => run('password', async () => {
    if (mode === 'signup') {
      const result = await signUpWithPassword(username, email, phone, birthday, password);
      if (!result.session) { Alert.alert('Confirm your account', 'Check your email or phone, then return to sign in.'); setMode('login'); return; }
      await finishAuth(result.user?.id, true);
    } else { const result = await signInWithIdentifier(identifier, password); await finishAuth(result.user?.id); }
  });
  const oauth = (provider: 'google' | 'apple') => run(provider, async () => { const result = await signInWithOAuth(provider); await finishAuth(result.user?.id); });
  return <SafeAreaView style={styles.screen}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.brand}><View style={styles.lockup}><BrandMark size={43} /><Text style={styles.brandName}>Synchronous</Text></View></View>
    <View style={styles.form}>
      {mode === 'signup' ? <>
        <Field label="Email"><TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.tertiary} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" style={styles.input} /></Field>
        <Field label="Phone number"><TextInput value={phone} onChangeText={setPhone} placeholder="(555) 000-0000" placeholderTextColor={colors.tertiary} keyboardType="phone-pad" textContentType="telephoneNumber" style={styles.input} /></Field>
        <Field label="Birthday"><TextInput value={birthday} onChangeText={setBirthday} placeholder="MM/DD/YYYY" placeholderTextColor={colors.tertiary} keyboardType="number-pad" textContentType="birthdate" style={styles.input} /></Field>
        <Field label="Username"><TextInput value={username} onChangeText={setUsername} placeholder="Choose a username" placeholderTextColor={colors.tertiary} autoCapitalize="none" autoCorrect={false} textContentType="username" style={styles.input} /></Field>
      </> : <Field label="Email, phone number, or username"><TextInput value={identifier} onChangeText={setIdentifier} placeholder="Enter your account identifier" placeholderTextColor={colors.tertiary} autoCapitalize="none" autoCorrect={false} textContentType="username" style={styles.input} accessibilityLabel="Email, phone number, or username" /></Field>}
      <Field label="Password"><TextInput value={password} onChangeText={setPassword} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'} placeholderTextColor={colors.tertiary} secureTextEntry textContentType={mode === 'signup' ? 'newPassword' : 'password'} style={styles.input} accessibilityLabel="Password" /></Field>
      {mode === 'login' && <TouchableOpacity style={styles.forgotButton} onPress={() => run('reset', async () => { await sendPasswordReset(identifier); Alert.alert('Check your email', 'We sent you a secure password reset link.'); })} disabled={Boolean(loading)}><Text style={styles.forgotText}>{loading === 'reset' ? 'Sending…' : 'Forgot password?'}</Text></TouchableOpacity>}
      <TouchableOpacity style={styles.primary} onPress={submit} disabled={Boolean(loading)}>{loading === 'password' ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryText}>{mode === 'login' ? 'Sign in' : 'Sign up'}</Text>}</TouchableOpacity>
      <View style={styles.orRow}><View style={styles.line} /><Text style={styles.or}>OR</Text><View style={styles.line} /></View>
      <TouchableOpacity style={styles.provider} onPress={() => oauth('google')} disabled={Boolean(loading)}><Ionicons name="logo-google" size={20} color="#fff" /><Text style={styles.providerText}>Continue with Google</Text></TouchableOpacity>
      <TouchableOpacity style={styles.provider} onPress={() => oauth('apple')} disabled={Boolean(loading)}><Ionicons name="logo-apple" size={22} color="#fff" /><Text style={styles.providerText}>Continue with Apple</Text></TouchableOpacity>
      <TouchableOpacity style={styles.switchButton} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}><Text style={styles.switchText}>{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}<Text style={styles.switchStrong}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Text></Text></TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.guest} onPress={() => run('guest', async () => { await continueAsGuest(); router.replace('/(tabs)/explore'); })} disabled={Boolean(loading)}><Text style={styles.guestText}>{loading === 'guest' ? 'Starting…' : 'Continue as guest'}</Text></TouchableOpacity>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, screen: { flex: 1, backgroundColor: colors.black }, content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 28 },
  brand: { alignItems: 'center', marginBottom: 40, width: '100%' }, lockup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 13 }, brandName: { color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -.4 }, tagline: { color: colors.secondary, fontSize: 15, marginTop: 15, textAlign: 'center', width: '100%' },
  form: { gap: 14 }, field: { gap: 7 }, label: { color: 'rgba(255,255,255,.56)', fontSize: 12, fontWeight: '600', letterSpacing: .2, paddingLeft: 12 }, input: { height: 54, borderWidth: 1, borderColor: 'rgba(255,255,255,.18)', borderRadius: 27, color: colors.white, paddingHorizontal: 20, fontSize: 16, backgroundColor: '#0A0A0A' }, forgotButton: { alignSelf: 'flex-end', marginTop: -4, paddingVertical: 2, paddingHorizontal: 4 }, forgotText: { color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: '600' }, primary: { height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 4 }, primaryText: { color: colors.black, fontWeight: '700', fontSize: 16 }, orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 }, line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,.82)' }, or: { color: '#fff', fontSize: 14, fontWeight: '500', letterSpacing: .4 }, provider: { height: 54, borderRadius: 27, borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, providerText: { color: colors.white, fontSize: 15, fontWeight: '600' }, switchButton: { alignItems: 'center', paddingTop: 10 }, switchText: { color: colors.secondary, fontSize: 14 }, switchStrong: { color: colors.white, fontWeight: '700' }, guest: { height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingTop: 18 }, guestText: { color: colors.secondary, fontSize: 14, fontWeight: '600' },
});
