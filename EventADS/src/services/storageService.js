import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_KEY = "@eventads:events";
const PROFILE_KEY = "@eventads:profile";
const NOTIFICATION_SETTINGS_KEY = "@eventads:notificationSettings";
const NOTIFICATION_HISTORY_KEY = "@eventads:notificationHistory";

function getProfileKey(uid) {
  return uid ? `${PROFILE_KEY}:${uid}` : PROFILE_KEY;
}

export async function loadEvents() {
  const data = await AsyncStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveEvents(events) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function loadProfile(uid) {
  const data = await AsyncStorage.getItem(getProfileKey(uid));
  return data ? JSON.parse(data) : null;
}

export async function saveProfile(profile, uid) {
  await AsyncStorage.setItem(getProfileKey(uid || profile?.uid), JSON.stringify(profile));
}

export async function clearProfile(uid) {
  await AsyncStorage.removeItem(getProfileKey(uid));
}

export async function loadNotificationSettings() {
  const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
  return data
    ? JSON.parse(data)
    : {
        saveAlerts: true,
        deleteAlerts: true,
        eventReminder: true,
      };
}

export async function saveNotificationSettings(settings) {
  await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadNotificationHistory() {
  const data = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveNotificationHistory(history) {
  await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(history));
}
