import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price must be greater than 0"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  category: z
    .string()
    .min(2, "Category is required"),
});

export type ProductType = z.infer<typeof productSchema>;