"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "@/zod/authSchema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: LoginType) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCred.user;

      const snap = await getDoc(doc(db, "users", user.uid));
      const userData = snap.data();

      const finalUser = {
        uid: user.uid,
        email: user.email,
        role: userData?.role || "user",
        fullName: userData?.fullName,
      };

      dispatch(setUser(finalUser));
      localStorage.setItem("user", JSON.stringify(finalUser));

      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      {" "}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        {" "}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {" "}
          Welcome Back{" "}
        </h2>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {" "}
          <div>
            {" "}
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {" "}
                {errors.email.message}{" "}
              </p>
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />{" "}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {" "}
                {errors.password.message}{" "}
              </p>
            )}{" "}
          </div>{" "}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            {" "}
            {isSubmitting ? "Logging in..." : "Login"}{" "}
          </button>{" "}
        </form>{" "}
        <p className="text-center text-sm text-gray-500">
          {" "}
          Don’t have an account? <span className="text-blue-500" onClick={()=>router.replace("/register")}>Register</span>
        </p>{" "}
      </div>{" "}
    </div>
  );
}
