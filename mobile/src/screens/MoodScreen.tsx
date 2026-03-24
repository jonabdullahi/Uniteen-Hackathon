import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

export function MoodScreen() {
  const { moodEntries, addMoodEntry } = useAppStore();
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [note, setNote] = React.useState("");

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Tracker</Text>
        <Text style={styles.subtitle}>Track your wellbeing and emotional patterns.</Text>
      </View>
      <Card>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.choiceWrap}>
          {[1, 2, 3, 4, 5].map((value) => (
            <ChoiceChip key={value} selected={selectedRating === value} onPress={() => setSelectedRating(value)}>
              {value}/5
            </ChoiceChip>
          ))}
        </View>
        <InputField label="Daily Reflection" placeholder="What made you feel this way?" value={note} onChangeText={setNote} multiline numberOfLines={4} style={{ minHeight: 110 }} />
        <PrimaryButton
          onPress={() => {
            if (!selectedRating || !note.trim()) return;
            addMoodEntry({
              id: Math.random().toString(36).slice(2, 10),
              date: new Date().toISOString(),
              rating: selectedRating,
              note: note.trim(),
            });
            setNote("");
            setSelectedRating(null);
          }}
        >
          Log Mood
        </PrimaryButton>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {moodEntries.length === 0 ? <Text style={styles.empty}>Start logging to see your history.</Text> : null}
        {moodEntries.slice(0, 8).map((entry) => (
          <View key={entry.id} style={styles.entry}>
            <Text style={styles.entryRating}>{entry.rating}/5</Text>
            <View style={styles.entryBody}>
              <Text style={styles.entryDate}>{new Date(entry.date).toLocaleString()}</Text>
              <Text style={styles.entryNote}>{entry.note || "No note added"}</Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8 },
  sectionTitle: { color: colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 14 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  entry: { flexDirection: "row", gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  entryRating: { color: colors.blue, fontWeight: "800", fontSize: 16, minWidth: 42 },
  entryBody: { flex: 1 },
  entryDate: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  entryNote: { color: colors.text, lineHeight: 20 },
  empty: { color: colors.textMuted },
});
