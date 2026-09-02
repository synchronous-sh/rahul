import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/constants/theme";
import { feed } from "@/data/content";
import { semanticSearch } from "@/lib/ai";
import { VoiceInputButton } from "@/components/VoiceInputButton";

const topics = ["All", ...Array.from(new Set(feed.map((item) => item.topic)))];
export default function Search() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [semanticIds, setSemanticIds] = useState<string[] | null>(null);
  const [searchingAI, setSearchingAI] = useState(false);
  const lexicalResults = useMemo(
    () =>
      feed.filter(
        (item) =>
          (topic === "All" || item.topic === topic) &&
          `${item.title} ${item.description} ${item.topic} ${item.source}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, topic],
  );
  const results = semanticIds ? semanticIds.map(id => feed.find(item => item.id === id)).filter((item): item is (typeof feed)[number] => Boolean(item)).filter(item => topic === 'All' || item.topic === topic) : lexicalResults;
  const searchByMeaning = async () => { const clean = query.trim(); if (clean.length < 2 || searchingAI) return; setSearchingAI(true); try { const candidates = feed.map(item => ({ id: item.id, title: item.title, text: `${item.topic}. ${item.description}. ${item.source}` })); const response = await semanticSearch(clean, candidates); setSemanticIds(response.results.map(item => item.id)); } catch { setSemanticIds(null); } finally { setSearchingAI(false); } };
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.secondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={searchByMeaning}
              returnKeyType="search"
              style={styles.input}
              placeholder="Search ideas and topics"
              placeholderTextColor={colors.secondary}
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(""); setSemanticIds(null); }} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.secondary}
                />
              </Pressable>
            )}
            <VoiceInputButton onResult={(text) => { setQuery(text); setSemanticIds(null); }} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search filters"
            style={[styles.filter, filtersOpen && styles.filterActive]}
            onPress={() => setFiltersOpen((v) => !v)}
          >
            <Ionicons
              name="options-outline"
              size={21}
              color={filtersOpen ? colors.black : colors.white}
            />
          </Pressable>
        </View>
        {query.trim().length > 1 && <Pressable onPress={searchByMeaning} style={styles.aiSearch}>{searchingAI ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="sparkles-outline" size={15} color="#fff" />}<Text style={styles.aiSearchText}>{semanticIds ? 'Semantic results' : 'Search by meaning'}</Text></Pressable>}
        {filtersOpen && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {topics.map((item) => (
              <Pressable
                key={item}
                onPress={() => setTopic(item)}
                style={[styles.chip, topic === item && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    topic === item && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={styles.headingRow}>
          <Text style={styles.heading}>{query ? "Results" : "Discover"}</Text>
          <Text style={styles.count}>{results.length} ideas</Text>
        </View>
        {results.length ? (
          <View style={styles.grid}>
            {results.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                style={({ pressed }) => [
                  styles.item,
                  pressed && { opacity: 0.72 },
                ]}
                  onPress={() => router.push(item.video ? { pathname: '/(tabs)/videos', params: { id: item.id } } : `/story/${item.id}`)}
              >
                <Image
                  source={item.image}
                  style={styles.image}
                  contentFit="cover"
                />
                <Text style={styles.topic}>{item.topic}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={30}
              color={colors.secondary}
            />
            <Text style={styles.emptyTitle}>No ideas found</Text>
            <Text style={styles.emptyText}>
              Try a different keyword or topic.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black },
  content: { paddingHorizontal: 20, paddingBottom: 110 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  search: {
    height: 44,
    flex: 1,
    backgroundColor: colors.elevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 9,
  },
  filter: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterActive: { backgroundColor: colors.white },
  input: { flex: 1, color: colors.white, fontSize: 14 },
  filters: { gap: 8, paddingTop: 14 },
  aiSearch: { alignSelf: 'flex-start', height: 34, flexDirection: 'row', gap: 7, alignItems: 'center', marginTop: 12, paddingHorizontal: 12, borderRadius: 17, backgroundColor: '#171717', borderWidth: 1, borderColor: '#303030' },
  aiSearchText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  chip: {
    paddingHorizontal: 13,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.white },
  chipText: { color: colors.secondary, fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.black },
  headingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  heading: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "700",
    marginTop: 27,
    marginBottom: 16,
  },
  count: { color: colors.secondary, fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  item: { width: "47.8%", marginBottom: 12 },
  image: {
    width: "100%",
    aspectRatio: 0.8,
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  topic: {
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 9,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 4,
  },
  empty: { alignItems: "center", paddingVertical: 80 },
  emptyTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyText: { color: colors.secondary, fontSize: 13, marginTop: 6 },
});
