import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CourseArtwork } from "@/components/CourseArtwork";
import { books } from "@/lib/books";
import { fetchNews, getCachedNewsStories, type NewsStory } from "@/lib/news";

type LibraryType = "courses" | "books" | "videos" | "news";

const courses = [
  ["ai", "AI Foundations", "Artificial Intelligence"],
  ["ai", "Artificial Intelligence", "Artificial Intelligence"],
  ["technology", "Technology for AI", "Artificial Intelligence"],
  ["psychology", "Human Intelligence", "Artificial Intelligence"],
  ["finance", "Finance", "Finance"],
  ["finance", "Finance Essentials", "Finance"],
  ["finance", "Markets & Investing", "Finance"],
  ["technology", "Computing & Software", "Technology"],
  ["technology", "Technology", "Technology"],
  ["ai", "Applied AI", "Technology"],
  ["design", "Digital Product Design", "Technology"],
  ["history", "World History", "History"],
  ["economics", "Economic History", "History"],
  ["design", "History of Design", "History"],
  ["science", "Core Science", "Science"],
  ["science", "Science", "Science"],
  ["space", "Astronomy", "Science"],
  ["psychology", "Behavioral Science", "Science"],
  ["psychology", "Psychology", "Psychology"],
  ["psychology", "Mental Health Foundations", "Health"],
  ["sports", "Movement & Recovery", "Health"],
  ["science", "Human Biology", "Health"],
  ["economics", "Economics", "Business"],
  ["economics", "Market Economics", "Business"],
  ["business", "Business Strategy", "Business"],
  ["business", "Food Business", "Business"],
  ["business", "Business Economics", "Business"],
  ["space", "Space", "Science"],
  ["design", "Design", "Technology"],
  ["sports", "Sports Science", "Health"],
  ["psychology", "Performance Psychology", "Health"],
  ["science", "Physics of Sport", "Science"],
  ["cooking", "Cooking Science", "Lifestyle"],
  ["science", "Food Chemistry", "Lifestyle"],
  ["history", "Political History", "History"],
  ["economics", "Political Economy", "Business"],
  ["psychology", "Public Opinion", "Psychology"],
] as const;

const filters = ["All", "AI", "Finance", "Business", "Technology", "Science", "History", "Lifestyle"];
const videoCardWidth = (Dimensions.get("window").width - 51) / 2;

