import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { stories } from '@/data/content';
import { goBack } from '@/lib/navigation';
import { CommentsPanel } from '@/components/CommentsPanel';
import { MorePanel } from '@/components/MorePanel';

const sections = [
  ['What happened', 'The latest development adds a meaningful new signal to a story that is still unfolding. The details are clearer than the headline alone suggests.'],
  ['Why it matters', 'The effects can reach households, businesses, and public policy at different speeds. Context makes it easier to separate the durable change from short-term noise.'],
  ['Background', 'This story builds on decisions and trends that developed over several years. The current moment is best understood as part of that longer arc.'],
  ['What to watch', 'Watch the next set of verified data, responses from affected groups, and whether early expectations hold up.'],
];

function StoryRow({ story, onPress }: { story: (typeof stories)[number]; onPress: () => void }) {
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
  const story = stories.find((item) => item.id === id) ?? stories[0];
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [listening, setListening] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [articleOpen, setArticleOpen] = useState(false);
  const learningPath = story.category === 'Markets' ? 'finance' : story.category === 'Technology' ? 'technology' : story.category === 'Science' ? 'science' : story.category === 'Business' ? 'business' : 'history';
  const tap = (action: () => void) => { Haptics.selectionAsync().catch(() => undefined); action(); };
  const placeholder = (label: string) => Alert.alert(label, 'No action is required right now.');

  const others = stories.filter((item) => item.id !== story.id);
  const similar = others.filter((item) => item.category === story.category).slice(0, 3);
  const recommended = others.filter((item) => item.category !== story.category).slice(0, 3);
  const openStory = (storyId: string) => { setArticleOpen(false); router.push(`/story/${storyId}`); };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={27} color="#fff" />
        </Pressable>
        <View style={styles.navActions}>
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
          <Pressable accessibilityLabel={listening ? 'Stop listening' : 'Listen to this story'} hitSlop={8} onPress={() => tap(() => setListening((v) => !v))}>
            <Ionicons name={listening ? 'volume-high' : 'volume-high-outline'} size={20} color="#fff" />
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

        <Pressable style={styles.readFull} onPress={() => tap(() => setArticleOpen(true))}>
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
          { label: 'Speed', icon: 'speedometer-outline', onPress: () => placeholder('Speed') },
          { label: 'Voice', icon: 'mic-outline', onPress: () => placeholder('Voice') },
          { label: 'Interested', icon: 'thumbs-up-outline', onPress: () => placeholder('Interested') },
          { label: 'Not interested', icon: 'thumbs-down-outline', onPress: () => placeholder('Not interested') },
          { label: 'View full article', icon: 'open-outline', onPress: () => tap(() => setArticleOpen(true)) },
        ]}
      />

      <Modal visible={articleOpen} animationType="slide" onRequestClose={() => setArticleOpen(false)}>
        <SafeAreaView style={styles.screen}>
          <View style={styles.nav}>
            <Pressable accessibilityLabel="Close" hitSlop={12} onPress={() => setArticleOpen(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
            <Text style={styles.articleBrand}>FULL ARTICLE</Text>
            <View style={{ width: 26 }} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.category}>{story.category}</Text>
            <Text style={styles.articleTitle}>{story.title}</Text>
            <Text style={styles.meta}>{story.source}  ·  {story.time}</Text>
            <Image source={story.image} style={styles.image} contentFit="cover" />
            <Text style={styles.articleLede}>{story.dek}</Text>
            {sections.map(([heading, body]) => (
              <View key={heading} style={styles.block}>
                <Text style={styles.heading}>{heading}</Text>
                <Text style={styles.articleBody}>{body}</Text>
              </View>
            ))}
            {similar.slice(0, 2).map((item) => <StoryRow key={item.id} story={item} onPress={() => openStory(item.id)} />)}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
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
