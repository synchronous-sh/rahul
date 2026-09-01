import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
const icons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = { explore: 'home', videos: 'play', news: 'newspaper', search: 'search', learn: 'book', you: 'person' };
export default function TabsLayout() { return <Tabs screenOptions={({ route }) => ({ headerShown: true, header: () => <AppHeader />, tabBarShowLabel: false, tabBarActiveTintColor: colors.white, tabBarInactiveTintColor: 'rgba(255,255,255,.38)', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline` as any} size={23} color={color} />, tabBarStyle: styles.bar })}><Tabs.Screen name="explore" options={{ title: 'Home' }} /><Tabs.Screen name="videos" options={{ title: 'Videos', headerShown: false }} /><Tabs.Screen name="learn" options={{ title: 'Learn' }} /><Tabs.Screen name="news" options={{ title: 'News' }} /><Tabs.Screen name="you" options={{ title: 'Profile' }} /><Tabs.Screen name="search" options={{ href: null }} /></Tabs>; }
const styles = StyleSheet.create({ bar: { position: 'absolute', backgroundColor: colors.black, borderTopColor: colors.border, height: 70, paddingTop: 10 } });
