import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/constants/theme";
import { goBack } from "@/lib/navigation";
import { createCustomCourse } from "@/lib/ai";

type Choice = { label: string; value: string; icon?: React.ComponentProps<typeof Ionicons>["name"] };
type ReferenceFile = { name: string; mimeType?: string; size?: number; uri: string };

const categories: Choice[] = [
  { label: "Artificial Intelligence", value: "ai", icon: "sparkles-outline" },
  { label: "Finance", value: "finance", icon: "trending-up-outline" },
  { label: "Technology", value: "technology", icon: "hardware-chip-outline" },
  { label: "Science", value: "science", icon: "flask-outline" },
  { label: "History", value: "history", icon: "library-outline" },
  { label: "Business", value: "business", icon: "briefcase-outline" },
  { label: "Other", value: "other", icon: "ellipsis-horizontal" },
];
const levelOptions: Choice[] = [
  { label: "Beginner", value: "Beginner", icon: "leaf-outline" },
  { label: "Intermediate", value: "Intermediate", icon: "layers-outline" },
  { label: "Advanced", value: "Advanced", icon: "rocket-outline" },
];
const styleOptions: Choice[] = [
  { label: "Visual", value: "Visual", icon: "images-outline" },
  { label: "Step by step", value: "Step by step", icon: "list-outline" },
  { label: "Practical examples", value: "Practical examples", icon: "construct-outline" },
  { label: "Story based", value: "Story based", icon: "book-outline" },
  { label: "Mixed", value: "Mixed", icon: "shuffle-outline" },
];
const paceOptions: Choice[] = [
  { label: "10 minutes", value: "10 minutes" },
  { label: "15–20 minutes", value: "15–20 minutes" },
  { label: "30 minutes", value: "30 minutes" },
];
const goalOptions: Choice[] = [
  { label: "Understand the fundamentals", value: "Fundamentals" },
  { label: "Build a practical skill", value: "Practical skill" },
  { label: "Prepare for work or school", value: "Preparation" },
  { label: "Explore out of curiosity", value: "Curiosity" },
];

