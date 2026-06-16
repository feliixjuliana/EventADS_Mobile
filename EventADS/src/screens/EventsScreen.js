import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EventCard } from "../components/EventCard";
import { PatternBackground } from "../components/PatternBackground";
import { useApp } from "../context/AppContext";
import { colors } from "../theme/colors";

export function EventsScreen({ navigation, route }) {
  const { filteredEvents, search, setSearch, deleteEvent, isEventOwner } = useApp();
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const onlyMine = Boolean(route.params?.onlyMine);
  const visibleEvents = onlyMine ? filteredEvents.filter((event) => isEventOwner(event)) : filteredEvents;

  function confirmDelete(event) {
    setEventToDelete(event);
  }

  async function handleDelete() {
    if (!eventToDelete) return;

    try {
      setDeleting(true);
      await deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title={onlyMine ? "Meus Eventos" : "Home"} leftIcon="menu" rightIcon="add" onRightPress={() => navigation.navigate("EventForm")} />
      <ScrollView
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
      >
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Buscar eventos..."
            placeholderTextColor={colors.mutedDark}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Ionicons name="filter-outline" size={18} color={colors.primary} />
        </View>

        {visibleEvents.length ? visibleEvents.map((event) => {
          const canManage = isEventOwner(event);

          return (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate("EventDetail", { event })}
              onEdit={canManage ? () => navigation.navigate("EventEdit", { event }) : null}
              onDelete={canManage ? () => confirmDelete(event) : null}
            />
          );
        }) : (
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={34} color={colors.primary} />
            <Text style={styles.emptyText}>{onlyMine ? "Você ainda não criou eventos." : "Nenhum evento encontrado."}</Text>
          </View>
        )}
      </ScrollView>
      <ConfirmDialog
        visible={Boolean(eventToDelete)}
        title="Excluir evento"
        message={eventToDelete ? `Deseja excluir ${eventToDelete.title}?` : ""}
        confirmText="Excluir"
        danger
        loading={deleting}
        onCancel={() => setEventToDelete(null)}
        onConfirm={handleDelete}
      />
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
    paddingBottom: 96,
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
  empty: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 8,
  },
});
