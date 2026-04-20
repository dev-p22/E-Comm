import axiosClient from "@/constant/apiClient";
import { AUTH_API } from "@/constant/api";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { Firestore, doc, setDoc } from "firebase/firestore";
import { LoginData } from "@/types/loginUser";
import { User } from "@/types/user";

export async function registerUser(auth: Auth, db: Firestore, data: User) {
  const userCred = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );

  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: data.email,
    fullName: data.fullName,
    role: "user",
    createdAt: new Date(),
  });

  return {
    uid: user.uid,
    email: user.email,
  };
}

export async function loginUser(data: LoginData) {
  const res = await axiosClient.post(AUTH_API.LOGIN, data);
  return res.data;
}

export async function getCurrentUser() {
  const res = await axiosClient.get(AUTH_API.ME);
  return res.data;
}

export async function logoutUser() {
  const res = await axiosClient.post(AUTH_API.LOGOUT, {});
  return res.data;
}
