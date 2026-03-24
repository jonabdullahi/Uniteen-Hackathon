import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { CAREERS } from "../data/careers";
import { colors } from "../theme/colors";

export function CareerScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Career Matches</Text>
        <Text style={styles.subtitle}>Based on your interests in math, logic, and problem-solving.</Text>
      </View>
      {CAREERS.map((career, index) => (
        <Card key={career.title}>
          <Text style={[styles.badge, index === 0 && styles.topBadge]}>{index === 0 ? "Top Match" : `${career.match} Match`}</Text>
          <Text style={styles.cardTitle}>{career.title}</Text>
          <Text style={styles.body}>{career.description}</Text>
          <View style={styles.metaGrid}>
            <Text style={styles.meta}>Salary: {career.salary}</Text>
            <Text style={styles.meta}>Growth: {career.growth}</Text>
            <Text style={styles.meta}>Education: {career.education}</Text>
          </View>
          <View style={styles.tags}>
            {career.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8 },
  badge: { alignSelf: "flex-start", backgroundColor: colors.textMuted, color: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: "hidden", fontSize: 12, fontWeight: "700", marginBottom: 10 },
  topBadge: { backgroundColor: colors.blue },
  cardTitle: { color: colors.navy, fontSize: 22, fontWeight: "800", marginBottom: 10 },
  body: { color: colors.textMuted, lineHeight: 22, marginBottom: 12 },
  metaGrid: { gap: 6, marginBottom: 12 },
  meta: { color: colors.text, fontSize: 14, fontWeight: "600" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { color: colors.textMuted, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: "hidden", fontSize: 12 },
});
