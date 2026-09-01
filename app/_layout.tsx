import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider } from '@/state/AppState';

export default function RootLayout() {
  return <AppStateProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' }, animation: 'slide_from_right' }} /></AppStateProvider>;
}
