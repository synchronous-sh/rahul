import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { CourseArtwork } from "@/components/CourseArtwork";
import { Progress } from "@/components/ui";
import { colors } from "@/constants/theme";
import { useAppState } from "@/state/AppState";
import { fetchNews, type NewsStory } from "@/lib/news";

const continueCourses = [
  { id: "finance" as const, title: "Finance", detail: "Continue with Banks", progress: 58 },
  { id: "history" as const, title: "World History", detail: "Continue with Greece", progress: 32 },
  { id: "technology" as const, title: "Technology", detail: "Continue with Networks", progress: 16 },
];

const recommendedCourses = [
  { id: "ai" as const, title: "Artificial Intelligence" },
  { id: "psychology" as const, title: "Psychology" },
  { id: "economics" as const, title: "Economics" },
  { id: "science" as const, title: "Science" },
];

export default function Home() {
  const { saved, toggleSave } = useAppState();
  const discoverId = "ai-foundations";
  const heroSaved = saved.includes(discoverId);
  const [homeNews, setHomeNews] = useState<NewsStory[]>([]);
  useEffect(() => { fetchNews('For You').then(items => setHomeNews(items.slice(0, 12))).catch(() => setHomeNews([])); }, []);
  const openDiscoverCourse = () => router.push({ pathname: "/course/[id]", params: { id: "ai", title: "AI Foundations" } });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Good morning, Rahul.</Text>
        </View>

        <View style={styles.discoverHeading}>
          <Text style={styles.discoverTitle}>Discover</Text>
        </View>

        <Pressable onPress={openDiscoverCourse} style={styles.hero}>
          <CourseArtwork path="ai" title="AI Foundations" style={styles.heroArtwork} />
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>ARTIFICIAL INTELLIGENCE · COURSE</Text>
            <Text style={styles.heroTitle}>AI Foundations</Text>
            <Text style={styles.heroDescription}>Understand how modern AI systems learn, reason, and use information.</Text>
            <View style={styles.heroActions}>
              <Pressable onPress={openDiscoverCourse} style={styles.startButton}>
                <Ionicons name="play" size={14} color="#000" />
                <Text style={styles.startText}>Start</Text>
              </Pressable>
              <Pressable onPress={() => toggleSave(discoverId)} style={styles.secondaryButton}>
                <Ionicons name={heroSaved ? "bookmark" : "bookmark-outline"} size={15} color="#fff" />
                <Text style={styles.secondaryText}>{heroSaved ? "Saved" : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

        <SectionHeader title="Continue learning" action="See all" onPress={() => router.push("/(tabs)/learn")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {continueCourses.map((course) => (
            <Pressable key={course.id} onPress={() => router.push(`/course/${course.id}`)} style={styles.courseCard}>
              <CourseArtwork path={course.id} title={course.title} style={styles.courseArt} />
              <Progress value={course.progress} style={styles.courseProgress} />
              <Text style={styles.cardTitle}>{course.title}</Text>
              <Text style={styles.cardDetail}>{course.detail}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Recommended courses" action="See all" onPress={() => router.push("/(tabs)/learn")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {recommendedCourses.map((course) => (
            <Pressable key={course.id} onPress={() => router.push(`/course/${course.id}`)} style={styles.recommendationCard}>
              <CourseArtwork path={course.id} title={course.title} style={styles.recommendationImage} />
              <Text style={styles.recommendationTitle} numberOfLines={1}>{course.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Videos for you" action="Watch all" onPress={() => router.push("/(tabs)/videos")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videoRail}>
          {homeNews.slice(0, 4).map((item) => (
            <Pressable key={item.id} onPress={() => router.push({ pathname: "/(tabs)/videos", params: { id: item.id } })} style={styles.videoCard}>
              <Image source={item.image} style={styles.videoImage} contentFit="cover" />
              <View style={styles.videoShade} />
              <View style={styles.videoPlay}><Ionicons name="play" size={13} color="#000" /></View>
              <Text style={styles.videoDuration}>0:30</Text>
              <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Today’s news" action="More news" onPress={() => router.push("/(tabs)/news")} />
        <View style={styles.newsList}>
          {homeNews.slice(4, 7).map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/story/${item.id}`)} style={styles.newsRow}>
              <View style={styles.newsCopy}>
                <Text style={styles.newsTopic}>{item.category.toUpperCase()}</Text>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsSource}>{item.source.split(" · ")[0]} · {item.time}</Text>
              </View>
              <Image source={item.image} style={styles.newsImage} contentFit="cover" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, action, onPress }: { title: string; action: string; onPress: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text><Pressable onPress={onPress} hitSlop={8}><Text style={styles.sectionAction}>{action} ›</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  content: { paddingBottom: 110 },
  greetingRow: { paddingHorizontal: 20, paddingTop: 21 },
  greeting: { color: "#fff", fontSize: 25, lineHeight: 30, fontWeight: "700", letterSpacing: -0.6 },
  discoverHeading: { paddingHorizontal: 20, marginTop: 27, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  discoverTitle: { color: "#fff", fontSize: 21, fontWeight: "700" },
  hero: { height: 286, marginHorizontal: 12, borderRadius: 18, overflow: "hidden", backgroundColor: colors.card },
  heroArtwork: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.28)" },
  heroCopy: { position: "absolute", left: 18, right: 18, bottom: 18 },
  heroEyebrow: { color: "rgba(255,255,255,.72)", fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },
  heroTitle: { color: "#fff", fontSize: 24, lineHeight: 28, fontWeight: "700", letterSpacing: -0.5, marginTop: 7 },
  heroDescription: { color: "rgba(255,255,255,.78)", fontSize: 12, lineHeight: 17, marginTop: 6, maxWidth: 310 },
  heroActions: { flexDirection: "row", gap: 9, marginTop: 15 },
  startButton: { height: 38, borderRadius: 20, backgroundColor: "#fff", paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  startText: { color: "#000", fontSize: 12, fontWeight: "700" },
  secondaryButton: { height: 38, borderRadius: 20, backgroundColor: "rgba(25,25,25,.86)", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  secondaryText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  sectionHeader: { paddingHorizontal: 20, marginTop: 29, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  sectionTitle: { color: "#fff", fontSize: 19, fontWeight: "700" },
  sectionAction: { color: colors.secondary, fontSize: 11 },
  rail: { paddingHorizontal: 20, gap: 11 },
  courseCard: { width: 164 },
  courseArt: { width: 164, height: 96, borderRadius: 10 },
  courseProgress: { marginTop: -3, height: 3 },
  cardTitle: { color: "#fff", fontSize: 13, fontWeight: "700", marginTop: 8 },
  cardDetail: { color: colors.secondary, fontSize: 10, marginTop: 3 },
  recommendationCard: { width: 154 },
  recommendationImage: { width: 154, height: 112, borderRadius: 11, backgroundColor: colors.card },
  recommendationTitle: { color: "#fff", fontSize: 13, lineHeight: 17, fontWeight: "700", marginTop: 8 },
  videoRail: { paddingHorizontal: 20, gap: 11 },
  videoCard: { width: 132, height: 184, borderRadius: 11, overflow: "hidden", backgroundColor: colors.card },
  videoImage: { ...StyleSheet.absoluteFillObject },
  videoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.27)" },
  videoPlay: { position: "absolute", left: 10, bottom: 46, width: 27, height: 27, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  videoDuration: { position: "absolute", right: 9, bottom: 52, color: "#fff", fontSize: 9, fontWeight: "600" },
  videoTitle: { position: "absolute", left: 10, right: 9, bottom: 10, color: "#fff", fontSize: 11, lineHeight: 14, fontWeight: "700" },
  newsList: { marginHorizontal: 20, borderTopWidth: 1, borderTopColor: colors.border },
  newsRow: { minHeight: 95, flexDirection: "row", alignItems: "center", gap: 14, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12 },
  newsCopy: { flex: 1 },
  newsTopic: { color: colors.secondary, fontSize: 8, fontWeight: "800", letterSpacing: 1.1 },
  newsTitle: { color: "#fff", fontSize: 13, lineHeight: 17, fontWeight: "600", marginTop: 4 },
  newsSource: { color: colors.tertiary, fontSize: 9, marginTop: 5 },
  newsImage: { width: 86, height: 64, borderRadius: 8, backgroundColor: colors.card },
});
