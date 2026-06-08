import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";

export function EventFormScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppHeader title="Novo Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Adicionar imagem do evento</Text>
        <View style={styles.upload}>
          <Ionicons name="image-outline" size={36} color={colors.primary} />
          <Text style={styles.uploadTitle}>Selecionar imagem</Text>
          <Text style={styles.uploadText}>Toque para escolher</Text>
        </View>

        <InputField label="Titulo do evento" placeholder="Digite o titulo" />
        <InputField label="Descricao" placeholder="Descreva o evento" multiline />
        <View style={styles.row}>
          <View style={styles.half}>
            <InputField label="Data" placeholder="DD/MM/AAAA" icon="calendar-outline" />
          </View>
          <View style={styles.half}>
            <InputField label="Hora" placeholder="HH:MM" icon="time-outline" />
          </View>
        </View>
        <InputField label="Local" placeholder="Digite o local" />

        <PrimaryButton title="Salvar Evento" onPress={() => navigation.navigate("Events")} style={styles.button} />
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
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  upload: {
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  uploadTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  uploadText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
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
