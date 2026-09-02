import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { colors } from '@/constants/theme';
import { askAI } from '@/lib/ai';

export type MorePanelAction = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function MorePanel({
  visible,
  onClose,
  edge,
  topOffset = 58,
  title,
  summary,
  actions,
}: {
  visible: boolean;
  onClose: () => void;
  edge: 'top' | 'bottom';
  /** Pixels to clear below the screen top (status bar + header) when edge is 'top'. */
  topOffset?: number;
  title: string;
  summary: string;
  actions: MorePanelAction[];
}) {
  const top = edge === 'top';
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const submitQuestion = async () => {
    const clean = question.trim(); if (!clean || asking) return;
    setAsking(true); setAnswer('');
    try { const result = await askAI(clean, `${title}\n${summary}`); setAnswer(result.answer); }
    catch (error) { setAnswer(error instanceof Error ? error.message : 'Could not answer right now.'); }
    finally { setAsking(false); }
  };
  return (
    <Modal visible={visible} transparent animationType={top ? 'fade' : 'slide'} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.wrap, top ? { justifyContent: 'flex-start' } : styles.wrapBottom]} pointerEvents="box-none">
        <View style={[styles.panel, top ? [styles.panelTop, { marginTop: topOffset }] : styles.panelBottom]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary}>{summary}</Text>
          <View style={styles.askRow}>
            <Ionicons name="sparkles-outline" size={16} color={colors.white} />
            <TextInput value={question} onChangeText={setQuestion} onSubmitEditing={submitQuestion} returnKeyType="send" placeholder="Ask AI anything…" placeholderTextColor={colors.tertiary} style={styles.askInput} />
            <Pressable onPress={submitQuestion} hitSlop={8}>{asking ? <ActivityIndicator size="small" color={colors.secondary} /> : <Ionicons name="arrow-up-circle" size={22} color={question.trim() ? colors.white : colors.tertiary} />}</Pressable>
          </View>
          {Boolean(answer) && <ScrollView style={styles.answerBox} nestedScrollEnabled><Text style={styles.answer}>{answer}</Text></ScrollView>}
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                style={styles.actionRow}
                onPress={() => {
                  action.onPress();
                  onClose();
                }}
              >
                <Ionicons name={action.icon} size={19} color={colors.white} />
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Ionicons name="chevron-forward" size={17} color={colors.tertiary} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.55)' },
  wrap: { flex: 1 },
  wrapBottom: { justifyContent: 'flex-end' },
  panel: { backgroundColor: colors.elevated, paddingHorizontal: 20, paddingTop: 14 },
  panelTop: {
    marginHorizontal: 10,
    borderRadius: 20,
    paddingBottom: 10,
  },
  panelBottom: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { color: colors.white, fontSize: 17, fontWeight: '700', marginBottom: 8 },
  summary: { color: colors.secondary, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  askRow: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    marginBottom: 6,
  },
  askInput: { flex: 1, color: colors.white, fontSize: 14, paddingVertical: 0 },
  answerBox: { maxHeight: 160, marginTop: 7, marginBottom: 8, borderLeftWidth: 2, borderLeftColor: '#fff', paddingLeft: 12 },
  answer: { color: colors.secondary, fontSize: 13, lineHeight: 19 },
  actions: { marginTop: 10 },
  actionRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actionLabel: { flex: 1, color: colors.white, fontSize: 15 },
});
