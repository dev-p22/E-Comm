"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CheckOut() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.auth.user); 

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
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

  const handleOrder = async () => {
    if ((!form.name && form.name.length < 3 ) || (!form.address && form.address.length < 8) || (!form.city && form.city.length < 3)|| ( !form.pincode && form.pincode.length < 3)) {
      return toast.error("Please fill all  the fields correctly");
    }

    try {
        toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      
      
      <div className="border rounded-xl p-5 shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

        <input
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Address"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          placeholder="City"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="Pincode"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
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
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
            onClick={handleOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}