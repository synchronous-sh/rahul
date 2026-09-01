import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/constants/theme";
import { PathId } from "@/data/courses";
import { paths } from "@/data/content";
import { goBack } from "@/lib/navigation";

const focusOptions: PathId[] = ["ai", "finance", "technology", "science", "history", "business"];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState<PathId>("ai");
  const [level, setLevel] = useState("Beginner");
  const cleanTitle = title.trim();

  const create = () => {
    if (!cleanTitle) return;
    router.replace({
      pathname: "/course/[id]",
      params: { id: focus, title: cleanTitle, level },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Close" onPress={() => goBack()} style={styles.navButton}>
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.navTitle}>Custom course</Text>
        <View style={styles.navButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>What do you want to learn?</Text>
        <Text style={styles.subtitle}>Create a focused course using one of Curious’s complete learning paths.</Text>

        <Text style={styles.label}>COURSE TITLE</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Understanding the stock market"
          placeholderTextColor={colors.tertiary}
          style={styles.input}
          returnKeyType="done"
        />

        <Text style={styles.label}>FOUNDATION</Text>
        <View style={styles.options}>
          {focusOptions.map((option) => {
            const selected = option === focus;
            return (
              <Pressable
                key={option}
                onPress={() => setFocus(option)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {paths[option].title}
                </Text>
                {selected && <Ionicons name="checkmark" size={17} color="#000" />}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>LEVEL</Text>
        <View style={styles.levels}>
          {levels.map((option) => {
            const selected = option === level;
            return (
              <Pressable
                key={option}
                onPress={() => setLevel(option)}
                style={[styles.level, selected && styles.levelSelected]}
              >
                <Text style={[styles.levelText, selected && styles.levelTextSelected]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!cleanTitle}
          onPress={create}
          style={({ pressed }) => [
            styles.create,
            !cleanTitle && styles.createDisabled,
            pressed && cleanTitle && { opacity: 0.78 },
          ]}
        >
          <Text style={styles.createText}>Create course</Text>
          <Ionicons name="arrow-forward" size={19} color="#000" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  nav: { height: 54, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.border },
  navButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  navTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  content: { padding: 20, paddingBottom: 50 },
  title: { color: "#fff", fontSize: 31, lineHeight: 36, fontWeight: "700", letterSpacing: -0.7, marginTop: 18 },
  subtitle: { color: colors.secondary, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 28 },
  label: { color: colors.secondary, fontSize: 10, fontWeight: "700", letterSpacing: 1.3, marginTop: 24, marginBottom: 10 },
  input: { height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 14, color: "#fff", backgroundColor: colors.card, paddingHorizontal: 16, fontSize: 15 },
  options: { borderTopWidth: 1, borderTopColor: colors.border },
  option: { minHeight: 52, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionSelected: { paddingHorizontal: 14, backgroundColor: "#fff", borderRadius: 12, borderBottomWidth: 0, marginVertical: 4 },
  optionText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  optionTextSelected: { color: "#000" },
  levels: { flexDirection: "row", gap: 8 },
  level: { flex: 1, height: 42, borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  levelSelected: { backgroundColor: "#fff" },
  levelText: { color: colors.secondary, fontSize: 12, fontWeight: "600" },
  levelTextSelected: { color: "#000" },
  create: { height: 56, borderRadius: 28, backgroundColor: "#fff", marginTop: 34, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" },
  createDisabled: { opacity: 0.35 },
  createText: { color: "#000", fontSize: 16, fontWeight: "700" },
});
