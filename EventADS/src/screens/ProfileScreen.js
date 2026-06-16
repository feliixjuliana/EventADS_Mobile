import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { PatternBackground } from "../components/PatternBackground";
import { useApp } from "../context/AppContext";
import { colors } from "../theme/colors";

export function ProfileScreen({ navigation }) {
  const { perfil, events } = useApp();
  const name = perfil?.name || "Estudante ADS";
  const email = perfil?.email || "sem e-mail";
  const photoURL = perfil?.photoURL || null;

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Meu Perfil" rightIcon="create-outline" onRightPress={() => navigation.navigate("EditProfile")} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials(name || email)}</Text>
          )}
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.menu}>
          <MenuItem icon="calendar-outline" title="Meus Eventos" subtitle={`${events.length} eventos cadastrados`} onPress={() => navigation.navigate("Home")} />
          <MenuItem icon="notifications-outline" title="Notificacoes" subtitle="Configurar preferencias" onPress={() => navigation.navigate("Notifications")} />
          <MenuItem icon="lock-closed-outline" title="Alterar Senha" onPress={() => navigation.navigate("ForgotPassword")} />
          <MenuItem icon="exit-outline" title="Sair da Conta" danger onPress={() => navigation.navigate("Logout")} />
        </View>
      </ScrollView>
    </View>
  );
}

function initials(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function MenuItem({ icon, title, subtitle, danger, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Ionicons name={icon} size={21} color={danger ? colors.accent : colors.muted} />
      <View style={styles.itemText}>
        <Text style={[styles.itemTitle, danger && styles.danger]}>{title}</Text>
        {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: "center",
    padding: 22,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
    marginBottom: 14,
    overflow: "hidden",
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "900",
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  email: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  menu: {
    width: "100%",
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  item: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  itemSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  danger: {
    color: colors.accent,
  },
});
