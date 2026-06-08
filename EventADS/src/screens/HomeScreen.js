import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { EventCard } from "../components/EventCard";
import { events } from "../data/events";
import { colors } from "../theme/colors";

export function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Ola, Joao Silva"
        subtitle="Seja bem-vindo!"
        rightIcon="notifications-outline"
        onRightPress={() => navigation.navigate("Notifications")}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Eventos cadastrados</Text>
          <Text style={styles.summaryNumber}>12</Text>
          <Text style={styles.summarySmall}>eventos</Text>
        </View>

        <Text style={styles.sectionTitle}>Proximo evento</Text>
        <EventCard event={events[0]} compact onPress={() => navigation.navigate("EventDetail", { event: events[0] })} />

        <View style={styles.shortcuts}>
          <Shortcut icon="add" title="Novo Evento" text="Cadastrar evento" onPress={() => navigation.navigate("EventForm")} />
          <Shortcut icon="list" title="Ver Eventos" text="Ver todos" onPress={() => navigation.navigate("Events")} />
        </View>
      </ScrollView>
    </View>
  );
}

function Shortcut({ icon, title, text, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.shortcut}>
      <Ionicons name={icon} size={28} color={colors.primary} />
      <Text style={styles.shortcutTitle}>{title}</Text>
      <Text style={styles.shortcutText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  summary: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  summaryNumber: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 8,
  },
  summarySmall: {
    color: colors.muted,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  shortcuts: {
    flexDirection: "row",
    gap: 12,
  },
  shortcut: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 118,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  shortcutText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
});
