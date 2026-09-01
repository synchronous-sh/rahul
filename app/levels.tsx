import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Progress } from "@/components/ui";
import { colors } from "@/constants/theme";
import { useAppState } from "@/state/AppState";

const ranges = {
  D: { total: "38m", bars: [28, 52, 37, 76, 60, 42, 68], labels: ["8a", "10a", "12p", "2p", "4p", "6p", "8p"] },
  W: { total: "3h 42m", bars: [38, 71, 46, 88, 64, 32, 57], labels: ["M", "T", "W", "T", "F", "S", "S"] },
  M: { total: "14h 26m", bars: [42, 62, 78, 55, 84, 69, 91], labels: ["1", "5", "10", "15", "20", "25", "30"] },
} as const;

const levels = [
  [5, "Explorer"],
  [10, "Thinker"],
  [20, "Scholar"],
  [35, "Expert"],
  [50, "Mentor"],
] as const;

export default function Levels() {
  const { xp, streak, completedLessons } = useAppState();
  const [range, setRange] = useState<keyof typeof ranges>("W");
  const data = ranges[range];
  const progress = Math.min(100, Math.round((xp / 2000) * 100));

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={27} color="#fff" />
        </Pressable>
        <Text style={styles.navTitle}>Your progress</Text>
        <View style={{ width: 27 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.current}>
          <Image source={require("../assets/characters/brain-level-1.png")} style={styles.currentImage} contentFit="contain" />
          <Text style={styles.eyebrow}>LEVEL 1</Text>
          <Text style={styles.rank}>CURIOUS</Text>
          <Text style={styles.xp}>{xp.toLocaleString()} / 2,000 XP</Text>
          <Progress value={progress} style={styles.progress} />
        </View>

        <Text style={styles.sectionTitle}>Level journey</Text>
        <Text style={styles.sectionCopy}>Keep learning to unlock each stage of your knowledge journey.</Text>
        <View style={styles.futureStrip}>
          <Image source={require("../assets/characters/brain-levels-5-50.png")} style={styles.futureImage} contentFit="cover" />
          <View style={styles.lockRow}>
            {levels.map(([level, name]) => (
              <View key={level} style={styles.lockedLevel}>
                <View style={styles.lockCircle}><Ionicons name="lock-closed" size={10} color="rgba(255,255,255,.72)" /></View>
                <Text style={styles.lockLevel}>LV {level}</Text>
                <Text style={styles.lockName} numberOfLines={1}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.analyticsHeader}>
          <View><Text style={styles.sectionTitle}>Learning time</Text><Text style={styles.analyticsTotal}>{data.total}</Text></View>
          <View style={styles.rangePicker}>
            {(Object.keys(ranges) as (keyof typeof ranges)[]).map((key) => (
              <Pressable key={key} onPress={() => setRange(key)} style={[styles.range, range === key && styles.rangeActive]}>
                <Text style={[styles.rangeText, range === key && styles.rangeTextActive]}>{key}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.chart}>
          {data.bars.map((height, index) => (
            <View key={`${range}-${index}`} style={styles.barColumn}>
              <View style={[styles.bar, { height }]} />
              <Text style={styles.barLabel}>{data.labels[index]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Ionicons name="trophy-outline" size={20} color="#fff" /><Text style={styles.statValue}>3</Text><Text style={styles.statLabel}>courses completed</Text></View>
          <View style={styles.stat}><Ionicons name="book-outline" size={20} color="#fff" /><Text style={styles.statValue}>{completedLessons}</Text><Text style={styles.statLabel}>lessons finished</Text></View>
          <View style={styles.stat}><Ionicons name="flame-outline" size={20} color="#fff" /><Text style={styles.statValue}>{streak} days</Text><Text style={styles.statLabel}>current streak</Text></View>
          <View style={styles.stat}><Ionicons name="medal-outline" size={20} color="#fff" /><Text style={styles.statValue}>21 days</Text><Text style={styles.statLabel}>longest streak</Text></View>
          <View style={styles.stat}><Ionicons name="timer-outline" size={20} color="#fff" /><Text style={styles.statValue}>24m</Text><Text style={styles.statLabel}>average session</Text></View>
          <View style={styles.stat}><Ionicons name="calendar-outline" size={20} color="#fff" /><Text style={styles.statValue}>6 days</Text><Text style={styles.statLabel}>active this week</Text></View>
        </View>
        <View style={styles.topicHeader}>
          <Text style={styles.sectionTitle}>Topics learned</Text>
          <Text style={styles.topicMeta}>12 topics · 3h 42m</Text>
        </View>
        <View style={styles.topicBreakdown}>
          <View style={styles.donut}>
            <View style={styles.donutHole}>
              <Text style={styles.donutValue}>38%</Text>
              <Text style={styles.donutLabel}>Finance</Text>
            </View>
          </View>
          <View style={styles.legend}>
            {[
              ["Finance", "1h 24m", "#F5F5F5"],
              ["Technology", "56m", "#A8A8A8"],
              ["History", "44m", "#666"],
              ["Science", "38m", "#343434"],
            ].map(([label, value, color]) => (
              <View key={label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendLabel}>{label}</Text>
                <Text style={styles.legendValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mostStudied}>
          <View><Text style={styles.mostStudiedLabel}>MOST TIME SPENT</Text><Text style={styles.mostStudiedTitle}>Finance</Text><Text style={styles.mostStudiedCopy}>Banks and market fundamentals</Text></View>
          <Text style={styles.mostStudiedValue}>38%</Text>
        </View>
        <View style={styles.insight}>
          <Ionicons name="trending-up" size={21} color="#fff" />
          <View style={{ flex: 1 }}><Text style={styles.insightTitle}>Your strongest week yet</Text><Text style={styles.insightCopy}>Learning time is up 18% from last week. Tuesday is your most focused day.</Text></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  nav: { height: 52, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  content: { paddingBottom: 48 },
  current: { alignItems: "center", paddingTop: 8, paddingBottom: 30 },
  currentImage: { width: 190, height: 172 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: "700", letterSpacing: 1.8 },
  rank: { color: "#fff", fontSize: 23, fontWeight: "800", letterSpacing: 1.5, marginTop: 5 },
  xp: { color: colors.secondary, fontSize: 11, marginTop: 7 },
  progress: { width: 190, marginTop: 10 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginHorizontal: 20 },
  sectionCopy: { color: colors.secondary, fontSize: 12, lineHeight: 18, marginHorizontal: 20, marginTop: 5 },
  futureStrip: { marginTop: 15, height: 146, overflow: "hidden" },
  futureImage: { position: "absolute", left: 0, right: 0, top: 0, width: "100%", height: 112, opacity: 0.32 },
  lockRow: { flex: 1, flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 7 },
  lockedLevel: { flex: 1, alignItems: "center" },
  lockCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(0,0,0,.72)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: 3 },
  lockLevel: { color: "rgba(255,255,255,.55)", fontSize: 8, fontWeight: "700" },
  lockName: { color: "rgba(255,255,255,.38)", fontSize: 8, marginTop: 2 },
  analyticsHeader: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 18, paddingTop: 25, paddingRight: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  analyticsTotal: { color: colors.secondary, fontSize: 12, marginLeft: 20, marginTop: 4 },
  rangePicker: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 8, padding: 2 },
  range: { width: 30, height: 26, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  rangeActive: { backgroundColor: "#fff" },
  rangeText: { color: colors.secondary, fontSize: 10, fontWeight: "700" },
  rangeTextActive: { color: "#000" },
  chart: { height: 126, marginHorizontal: 20, marginTop: 18, marginBottom: 31, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  barColumn: { width: 28, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,.86)" },
  barLabel: { color: colors.tertiary, fontSize: 8, marginTop: 8, marginBottom: 7 },
  stats: { marginHorizontal: 20, marginTop: 14, borderTopWidth: 1, borderLeftWidth: 1, borderColor: colors.border, flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "50%", height: 104, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border, padding: 15 },
  statValue: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 8 },
  statLabel: { color: colors.secondary, fontSize: 9, marginTop: 2 },
  topicHeader: { marginTop: 31, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingRight: 20 },
  topicMeta: { color: colors.secondary, fontSize: 10 },
  topicBreakdown: { minHeight: 170, marginHorizontal: 20, marginTop: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 25 },
  donut: { width: 112, height: 112, borderRadius: 56, borderWidth: 17, borderTopColor: "#F5F5F5", borderRightColor: "#A8A8A8", borderBottomColor: "#666", borderLeftColor: "#343434", alignItems: "center", justifyContent: "center", transform: [{ rotate: "-25deg" }] },
  donutHole: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#000", alignItems: "center", justifyContent: "center", transform: [{ rotate: "25deg" }] },
  donutValue: { color: "#fff", fontSize: 17, fontWeight: "700" },
  donutLabel: { color: colors.secondary, fontSize: 8, marginTop: 2 },
  legend: { flex: 1, gap: 12 },
  legendRow: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 7, height: 7, borderRadius: 4, marginRight: 8 },
  legendLabel: { color: "rgba(255,255,255,.78)", fontSize: 11, flex: 1 },
  legendValue: { color: colors.secondary, fontSize: 10 },
  mostStudied: { marginHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mostStudiedLabel: { color: colors.tertiary, fontSize: 8, fontWeight: "700", letterSpacing: 1.2 },
  mostStudiedTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 5 },
  mostStudiedCopy: { color: colors.secondary, fontSize: 10, marginTop: 3 },
  mostStudiedValue: { color: "#fff", fontSize: 23, fontWeight: "700" },
  insight: { margin: 20, paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, flexDirection: "row", gap: 13 },
  insightTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  insightCopy: { color: colors.secondary, fontSize: 11, lineHeight: 17, marginTop: 4 },
});
