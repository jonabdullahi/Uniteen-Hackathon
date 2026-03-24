import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text } from "react-native";

import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { UNIVERSITIES } from "../data/universities";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

const CHECKLIST_ITEMS = [
  "Review admission requirements",
  "Prepare personal statement draft",
  "Request recommendation letters",
  "Collect transcripts and scores",
  "Submit application before deadline",
];

type Props = NativeStackScreenProps<RootStackParamList, "UniversityDetail">;

export function UniversityDetailScreen({ navigation, route }: Props) {
  const { universityChecklist, toggleUniversityChecklistItem } = useAppStore();
  const uni = UNIVERSITIES.find((item) => item.id === route.params.id);

  if (!uni) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>University Not Found</Text>
          <SecondaryButton onPress={() => navigation.goBack()}>Back to Universities</SecondaryButton>
        </Card>
      </Screen>
    );
  }

  const completedItems = universityChecklist[String(uni.id)] ?? [];
  const completionPercent = Math.round((completedItems.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <Screen>
      <SecondaryButton onPress={() => navigation.goBack()}>Back to Universities</SecondaryButton>
      <Card>
        <Image source={{ uri: uni.image }} style={styles.image} />
        <Text style={styles.title}>{uni.name}</Text>
        <Text style={styles.subtitle}>{uni.location}</Text>
        <Text style={styles.body}>{uni.details.summary}</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Key Details</Text>
        <Text style={styles.body}>Acceptance Rate: {uni.details.acceptanceRate}</Text>
        <Text style={styles.body}>Tuition: {uni.details.tuition}</Text>
        <Text style={styles.body}>Top Programs: {uni.details.topPrograms}</Text>
        <Text style={styles.body}>Campus Vibe: {uni.details.campusVibe}</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Application Checklist ({completionPercent}% complete)</Text>
        {CHECKLIST_ITEMS.map((item) => {
          const done = completedItems.includes(item);
          return (
            <SecondaryButton key={item} onPress={() => toggleUniversityChecklistItem(uni.id, item)}>
              {done ? `Done: ${item}` : `Todo: ${item}`}
            </SecondaryButton>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 220, borderRadius: 18, marginBottom: 16 },
  title: { color: colors.navy, fontSize: 28, fontWeight: "800", marginBottom: 4 },
  subtitle: { color: colors.textMuted, marginBottom: 12 },
  sectionTitle: { color: colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 10 },
  body: { color: colors.textMuted, lineHeight: 22, marginBottom: 6 },
});
