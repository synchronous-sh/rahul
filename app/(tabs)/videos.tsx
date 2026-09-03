import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { AppHeader } from "@/components/AppHeader";
import { CommentsPanel } from "@/components/CommentsPanel";
import { NewsShortMedia } from "@/components/NewsShortMedia";
import { MorePanel } from "@/components/MorePanel";
import { ListenButton } from "@/components/ListenButton";
import { colors } from "@/constants/theme";
import { fetchNews, getCachedNewsStory } from "@/lib/news";
import { buildNewsShort, type NewsShort } from "@/lib/newsShorts";
import { useAppState } from "@/state/AppState";
const height = Dimensions.get("window").height;
const categories = [
  "For You",
  "U.S.",
  "World",
  "History",
  "Business",
  "Technology",
  "Science",
  "Entertainment",
  "Lifestyle",
  "Food",
  "Sports",
];

function learningPathFor(category: string) {
  if (category === "Business") return "business";
  if (category === "Technology") return "technology";
  if (category === "Science") return "science";
  if (category === "History") return "history";
  if (category === "U.S." || category === "World") return "history";
  return "finance";
}

function FeedAction({
  icon,
  label,
  active,
  onPress,
  count,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  active?: boolean;
  onPress?: () => void;
  count?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={7}
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.action,
        pressed && { transform: [{ scale: 0.88 }] },
      ]}
    >
      <Ionicons
        name={icon}
        size={27}
        color={active ? colors.white : "rgba(255,255,255,.96)"}
      />
      {count && <Text style={styles.actionCount}>{count}</Text>}
    </Pressable>
  );
}

