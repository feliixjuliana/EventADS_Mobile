import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { EventCard } from "../components/EventCard";
import { events } from "../data/events";
import { colors } from "../theme/colors";

export function EventsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppHeader title="Eventos" leftIcon="menu" rightIcon="add" onRightPress={() => navigation.navigate("EventForm")} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput placeholder="Buscar eventos..." placeholderTextColor={colors.mutedDark} style={styles.searchInput} />
          <Ionicons name="filter-outline" size={18} color={colors.primary} />
        </View>

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate("EventDetail", { event })}
            onEdit={() => navigation.navigate("EventEdit", { event })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  search: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },
});
