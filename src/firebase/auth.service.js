import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import apiClient from "../api/apiClient";

export const loginWithGoogle = async () => {
  // 1. Google popup
  const result = await signInWithPopup(auth, googleProvider);

  // 2. Get Firebase ID token
  const firebaseToken = await result.user.getIdToken();

  // 3. Send token to backend
  const res = await apiClient.post("/auth/google", {
    token: firebaseToken,
  });

  // 4. Backend JWT
  return res.data.token;
};
