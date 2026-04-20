"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "@/zod/authSchema";
import { useRouter } from "next/navigation";
import useLogin from "@/hooks/useLogin";

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });
  const handleLogin = useLogin();
  const router = useRouter();

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => router.replace("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
