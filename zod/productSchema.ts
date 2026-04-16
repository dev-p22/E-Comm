import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title too long")
    .regex(/^[a-zA-Z]+$/, "Title must contain only letters, no spaces"),

price: z .number("Price must be a number") .min(1, "Price must be greater than 0").max(100000,"price must be less than 100000"),

description: z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters")
  .max(500, "Description too long")
  .refine((val) => /[a-zA-Z]/.test(val), {
    message: "Description must contain at least one letter",
  })
  .refine((val) => !/^([a-zA-Z0-9])\1+$/.test(val), {
    message: "Description cannot be repetitive characters",
  })
  .regex(
    /^[a-zA-Z0-9\s,.-]+$/,
    "Only letters, numbers, spaces, commas, periods, and hyphens allowed"
  ),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(30, "Category too long")
    .regex(/^[a-zA-Z]+$/, "Category must contain only letters, no spaces"),
});

export type ProductType = z.infer<typeof productSchema>;