function SelectField({ label, value, options, open, onToggle, onSelect }: {
  label: string;
  value: string;
  options: Choice[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value) ?? options[0];
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onToggle} style={[styles.select, open && styles.selectOpen]}>
        <View style={styles.selectValue}>
          {selected.icon && <Ionicons name={selected.icon} size={18} color="rgba(255,255,255,.76)" />}
          <Text style={styles.selectText}>{selected.label}</Text>
        </View>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={17} color={colors.secondary} />
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {options.map((option) => {
            const active = option.value === value;
            return (
              <Pressable key={option.value} onPress={() => onSelect(option.value)} style={styles.dropdownRow}>
                <View style={styles.selectValue}>
                  {option.icon && <Ionicons name={option.icon} size={17} color={active ? "#fff" : colors.secondary} />}
                  <Text style={[styles.dropdownText, active && styles.dropdownTextActive]}>{option.label}</Text>
                </View>
                {active && <Ionicons name="checkmark" size={17} color="#fff" />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [references, setReferences] = useState<ReferenceFile[]>([]);
  const [category, setCategory] = useState("ai");
  const [level, setLevel] = useState("Beginner");
  const [learningStyle, setLearningStyle] = useState("Visual");
  const [pace, setPace] = useState("15–20 minutes");
  const [goal, setGoal] = useState("Fundamentals");
  const [openField, setOpenField] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const cleanTitle = title.trim();

  const addReferences = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "video/*", "application/pdf", "text/*", "application/*"],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    setReferences((current) => {
      const combined = [...current, ...result.assets.map(({ name, mimeType, size, uri }) => ({ name, mimeType: mimeType ?? undefined, size, uri }))];
      return combined.filter((file, index) => combined.findIndex((candidate) => candidate.uri === file.uri) === index).slice(0, 10);
    });
  };

  const selectProps = (field: string, value: string, setter: (value: string) => void, options: Choice[]) => ({
    value,
    options,
    open: openField === field,
    onToggle: () => setOpenField((current) => current === field ? null : field),
    onSelect: (next: string) => { setter(next); setOpenField(null); },
  });

  const create = async () => {
    if (!cleanTitle) return;
    if (description.trim().length < 12) { Alert.alert('Add a little more detail', 'Describe what you want this course to teach in at least 12 characters.'); return; }
    setCreating(true);
    try {
      const result = await createCustomCourse({ title: cleanTitle, description: description.trim(), category, difficulty: level, learningStyle, lessonLength: pace, goal, references: references.map(({ name, mimeType, size }) => ({ name, mimeType, size })) });
      router.replace({ pathname: '/generated-course/[id]', params: { id: result.course.id } });
    } catch (error) { Alert.alert('Could not create course', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setCreating(false); }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Close" onPress={() => goBack()} style={styles.navButton}><Ionicons name="close" size={26} color="#fff" /></Pressable>
        <Text style={styles.navTitle}>Custom course</Text>
        <View style={styles.navButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Build your course</Text>
        <Text style={styles.subtitle}>Choose what you want to learn and how you learn best. We’ll shape the course around you.</Text>

        <Text style={styles.label}>COURSE TITLE</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Understanding the stock market" placeholderTextColor={colors.tertiary} style={styles.input} returnKeyType="done" />

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What should this course help you understand or accomplish?"
          placeholderTextColor={colors.tertiary}
          style={styles.descriptionInput}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.referencesHeader}>
          <View>
            <Text style={[styles.label, styles.referencesLabel]}>REFERENCES</Text>
            <Text style={styles.referencesHint}>Add images, videos, PDFs, documents, or other files.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Add reference files" hitSlop={8} onPress={addReferences} style={styles.addReference}>
            <Ionicons name="add" size={20} color="#000" />
            <Text style={styles.addReferenceText}>Add</Text>
          </Pressable>
        </View>
        {references.length > 0 && <View style={styles.referenceList}>
          {references.map((file) => <View key={file.uri} style={styles.referenceRow}>
            <Ionicons name={file.mimeType?.startsWith("image/") ? "image-outline" : file.mimeType?.startsWith("video/") ? "videocam-outline" : file.mimeType === "application/pdf" ? "document-text-outline" : "attach-outline"} size={19} color="rgba(255,255,255,.72)" />
            <View style={styles.referenceCopy}><Text numberOfLines={1} style={styles.referenceName}>{file.name}</Text><Text style={styles.referenceMeta}>{file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "Attached file"}</Text></View>
            <Pressable accessibilityLabel={`Remove ${file.name}`} hitSlop={8} onPress={() => setReferences((current) => current.filter((item) => item.uri !== file.uri))}><Ionicons name="close" size={19} color={colors.secondary} /></Pressable>
          </View>)}
        </View>}

        <SelectField label="CATEGORY" {...selectProps("category", category, setCategory, categories)} />
        {category === "other" && <TextInput placeholder="Enter a category" placeholderTextColor={colors.tertiary} style={[styles.input, styles.otherInput]} />}
        <SelectField label="COURSE DIFFICULTY" {...selectProps("level", level, setLevel, levelOptions)} />
        <SelectField label="LEARNING STYLE" {...selectProps("style", learningStyle, setLearningStyle, styleOptions)} />
        <SelectField label="LESSON LENGTH" {...selectProps("pace", pace, setPace, paceOptions)} />
        <SelectField label="YOUR GOAL" {...selectProps("goal", goal, setGoal, goalOptions)} />
        <Pressable accessibilityRole="button" disabled={!cleanTitle || creating} onPress={create} style={({ pressed }) => [styles.create, (!cleanTitle || creating) && styles.createDisabled, pressed && cleanTitle && { opacity: 0.78 }]}>
          {creating ? <><ActivityIndicator color="#000" /><Text style={styles.createText}>Building your course…</Text></> : <><Text style={styles.createText}>Create course</Text><Ionicons name="arrow-forward" size={19} color="#000" /></>}
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
  subtitle: { color: colors.secondary, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 17 },
  label: { color: colors.secondary, fontSize: 10, fontWeight: "700", letterSpacing: 1.3, marginTop: 22, marginBottom: 9 },
  input: { height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 13, color: "#fff", backgroundColor: colors.card, paddingHorizontal: 16, fontSize: 15 },
  descriptionInput: { minHeight: 104, borderWidth: 1, borderColor: colors.border, borderRadius: 13, color: "#fff", backgroundColor: colors.card, paddingHorizontal: 16, paddingTop: 15, paddingBottom: 15, fontSize: 14, lineHeight: 20 },
  referencesHeader: { marginTop: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  referencesLabel: { marginTop: 0, marginBottom: 5 },
  referencesHint: { color: colors.tertiary, fontSize: 12, lineHeight: 17, maxWidth: 265 },
  addReference: { minWidth: 68, height: 38, borderRadius: 19, paddingHorizontal: 12, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  addReferenceText: { color: "#000", fontSize: 13, fontWeight: "700" },
  referenceList: { marginTop: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 13, overflow: "hidden" },
  referenceRow: { minHeight: 58, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  referenceCopy: { flex: 1 },
  referenceName: { color: "rgba(255,255,255,.88)", fontSize: 13, fontWeight: "600" },
  referenceMeta: { color: colors.tertiary, fontSize: 10, marginTop: 3 },
  otherInput: { marginTop: 9 },
  fieldBlock: { position: "relative" },
  select: { minHeight: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 13, backgroundColor: colors.card, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: "rgba(255,255,255,.3)" },
  selectValue: { flexDirection: "row", alignItems: "center", gap: 11 },
  selectText: { color: "rgba(255,255,255,.88)", fontSize: 14, fontWeight: "600" },
  dropdown: { borderWidth: 1, borderTopWidth: 0, borderColor: "rgba(255,255,255,.3)", borderBottomLeftRadius: 13, borderBottomRightRadius: 13, backgroundColor: "#101010", overflow: "hidden" },
  dropdownRow: { minHeight: 50, paddingHorizontal: 15, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dropdownText: { color: colors.secondary, fontSize: 14 },
  dropdownTextActive: { color: "#fff", fontWeight: "600" },
  create: { height: 56, borderRadius: 28, backgroundColor: "#fff", marginTop: 25, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" },
  createDisabled: { opacity: 0.35 },
  createText: { color: "#000", fontSize: 16, fontWeight: "700" },
});
