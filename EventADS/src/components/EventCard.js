import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export function EventCard({ event, compact, onPress, onEdit, onDelete }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, compact && styles.compactCard]}>
      <LinearGradient colors={[event.color, colors.primaryDark]} style={styles.thumb}>
        <Ionicons name={event.icon} size={compact ? 28 : 40} color="#7DD3FC" />
      </LinearGradient>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {event.title}
        </Text>
        <Info icon="calendar-outline" text={event.date} />
        <Info icon="time-outline" text={event.time} />
        <Info icon="location-outline" text={event.place} />
        {!compact ? (
          <View style={styles.actions}>
            <Pressable onPress={onEdit} style={styles.actionEdit}>
              <Ionicons name="create-outline" size={13} color={colors.primary} />
              <Text style={styles.editText}>Editar</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={styles.actionDelete}>
              <Ionicons name="trash-outline" size={13} color={colors.accent} />
              <Text style={styles.deleteText}>Excluir</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function Info({ icon, text }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={12} color={colors.muted} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  compactCard: {
    marginBottom: 0,
  },
  thumb: {
    width: 82,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  infoText: {
    color: colors.muted,
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
  },
  actionDelete: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    backgroundColor: "#FEF2F2",
  },
  editText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  deleteText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
  },
});
