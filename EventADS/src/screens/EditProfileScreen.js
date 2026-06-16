import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AppHeader } from "../components/AppHeader";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "../components/KeyboardAwareScrollView";
import { PatternBackground } from "../components/PatternBackground";
import { PrimaryButton } from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";
import { getAuthMessage } from "../services/authService";
import { uploadProfileImage } from "../services/imageUploadService";
import { colors } from "../theme/colors";

export function EditProfileScreen({ navigation }) {
  const { perfil, updateUserProfile } = useApp();
  const [name, setName] = useState(perfil?.name || "");
  const [email, setEmail] = useState(perfil?.email || "");
  const [photoURL, setPhotoURL] = useState(perfil?.photoURL || null);
  const [photoAsset, setPhotoAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(perfil?.name || "");
    setEmail(perfil?.email || "");
    setPhotoURL(perfil?.photoURL || null);
  }, [perfil]);

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Perfil", "Permita acesso a galeria para escolher uma foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotoURL(asset.uri);
      setPhotoAsset(asset);
    }
  }

  async function uploadPhotoIfNeeded() {
    if (!photoAsset) return { photoURL };

    return uploadProfileImage({
      asset: photoAsset,
      publicId: perfil?.photoPublicId,
      name: name.trim(),
      email: email.trim() || perfil?.email,
      uid: perfil?.uid,
    });
  }

  async function handleSaveProfile() {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Perfil", "Digite nome e e-mail.");
      return;
    }

    try {
      setLoading(true);
      const uploadedPhoto = await uploadPhotoIfNeeded();
      await updateUserProfile({ name: name.trim(), email: email.trim(), ...uploadedPhoto });
      setPhotoAsset(null);
      Alert.alert("Perfil", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      const message =
        error?.code === "auth/requires-recent-login"
          ? "Para alterar o e-mail, saia e entre novamente. Depois tente salvar o perfil."
          : getAuthMessage(error);
      Alert.alert("Erro ao atualizar perfil", message);
      console.log("Erro perfil:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PatternBackground />
      <AppHeader title="Editar Perfil" leftIcon="chevron-back" onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={pickPhoto} style={styles.avatar}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="camera" size={34} color={colors.primary} />
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color={colors.white} />
          </View>
        </Pressable>
        <Text style={styles.photoHint}>Toque na foto para trocar</Text>

        <InputField label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} autoCapitalize="words" />
        <InputField label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <PrimaryButton title={loading ? "Salvando..." : "Salvar Perfil"} disabled={loading} onPress={handleSaveProfile} style={styles.saveButton} />
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
    padding: 22,
    paddingBottom: 48,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
    marginBottom: 8,
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  photoHint: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 10,
  },
});
