"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterType } from "@/zod/authSchema";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterType) => {
    try {
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

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-500"
            onClick={() => router.replace("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
