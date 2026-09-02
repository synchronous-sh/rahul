import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '@/constants/theme';
import { CourseArtwork } from '@/components/CourseArtwork';
import { Progress } from '@/components/ui';
import { feed, paths } from '@/data/content';
import { PathId } from '@/data/courses';
import { useAppState } from '@/state/AppState';

const stats = [
  { label: 'Following', value: '128' },
  { label: 'Followers', value: '512' },
  { label: 'Friends', value: '46' },
];

const tabs = ['Likes', 'Comments', 'Saved', 'Courses'] as const;
type Tab = (typeof tabs)[number];

function EmptyState({ icon, message }: { icon: React.ComponentProps<typeof Ionicons>['name']; message: string }) {
  return <View style={styles.empty}>
    <Ionicons name={icon} size={26} color={colors.tertiary} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>;
}

function FeedRow({ item }: { item: (typeof feed)[number] }) {
  return <Pressable style={styles.itemRow} onPress={() => router.push(`/story/${item.id}`)}>
    <Image source={item.image} style={styles.itemThumb} contentFit="cover" />
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.itemMeta}>{item.topic}</Text>
    </View>
    <Ionicons name="chevron-forward" size={17} color={colors.tertiary} />
  </Pressable>;
}

export default function Profile() {
  const { liked, saved, completedLessonIds } = useAppState();
  const [tab, setTab] = useState<Tab>('Likes');
  const likedItems = useMemo(() => feed.filter((item) => liked.includes(item.id)), [liked]);
  const savedItems = useMemo(() => feed.filter((item) => saved.includes(item.id)), [saved]);
  const courseProgress = useMemo(() => (Object.keys(paths) as PathId[])
    .map((id) => {
      const total = paths[id].lessons.length;
      const completed = completedLessonIds.filter((key) => key.startsWith(`${id}:`)).length;
      return { id, title: paths[id].title, total, completed };
    })
    .sort((a, b) => b.completed / b.total - a.completed / a.total), [completedLessonIds]);

  return <SafeAreaView style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={styles.avatarText}>R</Text></View>
        <View style={styles.identity}>
          <Text style={styles.name}>Rahul</Text>
          <Text style={styles.handle}>@rahul</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={10} onPress={() => router.push('/settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={colors.white} />
        </Pressable>
      </View>

      <Text style={styles.bio}>Learning something new every day. Building Synchronous 🧠</Text>

      <View style={styles.stats}>
        {stats.map((item) => <View key={item.label} style={styles.stat}>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>)}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((item) => <Pressable key={item} onPress={() => setTab(item)} style={styles.tabButton}>
          <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          {tab === item && <View style={styles.tabLine} />}
        </Pressable>)}
      </View>

      <View style={styles.tabContent}>
        {tab === 'Likes' && (likedItems.length
          ? likedItems.map((item) => <FeedRow key={item.id} item={item} />)
          : <EmptyState icon="heart-outline" message="Posts you like will appear here." />)}

        {tab === 'Comments' && <EmptyState icon="chatbubble-outline" message="Comments you leave will appear here." />}

        {tab === 'Saved' && (savedItems.length
          ? savedItems.map((item) => <FeedRow key={item.id} item={item} />)
          : <EmptyState icon="bookmark-outline" message="Items you save will appear here." />)}

        {tab === 'Courses' && courseProgress.map((course) => <Pressable key={course.id} style={styles.courseRow} onPress={() => router.push(`/course/${course.id}`)}>
          <CourseArtwork path={course.id} title={course.title} style={styles.courseThumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle} numberOfLines={1}>{course.title}</Text>
            <Text style={styles.itemMeta}>{course.completed} of {course.total} lessons</Text>
            <Progress value={(course.completed / course.total) * 100} style={styles.courseProgress} />
          </View>
          <Ionicons name="chevron-forward" size={17} color={colors.tertiary} />
        </Pressable>)}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black },
  content: { paddingHorizontal: layout.page, paddingTop: 8, paddingBottom: 105 },
  settingsButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profile: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  avatarText: { color: colors.black, fontSize: 23, fontWeight: '700' },
  identity: { flex: 1, marginLeft: 14 },
  name: { color: colors.white, fontSize: 20, fontWeight: '700' },
  handle: { color: colors.secondary, fontSize: 13, marginTop: 3 },
  bio: { color: colors.white, fontSize: 14, lineHeight: 20, marginTop: 12 },
  stats: { flexDirection: 'row', marginTop: 20 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statValue: { color: colors.white, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.secondary, fontSize: 12, marginTop: 3 },
  tabBar: { flexDirection: 'row', marginTop: 26, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabButton: { flex: 1, alignItems: 'center', paddingBottom: 12 },
  tabText: { color: colors.secondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: colors.white },
  tabLine: { position: 'absolute', bottom: -1, width: 28, height: 2, borderRadius: 2, backgroundColor: colors.white },
  tabContent: { marginTop: 16, gap: 4 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 56 },
  emptyText: { color: colors.secondary, fontSize: 13, textAlign: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  itemThumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: colors.card },
  itemTitle: { color: colors.white, fontSize: 14, fontWeight: '600', lineHeight: 19 },
  itemMeta: { color: colors.secondary, fontSize: 12, marginTop: 3 },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  courseThumb: { width: 64, height: 52, borderRadius: 10 },
  courseProgress: { marginTop: 8 },
});
