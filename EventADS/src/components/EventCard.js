import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export function EventCard({ event, compact, onPress, onEdit, onDelete }) {
  const imageSource = event.imageUri || event.imageUrl;

  return (
    <Pressable onPress={onPress} style={[styles.card, compact && styles.compactCard]}>
      {imageSource ? (
        <ImageBackground source={{ uri: imageSource }} imageStyle={styles.thumbImage} style={styles.thumb}>
          <View style={styles.thumbOverlay}>
            <Ionicons name={event.icon} size={compact ? 22 : 28} color={colors.white} />
          </View>
        </ImageBackground>
      ) : (
        <LinearGradient colors={[event.color, colors.primaryDark]} style={styles.thumb}>
          <Ionicons name={event.icon} size={compact ? 28 : 40} color="#FDE7B0" />
        </LinearGradient>
      )}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {event.title}
        </Text>
        <Info icon="calendar-outline" text={event.date} />
        <Info icon="time-outline" text={event.time} />
        <Info icon="location-outline" text={event.place} />
        {!compact && (onEdit || onDelete) ? (
          <View style={styles.actions}>
            {onEdit ? (
              <Pressable onPress={onEdit} style={styles.actionEdit}>
                <Ionicons name="create-outline" size={13} color={colors.primary} />
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
            ) : null}
            {onDelete ? (
              <Pressable onPress={onDelete} style={styles.actionDelete}>
                <Ionicons name="trash-outline" size={13} color={colors.accent} />
                <Text style={styles.deleteText}>Excluir</Text>
              </Pressable>
            ) : null}
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
    alignItems: "stretch",
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
    height: 92,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.surfaceSoft,
  },
  thumbImage: {
    borderRadius: 8,
  },
  thumbOverlay: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(44, 33, 24, 0.35)",
  },
  content: {
    flex: 1,
    minHeight: 92,
    justifyContent: "center",
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
