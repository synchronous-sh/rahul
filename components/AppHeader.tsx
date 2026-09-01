import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BrandMark } from "@/components/BrandMark";
import { colors } from "@/constants/theme";

type Panel = "search" | "notifications" | "messages" | "menu";

export function AppHeader({ overlay = false }: { overlay?: boolean }) {
  const [panel, setPanel] = useState<Panel | null>(null);

  const toggle = (next: Panel) => {
    Haptics.selectionAsync().catch(() => undefined);
    setPanel((current) => current === next ? null : next);
  };

  return (
    <View style={[styles.header, overlay && styles.overlay]} pointerEvents="box-none">
      <View style={styles.brand}><BrandMark size={34} /></View>
      <View style={styles.actions}>
        <HeaderButton label="Search" icon="search-outline" active={panel === "search"} onPress={() => toggle("search")} />
        <HeaderButton label="Notifications" icon="notifications-outline" active={panel === "notifications"} onPress={() => toggle("notifications")} />
        <HeaderButton label="Messages" icon="paper-plane-outline" active={panel === "messages"} onPress={() => toggle("messages")} />
        <HeaderButton label="Menu" icon="reorder-two-outline" active={panel === "menu"} onPress={() => toggle("menu")} large />
      </View>
      {panel && <HeaderOverlay panel={panel} setPanel={setPanel} />}
    </View>
  );
}

function HeaderOverlay({ panel, setPanel }: { panel: Panel; setPanel: (panel: Panel | null) => void }) {
  return (
    <Modal visible animationType="fade" presentationStyle="overFullScreen" statusBarTranslucent onRequestClose={() => setPanel(null)}>
      <View style={styles.modalScreen}>
        <View style={styles.modalNav}>
          <View style={styles.brand}><BrandMark size={34} /></View>
          <View style={styles.actions}>
            <HeaderButton label="Search" icon="search-outline" active={panel === "search"} onPress={() => setPanel(panel === "search" ? null : "search")} />
            <HeaderButton label="Notifications" icon="notifications-outline" active={panel === "notifications"} onPress={() => setPanel(panel === "notifications" ? null : "notifications")} />
            <HeaderButton label="Messages" icon="paper-plane-outline" active={panel === "messages"} onPress={() => setPanel(panel === "messages" ? null : "messages")} />
            <HeaderButton label="Menu" icon="reorder-two-outline" active={panel === "menu"} onPress={() => setPanel(panel === "menu" ? null : "menu")} large />
          </View>
        </View>
        <HeaderPanel panel={panel} onClose={() => setPanel(null)} />
      </View>
    </Modal>
  );
}

function HeaderButton({ label, icon, active, onPress, large = false }: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
  large?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: active }}
      hitSlop={8}
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Ionicons name={active && label !== "Menu" ? ("close-outline" as const) : icon} size={large ? 27 : 23} color="#fff" />
    </Pressable>
  );
}

function HeaderPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelTop}>
        <Text style={styles.panelTitle}>{panel === "menu" ? "Menu" : panel[0].toUpperCase() + panel.slice(1)}</Text>
        <Pressable accessibilityLabel="Close" hitSlop={10} onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={23} color="#fff" />
        </Pressable>
      </View>
      {panel === "search" && <SearchPanel onClose={onClose} />}
      {panel === "notifications" && <NotificationsPanel />}
      {panel === "messages" && <MessagesPanel />}
      {panel === "menu" && <MenuPanel onClose={onClose} />}
    </View>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const suggestions = [
    { label: "Artificial intelligence", route: "/course/ai" },
    { label: "Finance", route: "/course/finance" },
    { label: "World history", route: "/course/history" },
    { label: "Science", route: "/course/science" },
    { label: "Psychology", route: "/course/psychology" },
  ];
  return (
    <View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={19} color={colors.secondary} />
        <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Search courses, videos, and news" placeholderTextColor={colors.tertiary} style={styles.searchInput} />
        {query.length > 0 && <Pressable onPress={() => setQuery("")}><Ionicons name="close-circle" size={18} color={colors.secondary} /></Pressable>}
      </View>
      <Text style={styles.eyebrow}>{query ? "RESULTS" : "SUGGESTED"}</Text>
      {suggestions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).map((item) => (
        <Pressable key={item.label} onPress={() => { onClose(); router.push(item.route as never); }} style={styles.row}>
          <Ionicons name="search-outline" size={18} color="#fff" />
          <Text style={styles.rowTitle}>{item.label}</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.tertiary} />
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

function MenuPanel({ onClose }: { onClose: () => void }) {
  const items: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; route: string }[] = [
    { icon: "bookmark-outline", label: "Saved", route: "/settings/saved" },
    { icon: "time-outline", label: "History", route: "/settings/history" },
    { icon: "options-outline", label: "Interests", route: "/settings/interests" },
    { icon: "settings-outline", label: "Settings", route: "/(tabs)/you" },
    { icon: "help-circle-outline", label: "Help and support", route: "/settings/support" },
  ];
  return <View>{items.map((item) => <Pressable key={item.label} onPress={() => { onClose(); router.push(item.route as never); }} style={styles.row}><Ionicons name={item.icon} size={20} color="#fff" /><Text style={styles.rowTitle}>{item.label}</Text><Ionicons name="chevron-forward" size={17} color={colors.tertiary} /></Pressable>)}</View>;
}

function PanelRow({ icon, title, detail }: { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string; detail: string }) {
  return <Pressable style={styles.row}><View style={styles.rowIcon}><Ionicons name={icon} size={18} color="#fff" /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View><View style={styles.unread} /></Pressable>;
}

const styles = StyleSheet.create({
  header: { height: 96, paddingTop: 42, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#000", zIndex: 100 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "transparent" },
  brand: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  actions: { flexDirection: "row", alignItems: "center", gap: 5 },
  button: { width: 37, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  buttonActive: { backgroundColor: "#1a1a1a" },
  modalScreen: { flex: 1, backgroundColor: "#000" },
  modalNav: { height: 96, paddingTop: 42, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#000" },
  panel: { flex: 1, backgroundColor: "#000", borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 15 },
  panelTop: { height: 45, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  closeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  searchBox: { height: 48, borderRadius: 13, backgroundColor: "#111", borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, marginTop: 8 },
  searchInput: { color: "#fff", fontSize: 14, flex: 1, height: 48 },
  eyebrow: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 1.5, marginTop: 25, marginBottom: 8 },
  row: { minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", gap: 13 },
  rowIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#111", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1 },
  rowTitle: { color: "#fff", fontSize: 14, fontWeight: "600", flex: 1 },
  rowDetail: { color: colors.secondary, fontSize: 11, marginTop: 4 },
  unread: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 80 },
  emptyTitle: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 19 },
  emptyCopy: { color: colors.secondary, fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 270, alignSelf: "center", marginTop: 8 },
  primaryAction: { height: 46, borderRadius: 23, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", alignSelf: "center", paddingHorizontal: 21, marginTop: 23 },
  primaryActionText: { color: "#000", fontSize: 13, fontWeight: "700" },
});
