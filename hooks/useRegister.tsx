
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { auth, db } from "@/lib/firebase";
import { registerUser } from "@/services/authServices";
import { RegisterType } from "@/zod/authSchema";

export function useRegister() {
  const router = useRouter();

  return async function handleRegister(data: RegisterType) {
    try {
      await registerUser(auth, db, data);

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };
}