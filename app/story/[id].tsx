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
import { expandNewsArticle, type NewsBrief } from '@/lib/ai';

function cleanArticleText(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function conciseStandfirst(story: NewsStory) {
  const sentences = cleanArticleText(story.dek)
    .split(/(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
  if (!sentences.length) return 'A concise overview of the latest verified reporting.';
  const first = sentences[0];
  if (first.length < 90 && sentences[1] && `${first} ${sentences[1]}`.length <= 165) return `${first} ${sentences[1]}`;
  return first;
}

function sourceBackedFallback(story: NewsStory): NewsBrief {
  const clean = cleanArticleText(`${story.dek}. ${story.content ?? ''}`);
  const sentences = clean.split(/(?<=[.!?])\s+/).map(value => value.trim()).filter(Boolean);
  const primary = sentences[0] || cleanArticleText(story.dek);
  const details = sentences.slice(1, 4).join(' ') || cleanArticleText(story.dek);
  return { sections: [
    { heading: 'Summary', paragraphs: [
      `${primary} This summary reflects the verified information made available by ${story.source} and keeps the publisher’s attribution and level of certainty intact.`,
      `The central development is the one described in the original report, without extending the available facts into assumptions. ${details}`,
    ] },
    { heading: 'Insights', paragraphs: [
      `The report is most useful when its confirmed details are separated from interpretation. The people, organizations, places, dates, and figures included here come from the publisher material; questions not answered by that material remain open rather than being filled with speculation.`,
      `Read together, the available details clarify what has happened and what the source considers important. They do not, by themselves, establish every cause or consequence. That distinction matters because early reporting can change as officials, participants, or additional records provide more information.`,
    ] },
    { heading: 'Background', paragraphs: [
      `${story.source} published the report under the headline “${story.title}.” The original coverage supplies the factual basis for this brief. Where the publisher offers only a limited preview, the brief preserves that boundary and does not introduce outside claims that cannot be traced to the linked article.`,
      `The background therefore centers on the context explicitly present in the report: ${cleanArticleText(story.dek)} This framing helps connect the headline to the reported circumstances while keeping attribution visible and avoiding an unsupported reconstruction of events.`,
    ] },
    { heading: 'Impact', paragraphs: [
      `The immediate significance depends on the people and institutions directly identified in the reporting. Any broader effect should be evaluated against confirmed actions, documented responses, and measurable changes rather than inferred from the headline alone.`,
      `For readers, the practical impact is a clearer account of the verified development and the parties involved. The report may also identify decisions or responses worth following, but this brief does not claim effects that the source has not established.`,
    ] },
    { heading: 'Outlook', paragraphs: [
      `The next reliable update should come from additional reporting, official statements, records, or direct responses connected to the event. Those developments may confirm, refine, or materially change the picture presented in the initial coverage.`,
      `Until then, the most responsible conclusion is limited to the facts above. Readers can open the original ${story.source} article below for the publisher’s complete presentation, updates, and any source material that becomes available after this brief was prepared.`,
      `This approach keeps the brief useful during a developing story while making a clear distinction between established reporting, attributed claims, and details that still require independent confirmation.`,
    ] },
  ] };
}

function StoryRow({ story, onPress }: { story: StoryType; onPress: () => void }) {
  return (
    <Pressable style={styles.relatedRow} onPress={onPress}>
      <Image source={story.image} style={styles.relatedThumb} contentFit="cover" />
      <View style={{ flex: 1 }}>
        <Text style={styles.relatedTitle} numberOfLines={2}>{story.title}</Text>
        <Text style={styles.relatedMeta} numberOfLines={1}>{story.source.split(' · ')[0]}  ·  {story.time}</Text>
      </View>
    </Pressable>
  );
}

export default function Story() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<NewsStory | null>(null);
  const [liveStories, setLiveStories] = useState<NewsStory[]>([]);
  const [expandedBrief, setExpandedBrief] = useState<NewsBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  useEffect(() => {
    setStory(null);
    Promise.all([getCachedNewsStory(id), getCachedNewsStories()]).then(([item, cached]) => {
      setLiveStories(cached);
      if (item?.link) setStory(item);
      else Alert.alert('Story unavailable', 'Only verified live articles with publisher links are shown.', [{ text: 'Go back', onPress: () => goBack() }]);
    });
  }, [id]);
  useEffect(() => {
    setExpandedBrief(null);
    if (!story?.link) return;
    setBriefLoading(true);
    let active = true;
    expandNewsArticle({
      id: story.id,
      title: story.title,
      description: story.dek,
      content: story.content,
      source: story.source,
      link: story.link,
    }).then((brief) => {
      const wordCount = brief.sections?.flatMap((section) => section.paragraphs).join(' ').trim().split(/\s+/).filter(Boolean).length ?? 0;
      const requiredHeadings = ['Summary', 'Insights', 'Background', 'Impact', 'Outlook'];
      const hasRequiredStructure = brief.sections?.length === requiredHeadings.length
        && brief.sections.every((section, index) => section.heading === requiredHeadings[index] && section.paragraphs.some((paragraph) => paragraph.trim()));
      if (active && hasRequiredStructure && wordCount >= 400 && wordCount <= 500) setExpandedBrief(brief);
      else if (active) setExpandedBrief(sourceBackedFallback(story));
    }).catch(() => {
      if (active) setExpandedBrief(sourceBackedFallback(story));
    }).finally(() => {
      if (active) setBriefLoading(false);
    });
    return () => { active = false; };
  }, [story?.id]);
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
  const matchingCategory = others.filter((item) => item.category === story.category);
  const similar = [
    ...matchingCategory,
    ...others.filter((item) => item.category !== story.category),
  ].slice(0, 3);
  const similarIds = new Set(similar.map((item) => item.id));
  const recommended = others.filter((item) => !similarIds.has(item.id)).slice(0, 3);
  const sections = expandedBrief?.sections ?? [];
  const standfirst = conciseStandfirst(story);
  const articleText = `${story.title}. ${story.dek}. ${sections.map((section) => `${section.heading}. ${section.paragraphs.join(' ')}`).join(' ')}`;
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
        <View style={styles.topActions}>
          <Pressable accessibilityLabel={liked ? 'Unlike' : 'Like'} hitSlop={8} onPress={() => tap(() => setLiked((v) => !v))}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={21} color={liked ? '#FF453A' : '#fff'} />
          </Pressable>
          <Pressable accessibilityLabel="Comments" hitSlop={8} onPress={() => tap(() => setCommentsOpen(true))}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="Share" hitSlop={8} onPress={() => tap(() => Share.share({ message: `${story.title}\n${story.dek}` }))}>
            <Ionicons name="paper-plane-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel={saved ? 'Remove bookmark' : 'Save article'} hitSlop={8} onPress={() => tap(() => setSaved((value) => !value))}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="More options" hitSlop={8} onPress={() => tap(() => setMoreOpen(true))}>
            <Ionicons name="ellipsis-horizontal" size={21} color="#fff" />
          </Pressable>
        </View>
      </View>
      <View style={styles.inlineVoice}><ListenButton text={articleText} iconOnly /></View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{story.category}</Text>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.dek} numberOfLines={3}>{standfirst}</Text>
        <Text style={styles.meta}>{story.source}  ·  {story.time}</Text>
        <Image source={story.image} style={styles.image} contentFit="cover" />
        {briefLoading && <View style={styles.briefStatus}><ActivityIndicator color="#fff" /><Text style={styles.briefStatusText}>Preparing the full brief…</Text></View>}
        {sections.map((section) => (
          <View key={section.heading} style={styles.block}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text key={`${section.heading}-${index}`} style={[styles.body, index > 0 && styles.bodyParagraph]}>{paragraph}</Text>
            ))}
          </View>
        ))}

        <Pressable style={styles.readFull} onPress={() => tap(openFullArticle)}>
          <View>
            <Text style={styles.learnLabel}>Read full article</Text>
            <Text style={styles.learnTitle}>{story.source}</Text>
          </View>
          <Ionicons name="arrow-up-outline" size={18} color="#fff" style={styles.externalArrow} />
        </Pressable>

        {similar.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Similar articles</Text>
            {similar.map((item) => <StoryRow key={item.id} story={item} onPress={() => router.push(`/story/${item.id}`)} />)}
          </View>
        )}

        {recommended.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Recommended articles</Text>
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
          { label: 'Voice', icon: 'mic-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud?only=voice'); } },
          { label: 'Speed', icon: 'speedometer-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud?only=speed'); } },
          { label: 'Interested', icon: 'thumbs-up-outline', onPress: () => placeholder('Interested') },
          { label: 'Not interested', icon: 'thumbs-down-outline', onPress: () => placeholder('Not interested') },
          { label: 'Study this topic', icon: 'book-outline', onPress: () => { setMoreOpen(false); router.push(`/path/${learningPath}`); } },
          { label: 'View full article', icon: 'open-outline', onPress: () => tap(openFullArticle) },
        ]}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nav: { height: 52, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 17 },
  inlineVoice: { position: 'absolute', zIndex: 12, top: 139, right: 18, width: 24, alignItems: 'center' },
  content: { padding: 20, paddingBottom: 110 },
  category: { color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1.4, fontSize: 11, fontWeight: '700', marginTop: 16 },
  title: { color: '#fff', fontSize: 31, lineHeight: 35, fontWeight: '700', letterSpacing: -0.7, marginTop: 9, paddingRight: 30 },
  dek: { color: 'rgba(255,255,255,.72)', fontSize: 16, lineHeight: 22, marginTop: 13, paddingRight: 8 },
  meta: { color: colors.tertiary, fontSize: 12, marginTop: 13 },
  image: { width: '100%', height: 240, marginTop: 20, marginBottom: 8 },
  block: { paddingVertical: 21 },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: 'rgba(255,255,255,.7)', fontSize: 16, lineHeight: 25 },
  bodyParagraph: { marginTop: 16 },
  briefStatus: { minHeight: 110, alignItems: 'center', justifyContent: 'center', gap: 12 },
  briefStatusText: { color: colors.secondary, fontSize: 14 },
  readFull: { alignSelf: 'flex-start', paddingVertical: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 9 },
  externalArrow: { transform: [{ rotate: '45deg' }] },
  learnLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  learnTitle: { color: colors.secondary, fontSize: 12, marginTop: 5 },
  relatedSection: { marginTop: 34 },
  relatedHeading: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  relatedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  relatedThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: colors.card },
  relatedTitle: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 19 },
  relatedMeta: { color: colors.tertiary, fontSize: 10, marginTop: 5 },
  articleBrand: { color: colors.secondary, fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  articleTitle: { color: '#fff', fontSize: 30, lineHeight: 35, fontWeight: '700', letterSpacing: -0.6, marginTop: 10 },
  articleLede: { color: 'rgba(255,255,255,.82)', fontSize: 18, lineHeight: 28, marginTop: 22, fontStyle: 'italic' },
  articleBody: { color: 'rgba(255,255,255,.78)', fontSize: 17, lineHeight: 28 },
});
