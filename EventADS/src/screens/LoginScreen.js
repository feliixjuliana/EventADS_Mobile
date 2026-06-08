import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";

export function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Event<Text style={styles.titleAccent}>ADS</Text>
        </Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
        <Text style={styles.hint}>Faca login para continuar</Text>
      </View>

      <InputField label="E-mail" placeholder="seu@email.com" />
      <InputField label="Senha" placeholder="********" secureTextEntry icon="eye-outline" />

      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>Esqueceu sua senha?</Text>
      </Pressable>

      <PrimaryButton title="Entrar" onPress={() => navigation.replace("Main")} style={styles.mainButton} />

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
          Nao possui conta? <Text style={styles.link}>Cadastre-se</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 26,
    backgroundColor: colors.background,
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
