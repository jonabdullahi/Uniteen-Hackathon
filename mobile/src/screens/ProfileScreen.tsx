import { Alert, StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

export function ProfileScreen() {
  const { userProfile, userSettings, updateUserSettings, resetData } = useAppStore();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile & Settings</Text>
        <Text style={styles.subtitle}>Manage privacy, accessibility, and your mobile demo data.</Text>
      </View>
      <Card>
        <Text style={styles.sectionTitle}>{userSettings.privacyMode ? "Private Student" : userProfile?.name || "Student"}</Text>
        <Text style={styles.body}>{userSettings.privacyMode ? "Privacy mode enabled" : userProfile?.school || "Profile in progress"}</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.choiceWrap}>
          <ChoiceChip selected={userSettings.privacyMode} onPress={() => updateUserSettings({ privacyMode: !userSettings.privacyMode })}>Privacy Mode</ChoiceChip>
          <ChoiceChip selected={userSettings.highContrast} onPress={() => updateUserSettings({ highContrast: !userSettings.highContrast })}>High Contrast</ChoiceChip>
          <ChoiceChip selected={userSettings.textScale === "normal"} onPress={() => updateUserSettings({ textScale: "normal" })}>Normal Text</ChoiceChip>
          <ChoiceChip selected={userSettings.textScale === "large"} onPress={() => updateUserSettings({ textScale: "large" })}>Large Text</ChoiceChip>
        </View>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Reset</Text>
        <SecondaryButton
          onPress={() =>
            Alert.alert("Reset demo data?", "This clears all locally saved mobile state.", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: () => resetData() },
            ])
          }
        >
          Reset Demo Data
        </SecondaryButton>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8 },
  sectionTitle: { color: colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 8 },
  body: { color: colors.textMuted, lineHeight: 22 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
});
