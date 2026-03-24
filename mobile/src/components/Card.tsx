import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(179, 205, 224, 0.4)",
    padding: 20,
    shadowColor: "#00122f",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});
