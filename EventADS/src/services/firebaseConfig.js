import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3Was11cQ12qqt7OO4NfSjoOaan-DFTbE",
  authDomain: "eventads-7dcaa.firebaseapp.com",
  projectId: "eventads-7dcaa",
  storageBucket: "eventads-7dcaa.firebasestorage.app",
  messagingSenderId: "342057739001",
  appId: "1:342057739001:web:9c57ddf2dd51a41b65b828",
  measurementId: "G-LHJRR2QSLN",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
