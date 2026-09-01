import { useEvent } from 'expo';
import { Image, ImageSource } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '@/constants/theme';

export function FeedMedia({ image, video, active }: { image: ImageSource; video?: string; active: boolean }) {
  const player = useVideoPlayer(video ?? null, (instance) => { instance.loop = true; instance.muted = false; });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const failed = Boolean(video) && status === 'error';
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(video ? 1 : 24);
  useEffect(() => { if (!video || failed) return; if (active) player.play(); else player.pause(); }, [active, player, video, failed]);
  useEffect(() => {
    if (!active || failed) return;
    const timer = setInterval(() => {
      if (video) {
        const nextDuration = Number(player.duration) || 1;
        setDuration(nextDuration);
        setCurrent(Number(player.currentTime) || 0);
      } else {
        setCurrent((value) => (value + 0.25) % 24);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [active, player, video, failed]);
  const progress = Math.min(100, Math.max(0, (current / duration) * 100));
  const remaining = Math.max(0, Math.ceil(duration - current));
  return <View style={StyleSheet.absoluteFill}>
    {video && !failed
      ? <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      : <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} cachePolicy="memory-disk" />}
    {failed && <View style={styles.unavailable} pointerEvents="none">
      <Ionicons name="cloud-offline-outline" size={22} color={colors.secondary} />
      <Text style={styles.unavailableText}>Video unavailable</Text>
    </View>}
    {!failed && <View style={styles.timeRow}>
      <Text style={styles.timeText}>{formatTime(current)}</Text>
      <Text style={styles.timeText}>-{formatTime(remaining)}</Text>
    </View>}
    {!failed && <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>}
  </View>;
}

function formatTime(value: number) {
  const total = Math.max(0, Math.floor(value));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  unavailable: { position: 'absolute', left: 0, right: 0, bottom: 78, alignItems: 'center', gap: 6 },
  unavailableText: { color: colors.secondary, fontSize: 12, fontWeight: '600' },
  timeRow: { position: 'absolute', left: 12, right: 12, bottom: 78, flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: 'rgba(255,255,255,.64)', fontSize: 9, fontWeight: '600', textShadowColor: '#000', textShadowRadius: 3 },
  track: { position: 'absolute', left: 0, right: 0, bottom: 70, height: 2, backgroundColor: 'rgba(255,255,255,.25)' },
  fill: { height: 2, backgroundColor: '#fff' },
});
