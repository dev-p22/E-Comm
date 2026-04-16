import z from "zod";


export const checkoutSchema = z.object({
    name: z.string().trim().min(3).max(25).regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    address: z.string().trim().min(8).max(200).regex(/^[a-zA-Z0-9\s,.-]+$/, "Address can only contain letters, numbers, spaces, commas, periods, and hyphens"),
    city: z.string().trim().min(3).max(100).regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
    pincode: z.string().trim().min(3).max(10).regex(/^[0-9]+$/, "Pincode can only contain numbers"),
    paymentMethod: z.enum(["COD", "ONLINE"]),
})