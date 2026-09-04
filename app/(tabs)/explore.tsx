import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { CourseArtwork } from "@/components/CourseArtwork";
import { Progress } from "@/components/ui";
import { colors } from "@/constants/theme";
import { fetchNews, type NewsStory } from "@/lib/news";
import { books } from "@/lib/books";
import { gameCatalog } from "@/lib/games";

const continueCourses = [
  { id: "finance" as const, title: "Finance", progress: 58 },
  { id: "history" as const, title: "World History", progress: 32 },
  { id: "technology" as const, title: "Technology", progress: 16 },
];

const recommendedCourses = [
  { id: "ai" as const, title: "Artificial Intelligence" },
  { id: "psychology" as const, title: "Psychology" },
  { id: "economics" as const, title: "Economics" },
  { id: "science" as const, title: "Science" },
];

export default function Home() {
  const [homeNews, setHomeNews] = useState<NewsStory[]>([]);
  useEffect(() => { fetchNews('For You').then(items => setHomeNews(items.slice(0, 12))).catch(() => setHomeNews([])); }, []);
  const newsItems = [...homeNews.slice(4, 7), ...homeNews.slice(0, 4)]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 3);
  const openDiscoverCourse = () => router.push({ pathname: "/course/[id]", params: { id: "ai", title: "AI Foundations" } });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Good morning, Rahul.</Text>
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
                <Text style={styles.startText}>Start</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

        <SectionHeader title="Recents" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {continueCourses.map((course) => (
            <Pressable key={course.id} onPress={() => router.push(`/course/${course.id}`)} style={styles.courseCard}>
              <CourseArtwork path={course.id} title={course.title} style={styles.cardArtwork} />
              <ArtworkShade />
              <View style={styles.courseOverlay}><Text style={styles.courseKicker}>CONTINUE · {course.progress}%</Text><Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text></View>
              <Progress value={course.progress} style={styles.courseProgress} />
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Courses" action="More" onPress={() => router.push({ pathname: "/library/[type]", params: { type: "courses" } })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {recommendedCourses.map((course) => (
            <Pressable key={course.id} onPress={() => router.push(`/course/${course.id}`)} style={styles.recommendationCard}>
              <CourseArtwork path={course.id} title={course.title} style={styles.cardArtwork} />
              <ArtworkShade />
              <View style={styles.courseOverlay}><Text style={styles.courseKicker}>COURSE</Text><Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text></View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Books" action="More" onPress={() => router.push({ pathname: "/library/[type]", params: { type: "books" } })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookRail}>
          {books.slice(0, 5).map((book) => (
            <Pressable key={book.id} onPress={() => router.push(`/book/${book.id}`)} style={styles.bookCard}>
              <Image source={book.cover} style={styles.bookCover} contentFit="cover" />
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Videos" action="More" onPress={() => router.push({ pathname: "/library/[type]", params: { type: "videos" } })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videoRail}>
          {homeNews.slice(0, 4).map((item) => (
            <Pressable key={item.id} onPress={() => router.push({ pathname: "/(tabs)/videos", params: { id: item.id } })} style={styles.videoCard}>
              <Image source={item.image} style={styles.videoImage} contentFit="cover" />
              <ArtworkShade />
              <View style={styles.videoBadge}><Text style={styles.videoBadgeText}>0:30</Text></View>
              <View style={styles.videoCopy}><View style={styles.playGlyph}><Text style={styles.playGlyphText}>▶</Text></View><Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text></View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="News" action="More" onPress={() => router.push({ pathname: "/library/[type]", params: { type: "news" } })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newsRail}>
          {newsItems.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/story/${item.id}`)} style={styles.newsCard}>
              <Image source={item.image} style={styles.newsImage} contentFit="cover" />
              <ArtworkShade />
              <View style={styles.newsCopy}><Text style={styles.newsSource} numberOfLines={1}>{item.source.split(" · ")[0]} · {item.time}</Text><Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text></View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title="Games" action="More" onPress={() => router.push('/games')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gameRail}>
          {gameCatalog.map((game) => (
            <Pressable key={game.id} onPress={() => router.push(`/game/${game.id}`)} style={styles.gameCard}>
              <Image source={game.poster} style={styles.gameCover} contentFit="cover" />
              {!game.posterHasTitle && <><View style={styles.gameShade} /><View style={styles.gameFade} /><View style={styles.gameCopy}>
                  <Text style={styles.gameGenre}>{game.genre.toUpperCase()}</Text>
                  <Text style={styles.gameTitle} numberOfLines={2}>{game.title}</Text>
                </View></>}
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action && onPress ? <Pressable onPress={onPress} hitSlop={8}><Text style={styles.sectionAction}>{action} ›</Text></Pressable> : null}</View>;
}

function ArtworkShade() {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}><View style={styles.artworkTint} /><View style={styles.artworkFadeMid} /><View style={styles.artworkFadeBottom} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  content: { paddingBottom: 110 },
  greetingRow: { paddingHorizontal: 20, paddingTop: 21, paddingBottom: 18 },
  greeting: { color: "#fff", fontSize: 25, lineHeight: 30, fontWeight: "700", letterSpacing: -0.6 },
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
  sectionHeader: { paddingHorizontal: 20, marginTop: 29, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  sectionTitle: { color: "#fff", fontSize: 19, fontWeight: "700" },
  sectionAction: { color: colors.secondary, fontSize: 11 },
  rail: { paddingHorizontal: 20, gap: 11 },
  artworkTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.08)" },
  artworkFadeMid: { position: "absolute", left: 0, right: 0, bottom: 0, height: "58%", backgroundColor: "rgba(0,0,0,.25)" },
  artworkFadeBottom: { position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", backgroundColor: "rgba(0,0,0,.58)" },
  cardArtwork: { ...StyleSheet.absoluteFillObject },
  courseCard: { width: 224, height: 126, borderRadius: 13, overflow: "hidden", backgroundColor: colors.card },
  courseProgress: { position: "absolute", left: 0, right: 0, bottom: 0, height: 3 },
  courseOverlay: { position: "absolute", left: 13, right: 13, bottom: 13 },
  courseKicker: { color: "rgba(255,255,255,.68)", fontSize: 8, lineHeight: 11, fontWeight: "800", letterSpacing: 1 },
  courseTitle: { color: "#fff", fontSize: 17, lineHeight: 20, fontWeight: "800", letterSpacing: -0.3, marginTop: 3, textShadowColor: "rgba(0,0,0,.9)", textShadowRadius: 7 },
  cardDetail: { color: colors.secondary, fontSize: 10, marginTop: 3 },
  recommendationCard: { width: 244, height: 138, borderRadius: 13, overflow: "hidden", backgroundColor: colors.card },
  bookRail: { paddingHorizontal: 20, gap: 13 },
  bookCard: { width: 112 },
  bookCover: { width: 112, height: 164, borderRadius: 8, backgroundColor: colors.card },
  bookTitle: { color: "#fff", fontSize: 12, lineHeight: 16, fontWeight: "700", marginTop: 8 },
  videoRail: { paddingHorizontal: 20, gap: 11 },
  videoCard: { width: 252, height: 142, borderRadius: 13, overflow: "hidden", backgroundColor: colors.card },
  videoImage: { ...StyleSheet.absoluteFillObject },
  videoBadge: { position: "absolute", right: 10, top: 10, height: 23, paddingHorizontal: 8, borderRadius: 12, backgroundColor: "rgba(0,0,0,.72)", alignItems: "center", justifyContent: "center" },
  videoBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  videoCopy: { position: "absolute", left: 12, right: 12, bottom: 12, flexDirection: "row", alignItems: "flex-end", gap: 8 },
  playGlyph: { width: 25, height: 25, borderRadius: 13, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 1 },
  playGlyphText: { color: "#000", fontSize: 9, marginLeft: 1 },
  videoTitle: { flex: 1, color: "#fff", fontSize: 14, lineHeight: 17, fontWeight: "800", textShadowColor: "rgba(0,0,0,.9)", textShadowRadius: 6 },
  newsRail: { paddingHorizontal: 20, gap: 11 },
  newsCard: { width: 252, height: 142, borderRadius: 13, overflow: "hidden", backgroundColor: colors.card },
  newsCopy: { position: "absolute", left: 12, right: 12, bottom: 11 },
  newsTitle: { color: "#fff", fontSize: 14, lineHeight: 17, fontWeight: "800", marginTop: 3, textShadowColor: "rgba(0,0,0,.9)", textShadowRadius: 6 },
  newsSource: { color: "rgba(255,255,255,.68)", fontSize: 8, lineHeight: 10, fontWeight: "800", letterSpacing: .65, textTransform: "uppercase" },
  newsImage: { ...StyleSheet.absoluteFillObject },
  gameRail: { paddingHorizontal: 20, gap: 11 },
  gameCard: { width: 142, height: 207, borderRadius: 14, overflow: "hidden", backgroundColor: colors.card },
  gameCover: { ...StyleSheet.absoluteFillObject },
  gameShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.08)" },
  gameFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "46%", backgroundColor: "rgba(0,0,0,.72)" },
  gameCopy: { position: "absolute", left: 12, right: 11, bottom: 13 },
  gameGenre: { color: "rgba(255,255,255,.62)", fontSize: 7, lineHeight: 9, fontWeight: "800", letterSpacing: 1.25 },
  gameTitle: { color: "#fff", fontSize: 16, lineHeight: 18, fontWeight: "800", letterSpacing: -.25, marginTop: 4, textShadowColor: "rgba(0,0,0,.9)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
});
