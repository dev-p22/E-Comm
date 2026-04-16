"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/zod/checkout";

export default function CheckOut() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const fetchCart = async () => {
    setLoading(true);
    const res = await axios.get(`/api/cart?userId=${user.uid}`);
    setCart(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.uid) fetchCart();
  }, [user]);

  const total = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  
  const onSubmit = async (data: any) => {
    try {
      const orderRef = collection(db, "orders");

      await addDoc(orderRef, {
        userId: user.uid,
        items: cart,
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

          {loading && <p>Loading...</p>}

          {cart.map((item: any) => (
            <div key={item.productId} className="flex gap-3 mb-4">
              <img src={item.image} className="w-16 h-16 rounded" />
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

            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Placing..." : "Place Order"}
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}