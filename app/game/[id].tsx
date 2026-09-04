import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { gameCatalog, type GameId } from '@/lib/games';

const gameDetails: Record<GameId, { description: string; rules: string[]; detail: string }> = {
  trivia: { description: 'Put your general knowledge to the test across science, history, culture, and ideas.', rules: ['Choose one answer for each question', 'Learn from the explanation after every turn', 'Finish five questions and beat your score'], detail: '5 questions · Single player' },
  map: { description: 'Travel the world through geography challenges about countries, cities, rivers, and landmarks.', rules: ['Read the location clue', 'Choose the correct place', 'Complete all five destinations'], detail: '5 destinations · Single player' },
  'odd-one-out': { description: 'Find the one answer that breaks the pattern and sharpen your categorical reasoning.', rules: ['Compare all four choices', 'Tap the item that does not belong', 'Use each explanation to discover the pattern'], detail: '5 puzzles · Single player' },
  'higher-or-lower': { description: 'Compare real facts, dates, measurements, and populations in a quick decision game.', rules: ['Study the two values', 'Choose the higher, larger, faster, or earlier fact', 'Build the strongest score over five rounds'], detail: '5 comparisons · Single player' },
  'guess-it': { description: 'Decode concise clues and identify the hidden object, idea, or scientific concept.', rules: ['Read each clue carefully', 'Choose the answer it describes', 'Reveal the reasoning after your guess'], detail: '5 mysteries · Single player' },
  timeline: { description: 'Reconstruct history by arranging landmark events from the ancient world to the digital age.', rules: ['Start with the oldest event', 'Continue tapping in chronological order', 'Finish with as few mistakes as possible'], detail: '5 events · Single player' },
  'true-or-false': { description: 'Separate reliable facts from familiar myths across science, history, and everyday life.', rules: ['Read the statement', 'Decide whether it is true or false', 'Review the evidence after every answer'], detail: '5 statements · Single player' },
  match: { description: 'Exercise your memory by pairing connected subjects and categories before your moves run up.', rules: ['Turn over two cards at a time', 'Remember their positions', 'Match all four related pairs'], detail: '8 cards · Single player' },
};

export default function GamePreview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = gameCatalog.find(item => item.id === id) ?? gameCatalog[0];
  const details = gameDetails[game.id];
  return <SafeAreaView style={styles.screen}>
    <View style={styles.nav}><Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}><Ionicons name="chevron-back" size={27} color="#fff" /></Pressable><View style={{ width: 27 }} /></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, game.posterHasTitle ? styles.titledHero : styles.untitledHero]}><Image source={game.poster} style={styles.cover} contentFit="cover" />{!game.posterHasTitle && <><View style={styles.shade} /><View style={styles.fade} /><View style={styles.heroCopy}><Text style={styles.genre}>{game.genre.toUpperCase()}</Text><Text style={styles.title}>{game.title}</Text><Text style={styles.heroDetail}>{details.detail}</Text></View></>}</View>
      <Text style={styles.description}>{details.description}</Text>
      <Text style={styles.heading}>How to play</Text>
      <View style={styles.rules}>{details.rules.map((rule, index) => <View key={rule} style={styles.rule}><View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>{index + 1}</Text></View><Text style={styles.ruleText}>{rule}</Text></View>)}</View>
      <Pressable accessibilityRole="button" onPress={() => router.push(`/play/${game.id}`)} style={({ pressed }) => [styles.playButton, pressed && { opacity: .8 }]}><Ionicons name="play" size={18} color="#000" /><Text style={styles.playText}>Play</Text></Pressable>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' }, nav: { height: 54, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, navTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 60 }, hero: { borderRadius: 18, overflow: 'hidden', backgroundColor: '#111' }, untitledHero: { height: 390 }, titledHero: { aspectRatio: 220 / 324 }, cover: { ...StyleSheet.absoluteFillObject }, shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.08)' }, fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', backgroundColor: 'rgba(0,0,0,.74)' }, heroCopy: { position: 'absolute', left: 18, right: 18, bottom: 19 },
  genre: { color: 'rgba(255,255,255,.62)', fontSize: 9, lineHeight: 11, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#fff', fontSize: 31, lineHeight: 35, fontWeight: '800', letterSpacing: -.6, marginTop: 5, textShadowColor: 'rgba(0,0,0,.9)', textShadowRadius: 8 }, heroDetail: { color: 'rgba(255,255,255,.63)', fontSize: 11, marginTop: 6 },
  description: { color: 'rgba(255,255,255,.72)', fontSize: 16, lineHeight: 24, marginTop: 24 }, heading: { color: '#fff', fontSize: 19, fontWeight: '700', marginTop: 30, marginBottom: 8 }, rules: { gap: 2 }, rule: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 13 }, ruleNumber: { width: 29, height: 29, borderRadius: 15, backgroundColor: 'rgba(255,255,255,.09)', alignItems: 'center', justifyContent: 'center' }, ruleNumberText: { color: '#fff', fontSize: 11, fontWeight: '700' }, ruleText: { flex: 1, color: 'rgba(255,255,255,.68)', fontSize: 14, lineHeight: 20 },
  playButton: { height: 54, borderRadius: 27, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 28 }, playText: { color: '#000', fontSize: 15, fontWeight: '800' },
});
