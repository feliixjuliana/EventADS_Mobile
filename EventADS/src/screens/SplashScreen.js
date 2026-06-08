import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export function SplashScreen() {
  return (
    <LinearGradient colors={[colors.primaryLight, colors.primaryDark]} style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="calendar" size={62} color={colors.white} />
        <Ionicons name="star" size={22} color={colors.primary} style={styles.star} />
      </View>
      <Text style={styles.title}>EventADS</Text>
      <Text style={styles.subtitle}>Gestao de Eventos Academicos</Text>
      <ActivityIndicator color={colors.white} style={styles.loader} />
      <Text style={styles.loading}>Carregando...</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    position: "absolute",
    top: 38,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },
  subtitle: {
    color: "#EDE9FE",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  loader: {
    marginTop: 42,
  },
  loading: {
    color: colors.white,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "700",
  },
});
