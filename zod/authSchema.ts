import { z } from "zod";


export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name too long"),

  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long"),
});


export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;