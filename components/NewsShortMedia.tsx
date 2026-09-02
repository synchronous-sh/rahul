import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NewsShort } from '@/lib/newsShorts';

export function NewsShortMedia({ item, active }: { item: NewsShort; active: boolean }) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) { setElapsed(0); setPaused(false); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(zoom, { toValue: 1.08, duration: 9000, useNativeDriver: true }),
      Animated.timing(zoom, { toValue: 1, duration: 9000, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [active, zoom]);
  useEffect(() => {
    if (!active || paused) return;
    const timer = setInterval(() => setElapsed(value => value >= item.duration ? 0 : value + .25), 250);
    return () => clearInterval(timer);
  }, [active, paused, item.duration]);

  const progress = `${Math.min(100, elapsed / item.duration * 100)}%` as `${number}%`;
  return <View style={StyleSheet.absoluteFill}>
    <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: zoom }] }]}><Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} /></Animated.View>
    <View style={styles.gradient} />
    <Pressable accessibilityLabel={paused ? 'Resume news video' : 'Pause news video'} style={StyleSheet.absoluteFill} onPress={() => setPaused(value => !value)} />
    {paused && <View style={styles.pause} pointerEvents="none"><Text style={styles.play}>▶</Text></View>}
    <View style={styles.timeRow}><Text style={styles.time}>{format(elapsed)}</Text><Text style={styles.time}>-{format(item.duration - elapsed)}</Text></View>
    <View style={styles.track}><View style={[styles.fill, { width: progress }]} /></View>
  </View>;
}

const format = (value: number) => `0:${String(Math.max(0, Math.ceil(value))).padStart(2, '0')}`;
const styles = StyleSheet.create({
  gradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.22)' },
  pause: { position: 'absolute', alignSelf: 'center', top: '44%', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,.5)', alignItems: 'center', justifyContent: 'center' },
  play: { color: '#fff', fontSize: 28 },
  timeRow: { position: 'absolute', left: 12, right: 12, bottom: 78, flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: 'rgba(255,255,255,.72)', fontSize: 9, fontWeight: '600' },
  track: { position: 'absolute', left: 0, right: 0, bottom: 70, height: 2, backgroundColor: 'rgba(255,255,255,.3)' },
  fill: { height: 2, backgroundColor: '#fff' },
});
