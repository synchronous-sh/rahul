import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
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
import { FeedMedia } from "@/components/FeedMedia";
import { MorePanel } from "@/components/MorePanel";
import { colors } from "@/constants/theme";
import { FeedItem } from "@/data/content";
import { videoCovers } from "@/data/videoCovers";
import { useAppState, useRankedFeed } from "@/state/AppState";
const height = Dimensions.get("window").height;
const categories = [
  "Explore",
  "AI",
  "Business",
  "Finance",
  "Science",
  "History",
  "Space",
  "Psychology",
  "Cooking",
  "Technology",
  "Sports",
  "Economics",
  "Design",
];

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
  const ranked = useRankedFeed();
  const { saved, liked, toggleSave, toggleLike } = useAppState();
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState("Explore");
  const [commentsFor, setCommentsFor] = useState<FeedItem | null>(null);
  const [moreFor, setMoreFor] = useState<FeedItem | null>(null);
  const placeholder = (label: string) => Alert.alert(label, "No action is required right now.");
  const items =
    category === "Explore"
      ? ranked
      : ranked.filter((item) => item.topic === category);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setActive(viewableItems[0].index);
    },
  );
  const renderItem: ListRenderItem<FeedItem> = useCallback(
    ({ item, index }) => {
      const publisher = item.source.split(" · ")[0];
      return (
        <View style={styles.page}>
          <FeedMedia
            image={videoCovers[item.id] ?? item.image}
            active={index === active}
          />
          <View style={styles.shade} />
          <View style={styles.topicRow}>
            <Text style={styles.topic}>{item.topic}</Text>
            <View style={styles.sound}>
              <Ionicons
                name={index === active ? "volume-medium" : "volume-mute"}
                size={16}
                color="#fff"
              />
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.copy}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
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
                label="Learn"
                icon="book-outline"
                onPress={() => router.push(`/path/${item.path}`)}
              />
              <FeedAction
                label="Share"
                icon="paper-plane-outline"
                onPress={() =>
                  Share.share({ message: `${item.title}\n${item.description}` })
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
                <View style={styles.detailsLineTop} />
                <View style={styles.detailsLineBottom} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Source: ${publisher}`}
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
        summary={moreFor?.description ?? ""}
        actions={[
          { label: "Voice", icon: "mic-outline", onPress: () => placeholder("Voice") },
          { label: "Speed", icon: "speedometer-outline", onPress: () => placeholder("Speed") },
          { label: "Autoscroll", icon: "play-skip-forward-outline", onPress: () => placeholder("Autoscroll") },
          { label: "Interested", icon: "thumbs-up-outline", onPress: () => placeholder("Interested") },
          { label: "Not interested", icon: "thumbs-down-outline", onPress: () => placeholder("Not interested") },
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
  topicRow: {
    position: "absolute",
    top: 156,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topic: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 1.7 },
  sound: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    position: "absolute",
    left: 18,
    right: 9,
    bottom: 88,
    height: 132,
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
  detailsAction: { width: 44, height: 35, alignItems: "center", justifyContent: "center", gap: 5 },
  detailsLineTop: { width: 23, height: 2, borderRadius: 1, backgroundColor: "rgba(255,255,255,.96)" },
  detailsLineBottom: { width: 14, height: 2, borderRadius: 1, backgroundColor: "rgba(255,255,255,.96)" },
  sourceBadge: { width: 48, alignItems: "center", marginTop: 2 },
  sourceAvatar: { width: 29, height: 29, borderRadius: 7, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,.8)" },
  sourceLetter: { color: "#000", fontSize: 11, fontWeight: "800" },
  sourceName: { color: "rgba(255,255,255,.72)", fontSize: 7, fontWeight: "600", marginTop: 3, maxWidth: 47 },
});
