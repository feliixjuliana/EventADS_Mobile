import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export function InputField({
  label,
  placeholder,
  icon,
  secureTextEntry,
  multiline,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize = "none",
}) {
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputBox, multiline && styles.areaBox]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.mutedDark}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, multiline && styles.area]}
        />
        {icon ? <Ionicons name={icon} size={18} color={colors.muted} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  inputBox: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  areaBox: {
    minHeight: 88,
    alignItems: "flex-start",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },
  area: {
    minHeight: 70,
    textAlignVertical: "top",
  },
});
