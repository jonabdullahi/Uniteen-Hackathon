import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";

interface ChoiceChipProps extends PropsWithChildren {
  selected?: boolean;
  onPress: () => void;
}

export function ChoiceChip({ selected, onPress, children }: ChoiceChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selected: {
    borderColor: colors.blue,
    backgroundColor: "rgba(0, 91, 150, 0.1)",
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedLabel: {
    color: colors.blue,
  },
});
