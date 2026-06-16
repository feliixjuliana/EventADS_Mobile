import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { getAuthMessage, registerWithEmail } from "../services/authService";
import { colors } from "../theme/colors";

export function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Cadastro", "Preencha nome, e-mail e senha.");
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(name, email, password);
    } catch (error) {
      console.log("Erro Firebase cadastro:", error.code, error.message);
      Alert.alert("Erro ao cadastrar", getAuthMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
        </View>

        <View style={styles.photoBox}>
          <View style={styles.photoCircle}>
            <Ionicons name="camera" size={30} color={colors.muted} />
          </View>
          <Text style={styles.photoText}>Adicionar foto</Text>
        </View>

        <InputField
          label="Nome completo"
          placeholder="Digite seu nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <InputField
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="eye-outline"
        />

        <PrimaryButton title={loading ? "Cadastrando..." : "Cadastrar"} disabled={loading} onPress={handleRegister} style={styles.button} />
        {loading ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}

        <Pressable onPress={() => navigation.navigate("Login")} style={styles.bottomLink}>
          <Text style={styles.bottomText}>
            Ja possui conta? <Text style={styles.link}>Fazer login</Text>
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
    marginBottom: 22,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  photoBox: {
    alignItems: "center",
    marginBottom: 22,
  },
  photoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EAF2",
  },
  photoText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
  },
  button: {
    marginTop: 6,
  },
  loading: {
    marginTop: 12,
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 24,
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
