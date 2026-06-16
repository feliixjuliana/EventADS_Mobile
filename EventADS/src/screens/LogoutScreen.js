import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { getAuthMessage, logoutUser } from "../services/authService";
import { colors } from "../theme/colors";

export function LogoutScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await logoutUser();
    } catch (error) {
      Alert.alert("Erro ao sair", getAuthMessage(error));
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader title="" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="log-out-outline" size={46} color={colors.primary} />
        </View>
        <Text style={styles.question}>Tem certeza que deseja sair da sua conta?</Text>
        <PrimaryButton title={loading ? "Saindo..." : "Sair"} disabled={loading} variant="danger" onPress={handleLogout} style={styles.button} />
        {loading ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}
        <PrimaryButton title="Cancelar" variant="ghost" onPress={() => navigation.goBack()} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 26,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEBFF",
    marginBottom: 34,
  },
  question: {
    color: colors.text,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    marginBottom: 14,
  },
  loading: {
    marginBottom: 14,
  },
});
