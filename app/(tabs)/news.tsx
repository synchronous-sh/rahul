import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { fetchNews, type NewsStory } from '@/lib/news';

const categories = ['For You', 'U.S.', 'World', 'History', 'Business', 'Technology', 'Science', 'Entertainment', 'Lifestyle', 'Food', 'Sports'];

export default function News() {
  const [category, setCategory] = useState('For You');
  const [visible, setVisible] = useState<NewsStory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async (force = false) => { setRefreshing(force); setFailed(false); try { const next = await fetchNews(category, force); setVisible(next); setFailed(next.length === 0); } catch { setVisible([]); setFailed(true); } finally { setLoading(false); setRefreshing(false); } };
  useEffect(() => { setVisible([]); setLoading(true); load(); }, [category]);
  return <SafeAreaView style={styles.screen}><ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#fff" />} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
      {categories.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={styles.categoryButton}><Text style={[styles.category, category === item && styles.categoryActive]}>{item}</Text></Pressable>)}
    </ScrollView>
    {loading && <ActivityIndicator color="#fff" style={styles.loader} />}
    {!loading && failed && <Text style={styles.empty}>Live articles are temporarily unavailable. Pull down to retry.</Text>}
    {!loading && visible[0] && (
      <Pressable style={styles.hero} onPress={() => router.push(`/story/${visible[0].id}`)}>
        <Image source={visible[0].image} style={styles.heroImage} contentFit="cover" />
        <View style={styles.heroShade} />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle} numberOfLines={2}>{visible[0].title}</Text>
          <Text style={styles.heroMeta}>{visible[0].source.split(' · ')[0]}  ·  {visible[0].time}</Text>
          <View style={styles.readButton}><Text style={styles.readButtonText}>Read</Text></View>
        </View>
      </Pressable>
    )}
    {!loading && visible.length > 1 && <Text style={styles.sectionTitle}>Top Stories</Text>}
    {visible.slice(1).map((story) => (
      <Pressable key={story.id} style={styles.story} onPress={() => router.push(`/story/${story.id}`)}>
        <Image source={story.image} style={styles.image} contentFit="cover" />
        <View style={styles.storyCopy}>
          <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">{story.title}</Text>
          <Text style={styles.meta}>{story.source.split(' · ')[0]}  ·  {story.time}</Text>
        </View>
      </Pressable>
    ))}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#000' }, content: { paddingHorizontal: 20, paddingBottom: 110 }, loader: { marginBottom: 20 }, empty: { color: colors.secondary, fontSize: 14, lineHeight: 21, paddingVertical: 40, textAlign: 'center' }, categories: { gap: 23, paddingTop: 7, paddingBottom: 22 }, categoryButton: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 6 }, category: { color: colors.tertiary, fontSize: 14, fontWeight: '600' }, categoryActive: { color: '#fff' }, hero: { height: 248, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.card, marginBottom: 24 }, heroImage: { ...StyleSheet.absoluteFillObject }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.38)' }, heroCopy: { position: 'absolute', left: 18, right: 18, bottom: 17, alignItems: 'flex-start' }, heroTitle: { color: '#fff', fontSize: 18, lineHeight: 22, fontWeight: '700', letterSpacing: -.25 }, heroMeta: { color: 'rgba(255,255,255,.62)', fontSize: 9, marginTop: 6 }, readButton: { minWidth: 66, height: 32, paddingHorizontal: 18, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: 11 }, readButtonText: { color: '#000', fontSize: 12, fontWeight: '700' }, sectionTitle: { color: '#fff', fontSize: 19, lineHeight: 24, fontWeight: '700', marginBottom: 5 }, story: { minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 9 }, storyCopy: { flex: 1, justifyContent: 'center' }, image: { width: 86, height: 64, borderRadius: 8, backgroundColor: colors.card }, headline: { color: '#fff', fontSize: 13, lineHeight: 17, fontWeight: '600' }, meta: { color: colors.tertiary, fontSize: 9, marginTop: 5 } });
