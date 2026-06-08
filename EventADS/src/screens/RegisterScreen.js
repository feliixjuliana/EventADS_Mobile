import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";

export function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
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

      <InputField label="Nome completo" placeholder="Digite seu nome" />
      <InputField label="E-mail" placeholder="Digite seu e-mail" />
      <InputField label="Senha" placeholder="Digite sua senha" secureTextEntry icon="eye-outline" />

      <PrimaryButton title="Cadastrar" onPress={() => navigation.replace("Main")} style={styles.button} />

      <Pressable onPress={() => navigation.navigate("Login")} style={styles.bottomLink}>
        <Text style={styles.bottomText}>
          Ja possui conta? <Text style={styles.link}>Fazer login</Text>
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
