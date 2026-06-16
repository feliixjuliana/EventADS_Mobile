import { api } from "./api";

export async function uploadEventImage(asset, publicId) {
  if (!asset?.uri) return {};

  const data = new FormData();
  data.append("file", buildImageFile(asset, "event.jpg"));
  data.append("public_id", publicId || `event_${Date.now()}`);

  const response = await api.post("/upload-event", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    imageUrl: response.data.secure_url,
    imagePublicId: response.data.public_id,
    imageUri: null,
  };
}

export async function uploadProfileImage({ asset, publicId, name, email, uid }) {
  if (!asset?.uri) return null;

  const data = new FormData();
  data.append("file", buildImageFile(asset, "profile.jpg"));
  data.append("public_id", publicId || `profile_${uid || Date.now()}`);
  data.append("name", name);
  data.append("email", email);
  data.append("uid", uid || "");

  const response = await api.post("/upload-profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    photoURL: response.data.secure_url,
    photoPublicId: response.data.public_id,
  };
}

function buildImageFile(asset, fallbackName) {
  return {
    uri: asset.uri,
    type: asset.mimeType?.startsWith("image/") ? asset.mimeType : "image/jpeg",
    name: asset.fileName || fallbackName,
  };
}
