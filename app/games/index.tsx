import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { gameCatalog } from '@/lib/games';

const gameCardWidth = (Dimensions.get('window').width - 51) / 2;
const filters = ['All', 'Knowledge', 'Logic', 'Memory'];
const gameGroups = {
  Knowledge: ['trivia', 'map', 'guess-it', 'true-or-false'],
  Logic: ['odd-one-out', 'higher-or-lower', 'timeline'],
  Memory: ['match'],
} as const;

export default function GamesLibrary() {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const games = useMemo(() => gameCatalog.filter(game => {
    const matchesQuery = `${game.title} ${game.subtitle}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'All' || (gameGroups[filter as keyof typeof gameGroups] as readonly string[]).includes(game.id);
    return matchesQuery && matchesFilter;
  }), [query, filter]);
  return <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back" onPress={() => router.back()} hitSlop={10} style={styles.sideButton}><Ionicons name="chevron-back" size={25} color="#fff" /></Pressable>
      <View style={styles.searchBox}><Ionicons name="search-outline" size={17} color="rgba(255,255,255,.48)" /><TextInput value={query} onChangeText={setQuery} placeholder="Search games" placeholderTextColor="rgba(255,255,255,.4)" style={styles.searchInput} /></View>
      <Pressable accessibilityLabel="Filter" onPress={() => setFilterOpen(value => !value)} hitSlop={10} style={styles.sideButton}><Ionicons name="options-outline" size={22} color={filterOpen ? '#fff' : 'rgba(255,255,255,.65)'} /></Pressable>
    </View>
    {filterOpen && <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{filters.map(item => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</ScrollView>}
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Games</Text>
      <View style={styles.grid}>{games.map(game => <Pressable key={game.id} onPress={() => router.push(`/game/${game.id}`)} style={styles.card}>
        <Image source={game.poster} style={styles.cover} contentFit="cover" />
        {!game.posterHasTitle && <><View style={styles.shade} /><View style={styles.fade} /><View style={styles.copy}><Text style={styles.cardGenre}>{game.genre.toUpperCase()}</Text><Text style={styles.cardTitle}>{game.title}</Text><Text style={styles.cardSubtitle}>{game.subtitle}</Text></View></>}
      </Pressable>)}</View>{games.length === 0 && <Text style={styles.empty}>No games match your search.</Text>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' }, header: { height: 62, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 9 }, sideButton: { width: 32, height: 40, justifyContent: 'center', alignItems: 'center' }, searchBox: { flex: 1, height: 38, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,.14)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 8 }, searchInput: { flex: 1, height: 38, color: '#fff', fontSize: 13 },
  filters: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 }, filter: { height: 31, paddingHorizontal: 13, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,.14)', justifyContent: 'center' }, filterActive: { backgroundColor: '#fff' }, filterText: { color: 'rgba(255,255,255,.55)', fontSize: 11, fontWeight: '600' }, filterTextActive: { color: '#000' },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 70 }, title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }, card: { width: gameCardWidth, height: gameCardWidth / .67, borderRadius: 14, overflow: 'hidden', backgroundColor: '#111' }, cover: { ...StyleSheet.absoluteFillObject }, shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.08)' }, fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '43%', backgroundColor: 'rgba(0,0,0,.72)' },
  copy: { position: 'absolute', left: 13, right: 13, bottom: 14 }, cardGenre: { color: 'rgba(255,255,255,.58)', fontSize: 7, lineHeight: 9, fontWeight: '800', letterSpacing: 1.2 }, cardTitle: { color: '#fff', fontSize: 18, lineHeight: 21, fontWeight: '800', letterSpacing: -.3, marginTop: 4, textShadowColor: 'rgba(0,0,0,.9)', textShadowRadius: 6 }, cardSubtitle: { color: 'rgba(255,255,255,.66)', fontSize: 10, lineHeight: 13, marginTop: 4 }, empty: { color: 'rgba(255,255,255,.45)', fontSize: 13, textAlign: 'center', paddingVertical: 70 },
});
