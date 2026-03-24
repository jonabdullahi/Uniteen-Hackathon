import { StyleSheet, Text, View } from "react-native";

import { Card } from "./Card";
import { colors } from "../theme/colors";

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  value: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: "800",
  },
});
