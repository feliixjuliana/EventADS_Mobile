import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const items = [
  { icon: "book-outline", top: 42, left: 18, size: 34, rotate: "-12deg" },
  { icon: "pencil-outline", top: 112, right: 28, size: 28, rotate: "18deg" },
  { icon: "library-outline", top: 230, left: 38, size: 30, rotate: "8deg" },
  { icon: "create-outline", top: 340, right: 36, size: 32, rotate: "-20deg" },
  { icon: "bookmarks-outline", bottom: 170, left: 24, size: 28, rotate: "14deg" },
  { icon: "reader-outline", bottom: 82, right: 30, size: 34, rotate: "-10deg" },
];

export function PatternBackground() {
  return (
    <View pointerEvents="none" style={styles.container}>
      {items.map((item, index) => (
        <Ionicons
          key={`${item.icon}-${index}`}
          name={item.icon}
          size={item.size}
          color={colors.primary}
          style={[
            styles.icon,
            {
              top: item.top,
              right: item.right,
              bottom: item.bottom,
              left: item.left,
              transform: [{ rotate: item.rotate }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  icon: {
    position: "absolute",
    opacity: 0.055,
  },
});