export default function Videos() {
  const { id: selectedId } = useLocalSearchParams<{ id?: string }>();
  const { saved, liked, toggleSave, toggleLike } = useAppState();
  const [newsShorts, setNewsShorts] = useState<NewsShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState("For You");
  const [commentsFor, setCommentsFor] = useState<NewsShort | null>(null);
  const [moreFor, setMoreFor] = useState<NewsShort | null>(null);
  const placeholder = (label: string) => Alert.alert(label, "No action is required right now.");
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNewsShorts([]);
    Promise.all([fetchNews(category), selectedId && category === "For You" ? getCachedNewsStory(selectedId) : Promise.resolve(null)])
      .then(([stories, selected]) => [selected, ...stories]
        .filter((story): story is NonNullable<typeof story> => Boolean(story?.link))
        .filter((story, index, all) => all.findIndex(item => item.id === story.id) === index))
      .then(stories => Promise.all(stories.map(buildNewsShort)))
      .then(items => { if (mounted) setNewsShorts(items); })
      .catch(error => { if (mounted) Alert.alert('Videos unavailable', error instanceof Error ? error.message : 'Please try again.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [category, selectedId]);
  const prioritized = useMemo(() => {
    if (!selectedId) return newsShorts;
    const selected = newsShorts.find((item) => item.id === selectedId);
    return selected ? [selected, ...newsShorts.filter((item) => item.id !== selectedId)] : newsShorts;
  }, [newsShorts, selectedId]);
  const items = prioritized;
  useEffect(() => {
    if (selectedId) {
      setCategory("For You");
      setActive(0);
    }
  }, [selectedId]);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setActive(viewableItems[0].index);
    },
  );
  const renderItem: ListRenderItem<NewsShort> = useCallback(
    ({ item, index }) => {
      const publisher = item.source.split(" · ")[0];
      return (
        <View style={styles.page}>
          <NewsShortMedia item={item} active={index === active} />
          <View style={styles.shade} />
          <View style={styles.voiceControl}>
            <ListenButton text={`${item.title}. ${item.dek}`} iconOnly iconSize={23} />
          </View>
          <View style={styles.bottom}>
            <View style={styles.copy}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>
                {item.shortTitle}
              </Text>
              <Text style={styles.description} numberOfLines={1}>{item.dek}  <Text style={styles.moreText}>more</Text></Text>
              <Text style={styles.attribution} numberOfLines={1}>{publisher}</Text>
            </View>
            <View style={styles.actions}>
              <FeedAction
                label="Like"
                icon={liked.includes(item.id) ? "heart" : "heart-outline"}
                active={liked.includes(item.id)}
                count={liked.includes(item.id) ? "3" : "2"}
                onPress={() => toggleLike(item.id)}
              />
              <FeedAction
                label="Comments"
                icon="chatbubble-outline"
                count="1"
                onPress={() => setCommentsFor(item)}
              />
              <FeedAction
                label="Save"
                icon={saved.includes(item.id) ? "bookmark" : "bookmark-outline"}
                active={saved.includes(item.id)}
                onPress={() => toggleSave(item.id)}
              />
              <FeedAction
                label="Share"
                icon="paper-plane-outline"
                onPress={() =>
                  Share.share({ message: `${item.title}\n${item.dek}\n${item.link}` })
                }
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="More options"
                hitSlop={7}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => undefined);
                  setMoreFor(item);
                }}
                style={({ pressed }) => [
                  styles.detailsAction,
                  pressed && { transform: [{ scale: 0.88 }] },
                ]}
              >
                <Ionicons name="ellipsis-horizontal" size={23} color="rgba(255,255,255,.96)" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${publisher} news summary`}
                onPress={() => router.push(`/story/${item.id}`)}
                style={styles.sourceBadge}
              >
                <View style={styles.sourceAvatar}><Text style={styles.sourceLetter}>{publisher[0]}</Text></View>
                <Text style={styles.sourceName} numberOfLines={1}>{publisher}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [active, saved, liked, toggleLike, toggleSave],
  );
  return (
    <View style={styles.screen}>
      {loading && <View style={styles.loader}><ActivityIndicator color="#fff" /><Text style={styles.loaderText}>Building today’s news videos…</Text></View>}
      {!loading && items.length === 0 && <View style={styles.loader}><Ionicons name="newspaper-outline" size={28} color={colors.secondary} /><Text style={styles.loaderText}>No verified news videos are available in this category.</Text></View>}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
      <AppHeader overlay />
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setCategory(item);
                setActive(0);
              }}
              style={styles.categoryButton}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryActive,
                ]}
              >
                {item}
              </Text>
              {category === item && <View style={styles.categoryLine} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <CommentsPanel
        visible={commentsFor != null}
        onClose={() => setCommentsFor(null)}
        itemId={commentsFor?.id ?? ""}
        topOffset={96}
      />
      <MorePanel
        visible={moreFor != null}
        onClose={() => setMoreFor(null)}
        edge="bottom"
        title="About this video"
        summary={moreFor?.dek ?? ""}
        actions={[
          { label: "Voice", icon: "mic-outline", onPress: () => { setMoreFor(null); router.push('/settings/read-aloud?only=voice'); } },
          { label: "Speed", icon: "speedometer-outline", onPress: () => { setMoreFor(null); router.push('/settings/read-aloud?only=speed'); } },
          { label: "Autoscroll", icon: "play-skip-forward-outline", onPress: () => placeholder("Autoscroll") },
          { label: "Interested", icon: "thumbs-up-outline", onPress: () => placeholder("Interested") },
          { label: "Not interested", icon: "thumbs-down-outline", onPress: () => placeholder("Not interested") },
          { label: "Study this topic", icon: "book-outline", onPress: () => { if (moreFor) router.push(`/path/${learningPathFor(moreFor.category)}`); setMoreFor(null); } },
          { label: "Read article", icon: "newspaper-outline", onPress: () => { if (moreFor) router.push(`/story/${moreFor.id}`); setMoreFor(null); } },
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  page: { height, backgroundColor: "#000" },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,.04)",
  },
  categoryBar: {
    position: "absolute",
    top: 102,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  categoryContent: { paddingHorizontal: 17, gap: 22 },
  voiceControl: { position: 'absolute', zIndex: 21, top: 151, right: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  categoryButton: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "rgba(255,255,255,.58)",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryActive: { color: "#fff", fontWeight: "700" },
  categoryLine: {
    position: "absolute",
    bottom: 2,
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  loader: { ...StyleSheet.absoluteFillObject, zIndex: 4, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 36 },
  loaderText: { color: colors.secondary, fontSize: 13, textAlign: 'center' },
  bottom: {
    position: "absolute",
    left: 18,
    right: 9,
    bottom: 104,
    height: 116,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  copy: { flex: 1, paddingRight: 12, paddingBottom: 12 },
  title: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,.9)",
    textShadowRadius: 5,
  },
  description: {
    color: "rgba(255,255,255,.88)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    textShadowColor: "#000",
    textShadowRadius: 4,
  },
  attribution: {
    color: "rgba(255,255,255,.62)",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
    textShadowColor: "#000",
    textShadowRadius: 4,
  },
  moreText: { color: "rgba(255,255,255,.64)", fontWeight: "600" },
  actions: {
    width: 48,
    alignItems: "center",
    gap: 7,
    marginBottom: 4,
    marginTop: -276,
  },
  action: {
    minWidth: 44,
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCount: { color: "#fff", fontSize: 11, fontWeight: "600", marginTop: 1 },
  detailsAction: { width: 44, height: 35, alignItems: "center", justifyContent: "center" },
  sourceBadge: { width: 48, alignItems: "center", marginTop: 2 },
  sourceAvatar: { width: 29, height: 29, borderRadius: 7, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,.8)" },
  sourceLetter: { color: "#000", fontSize: 11, fontWeight: "800" },
  sourceName: { color: "rgba(255,255,255,.72)", fontSize: 7, fontWeight: "600", marginTop: 3, maxWidth: 47 },
});
