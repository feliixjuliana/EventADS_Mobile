import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export function PrimaryButton({ title, onPress, variant = "primary", style }) {
  const isDanger = variant === "danger";
  const isGhost = variant === "ghost";

  if (isGhost) {
    return (
      <Pressable onPress={onPress} style={[styles.ghost, style]}>
        <Text style={styles.ghostText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, style]}>
      <LinearGradient
        colors={isDanger ? ["#EF4444", "#DC2626"] : [colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  ghost: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  ghostText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});
