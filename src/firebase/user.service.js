import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserProfile = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    role: "user",
    createdAt: new Date(),
  });
};
