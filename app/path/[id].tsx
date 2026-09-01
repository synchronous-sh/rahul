import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Progress } from "@/components/ui";
import { colors } from "@/constants/theme";
import { PathId } from "@/data/courses";
import { paths } from "@/data/content";
import { goBack } from "@/lib/navigation";
import { useAppState } from "@/state/AppState";

const offsets = [0, -74, 0, 74];
export default function Path() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = (params.id in paths ? params.id : "ai") as PathId;
  const path = paths[id];
  const { isCourseLessonComplete } = useAppState();
  const completed = path.lessons.filter((_, index) =>
    isCourseLessonComplete(id, index),
  ).length;
  const progress = Math.round((completed / path.lessons.length) * 100);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={() => goBack()}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" color="#fff" size={27} />
        </Pressable>
        <Text style={styles.navTitle}>Course path</Text>
        <View style={styles.navButton} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Ionicons name="school" size={25} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>COURSE</Text>
            <Text style={styles.title}>{path.title}</Text>
            <Text style={styles.description}>{path.description}</Text>
          </View>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {completed} of {path.lessons.length} lessons
          </Text>
          <Text style={styles.progressLabel}>{progress}%</Text>
        </View>
        <Progress value={progress} style={styles.progress} />
        <View style={styles.path}>
          <View style={styles.spine} />
          {path.lessons.map((lesson, index) => {
            const done = isCourseLessonComplete(id, index);
            const unlocked =
              done || index === 0 || isCourseLessonComplete(id, index - 1);
            const active = unlocked && !done;
            const offset = offsets[index % offsets.length];
            return (
              <View key={lesson} style={[styles.stop, index % 4 === 0 && styles.unitStart]}>
                {index % 4 === 0 && (
                  <View style={styles.miniUnit}>
                    <Text style={styles.unitEyebrow}>UNIT {Math.floor(index / 4) + 1}</Text>
                    <Text style={[styles.unitTitle, styles.miniUnitTitle]}>{["Foundations", "Build understanding", "Apply the ideas", "Advanced mastery"][Math.min(3, Math.floor(index / 4))]}</Text>
                    <Text style={styles.unitText}>Lessons {index + 1}–{Math.min(index + 4, path.lessons.length)}</Text>
                  </View>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${lesson}, ${done ? "completed" : unlocked ? "available" : "locked"}`}
                  disabled={!unlocked}
                  onPress={() => router.push(`/lesson/${id}/${index + 1}`)}
                  style={({ pressed }) => [
                    styles.lessonButton,
                    {
                      transform: [
                        { translateX: offset },
                        { scale: pressed ? 0.94 : 1 },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.nodeShadow,
                      active && styles.nodeShadowActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.node,
                        done && styles.nodeDone,
                        active && styles.nodeActive,
                      ]}
                    >
                      {done ? (
                        <Ionicons name="checkmark" size={28} color="#000" />
                      ) : active ? (
                        <Ionicons
                          name="play"
                          size={25}
                          color="#000"
                          style={{ marginLeft: 3 }}
                        />
                      ) : (
                        <Ionicons
                          name="lock-closed"
                          size={22}
                          color={colors.tertiary}
                        />
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.lessonLabel,
                      active && styles.lessonLabelActive,
                    ]}
                  >
                    <Text style={styles.lessonNumber}>LESSON {index + 1}</Text>
                    <Text
                      style={[
                        styles.lessonName,
                        !unlocked && styles.lockedText,
                      ]}
                      numberOfLines={2}
                    >
                      {lesson}
                    </Text>
                    <Text style={styles.lessonMeta}>
                      {done
                        ? "Completed · Review"
                        : active
                          ? "15–20 min · Start"
                          : "Locked"}
                    </Text>
                  </View>
                </Pressable>
                {index < path.lessons.length - 1 && (
                  <View
                    style={[
                      styles.connectorDot,
                      {
                        transform: [
                          {
                            translateX:
                              offsets[(index + 1) % offsets.length] / 2,
                          },
                        ],
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
          <View style={styles.finish}>
            <Ionicons
              name="trophy"
              size={26}
              color={
                completed === path.lessons.length ? "#000" : colors.tertiary
              }
            />
            <Text
              style={[
                styles.finishText,
                completed === path.lessons.length && { color: "#000" },
              ]}
            >
              Course complete
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  nav: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { color: colors.secondary, fontSize: 13, fontWeight: "600" },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 70 },
  courseCard: {
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: "row",
    gap: 14,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 3,
  },
  description: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  progressLabel: { color: colors.secondary, fontSize: 11 },
  progress: { marginTop: 7 },
  unitBanner: {
    marginTop: 27,
    borderRadius: 17,
    backgroundColor: "#fff",
    padding: 17,
  },
  unitEyebrow: {
    color: "rgba(0,0,0,.5)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  unitTitle: { color: "#000", fontSize: 19, fontWeight: "700", marginTop: 4 },
  unitText: {
    color: "rgba(0,0,0,.6)",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  path: { alignItems: "center", paddingTop: 38, position: "relative" },
  spine: {
    position: "absolute",
    top: 42,
    bottom: 85,
    width: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,.1)",
  },
  stop: { height: 172, width: "100%", alignItems: "center" },
  unitStart: { height: 240 },
  miniUnit: { width: "100%", minHeight: 57, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 11 },
  miniUnitTitle: { color: "#fff", fontSize: 15 },
  lessonButton: { width: 185, alignItems: "center", zIndex: 2 },
  nodeShadow: {
    width: 76,
    height: 76,
    borderRadius: 38,
    paddingBottom: 6,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  nodeShadowActive: { backgroundColor: "rgba(255,255,255,.35)" },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#151515",
    borderWidth: 2,
    borderColor: "#2d2d2d",
    alignItems: "center",
    justifyContent: "center",
  },
  nodeDone: { backgroundColor: "#fff", borderColor: "#fff" },
  nodeActive: { backgroundColor: "#fff", borderColor: "#fff" },
  lessonLabel: {
    minWidth: 150,
    maxWidth: 190,
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  lessonLabelActive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    paddingVertical: 7,
  },
  lessonNumber: {
    color: colors.tertiary,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  lessonName: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  lessonMeta: { color: colors.secondary, fontSize: 9, marginTop: 3 },
  lockedText: { color: colors.tertiary },
  connectorDot: {
    position: "absolute",
    bottom: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,.22)",
  },
  finish: {
    width: 150,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  finishText: { color: colors.secondary, fontSize: 12, fontWeight: "700" },
});
