import { router } from 'expo-router';

export function goBack(fallback: Parameters<typeof router.replace>[0] = '/(tabs)/explore') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
