import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/theme';
import { feed } from '@/data/content';

export function CommentsPanel({
  visible,
  onClose,
  itemId,
  topOffset = 58,
}: {
  visible: boolean;
  onClose: () => void;
  itemId: string;
  /** Pixels to clear below the screen top (status bar + header). */
  topOffset?: number;
}) {
  const post = feed.find((item) => item.id === itemId) ?? feed[0];
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: 'Maya', body: 'The practical example made this click for me.' },
  ]);
  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    setComments((v) => [...v, { id: String(Date.now()), author: 'Rahul', body }]);
    setDraft('');
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        style={styles.wrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View style={[styles.panel, { marginTop: topOffset }]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Comments</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            <Text style={styles.postTitle}>{post.title}</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{comment.author[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.author}>{comment.author}</Text>
                  <Text style={styles.body}>{comment.body}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Add a thoughtful comment"
              placeholderTextColor={colors.secondary}
              style={styles.input}
            />
            <Pressable
              accessibilityLabel="Post comment"
              disabled={!draft.trim()}
              onPress={submit}
              style={[styles.send, !draft.trim() && { opacity: 0.35 }]}
            >
              <Ionicons name="arrow-up" size={18} color="#000" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.55)' },
  wrap: { flex: 1, justifyContent: 'flex-start' },
  panel: {
    marginHorizontal: 10,
    maxHeight: '68%',
    backgroundColor: colors.elevated,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { color: colors.white, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  list: { marginBottom: 10 },
  postTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  comment: { flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.black, fontWeight: '700', fontSize: 13 },
  author: { color: colors.white, fontSize: 13, fontWeight: '600' },
  body: { color: 'rgba(255,255,255,.76)', fontSize: 13.5, lineHeight: 19, marginTop: 3 },
  composer: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, height: 42, borderRadius: 21, backgroundColor: colors.card, color: colors.white, paddingHorizontal: 15, fontSize: 14 },
  send: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
