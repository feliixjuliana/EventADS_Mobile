import * as Notifications from "expo-notifications";
import { getEventNotificationDate } from "../utils/eventDate";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status: currentStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = currentStatus;

  if (currentStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleEventNotification(event, action = "created") {
  const allowed = await requestNotificationPermission();
  if (!allowed) return null;

  const isUpdate = action === "updated";
  const entry = createNotificationEntry({
    type: isUpdate ? "update" : "create",
    title: isUpdate ? "Evento atualizado" : "Evento cadastrado",
    body: isUpdate
      ? `${event.title} foi atualizado com sucesso.`
      : `${event.title} foi cadastrado com sucesso.`,
    eventId: event.id,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: entry.title,
      body: entry.body,
      data: { eventId: event.id, historyEntry: entry },
    },
    trigger: null,
  });

  return entry;
}

export async function scheduleEventReminder(event) {
  const allowed = await requestNotificationPermission();
  const eventDate = getEventNotificationDate(event);

  if (!allowed || !eventDate || eventDate.getTime() <= Date.now()) return null;

  const entry = createNotificationEntry({
    type: "reminder",
    title: "Hoje tem evento no EventADS",
    body: `${event.title} comeca as ${event.time}.`,
    eventId: event.id,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: entry.title,
      body: entry.body,
      data: { eventId: event.id, historyEntry: entry },
    },
    trigger: eventDate,
  });

  return entry;
}

export async function notifyEventDeleted(eventTitle) {
  const allowed = await requestNotificationPermission();
  if (!allowed) return null;

  const entry = createNotificationEntry({
    type: "delete",
    title: "Evento excluido",
    body: `${eventTitle} foi removido da sua lista.`,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: entry.title,
      body: entry.body,
      data: { historyEntry: entry },
    },
    trigger: null,
  });

  return entry;
}

export function subscribeNotificationHistory(onNotification) {
  const received = Notifications.addNotificationReceivedListener((notification) => {
    const entry = getHistoryEntry(notification);
    if (entry) onNotification(entry);
  });

  const response = Notifications.addNotificationResponseReceivedListener((notificationResponse) => {
    const entry = getHistoryEntry(notificationResponse.notification);
    if (entry) onNotification(entry);
  });

  return () => {
    received.remove();
    response.remove();
  };
}

function createNotificationEntry({ type, title, body, eventId }) {
  return {
    id: `${type}_${eventId || "app"}_${Date.now()}`,
    type,
    title,
    body,
    eventId: eventId || null,
    createdAt: new Date().toISOString(),
  };
}

function getHistoryEntry(notification) {
  const entry = notification?.request?.content?.data?.historyEntry;
  if (!entry) return null;

  return {
    ...entry,
    id: entry.id || `${entry.type || "notification"}_${Date.now()}`,
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}
