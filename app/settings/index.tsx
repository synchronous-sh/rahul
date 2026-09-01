import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { goBack } from '@/lib/navigation';
import { useAppState } from '@/state/AppState';

type Row = { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value?: string; destructive?: boolean; action?: () => void };

export default function Settings() {
  const { resetDemo } = useAppState();
  const show = (label: string) => router.push(`/settings/${encodeURIComponent(label.toLowerCase().replace(/\s+/g, '-'))}`);
  const logout = () => { resetDemo(); router.replace('/welcome'); };
  const sections: { title: string; rows: Row[] }[] = [
    { title: 'Personalization', rows: [
      { icon: 'options-outline', label: 'Personalization' },
      { icon: 'sparkles-outline', label: 'Memory', value: 'On' },
      { icon: 'extension-puzzle-outline', label: 'Plugins', value: '3 connected' },
    ] },
    { title: 'Account', rows: [
      { icon: 'person-circle-outline', label: 'Personal information' },
      { icon: 'mail-outline', label: 'Email', value: 'rahul@example.com' },
      { icon: 'call-outline', label: 'Phone number', value: 'Not added' },
      { icon: 'at-outline', label: 'Username', value: '@rahul' },
      { icon: 'key-outline', label: 'Password' },
      { icon: 'card-outline', label: 'Billing' },
    ] },
    { title: 'App', rows: [
      { icon: 'contrast-outline', label: 'Appearance', value: 'Dark' },
      { icon: 'settings-outline', label: 'General' },
      { icon: 'notifications-outline', label: 'Notifications' },
      { icon: 'shield-checkmark-outline', label: 'Privacy & safety' },
      { icon: 'server-outline', label: 'Storage', value: '184 MB' },
    ] },
    { title: 'Support', rows: [
      { icon: 'help-circle-outline', label: 'Help center' },
      { icon: 'information-circle-outline', label: 'About', value: '1.0.0' },
      { icon: 'log-out-outline', label: 'Log out', destructive: true, action: logout },
    ] },
  ];

  return <SafeAreaView style={styles.screen}>
    <View style={styles.nav}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => goBack()} style={styles.back}><Ionicons name="chevron-back" size={27} color={colors.white} /></Pressable>
      <Text style={styles.navTitle}>Settings</Text>
      <View style={styles.back} />
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.plan} onPress={() => show('Plan')}>
        <View style={styles.planIcon}><Ionicons name="diamond-outline" size={19} color={colors.white} /></View>
        <View style={{ flex: 1 }}><Text style={styles.planTitle}>Curious Free</Text><Text style={styles.planText}>Manage your plan and usage</Text></View>
        <Ionicons name="chevron-forward" size={18} color={colors.tertiary} />
      </Pressable>
      {sections.map(section => <View key={section.title} style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.group}>{section.rows.map(row => <Pressable key={row.label} style={styles.row} onPress={row.action ?? (() => show(row.label))}>
          <Ionicons name={row.icon} size={20} color={row.destructive ? '#FF453A' : colors.white} />
          <Text style={[styles.rowLabel, row.destructive && styles.destructive]}>{row.label}</Text>
          {row.value && <Text style={styles.value} numberOfLines={1}>{row.value}</Text>}
          <Ionicons name="chevron-forward" size={17} color={colors.tertiary} />
        </Pressable>)}</View>
      </View>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black },
  nav: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: colors.white, fontSize: 15, fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 60 },
  plan: { minHeight: 68, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  planIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.elevated, alignItems: 'center', justifyContent: 'center' },
  planTitle: { color: colors.white, fontSize: 14, fontWeight: '600' },
  planText: { color: colors.secondary, fontSize: 11, marginTop: 3 },
  section: { marginTop: 27 },
  sectionTitle: { color: colors.secondary, fontSize: 12, fontWeight: '600', marginLeft: 5, marginBottom: 9 },
  group: { borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  row: { height: 54, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: { color: colors.white, fontSize: 15, flex: 1 },
  value: { color: colors.secondary, fontSize: 12, maxWidth: 150 },
  destructive: { color: '#FF453A' },
});
