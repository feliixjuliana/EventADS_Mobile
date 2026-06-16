import { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppHeader } from "../components/AppHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { colors } from "../theme/colors";

export function EventDetailScreen({ navigation, route }) {
  const event = route.params?.event;
  const { deleteEvent, isEventOwner } = useApp();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!event) {
    return (
      <View style={styles.container}>
        <PatternBackground />
        <AppHeader title="Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.title}>Evento nao encontrado</Text>
          <Text style={styles.description}>Volte para a lista e selecione um evento cadastrado.</Text>
        </View>
      </View>
    );
  }

  const imageSource = event.imageUri || event.imageUrl;
  const canManage = isEventOwner(event);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteEvent(event.id);
      setConfirmVisible(false);
      navigation.navigate("Main", { screen: "Events" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="" leftIcon="chevron-back" rightIcon="ellipsis-horizontal" onLeftPress={() => navigation.goBack()} />
      <ScrollView>
        {imageSource ? (
          <ImageBackground source={{ uri: imageSource }} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay}>
              <Ionicons name={event.icon} size={70} color="#FDE7B0" />
              <Text style={styles.heroText}>{event.title.toUpperCase()}</Text>
            </View>
          </ImageBackground>
        ) : (
          <LinearGradient colors={[event.color, colors.primaryDark]} style={styles.hero}>
            <Ionicons name={event.icon} size={80} color="#FDE7B0" />
            <Text style={styles.heroText}>{event.title.toUpperCase()}</Text>
          </LinearGradient>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Info icon="calendar-outline" label="Data" text={event.date} />
          <Info icon="time-outline" label="Hora" text={event.time} />
          <Info icon="location-outline" label="Local" text={event.place} />

          <Text style={styles.section}>Descricao</Text>
          <Text style={styles.description}>{event.description}</Text>

          {canManage ? (
            <View style={styles.actions}>
              <PrimaryButton title="Editar" variant="ghost" onPress={() => navigation.navigate("EventEdit", { event })} style={styles.action} />
              <PrimaryButton title="Excluir" variant="danger" onPress={() => setConfirmVisible(true)} style={styles.action} />
            </View>
          ) : null}
        </View>
      </ScrollView>
      <ConfirmDialog
        visible={confirmVisible}
        title="Excluir evento"
        message={`Deseja excluir ${event.title}?`}
        confirmText="Excluir"
        danger
        loading={deleting}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

function Info({ icon, label, text }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={18} color={colors.muted} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    width: "100%",
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    backgroundColor: "rgba(44, 33, 24, 0.42)",
  },
  heroText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  info: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  infoLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  infoText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  action: {
    flex: 1,
  },
});
