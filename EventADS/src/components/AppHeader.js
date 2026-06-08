import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function AppHeader({ title, subtitle, leftIcon, rightIcon, onLeftPress, onRightPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        {leftIcon ? (
          <Pressable onPress={onLeftPress} style={styles.iconButton}>
            <Ionicons name={leftIcon} size={22} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
        <Text style={styles.title}>{title}</Text>
        {rightIcon ? (
          <Pressable onPress={onRightPress} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={22} color={colors.white} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
  },
  row: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    color: "#EDE9FE",
    fontSize: 12,
    marginTop: 2,
  },
});
