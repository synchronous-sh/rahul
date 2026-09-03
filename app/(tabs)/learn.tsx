import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Progress } from "@/components/ui";
import { CourseArtwork } from "@/components/CourseArtwork";
import { colors } from "@/constants/theme";
import { paths } from "@/data/content";
import { useAppState } from "@/state/AppState";

type CourseCard = {
  path: keyof typeof paths;
  title: string;
  subtitle: string;
  progress?: number;
};
const card = (
  path: keyof typeof paths,
  title: string,
  subtitle: string,
  progress?: number,
): CourseCard => ({ path, title, subtitle, progress });
const shelves: { title: string; items: CourseCard[] }[] = [
  {
    title: "Recents",
    items: [
      card("finance", "Finance", "Continue with Banks", 18),
      card("history", "World History", "Continue with Greece", 12),
      card("technology", "Technology", "Continue with Networks", 16),
    ],
  },
  {
    title: "Recommended",
    items: [
      card("ai", "Artificial Intelligence", "Models, transformers, and agents"),
      card("psychology", "Psychology", "Memory, emotion, and decisions"),
      card("economics", "Economics", "Incentives, markets, and growth"),
    ],
  },
  {
    title: "New",
    items: [
      card("science", "Science", "Evidence and the natural world"),
      card("space", "Space", "From planets to cosmology"),
      card("design", "Design", "Clear and useful systems"),
    ],
  },
  {
    title: "Business",
    items: [
      card("business", "Business Strategy", "Customers to leadership"),
      card("finance", "Finance Essentials", "Money, markets, and risk"),
      card("economics", "Market Economics", "Supply, demand, and trade"),
    ],
  },
  {
    title: "Technology",
    items: [
      card(
        "technology",
        "Computing & Software",
        "Networks, security, and robotics",
      ),
      card("ai", "Applied AI", "Machine learning to agents"),
      card("design", "Digital Product Design", "Research and interaction"),
    ],
  },
  {
    title: "AI",
    items: [
      card("ai", "AI Foundations", "A complete introductory path"),
      card(
        "technology",
        "Technology for AI",
        "Computing and network foundations",
      ),
      card(
        "psychology",
        "Human Intelligence",
        "Learning, memory, and decisions",
      ),
    ],
  },
  {
    title: "Science",
    items: [
      card("science", "Core Science", "Matter, energy, and life"),
      card("space", "Astronomy", "Stars, galaxies, and gravity"),
      card("psychology", "Behavioral Science", "How minds interpret the world"),
    ],
  },
  {
    title: "History",
    items: [
      card("history", "World History", "Ancient worlds to modern conflict"),
      card("economics", "Economic History", "Trade, labor, and growth"),
      card("design", "History of Design", "Systems that shaped daily life"),
    ],
  },
  {
    title: "Health",
    items: [
      card(
        "psychology",
        "Mental Health Foundations",
        "Emotion, habits, and decisions",
      ),
      card("sports", "Movement & Recovery", "Strength, endurance, and rest"),
      card("science", "Human Biology", "Life, energy, and evidence"),
    ],
  },
  {
    title: "Politics",
    items: [
      card("history", "Political History", "Power, institutions, and conflict"),
      card("economics", "Political Economy", "Policy, incentives, and trade"),
      card("psychology", "Public Opinion", "Perception and decision making"),
    ],
  },
  {
    title: "Cooking",
    items: [
      card("cooking", "Cooking Science", "Heat, texture, and timing"),
      card("science", "Food Chemistry", "Matter and energy in the kitchen"),
      card("business", "Food Business", "Customers and operations"),
    ],
  },
  {
    title: "Sports",
    items: [
      card("sports", "Sports Science", "Movement through teamwork"),
      card(
        "psychology",
        "Performance Psychology",
        "Learning, habits, and focus",
      ),
      card("science", "Physics of Sport", "Energy, matter, and motion"),
    ],
  },
  {
    title: "Economics",
    items: [
      card("economics", "Economics", "Scarcity through growth"),
      card("finance", "Markets & Investing", "Stocks, bonds, and valuation"),
      card("business", "Business Economics", "Models, strategy, and scale"),
    ],
  },
];

