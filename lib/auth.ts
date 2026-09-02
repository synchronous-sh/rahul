import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';

export const GUEST_KEY = 'curious-guest-session';

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '');

export async function signInWithIdentifier(identifier: string, password: string) {
  const value = identifier.trim();
  if (!value || password.length < 8) throw new Error('Enter a valid email or phone number and a password of at least 8 characters.');
  const credentials = isEmail(value) ? { email: value.toLowerCase(), password } : { phone: normalizePhone(value), password };
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw error;
  await AsyncStorage.removeItem(GUEST_KEY);
  return data;
}

export async function sendPasswordReset(email: string) {
  const value = email.trim().toLowerCase();
  if (!isEmail(value)) throw new Error('Enter your email address above to reset your password.');
  const { error } = await supabase.auth.resetPasswordForEmail(value);
  if (error) throw error;
}

export async function signUpWithPassword(username: string, email: string, phone: string, birthday: string, password: string) {
  const handle = username.trim();
  const emailAddress = email.trim().toLowerCase();
  const phoneNumber = normalizePhone(phone);
  const birthDate = birthday.trim();
  if (handle.length < 3) throw new Error('Username must contain at least 3 characters.');
  if (!/^[a-zA-Z0-9._]+$/.test(handle)) throw new Error('Username can only use letters, numbers, periods, and underscores.');
  if (!isEmail(emailAddress)) throw new Error('Enter a valid email address.');
  if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) throw new Error('Enter a valid phone number, including the country code when applicable.');
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) throw new Error('Enter your birthday as MM/DD/YYYY.');
  if (password.length < 8) throw new Error('Password must contain at least 8 characters.');
  const options = { data: { username: handle, phone: phoneNumber, birthday: birthDate } };
  const { data, error } = await supabase.auth.signUp({ email: emailAddress, password, options });
  if (error) throw error;
  await AsyncStorage.removeItem(GUEST_KEY);
  return data;
}

export async function continueAsGuest() {
  const { data, error } = await supabase.auth.signInAnonymously({ options: { data: { is_guest: true } } });
  await AsyncStorage.setItem(GUEST_KEY, 'true');
  if (error) return { user: null, session: null };
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
  const redirectTo = Linking.createURL('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
  if (error) throw error;
  if (!data.url) throw new Error('The sign-in provider did not return a login URL.');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') throw new Error('Sign in was cancelled.');
  const parsed = Linking.parse(result.url);
  const code = typeof parsed.queryParams?.code === 'string' ? parsed.queryParams.code : undefined;
  if (!code) throw new Error('The sign-in callback did not include an authorization code.');
  const exchange = await supabase.auth.exchangeCodeForSession(code);
  if (exchange.error) throw exchange.error;
  await AsyncStorage.removeItem(GUEST_KEY);
  return exchange.data;
}

export async function needsOnboarding(userId: string) {
  const { data, error } = await supabase.from('users').select('onboarding_complete').eq('id', userId).maybeSingle();
  if (error) return true;
  return data?.onboarding_complete !== true;
}
