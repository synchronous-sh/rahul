import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { stories } from '@/data/content';

const categories = ['Live', 'For You', 'US', 'World', 'Business', 'Markets', 'Technology', 'Science'];

export default function News() {
  const [category, setCategory] = useState('For You');
  const visible = category === 'For You' ? stories : category === 'Live' ? stories.slice(0, 8) : stories.filter(x => x.category === category);
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
      {categories.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={styles.categoryButton}>{item === 'Live' && <View style={styles.liveDot} />}<Text style={[styles.category, category === item && styles.categoryActive]}>{item}</Text></Pressable>)}
    </ScrollView>
    {visible.map((story, i) => <Pressable key={story.id} style={styles.story} onPress={() => router.push(`/story/${story.id}`)}><Image source={story.image} style={[styles.image, i > 0 && { height: 190 }]} contentFit="cover" /><Text style={styles.kicker}>{story.category}</Text><Text style={styles.headline}>{story.title}</Text><Text style={styles.dek}>{story.dek}</Text><Text style={styles.meta}>{story.source}  ·  {story.time}</Text><Text style={styles.understand}>Understand this  →</Text></Pressable>)}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#000' }, content: { paddingHorizontal: 20, paddingBottom: 110 }, categories: { gap: 23, paddingTop: 7, paddingBottom: 22 }, categoryButton: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 6 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF453A' }, category: { color: colors.tertiary, fontSize: 14, fontWeight: '600' }, categoryActive: { color: '#fff' }, story: { paddingBottom: 30, marginBottom: 30, borderBottomWidth: 1, borderBottomColor: colors.border }, image: { height: 255, width: '100%', borderRadius: 4, backgroundColor: colors.card }, kicker: { color: colors.secondary, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700', marginTop: 16 }, headline: { color: '#fff', fontSize: 25, lineHeight: 29, fontWeight: '700', letterSpacing: -.4, marginTop: 7 }, dek: { color: 'rgba(255,255,255,.72)', fontSize: 16, lineHeight: 23, marginTop: 8 }, meta: { color: colors.tertiary, fontSize: 12, marginTop: 12 }, understand: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 18 } });