export default function LibraryScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const type = (["courses", "books", "videos", "news"].includes(params.type ?? "") ? params.type : "courses") as LibraryType;
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [stories, setStories] = useState<NewsStory[]>([]);

  useEffect(() => {
    if (type !== "news" && type !== "videos") return;
    let active = true;
    const categories = ["For You", "U.S.", "World", "Business", "Technology", "Science", "Entertainment", "Lifestyle", "Food", "Sports"];
    const storyKey = (story: NewsStory) => story.link || story.id;
    const merge = (items: NewsStory[]) => {
      const seen = new Set<string>();
      return items.filter((item) => {
        const key = storyKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    getCachedNewsStories().then((cached) => { if (active && cached.length) setStories(cached); }).catch(() => undefined);
    categories.forEach((category) => {
      fetchNews(category)
        .then((items) => {
          if (active && items.length) setStories((current) => merge([...current, ...items]));
        })
        .catch(() => undefined);
    });
    return () => { active = false; };
  }, [type]);

  const visibleStories = useMemo(() => stories.filter((item) => {
    const matchesQuery = `${item.title} ${item.dek} ${item.source}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || item.category.toLowerCase().includes(filter.toLowerCase());
    return matchesQuery && matchesFilter;
  }), [stories, query, filter]);

  const title = type[0].toUpperCase() + type.slice(1);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back" onPress={() => router.back()} hitSlop={10} style={styles.sideButton}>
          <Ionicons name="chevron-back" size={25} color="#fff" />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={17} color="rgba(255,255,255,.48)" />
          <TextInput value={query} onChangeText={setQuery} placeholder={`Search ${type}`} placeholderTextColor="rgba(255,255,255,.4)" style={styles.searchInput} />
        </View>
        <Pressable accessibilityLabel="Filter" onPress={() => setFilterOpen((value) => !value)} hitSlop={10} style={styles.sideButton}>
          <Ionicons name="options-outline" size={22} color={filterOpen ? "#fff" : "rgba(255,255,255,.65)"} />
        </Pressable>
      </View>

      {filterOpen ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}
      </ScrollView> : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        {type === "courses" ? <View style={styles.grid}>{courses.filter((item) => `${item[1]} ${item[2]}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || item[2].includes(filter))).map((item) => (
          <Pressable key={`${item[0]}-${item[1]}`} onPress={() => router.push({ pathname: "/course/[id]", params: { id: item[0], title: item[1] } })} style={styles.courseCard}>
            <CourseArtwork path={item[0]} title={item[1]} style={styles.courseImage} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item[1]}</Text>
            <Text style={styles.meta}>{item[2]}</Text>
          </Pressable>
        ))}</View> : null}

        {type === "books" ? <View style={styles.grid}>{books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || book.category.includes(filter))).map((book) => (
          <Pressable key={book.id} onPress={() => router.push(`/book/${book.id}`)} style={styles.bookCard}>
            <Image source={book.cover} style={styles.bookCover} contentFit="cover" />
            <Text style={styles.cardTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.meta} numberOfLines={1}>{book.author}</Text>
          </Pressable>
        ))}</View> : null}

        {type === "news" ? <View>{visibleStories.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`/story/${item.id}`)} style={styles.newsRow}>
            <Image source={item.image} style={styles.newsImage} contentFit="cover" />
            <View style={styles.newsCopy}><Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text><Text style={styles.meta}>{item.source} · {item.time}</Text></View>
          </Pressable>
        ))}{visibleStories.length === 0 ? <EmptyLibrary label="articles" /> : null}</View> : null}

        {type === "videos" ? <View style={styles.grid}>{visibleStories.map((item) => (
          <Pressable key={item.id} onPress={() => router.push({ pathname: "/(tabs)/videos", params: { id: item.id } })} style={styles.videoCard}>
            <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.videoShade} />
            <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          </Pressable>
        ))}{visibleStories.length === 0 ? <EmptyLibrary label="videos" /> : null}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyLibrary({ label }: { label: string }) {
  return <View style={styles.empty}><Ionicons name="cloud-download-outline" size={25} color="rgba(255,255,255,.4)" /><Text style={styles.emptyText}>Loading verified {label}…</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  header: { height: 62, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 9 },
  sideButton: { width: 32, height: 40, justifyContent: "center", alignItems: "center" },
  searchBox: { flex: 1, height: 38, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,.14)", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, gap: 8 },
  searchInput: { flex: 1, height: 38, color: "#fff", fontSize: 13 },
  filters: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  filter: { height: 31, paddingHorizontal: 13, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,.14)", justifyContent: "center" },
  filterActive: { backgroundColor: "#fff" },
  filterText: { color: "rgba(255,255,255,.55)", fontSize: 11, fontWeight: "600" },
  filterTextActive: { color: "#000" },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 70 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 25 },
  courseCard: { width: "48%" },
  courseImage: { width: "100%", aspectRatio: 1.36, borderRadius: 11 },
  bookCard: { width: "31%" },
  bookCover: { width: "100%", aspectRatio: .68, borderRadius: 8, backgroundColor: "#111" },
  cardTitle: { color: "rgba(255,255,255,.82)", fontSize: 13, lineHeight: 17, fontWeight: "600", marginTop: 8 },
  meta: { color: "rgba(255,255,255,.4)", fontSize: 10, lineHeight: 14, marginTop: 4 },
  newsRow: { minHeight: 112, flexDirection: "row", alignItems: "center", gap: 15, paddingVertical: 13 },
  newsCopy: { flex: 1 },
  newsTitle: { color: "rgba(255,255,255,.88)", fontSize: 15, lineHeight: 19, fontWeight: "600" },
  newsImage: { width: 104, height: 78, borderRadius: 8, backgroundColor: "#111" },
  videoCard: { width: videoCardWidth, height: videoCardWidth / .72, borderRadius: 12, overflow: "hidden", backgroundColor: "#111" },
  videoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.28)" },
  videoTitle: { position: "absolute", left: 12, right: 12, bottom: 12, color: "#fff", fontSize: 13, lineHeight: 17, fontWeight: "700" },
  empty: { width: "100%", minHeight: 260, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { color: "rgba(255,255,255,.42)", fontSize: 12 },
});
