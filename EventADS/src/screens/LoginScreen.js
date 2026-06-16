import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { getAuthMessage, loginWithEmail } from "../services/authService";
import { colors } from "../theme/colors";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Login", "Informe e-mail e senha para entrar.");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
    } catch (error) {
      console.log("Erro Firebase login:", error.code, error.message);
      Alert.alert("Erro ao entrar", getAuthMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Event<Text style={styles.titleAccent}>ADS</Text>
          </Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
          <Text style={styles.hint}>Faca login para continuar</Text>
        </View>

        <InputField
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          label="Senha"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="eye-outline"
        />

        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </Pressable>

        <PrimaryButton title={loading ? "Entrando..." : "Entrar"} disabled={loading} onPress={handleLogin} style={styles.mainButton} />
        {loading ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.or}>ou</Text>
          <View style={styles.divider} />
        </View>

        <Pressable style={styles.google}>
          <Ionicons name="logo-google" size={18} color="#EA4335" />
          <Text style={styles.googleText}>Entrar com Google</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")} style={styles.bottomLink}>
          <Text style={styles.bottomText}>
            nao possui conta? <Text style={styles.link}>Cadastre-se</Text>
          </Text>
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "900",
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 10,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  forgot: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 16,
  },
  mainButton: {
    marginTop: 2,
  },
  loading: {
    marginTop: 12,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  or: {
    color: colors.muted,
    fontSize: 12,
  },
  google: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  googleText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 26,
  },
  bottomText: {
    color: colors.muted,
    fontSize: 12,
  },
  link: {
    color: colors.primary,
    fontWeight: "800",
  },
});
