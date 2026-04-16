import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  price: z
    .number("Price must be a number")
    .min(1, "Price must be greater than 0"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters").regex(/^[a-zA-Z0-9\s,.-]+$/, "Address can only contain letters, numbers, spaces, commas, periods, and hyphens"),

  category: z
    .string()
    .min(2, "Category is required").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

export type ProductType = z.infer<typeof productSchema>;