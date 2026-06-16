import { useState } from "react";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { AppHeader } from "../components/AppHeader";
import { EventDateTimeFields } from "../components/EventDateTimeFields";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { uploadEventImage } from "../services/imageUploadService";
import { colors } from "../theme/colors";

export function EventEditScreen({ navigation, route }) {
  const event = route.params?.event;
  const { saveEvent } = useApp();
  const safeEvent = event || {};
  const [title, setTitle] = useState(safeEvent.title || "");
  const [description, setDescription] = useState(safeEvent.description || "");
  const [date, setDate] = useState(safeEvent.date || "");
  const [time, setTime] = useState(safeEvent.time || "");
  const [place, setPlace] = useState(safeEvent.place || "");
  const [imageUri, setImageUri] = useState(safeEvent.imageUri || safeEvent.imageUrl || null);
  const [imageAsset, setImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <View style={styles.container}>
        <PatternBackground />
        <AppHeader title="Editar Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.changeText}>Evento nao encontrado.</Text>
        </View>
      </View>
    );
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Imagem", "Permita acesso a galeria para trocar a imagem.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageAsset(asset);
    }
  }

  async function uploadImageIfNeeded() {
    if (!imageAsset) {
      return {
        imageUrl: event.imageUrl || imageUri,
        imagePublicId: event.imagePublicId || null,
        imageUri: null,
      };
    }

    return uploadEventImage(imageAsset, event.imagePublicId || `event_${Date.now()}`);
  }

  async function handleUpdate() {
    if (!title.trim() || !date.trim() || !time.trim() || !place.trim()) {
      Alert.alert("Editar evento", "Preencha titulo, data, hora e local.");
      return;
    }

    try {
      setLoading(true);
      const uploadedImage = await uploadImageIfNeeded();
      const updated = await saveEvent(
        {
          ...event,
          title: title.trim(),
          description: description.trim(),
          date: date.trim(),
          time: time.trim(),
          place: place.trim(),
          ...uploadedImage,
        },
        event.id
      );
      navigation.navigate("Main", { screen: "Events" });
    } catch (error) {
      const message =
        error.code === "ERR_NETWORK" || error.message?.includes("Network")
          ? "Nao consegui acessar o backend. Confira se o EventADS-backend esta rodando."
          : "Nao foi possivel atualizar o evento.";
      Alert.alert("Erro", message);
      console.log("Erro ao atualizar evento:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Editar Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageRow}>
          {imageUri ? (
            <ImageBackground source={{ uri: imageUri }} imageStyle={styles.thumbImage} style={styles.thumb}>
              <View style={styles.thumbOverlay}>
                <Ionicons name={event.icon} size={28} color={colors.white} />
              </View>
            </ImageBackground>
          ) : (
            <LinearGradient colors={[event.color, colors.primaryDark]} style={styles.thumb}>
              <Ionicons name={event.icon} size={34} color="#FDE7B0" />
            </LinearGradient>
          )}
          <Pressable onPress={pickImage} style={styles.changeButton}>
            <Ionicons name="image-outline" size={17} color={colors.primary} />
            <Text style={styles.changeText}>Trocar imagem</Text>
          </Pressable>
        </View>

        <InputField label="Titulo do evento" placeholder={event.title} value={title} onChangeText={setTitle} autoCapitalize="sentences" />
        <InputField label="Descricao" placeholder={event.description} value={description} onChangeText={setDescription} multiline autoCapitalize="sentences" />
        <EventDateTimeFields date={date} time={time} onChangeDate={setDate} onChangeTime={setTime} />
        <InputField label="Local" placeholder={event.place} value={place} onChangeText={setPlace} autoCapitalize="words" />

        <PrimaryButton title={loading ? "Atualizando..." : "Atualizar Evento"} disabled={loading} onPress={handleUpdate} style={styles.button} />
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
    padding: 18,
    paddingBottom: 96,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  thumb: {
    width: 110,
    height: 82,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImage: {
    borderRadius: 8,
  },
  thumbOverlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(44, 33, 24, 0.35)",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  changeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  button: {
    marginTop: 8,
  },
});
