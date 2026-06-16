import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, updateEmail, updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { api } from "../services/api";
import {
  clearProfile,
  loadEvents,
  loadNotificationHistory,
  loadNotificationSettings,
  loadProfile,
  saveEvents,
  saveNotificationHistory,
  saveNotificationSettings,
  saveProfile,
} from "../services/storageService";
import {
  notifyEventDeleted,
  requestNotificationPermission,
  scheduleEventNotification,
  scheduleEventReminder,
  subscribeNotificationHistory,
} from "../services/notificationService";
import { filterUpcomingEvents, sortEventsBySchedule } from "../utils/eventDate";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({
    saveAlerts: true,
    deleteAlerts: true,
    eventReminder: true,
  });
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    loadInitialData();
    loadStoredNotificationSettings();
    loadStoredNotificationHistory();
    requestNotificationPermission();

    const unsubscribeNotifications = subscribeNotificationHistory(addNotificationHistory);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);

      if (user) {
        const localProfile = await loadProfile(user.uid);
        let backendProfile = null;

        try {
          const { data } = await api.get(`/people/${user.uid}`);
          backendProfile = data;
        } catch (error) {
          console.log("Perfil nao encontrado no backend ainda:", error.message);
        }

        const userProfile = {
          uid: user.uid,
          name: user.displayName || backendProfile?.name || localProfile?.name || "Estudante ADS",
          email: user.email || backendProfile?.email || localProfile?.email || "",
          photoURL: user.photoURL || backendProfile?.photoURL || localProfile?.photoURL || null,
          photoPublicId: backendProfile?.photoPublicId || localProfile?.photoPublicId || null,
        };
        setPerfil(userProfile);
        await saveProfile(userProfile, user.uid);
        try {
          await api.post("/people", userProfile);
        } catch (error) {
          console.log("Perfil não sincronizado com backend:", error.message);
        }
      } else {
        setPerfil(null);
      }

      setLoadingAuth(false);
    });

    return () => {
      unsubscribe();
      unsubscribeNotifications();
    };
  }, []);

  async function loadInitialData() {
    try {
      const { data } = await api.get("/events");
      const sortedEvents = sortEventsBySchedule(data);
      setEvents(sortedEvents);
      await saveEvents(sortedEvents);
    } catch (error) {
      console.log("Backend indisponivel, usando cache local:", error.message);
      const storedEvents = await loadEvents();
      const fallbackEvents = storedEvents?.length ? storedEvents : [];
      const sortedFallback = sortEventsBySchedule(fallbackEvents);
      setEvents(sortedFallback);
      await saveEvents(sortedFallback);
    }
  }

  async function loadStoredNotificationSettings() {
    const settings = await loadNotificationSettings();
    setNotificationSettings(settings);
  }

  async function loadStoredNotificationHistory() {
    const history = await loadNotificationHistory();
    setNotificationHistory(history);
  }

  async function addNotificationHistory(entry) {
    if (!entry) return;

    setNotificationHistory((current) => {
      if (current.some((item) => item.id === entry.id)) return current;

      const nextHistory = [entry, ...current].slice(0, 30);
      saveNotificationHistory(nextHistory);
      return nextHistory;
    });
  }

  async function updateNotificationSettings(nextSettings) {
    const settings = {
      ...notificationSettings,
      ...nextSettings,
    };

    setNotificationSettings(settings);
    await saveNotificationSettings(settings);
  }

  function isEventOwner(event) {
    if (!event) return false;
    return Boolean(
      usuario?.uid && event.ownerId === usuario.uid
    ) || Boolean(perfil?.email && event.ownerEmail === perfil.email);
  }

  async function saveEvent(data, eventId) {
    const currentEvent = eventId ? events.find((event) => event.id === eventId) : null;

    if (eventId && !isEventOwner(currentEvent)) {
      throw new Error("Apenas quem criou o evento pode editar.");
    }

    const payload = {
      ...data,
      ownerId: usuario?.uid || "local",
      ownerEmail: perfil?.email || usuario?.email || "",
      ownerName: perfil?.name || usuario?.displayName || "",
    };

    const { data: savedEvent } = eventId ? await api.put(`/events/${eventId}`, payload) : await api.post("/events", payload);
    const updatedEvents = eventId
      ? events.map((event) => (event.id === eventId ? savedEvent : event))
      : [savedEvent, ...events];
    const sortedEvents = sortEventsBySchedule(updatedEvents);

    setEvents(sortedEvents);
    await saveEvents(sortedEvents);

    if (notificationSettings.saveAlerts) {
      runNotificationTask(async () => {
        const entry = await scheduleEventNotification(savedEvent, eventId ? "updated" : "created");
        await addNotificationHistory(entry);
      });
    }

    if (notificationSettings.eventReminder) {
      runNotificationTask(() => scheduleEventReminder(savedEvent));
    }

    return savedEvent;
  }

  async function deleteEvent(eventId) {
    const event = events.find((item) => item.id === eventId);
    if (!isEventOwner(event)) {
      throw new Error("Apenas quem criou o evento pode excluir.");
    }

    await api.delete(`/events/${eventId}`);
    const updatedEvents = events.filter((item) => item.id !== eventId);

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);

    if (event && notificationSettings.deleteAlerts) {
      runNotificationTask(async () => {
        const entry = await notifyEventDeleted(event.title);
        await addNotificationHistory(entry);
      });
    }
  }

  async function updateUserProfile(data) {
    const previousEmail = perfil?.email;
    const updatedProfile = {
      ...perfil,
      ...data,
    };

    if (auth.currentUser) {
      if (updatedProfile.email && updatedProfile.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, updatedProfile.email);
      }

      try {
        await updateProfile(auth.currentUser, {
          displayName: updatedProfile.name,
          photoURL: updatedProfile.photoURL?.startsWith("http") ? updatedProfile.photoURL : auth.currentUser.photoURL,
        });
      } catch (error) {
        console.log("Firebase nao sincronizou nome/foto:", error.message);
      }
    }

    const { data: savedProfile } = await api.post("/people", {
      ...updatedProfile,
      previousEmail,
    });
    const nextProfile = {
      ...updatedProfile,
      ...savedProfile,
    };
    await saveProfile(nextProfile, nextProfile.uid);
    setPerfil(nextProfile);
    return nextProfile;
  }

  async function clearUserProfile() {
    await clearProfile(usuario?.uid);
    setPerfil(null);
  }

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    const sorted = filterUpcomingEvents(events);
    if (!term) return sorted;

    return sorted.filter((event) =>
      [event.title, event.place, event.type].some((field) => field?.toLowerCase().includes(term))
    );
  }, [events, search]);

  return (
    <AppContext.Provider
      value={{
        usuario,
        perfil,
        events,
        filteredEvents,
        search,
        loadingAuth,
        notificationSettings,
        notificationHistory,
        setSearch,
        updateNotificationSettings,
        saveEvent,
        deleteEvent,
        isEventOwner,
        updateUserProfile,
        clearUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

async function runNotificationTask(task) {
  try {
    await task();
  } catch (error) {
    console.log("Notificação não enviada:", error.message);
  }
}
