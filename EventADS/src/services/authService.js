import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
}

export async function registerWithEmail(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  if (name.trim()) {
    await updateProfile(userCredential.user, {
      displayName: name.trim(),
    });
  }

  return userCredential.user;
}

export function logoutUser() {
  return signOut(auth);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

export function getAuthMessage(error) {
  const messages = {
    "auth/invalid-email": "Digite um e-mail valido.",
    "auth/missing-password": "Digite sua senha.",
    "auth/missing-email": "Digite seu e-mail.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/requires-recent-login": "Saía e entre novamente para alterar dados sensíveis como e-mail.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/operation-not-allowed": "Ative o provedor E-mail/Senha no Firebase Authentication.",
    "auth/configuration-not-found": "Configure o Firebase Authentication e ative o provedor E-mail/Senha.",
    "auth/network-request-failed": "Sem conexão. Tente novamente.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
  };

  return messages[error?.code] || "Não foi possível concluir a ação. Tente novamente.";
}
