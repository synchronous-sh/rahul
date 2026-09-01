import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/constants/theme";
import { CourseArtwork } from "@/components/CourseArtwork";
import { PathId } from "@/data/courses";
import { paths } from "@/data/content";
import { goBack } from "@/lib/navigation";
import { useAppState } from "@/state/AppState";

const recommended: Record<PathId, PathId[]> = {
  ai: ["technology", "psychology", "science"],
  finance: ["economics", "business", "history"],
  history: ["economics", "design", "psychology"],
  science: ["space", "technology", "psychology"],
  business: ["finance", "economics", "design"],
  technology: ["ai", "design", "science"],
  psychology: ["science", "sports", "design"],
  space: ["science", "technology", "history"],
  cooking: ["science", "business", "psychology"],
  sports: ["psychology", "science", "business"],
  economics: ["finance", "business", "history"],
  design: ["technology", "psychology", "business"],
};

export default function CourseOverview() {
  const params = useLocalSearchParams<{ id: string; title?: string }>();
  const id = (params.id in paths ? params.id : "ai") as PathId;
  const course = paths[id];
  const selectedTitle =
    typeof params.title === "string" && params.title.trim()
      ? params.title
      : course.title;
  const [saved, setSaved] = useState(false);
  const { isCourseLessonComplete } = useAppState();
  const completed = course.lessons.filter((_, index) =>
    isCourseLessonComplete(id, index),
  ).length;
  const similarCourses = recommended[id];
  const recommendedCourses = (Object.keys(paths) as PathId[])
    .filter((path) => path !== id && !similarCourses.includes(path))
    .slice(0, 3);
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <CourseArtwork
            path={id}
            title={selectedTitle}
            style={styles.heroImage}
          />
          <Pressable
            accessibilityLabel="Close"
            onPress={() => goBack()}
            style={styles.close}
          >
            <Ionicons name="close" size={27} color="#fff" />
          </Pressable>
          <View style={styles.heroActions}>
            <Pressable
              accessibilityLabel="Save course"
              onPress={() => setSaved((value) => !value)}
              style={styles.circle}
            >
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={22}
                color="#fff"
              />
            </Pressable>
            <Pressable
              accessibilityLabel="Share course"
              onPress={() =>
                Share.share({
                  message: `${selectedTitle}\n${course.description}`,
                })
              }
              style={styles.circle}
            >
              <Ionicons name="share-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.topicPill}>
            <Text style={styles.topicText}>{course.title}</Text>
          </View>
          <Text style={styles.title}>{selectedTitle}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{course.lessons.length} lessons</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>15–20 min each</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>Beginner friendly</Text>
          </View>
          <Text style={styles.sectionTitle}>What you’ll learn</Text>
          <Text style={styles.description}>
            {course.description} Build knowledge cumulatively through guided
            explanations, worked examples, applications, and required mastery
            checks.
          </Text>
          <View style={styles.outcomes}>
            {[...new Set(course.lessons.map((lesson) => lesson.replace(": Applied", "")))]
              .slice(0, 2)
              .flatMap((topic) => [
                `Understand the foundations of ${topic}`,
                `Apply ${topic} to real examples and decisions`,
              ])
              .map((text) => (
                <View key={text} style={styles.outcome}>
                  <View style={styles.check}>
                    <Ionicons name="checkmark" size={14} color="#000" />
                  </View>
                  <Text style={styles.outcomeText}>{text}</Text>
                </View>
              ))}
          </View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Similar courses</Text>
            <Text style={styles.sectionLink}>More courses</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedRow}
          >
            {similarCourses.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() =>
                  router.replace({
                    pathname: "/course/[id]",
                    params: {
                      id: suggestion,
                      title: paths[suggestion].title,
                    },
                  })
                }
                style={styles.recommendedCard}
              >
                <CourseArtwork
                  path={suggestion}
                  title={paths[suggestion].title}
                  style={styles.recommendedImage}
                />
                <Text style={styles.recommendedTitle}>
                  {paths[suggestion].title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recommended courses</Text>
            <Text style={styles.sectionLink}>For you</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedRow}
          >
            {recommendedCourses.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() =>
                  router.replace({
                    pathname: "/course/[id]",
                    params: {
                      id: suggestion,
                      title: paths[suggestion].title,
                    },
                  })
                }
                style={styles.recommendedCard}
              >
                <CourseArtwork
                  path={suggestion}
                  title={paths[suggestion].title}
                  style={styles.recommendedImage}
                />
                <Text style={styles.recommendedTitle}>
                  {paths[suggestion].title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/path/${id}`)}
            style={({ pressed }) => [styles.start, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.startText}>
              {completed > 0 ? "Continue course" : "Start course"}
            </Text>
            <Ionicons name="arrow-forward" size={19} color="#000" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  content: { paddingBottom: 36 },
  hero: { height: 320, backgroundColor: colors.card },
  heroImage: { ...StyleSheet.absoluteFillObject },
  close: {
    position: "absolute",
    top: 12,
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,.48)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroActions: {
    position: "absolute",
    left: 18,
    bottom: 16,
    flexDirection: "row",
    gap: 9,
  },
  circle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: 20, paddingTop: 21 },
  topicPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  topicText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#fff",
    fontSize: 31,
    lineHeight: 36,
    fontWeight: "700",
    letterSpacing: -0.7,
    marginTop: 13,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 10,
  },
  metaText: { color: colors.secondary, fontSize: 11 },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.tertiary,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 30,
  },
  description: {
    color: "rgba(255,255,255,.72)",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 11,
  },
  outcomes: { marginTop: 16, gap: 13 },
  outcome: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  check: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  outcomeText: {
    color: "rgba(255,255,255,.82)",
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionLink: { color: colors.secondary, fontSize: 11 },
  recommendedRow: { gap: 11, paddingTop: 13, paddingRight: 20 },
  recommendedCard: { width: 155 },
  recommendedImage: {
    width: 155,
    height: 102,
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  recommendedTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  start: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    marginTop: 32,
    marginBottom: 8,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: { color: "#000", fontSize: 16, fontWeight: "700" },
});
