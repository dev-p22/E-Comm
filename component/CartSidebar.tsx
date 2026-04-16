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
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartSidebar({ setOpenCart, openCart, user }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setLoading(true);
      // API now uses authenticated user from middleware
      const res = await axios.get("/api/cart", {
        withCredentials: true,
      });
      // Extract items array from response
      setItems(res.data?.items || []);
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCart();
    }
  }, [user, openCart]);

  const removeItem = async (productId: string) => {
    try {
      const res = await axios.delete("/api/cart", {
        data: { productId },
        withCredentials: true,
      });

      if (res.data?.success) {
        setItems(res.data.items || []);
        toast.success("Item removed from cart");
      }
    } catch (error: any) {
      toast.error("Failed to remove item");
      console.error("Remove item error:", error);
    }
  };

  const updateQuantity = async (productId: string, type: "inc" | "dec") => {
    try {
      const res = await axios.patch(
        "/api/cart",
        {
          productId,
          type,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data?.success) {
        setItems(res.data.items || []);
      }
    } catch (error: any) {
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", error);
    }
  };

  // Ensure items is an array before using reduce
  const total = Array.isArray(items)
    ? items.reduce(
        (acc: number, item: any) => acc + (item.price * item.quantity || 0),
        0,
      )
    : 0;

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
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPYwxUp3JKC6jOxAZeioI-VF4o_Chj9yF2A&s"
                alt={item.title}
                width={80}
                height={80}
                className="rounded object-cover"
              />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <p className="text-xs text-gray-500">₹ {item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.productId, "dec")}
                  >
                    -
                  </Button>

                  <span className="text-sm font-medium">{item.quantity}</span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.productId, "inc")}
                  >
                    +
                  </Button>
                </div>

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
