import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import type { Story as StoryType } from '@/data/content';
import { goBack } from '@/lib/navigation';
import { CommentsPanel } from '@/components/CommentsPanel';
import { MorePanel } from '@/components/MorePanel';
import { ListenButton } from '@/components/ListenButton';
import { getCachedNewsStories, getCachedNewsStory, type NewsStory } from '@/lib/news';

function storySections(story: NewsStory): [string, string][] {
  const sentences = `${story.dek}. ${story.content ?? ''}`
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .filter((value, index, all) => value.length > 30 && all.indexOf(value) === index);
  const fallback = story.dek;
  return [
    ['What happened', sentences.slice(0, 2).join(' ') || fallback],
    ['Why it matters', sentences.slice(2, 4).join(' ') || fallback],
    ['Background', sentences.slice(4, 6).join(' ') || fallback],
    ['What to watch', sentences.slice(6, 8).join(' ') || `Follow ${story.source} for verified updates to this developing story.`],
  ];
}

function StoryRow({ story, onPress }: { story: StoryType; onPress: () => void }) {
  return (
    <Pressable style={styles.relatedRow} onPress={onPress}>
      <Image source={story.image} style={styles.relatedThumb} contentFit="cover" />
      <View style={{ flex: 1 }}>
        <Text style={styles.relatedCategory}>{story.category}</Text>
        <Text style={styles.relatedTitle} numberOfLines={2}>{story.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.tertiary} />
    </Pressable>
  );
}

