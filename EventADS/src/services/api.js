import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const androidUrl = "http://10.0.2.2:3002";
const localUrl = "http://10.31.90.179:3002";

function getExpoHostUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (!hostUri) return null;

  const host = hostUri.split(":")[0];
  return host ? `http://${host}:3002` : null;
}

export const API_URL = configuredApiUrl || getExpoHostUrl() || (Platform.OS === "android" ? androidUrl : localUrl);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});
