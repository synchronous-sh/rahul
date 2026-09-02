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
    {visible.map((story, i) => <Pressable key={story.id} style={styles.story} onPress={() => router.push(`/story/${story.id}`)}><Image source={story.image} style={[styles.image, i > 0 && { height: 190 }]} contentFit="cover" /><Text style={styles.kicker}>{story.category}</Text><Text style={styles.headline}>{story.title}</Text><Text style={styles.dek}>{story.dek}</Text><Text style={styles.meta}>{story.source}  ·  {story.time}</Text><Text style={styles.understand}>Understand this  →</Text></Pressable>)}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#000' }, content: { paddingHorizontal: 20, paddingBottom: 110 }, loader: { marginBottom: 20 }, empty: { color: colors.secondary, fontSize: 14, lineHeight: 21, paddingVertical: 40, textAlign: 'center' }, categories: { gap: 23, paddingTop: 7, paddingBottom: 22 }, categoryButton: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 6 }, category: { color: colors.tertiary, fontSize: 14, fontWeight: '600' }, categoryActive: { color: '#fff' }, story: { paddingBottom: 30, marginBottom: 30, borderBottomWidth: 1, borderBottomColor: colors.border }, image: { height: 255, width: '100%', borderRadius: 4, backgroundColor: colors.card }, kicker: { color: colors.secondary, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700', marginTop: 16 }, headline: { color: '#fff', fontSize: 25, lineHeight: 29, fontWeight: '700', letterSpacing: -.4, marginTop: 7 }, dek: { color: 'rgba(255,255,255,.72)', fontSize: 16, lineHeight: 23, marginTop: 8 }, meta: { color: colors.tertiary, fontSize: 12, marginTop: 12 }, understand: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 18 } });
