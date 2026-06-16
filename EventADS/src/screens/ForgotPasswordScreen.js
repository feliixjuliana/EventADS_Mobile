import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { getAuthMessage, resetPassword } from "../services/authService";
import { colors } from "../theme/colors";

export function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Recuperar senha", "Digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert("E-mail enviado", "Confira sua caixa de entrada para redefinir a senha.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getAuthMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Recuperar Senha" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.lockCircle}>
          <Ionicons name="lock-closed-outline" size={42} color={colors.primary} />
        </View>
        <Text style={styles.text}>Digite seu e-mail para receber instrucoes de como redefinir sua senha.</Text>
        <InputField label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <PrimaryButton title={loading ? "Enviando..." : "Enviar instrucoes"} disabled={loading} onPress={handleReset} style={styles.button} />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backLogin}>Voltar para o login</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 26,
    paddingBottom: 46,
  },
  lockCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEBFF",
    marginBottom: 26,
  },
  text: {
    color: colors.text,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
  backLogin: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 26,
  },
});
