"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/zod/checkout";
import { useGetCart } from "@/lib/query";
import { Item } from "@/types/item";
import Image from "next/image";

export default function CheckOut() {
  const user = useSelector((state: any) => state.auth.user);
  const { data, isPending } = useGetCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const total = data?.items?.reduce(
    (acc: number, item: Item) => acc + item.price * item.quantity,
    0,
  );

  const onSubmit = async (data: any) => {
    try {
      const orderRef = collection(db, "orders");

      await addDoc(orderRef, {
        userId: user.uid,
        items: data?.items,
        total,
        shippingDetails: data,
        createdAt: new Date(),
      });

      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="contents">
        <div className="border rounded-xl p-5 shadow">
          <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

          <input
            placeholder="Full Name"
            className="w-full border p-2 mb-3 rounded"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            placeholder="Address"
            className="w-full border p-2 mb-3 rounded"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}

          <input
            placeholder="City"
            className="w-full border p-2 mb-3 rounded"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}

          <input
            placeholder="Pincode"
            className="w-full border p-2 mb-3 rounded"
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm">{errors.pincode.message}</p>
          )}

          <select
            className="w-full border p-2 rounded"
            {...register("paymentMethod")}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>
        </div>

        <div className="border rounded-xl p-5 shadow">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {isPending && <p>Loading...</p>}

          {data?.items.map((item: any) => (
            <div key={item.productId} className="flex gap-3 mb-4">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPYwxUp3JKC6jOxAZeioI-VF4o_Chj9yF2A&s"
                alt={item.title}
                width={50}
                height={50}
                className="rounded object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500">
                  ₹ {item.price} × {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-bold">Total: ₹ {total}</h3>

            {data?.items.length >= 1 && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Placing..." : "Place Order"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
