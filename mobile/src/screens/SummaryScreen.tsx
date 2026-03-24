import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { GraduationCap, Languages, MapPin, UserRound } from "lucide-react-native";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Summary">;

const summaryItems = [
  { key: "name", label: "Student", icon: UserRound },
  { key: "school", label: "School", icon: GraduationCap },
  { key: "location", label: "Location", icon: MapPin },
  { key: "languages", label: "Languages", icon: Languages },
] as const;

export function SummaryScreen({ navigation }: Props) {
  const userProfile = useAppStore((state) => state.userProfile);
  const setSummaryComplete = useAppStore((state) => state.setSummaryComplete);

  const handleContinue = () => {
    setSummaryComplete(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>EduBridge Mobile</Text>
        <Text style={styles.title}>Profile Summary</Text>
        <Text style={styles.subtitle}>
          Review your student details, then continue into the full mobile app flow with survey, diagnostics,
          dashboard, pathways, and university discovery.
        </Text>
      </View>

      <Card>
        {summaryItems.map((item) => {
          const Icon = item.icon;
          const value = userProfile?.[item.key] ?? "Not provided";
          return (
            <View key={item.key} style={styles.row}>
              <View style={styles.iconWrap}>
                <Icon color={colors.blue} size={18} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{value}</Text>
              </View>
            </View>
          );
        })}
      </Card>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Next Steps</Text>
        <Text style={styles.noteBody}>
          Go to your dashboard, complete the initial survey, then take the diagnostic and personality test to unlock
          the rest of the app.
        </Text>
      </View>

      <PrimaryButton onPress={handleContinue}>Continue to Dashboard</PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginBottom: 20 },
  eyebrow: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800", marginBottom: 10 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(179, 205, 224, 0.35)",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(100, 151, 177, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowText: { flex: 1 },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  rowValue: { color: colors.text, fontSize: 16, fontWeight: "600" },
  note: {
    marginVertical: 20,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(179, 205, 224, 0.2)",
  },
  noteTitle: { color: colors.navy, fontSize: 16, fontWeight: "700", marginBottom: 8 },
  noteBody: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
});
