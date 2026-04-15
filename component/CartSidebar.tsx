"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartSidebar({ setOpenCart, openCart, user }: any) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    const res = await axios.get(`/api/cart?userId=${user.uid}`);
    setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.uid) fetchCart();
  }, [user, openCart]);

  const removeItem = async (id: string) => {
    const res = await axios.delete(`/api/cart/${id}`, {
      data: { userId: user.uid },
    });

    console.log(res);

    if (res.data?.success) {
      setItems(res.data.items);
      toast.success("Item removed from cart");
    }
    fetchCart();
  };

  const total = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0,
  );

  return (
    <Sheet open={openCart} onOpenChange={setOpenCart}>
      <SheetContent side="right" className="w-96 p-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : null}

          {items.length === 0 && (
            <p className="text-gray-500 text-center">Cart is empty</p>
          )}

          {items.map((item: any) => (
            <div
              key={item.productId}
              className="flex gap-3 border rounded-lg p-3 shadow-sm"
            >
              <img
                src={item.image}
                className="w-16 h-16 rounded object-cover"
              />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <p className="text-xs text-gray-500">₹ {item.price}</p>

                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-2"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-lg">Total: ₹ {total}</h3>

          <Button
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setOpenCart(false);
              router.push("/checkout");
            }}
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
