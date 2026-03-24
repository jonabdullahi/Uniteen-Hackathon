import { StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: colors.paleBlue,
  },
  fill: {
    height: "100%",
    backgroundColor: colors.blue,
  },
});
