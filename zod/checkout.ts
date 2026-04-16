import z from "zod";


export const checkoutSchema = z.object({
    name: z.string().trim().min(3).max(25),
    address: z.string().trim().min(8).max(200),
    city: z.string().trim().min(3).max(100),
    pincode: z.string().trim().min(3).max(10),
    paymentMethod: z.enum(["COD", "ONLINE"]),
})