function CourseShelf({ title, items }: { title: string; items: CourseCard[] }) {
  return (
    <View style={styles.shelf}>
      <View style={styles.shelfHeader}>
        <Text style={styles.shelfTitle}>{title}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => (
          <Pressable
            accessibilityRole="button"
            key={`${title}-${item.title}`}
            onPress={() =>
              router.push({
                pathname: "/course/[id]",
                params: { id: item.path, title: item.title },
              })
            }
            style={({ pressed }) => [
              styles.courseCard,
              pressed && { opacity: 0.72 },
            ]}
          >
            <CourseArtwork
              path={item.path}
              title={item.title}
              style={styles.courseImage}
            />
            {item.progress != null && (
              <View style={styles.cardProgress}>
                <View
                  style={[
                    styles.cardProgressFill,
                    { width: `${item.progress}%` },
                  ]}
                />
              </View>
            )}
            <Text style={styles.courseTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function Learn() {
  const { xp, streak, completedLessons } = useAppState();
  const levelTarget = 2000;
  const levelProgress = Math.min(100, Math.round((xp / levelTarget) * 100));
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View level progress and learning analytics"
          onPress={() => router.push("/levels")}
          style={({ pressed }) => [styles.hero, pressed && { opacity: 0.82 }]}
        >
          <Image
            source={require("../../assets/characters/brain-level-1.png")}
            style={styles.brain}
            contentFit="contain"
          />
          <Text style={styles.level}>LEVEL 1</Text>
          <Text style={styles.rank}>CURIOUS</Text>
          <Text style={styles.xp}>
            {xp.toLocaleString()} / {levelTarget.toLocaleString()} XP
          </Text>
          <Progress value={levelProgress} style={styles.levelProgress} />
          <View style={styles.heroHint}>
            <Text style={styles.heroHintText}>View progress</Text>
            <Ionicons name="chevron-forward" size={11} color={colors.secondary} />
          </View>
        </Pressable>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Ionicons name="flame-outline" size={18} color="#fff" />
            <Text style={styles.metricValue}>{streak} days</Text>
            <Text style={styles.metricLabel}>streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metric}>
            <Ionicons name="time-outline" size={18} color="#fff" />
            <Text style={styles.metricValue}>3h 42m</Text>
            <Text style={styles.metricLabel}>learning time</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metric}>
            <Ionicons name="book-outline" size={18} color="#fff" />
            <Text style={styles.metricValue}>{completedLessons}</Text>
            <Text style={styles.metricLabel}>lessons</Text>
          </View>
        </View>
        <View style={styles.catalogHeader}>
          <View style={styles.catalogTitleRow}>
            <Text style={styles.catalogTitle}>Courses</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create a custom course"
              hitSlop={10}
              onPress={() => router.push("/course/create")}
              style={({ pressed }) => [
                styles.createCourse,
                pressed && { opacity: 0.55 },
              ]}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.catalogSubtitle}>
            Pick up where you left off or explore something new.
          </Text>
        </View>
        {shelves.map((shelf) => (
          <CourseShelf key={shelf.title} {...shelf} />
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all courses"
          hitSlop={10}
          onPress={() => router.push({ pathname: "/library/[type]", params: { type: "courses" } })}
          style={({ pressed }) => [styles.moreButton, pressed && { opacity: 0.55 }]}
        >
          <Text style={styles.moreText}>More ›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  content: { paddingBottom: 105 },
  hero: { height: 340, alignItems: "center", overflow: "hidden" },
  brain: { width: 235, height: 225 },
  level: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginTop: -7,
  },
  rank: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 5,
  },
  xp: { color: colors.secondary, fontSize: 10, marginTop: 5 },
  levelProgress: { width: 184, marginTop: 9 },
  heroHint: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 10 },
  heroHintText: { color: colors.secondary, fontSize: 9, fontWeight: "600" },
  metrics: {
    marginHorizontal: 20,
    height: 82,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  metric: { flex: 1, alignItems: "center", gap: 3 },
  metricValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
  metricLabel: { color: colors.secondary, fontSize: 8 },
  divider: { width: 1, height: 42, backgroundColor: colors.border },
  catalogHeader: { paddingHorizontal: 20, marginTop: 27, marginBottom: 5 },
  catalogTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  catalogTitle: { color: "#fff", fontSize: 25, fontWeight: "750" as "700" },
  createCourse: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  catalogSubtitle: { color: colors.secondary, fontSize: 13, marginTop: 5 },
  shelf: { marginTop: 24 },
  shelfHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  shelfTitle: { color: "#fff", fontSize: 19, fontWeight: "700" },
  moreButton: { alignSelf: "center", marginTop: 30, paddingHorizontal: 16, paddingVertical: 8 },
  moreText: { color: colors.secondary, fontSize: 13, fontWeight: "600", textAlign: "center" },
  row: { paddingHorizontal: 20, gap: 11 },
  courseCard: { width: 166 },
  courseImage: {
    width: 166,
    height: 94,
    borderRadius: 9,
    backgroundColor: colors.card,
  },
  cardProgress: {
    height: 3,
    backgroundColor: "rgba(255,255,255,.25)",
    marginTop: -3,
    zIndex: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  cardProgressFill: { height: 3, backgroundColor: "#fff" },
  courseTitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
});
