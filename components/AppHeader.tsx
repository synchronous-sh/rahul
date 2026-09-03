import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BrandMark } from "@/components/BrandMark";
import { colors } from "@/constants/theme";

type Panel = "search" | "inbox";

export function AppHeader({ overlay = false }: { overlay?: boolean }) {
  const [panel, setPanel] = useState<Panel | null>(null);

  const toggle = (next: Panel) => {
    Haptics.selectionAsync().catch(() => undefined);
    setPanel((current) => current === next ? null : next);
  };

  return (
    <View style={[styles.header, overlay && styles.overlay]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go to Home"
        hitSlop={10}
        onPress={() => {
          Haptics.selectionAsync().catch(() => undefined);
          setPanel(null);
          router.replace("/(tabs)/explore");
        }}
        style={styles.brand}
      >
        <BrandMark size={34} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Search" onPress={() => toggle("search")} style={styles.headerSearch}><Ionicons name="search-outline" size={17} color="rgba(255,255,255,.5)" /><Text style={styles.headerSearchText}>Search</Text></Pressable>
      <InboxButton active={panel === "inbox"} onPress={() => toggle("inbox")} />
      {panel && <HeaderOverlay panel={panel} setPanel={setPanel} />}
    </View>
  );
}

function HeaderOverlay({ panel, setPanel }: { panel: Panel; setPanel: (panel: Panel | null) => void }) {
  const [query, setQuery] = useState("");
  return (
    <Modal visible animationType="fade" presentationStyle="overFullScreen" statusBarTranslucent onRequestClose={() => setPanel(null)}>
      <View style={styles.modalScreen}>
        <View style={styles.modalNav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} onPress={() => setPanel(null)} style={styles.modalBack}><Ionicons name="chevron-back" size={25} color="#fff" /></Pressable>
          <View style={styles.modalSearch}>
            <Ionicons name="search-outline" size={17} color="rgba(255,255,255,.5)" />
            <TextInput autoFocus={panel === 'search'} value={query} onChangeText={setQuery} onFocus={() => setPanel('search')} placeholder="Search" placeholderTextColor="rgba(255,255,255,.42)" style={styles.modalSearchInput} />
            {query.length > 0 && <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={17} color={colors.secondary} /></Pressable>}
          </View>
          {panel === 'inbox' && <Pressable accessibilityRole="button" accessibilityLabel="New message" hitSlop={10} onPress={() => Alert.alert('New message', 'Choose a person to start a conversation.')} style={styles.compose}><Ionicons name="create-outline" size={22} color="rgba(255,255,255,.7)" /></Pressable>}
        </View>
        <HeaderPanel panel={panel} query={query} onClose={() => setPanel(null)} />
      </View>
    </Modal>
  );
}

function InboxButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const unreadCount = 3;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Inbox, ${unreadCount} unread`}
      accessibilityState={{ expanded: active }}
      hitSlop={8}
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Ionicons name={active ? "close-outline" : "mail-outline"} size={24} color="rgba(255,255,255,.64)" />
      {!active && unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
    </Pressable>
  );
}

function HeaderPanel({ panel, query, onClose }: { panel: Panel; query: string; onClose: () => void }) {
  const [inboxTab, setInboxTab] = useState<'notifications' | 'messages' | 'channels'>('notifications');
  return (
    <View style={[styles.panel, panel === "search" && styles.searchPanel]}>
      {panel === "search" && <SearchPanel query={query} onClose={onClose} />}
      {panel === "inbox" && <>
        <View style={styles.inboxTabs}>
          {(['notifications', 'messages', 'channels'] as const).map(tab => <Pressable key={tab} onPress={() => setInboxTab(tab)} style={styles.inboxTab}><Text style={[styles.inboxTabText, inboxTab === tab && styles.inboxTabTextActive]}>{tab[0].toUpperCase() + tab.slice(1)}</Text></Pressable>)}
        </View>
        {inboxTab === 'notifications' ? <NotificationsPanel /> : inboxTab === 'messages' ? <MessagesPanel /> : <ChannelsPanel />}
      </>}
    </View>
  );
}

function SearchPanel({ query, onClose }: { query: string; onClose: () => void }) {
  const suggestions = [
    { label: "Artificial intelligence", route: "/course/ai" },
    { label: "Finance", route: "/course/finance" },
    { label: "World history", route: "/course/history" },
    { label: "Science", route: "/course/science" },
    { label: "Psychology", route: "/course/psychology" },
  ];
  return (
    <View>
      <Text style={styles.eyebrow}>{query ? "RESULTS" : "RECENTLY SEARCHED"}</Text>
      {suggestions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).map((item) => (
        <Pressable key={item.label} onPress={() => { onClose(); router.push(item.route as never); }} style={styles.searchRow}>
          <Text style={styles.rowTitle}>{item.label}</Text>
          <Ionicons name="arrow-up-outline" size={16} color="rgba(255,255,255,.56)" style={{ transform: [{ rotate: '45deg' }] }} />
        </Pressable>
      ))}
    </View>
  );
}

function NotificationsPanel() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>TODAY</Text>
      <PanelRow icon="book-outline" title="Your next Finance lesson is ready" detail="Continue with Banks · 12 min" />
      <PanelRow icon="flame-outline" title="Keep your 14 day streak" detail="Learn for 8 more minutes today" />
      <PanelRow icon="newspaper-outline" title="A new technology brief was added" detail="Memory becomes the next AI bottleneck" />
      <Text style={styles.eyebrow}>EARLIER</Text>
      <PanelRow icon="bookmark-outline" title="Saved for later" detail="Three ideas are waiting in your library" />
    </ScrollView>
  );
}

function MessagesPanel() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.emptyIcon}><Ionicons name="paper-plane-outline" size={25} color="#fff" /></View>
      <Text style={styles.emptyTitle}>Your messages</Text>
      <Text style={styles.emptyCopy}>Questions, replies, and shared ideas will appear here.</Text>
      <Pressable style={styles.primaryAction}><Text style={styles.primaryActionText}>Start a conversation</Text></Pressable>
    </ScrollView>
  );
}

function ChannelsPanel() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.emptyIcon}><Ionicons name="people-outline" size={25} color="#fff" /></View>
      <Text style={styles.emptyTitle}>Your channels</Text>
      <Text style={styles.emptyCopy}>Course channels and shared discussions will appear here.</Text>
      <Pressable style={styles.primaryAction}><Text style={styles.primaryActionText}>Create a channel</Text></Pressable>
    </ScrollView>
  );
}

function PanelRow({ icon, title, detail }: { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string; detail: string }) {
  return <Pressable style={styles.row}><View style={styles.rowIcon}><Ionicons name={icon} size={18} color="#fff" /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View><View style={styles.unread} /></Pressable>;
}

const styles = StyleSheet.create({
  header: { height: 96, paddingTop: 42, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#000", zIndex: 100 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "transparent" },
  brand: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerSearch: { flex: 1, height: 34, marginHorizontal: 14, borderRadius: 17, backgroundColor: "transparent", borderWidth: 1, borderColor: "rgba(255,255,255,.12)", flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 12 },
  headerSearchText: { color: "rgba(255,255,255,.45)", fontSize: 12 },
  button: { width: 37, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  buttonActive: { backgroundColor: "#1a1a1a" },
  badge: { position: "absolute", top: 4, right: 2, minWidth: 14, height: 14, paddingHorizontal: 3, borderRadius: 7, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#000", fontSize: 8, fontWeight: "800" },
  modalScreen: { flex: 1, backgroundColor: "#000" },
  modalNav: { height: 96, paddingTop: 42, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#000" },
  modalBack: { width: 32, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  modalSearch: { flex: 1, height: 36, marginLeft: 7, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,.14)', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12 },
  modalSearchInput: { flex: 1, height: 36, color: '#fff', fontSize: 13 },
  compose: { width: 37, height: 40, marginLeft: 7, alignItems: 'flex-end', justifyContent: 'center' },
  panel: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 15 },
  searchPanel: { borderTopWidth: 0 },
  panelTop: { height: 45, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  inboxTabs: { height: 52, flexDirection: 'row', alignItems: 'center', gap: 28, marginBottom: 12 },
  inboxTab: { height: 48, justifyContent: 'center' },
  inboxTabText: { color: 'rgba(255,255,255,.48)', fontSize: 14, fontWeight: '600' },
  inboxTabTextActive: { color: '#fff', fontWeight: '700' },
  closeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  searchBox: { height: 48, borderRadius: 13, backgroundColor: "#111", borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, marginTop: 8 },
  searchInput: { color: "#fff", fontSize: 14, flex: 1, height: 48 },
  eyebrow: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 1.5, marginTop: 25, marginBottom: 8 },
  row: { minHeight: 78, paddingVertical: 13, flexDirection: "row", alignItems: "center", gap: 14 },
  searchRow: { minHeight: 64, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#111", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, minWidth: 0, justifyContent: 'center' },
  rowTitle: { color: "#fff", fontSize: 14, lineHeight: 19, fontWeight: "600" },
  rowDetail: { color: colors.secondary, fontSize: 11, lineHeight: 16, marginTop: 5 },
  unread: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 80 },
  emptyTitle: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 19 },
  emptyCopy: { color: colors.secondary, fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 270, alignSelf: "center", marginTop: 8 },
  primaryAction: { height: 46, borderRadius: 23, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", alignSelf: "center", paddingHorizontal: 21, marginTop: 23 },
  primaryActionText: { color: "#000", fontSize: 13, fontWeight: "700" },
});
