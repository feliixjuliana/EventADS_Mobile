import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export function EventDateTimeFields({ date, time, onChangeDate, onChangeTime }) {
  const [pickerMode, setPickerMode] = useState(null);

  const selectedDate = parseDate(date) || new Date();
  const selectedTime = buildTimeDate(time);

  function handleChange(event, value) {
    if (Platform.OS === "android") {
      setPickerMode(null);
    }

    if (event.type === "dismissed" || !value) return;

    if (pickerMode === "date") {
      onChangeDate(formatDate(value));
      return;
    }

    onChangeTime(formatTime(value));
  }

  return (
    <>
      <View style={styles.row}>
        <Pressable onPress={() => setPickerMode("date")} style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <View style={styles.valueRow}>
            <Ionicons name="calendar-outline" size={17} color={colors.primary} />
            <Text style={styles.value}>{date || "Selecionar"}</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setPickerMode("time")} style={styles.field}>
          <Text style={styles.label}>Hora</Text>
          <View style={styles.valueRow}>
            <Ionicons name="time-outline" size={17} color={colors.primary} />
            <Text style={styles.value}>{time || "Selecionar"}</Text>
          </View>
        </Pressable>
      </View>

      {pickerMode ? (
        <DateTimePicker
          value={pickerMode === "date" ? selectedDate : selectedTime}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}

function parseDate(value) {
  if (!value) return null;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;

  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildTimeDate(value) {
  const normalized = String(value || "19:00").replace("h", ":");
  const [hour, minute] = normalized.split(":").map(Number);
  const date = new Date();

  date.setHours(Number.isFinite(hour) ? hour : 19);
  date.setMinutes(Number.isFinite(minute) ? minute : 0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

function formatDate(value) {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${value.getFullYear()}`;
}

function formatTime(value) {
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  field: {
    flex: 1,
    minHeight: 58,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
