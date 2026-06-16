import { useState } from "react";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AppHeader } from "../components/AppHeader";
import { EventDateTimeFields } from "../components/EventDateTimeFields";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { uploadEventImage } from "../services/imageUploadService";
import { colors } from "../theme/colors";

export function EventFormScreen({ navigation }) {
  const { saveEvent } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Imagem", "Permita acesso a galeria para escolher uma imagem.");
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
    return uploadEventImage(imageAsset, `event_${Date.now()}`);
  }

  async function handleSave() {
    if (!title.trim() || !date.trim() || !time.trim() || !place.trim()) {
      Alert.alert("Novo evento", "Preencha titulo, data, hora e local.");
      return;
    }

    try {
      setLoading(true);
      const uploadedImage = await uploadImageIfNeeded();
      await saveEvent({
        title: title.trim(),
        description: description.trim() || "Evento academico cadastrado no EventADS.",
        date: date.trim(),
        time: time.trim(),
        place: place.trim(),
        type: "Academico",
        color: colors.primaryDark,
        icon: "book-outline",
        imageUri,
        ...uploadedImage,
      });
      navigation.navigate("Main", { screen: "Events" });
    } catch (error) {
      const isNetworkError = error.code === "ERR_NETWORK" || error.message?.includes("Network");
      const message = isNetworkError
        ? "Não consegui acessar o backend. Confira se o EventADS-backend está rodando na porta 3002."
        : "Não foi possível salvar o evento.";
      Alert.alert("Erro", message);
      console.log("Erro ao salvar evento:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Novo Evento" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Adicionar imagem do evento</Text>
        <Pressable onPress={pickImage}>
          {imageUri ? (
            <ImageBackground source={{ uri: imageUri }} imageStyle={styles.uploadImage} style={styles.upload}>
              <View style={styles.uploadOverlay}>
                <Ionicons name="image-outline" size={30} color={colors.white} />
                <Text style={styles.uploadTitleLight}>Trocar imagem</Text>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.upload}>
              <Ionicons name="image-outline" size={36} color={colors.primary} />
              <Text style={styles.uploadTitle}>Selecionar imagem</Text>
              <Text style={styles.uploadText}>Toque para escolher</Text>
            </View>
          )}
        </Pressable>

        <InputField label="Titulo do evento" placeholder="Digite o titulo" value={title} onChangeText={setTitle} autoCapitalize="sentences" />
        <InputField label="Descricao" placeholder="Descreva o evento" value={description} onChangeText={setDescription} multiline autoCapitalize="sentences" />
        <EventDateTimeFields date={date} time={time} onChangeDate={setDate} onChangeTime={setTime} />
        <InputField label="Local" placeholder="Digite o local" value={place} onChangeText={setPlace} autoCapitalize="words" />

        <PrimaryButton title={loading ? "Salvando..." : "Salvar Evento"} disabled={loading} onPress={handleSave} style={styles.button} />
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
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  upload: {
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  uploadImage: {
    borderRadius: 8,
  },
  uploadOverlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "rgba(44, 33, 24, 0.38)",
  },
  uploadTitleLight: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  uploadTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  uploadText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
  button: {
    marginTop: 8,
  },
});


