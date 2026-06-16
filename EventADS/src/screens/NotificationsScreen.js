import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { PatternBackground } from "../components/PatternBackground";
import { useApp } from "../context/AppContext";
import { colors } from "../theme/colors";

const notificationIcons = {
  create: "add-circle-outline",
  update: "create-outline",
  delete: "trash-outline",
  reminder: "alarm-outline",
};

export function NotificationsScreen({ navigation }) {
  const { notificationHistory } = useApp();

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Notificacoes" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {notificationHistory.length ? (
          notificationHistory.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={36} color={colors.primary} />
            <Text style={styles.emptyTitle}>Nenhuma notificacao ainda</Text>
            <Text style={styles.emptyText}>As notificacoes recebidas no app vao aparecer aqui.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function NotificationItem({ notification }) {
  const icon = notificationIcons[notification.type] || "notifications-outline";

  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>

      <View style={styles.textBox}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{formatNotificationDate(notification.createdAt)}</Text>
        </View>
        <Text style={styles.subtitle}>{notification.body}</Text>
      </View>
    </View>
  );
}

function formatNotificationDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  card: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
  },
  textBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  time: {
    color: colors.mutedDark,
    fontSize: 11,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  empty: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});
