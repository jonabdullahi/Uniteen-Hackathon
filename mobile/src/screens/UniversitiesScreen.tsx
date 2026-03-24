import { useNavigation } from "@react-navigation/native";
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { UNIVERSITIES } from "../data/universities";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

type Props = Partial<NativeStackScreenProps<RootStackParamList, "Universities">>;

export function UniversitiesScreen({ navigation }: Props) {
  const fallbackNavigation = useNavigation<any>();
  const nav = navigation ?? fallbackNavigation;
  const { savedUniversities, toggleSavedUniversity } = useAppStore();
  const [search, setSearch] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");

  const filtered = UNIVERSITIES.filter((u) => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedLocation = locationFilter.trim().toLowerCase();
    const normalizedTag = tagFilter.trim().toLowerCase();
    return (
      (!normalizedSearch || u.name.toLowerCase().includes(normalizedSearch) || u.tags.some((t) => t.toLowerCase().includes(normalizedSearch))) &&
      (!normalizedLocation || u.location.toLowerCase().includes(normalizedLocation)) &&
      (!normalizedTag || u.tags.some((tag) => tag.toLowerCase().includes(normalizedTag)))
    );
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Universities</Text>
        <Text style={styles.subtitle}>Find institutions that align with your profile and interests.</Text>
      </View>
      <Card>
        <InputField label="Search by name or tag" value={search} onChangeText={setSearch} placeholder="Search..." />
        <InputField label="Filter by location" value={locationFilter} onChangeText={setLocationFilter} placeholder="Boston, MA" />
        <InputField label="Filter by tag" value={tagFilter} onChangeText={setTagFilter} placeholder="STEM, Arts..." />
      </Card>
      {filtered.map((uni, idx) => (
        <Card key={uni.id}>
          <Image source={{ uri: uni.image }} style={styles.image} resizeMode="cover" />
          <Text style={styles.cardTitle}>{uni.name}</Text>
          <Text style={styles.body}>{uni.location}</Text>
          <View style={styles.choiceWrap}>
            {uni.tags.map((tag) => <ChoiceChip key={tag} selected={false} onPress={() => undefined}>{tag}</ChoiceChip>)}
          </View>
          <View style={styles.actions}>
            <PrimaryButton onPress={() => nav.navigate("UniversityDetail", { id: uni.id })}>View Details</PrimaryButton>
            <SecondaryButton onPress={() => toggleSavedUniversity(uni.id)}>{savedUniversities.includes(uni.id) ? "Saved" : "Save"}</SecondaryButton>
          </View>
          <Text style={styles.match}>Match: 9{8 - idx}%</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8 },
  image: { width: "100%", height: 170, borderRadius: 18, marginBottom: 14, backgroundColor: colors.paleBlue },
  cardTitle: { color: colors.navy, fontSize: 22, fontWeight: "800", marginBottom: 4 },
  body: { color: colors.textMuted, lineHeight: 20, marginBottom: 4 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10, marginBottom: 14 },
  actions: { gap: 10 },
  match: { color: colors.blue, fontWeight: "700", marginTop: 12 },
});
