import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppHeader } from "../components/AppHeader";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { events } from "../data/events";
import { colors } from "../theme/colors";

export function EventEditScreen({ navigation, route }) {
  const event = route.params?.event || events[0];

  return (
    <View style={styles.container}>
      <AppHeader title="Editar Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageRow}>
          <LinearGradient colors={[event.color, colors.primaryDark]} style={styles.thumb}>
            <Ionicons name={event.icon} size={34} color="#7DD3FC" />
          </LinearGradient>
          <View style={styles.changeButton}>
            <Ionicons name="image-outline" size={17} color={colors.primary} />
            <Text style={styles.changeText}>Trocar imagem</Text>
          </View>
        </View>

        <InputField label="Titulo do evento" placeholder={event.title} />
        <InputField label="Descricao" placeholder={event.description} multiline />
        <View style={styles.row}>
          <View style={styles.half}>
            <InputField label="Data" placeholder={event.date} icon="calendar-outline" />
          </View>
          <View style={styles.half}>
            <InputField label="Hora" placeholder={event.time} icon="time-outline" />
          </View>
        </View>
        <InputField label="Local" placeholder={event.place} />

        <PrimaryButton title="Atualizar Evento" onPress={() => navigation.navigate("Events")} style={styles.button} />
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
    padding: 18,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  thumb: {
    width: 110,
    height: 82,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  changeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});