export default function Story() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<NewsStory | null>(null);
  const [liveStories, setLiveStories] = useState<NewsStory[]>([]);
  useEffect(() => {
    setStory(null);
    Promise.all([getCachedNewsStory(id), getCachedNewsStories()]).then(([item, cached]) => {
      setLiveStories(cached);
      if (item?.link) setStory(item);
      else Alert.alert('Story unavailable', 'Only verified live articles with publisher links are shown.', [{ text: 'Go back', onPress: () => goBack() }]);
    });
  }, [id]);
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  if (!story) return <SafeAreaView style={styles.screen}><View style={styles.loading}><ActivityIndicator color="#fff" /></View></SafeAreaView>;
  const learningPath = story.category === 'Markets' ? 'finance' : story.category === 'Technology' ? 'technology' : story.category === 'Science' ? 'science' : story.category === 'Business' ? 'business' : 'history';
  const tap = (action: () => void) => { Haptics.selectionAsync().catch(() => undefined); action(); };
  const placeholder = (label: string) => Alert.alert(label, 'No action is required right now.');

  const others = liveStories.filter((item) => item.id !== story.id && item.link);
  const similar = others.filter((item) => item.category === story.category).slice(0, 3);
  const recommended = others.filter((item) => item.category !== story.category).slice(0, 3);
  const sections = storySections(story);
  const articleText = `${story.title}. ${story.dek}. ${sections.map(([heading, body]) => `${heading}. ${body}`).join(' ')}`;
  const openFullArticle = async () => {
    if (!story.link) {
      Alert.alert('Original article unavailable', 'This archived preview does not include a source URL. Open a live story from Today’s news to read its original article.');
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(story.link, {
        dismissButtonStyle: 'close',
        enableBarCollapsing: true,
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: '#000000',
      });
    } catch {
      Alert.alert('Could not open article', 'Please check your connection and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={27} color="#fff" />
        </Pressable>
        <View style={styles.navActions}>
          <ListenButton text={articleText} iconOnly />
          <Pressable accessibilityLabel={liked ? 'Unlike' : 'Like'} hitSlop={8} onPress={() => tap(() => setLiked((v) => !v))}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={21} color={liked ? '#FF453A' : '#fff'} />
          </Pressable>
          <Pressable accessibilityLabel="Comments" hitSlop={8} onPress={() => tap(() => setCommentsOpen(true))}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark story'} hitSlop={8} onPress={() => tap(() => setSaved((v) => !v))}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="Learn this" hitSlop={8} onPress={() => tap(() => router.push(`/path/${learningPath}`))}>
            <Ionicons name="book-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="Share" hitSlop={8} onPress={() => tap(() => Share.share({ message: `${story.title}\n${story.dek}` }))}>
            <Ionicons name="paper-plane-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="More options" hitSlop={8} onPress={() => tap(() => setMoreOpen(true))} style={styles.more}>
            <View style={styles.moreLineTop} />
            <View style={styles.moreLineBottom} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{story.category}</Text>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.dek}>{story.dek}</Text>
        <Text style={styles.meta}>{story.source}  ·  {story.time}</Text>
        <Image source={story.image} style={styles.image} contentFit="cover" />
        {sections.map(([heading, body]) => (
          <View key={heading} style={styles.block}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        ))}

        <Pressable style={styles.readFull} onPress={() => tap(openFullArticle)}>
          <View>
            <Text style={styles.learnLabel}>Read full article</Text>
            <Text style={styles.learnTitle}>{story.source}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>

        {similar.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Similar stories</Text>
            {similar.map((item) => <StoryRow key={item.id} story={item} onPress={() => router.push(`/story/${item.id}`)} />)}
          </View>
        )}

        {recommended.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Recommended stories</Text>
            {recommended.map((item) => <StoryRow key={item.id} story={item} onPress={() => router.push(`/story/${item.id}`)} />)}
          </View>
        )}
      </ScrollView>

      <CommentsPanel visible={commentsOpen} onClose={() => setCommentsOpen(false)} itemId={story.id} topOffset={insets.top + 52} />
      <MorePanel
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        edge="top"
        topOffset={insets.top + 52}
        title="About this story"
        summary={story.dek}
        actions={[
          { label: 'Speed', icon: 'speedometer-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud'); } },
          { label: 'Voice', icon: 'mic-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud'); } },
          { label: 'Interested', icon: 'thumbs-up-outline', onPress: () => placeholder('Interested') },
          { label: 'Not interested', icon: 'thumbs-down-outline', onPress: () => placeholder('Not interested') },
          { label: 'View full article', icon: 'open-outline', onPress: () => tap(openFullArticle) },
        ]}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nav: { height: 52, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  more: { gap: 4, alignItems: 'center' },
  moreLineTop: { width: 15, height: 2, borderRadius: 1, backgroundColor: '#fff' },
  moreLineBottom: { width: 15, height: 2, borderRadius: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 50 },
  category: { color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1.4, fontSize: 11, fontWeight: '700', marginTop: 16 },
  title: { color: '#fff', fontSize: 37, lineHeight: 41, fontWeight: '700', letterSpacing: -1, marginTop: 10 },
  dek: { color: 'rgba(255,255,255,.72)', fontSize: 19, lineHeight: 27, marginTop: 16 },
  meta: { color: colors.tertiary, fontSize: 12, marginTop: 16 },
  image: { width: '100%', height: 240, marginTop: 26, marginBottom: 10 },
  block: { paddingVertical: 25, borderBottomWidth: 1, borderBottomColor: colors.border },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: 'rgba(255,255,255,.7)', fontSize: 16, lineHeight: 25 },
  readFull: { paddingVertical: 20, marginTop: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  learnLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  learnTitle: { color: colors.secondary, fontSize: 12, marginTop: 5 },
  relatedSection: { marginTop: 34 },
  relatedHeading: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  relatedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  relatedThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: colors.card },
  relatedCategory: { color: colors.secondary, fontSize: 10, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: '700' },
  relatedTitle: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 19, marginTop: 3 },
  articleBrand: { color: colors.secondary, fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  articleTitle: { color: '#fff', fontSize: 30, lineHeight: 35, fontWeight: '700', letterSpacing: -0.6, marginTop: 10 },
  articleLede: { color: 'rgba(255,255,255,.82)', fontSize: 18, lineHeight: 28, marginTop: 22, fontStyle: 'italic' },
  articleBody: { color: 'rgba(255,255,255,.78)', fontSize: 17, lineHeight: 28 },
});
