import { Ionicons } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { goBack } from '@/lib/navigation';

export function UtilityScreen({ title, icon, message }: { title: string; icon: React.ComponentProps<typeof Ionicons>['name']; message: string }) {
  return <SafeAreaView style={styles.screen}><View style={styles.nav}><Pressable accessibilityRole="button" onPress={() => goBack()} style={styles.back}><Ionicons name="chevron-back" size={27} color={colors.white} /></Pressable><Text style={styles.navTitle}>{title}</Text><View style={styles.back} /></View><View style={styles.body}><View style={styles.icon}><Ionicons name={icon} size={29} color={colors.white} /></View><Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text></View></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.black }, nav: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.border }, back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }, navTitle: { color: colors.white, fontSize: 15, fontWeight: '600' }, body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, paddingBottom: 80 }, icon: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }, title: { color: colors.white, fontSize: 26, fontWeight: '700', marginTop: 22 }, message: { color: colors.secondary, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 9 } });
