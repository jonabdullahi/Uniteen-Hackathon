import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";

interface SecondaryButtonProps extends PropsWithChildren {
  onPress: () => void;
  disabled?: boolean;
}

export function SecondaryButton({ children, onPress, disabled }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    backgroundColor: "rgba(0, 91, 150, 0.06)",
  },
  label: {
    color: colors.blue,
    fontWeight: "700",
    fontSize: 15,
  },
});
