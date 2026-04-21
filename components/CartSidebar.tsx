"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCart } from "@/lib/query";
import useRemoveFromCart from "@/hooks/useRemoveFromCart";
import { useUpdateCartMutation } from "@/lib/mutation";
import { Item } from "@/types/item";

export default function CartSidebar({
  setOpenCart,
  openCart,
}: {
  setOpenCart: (openCart: boolean) => void;
  openCart: boolean;
}) {
  const router = useRouter();

  const { data, isLoading } = useGetCart();
  const { removeFromCart } = useRemoveFromCart();
  const { mutate: updateCartMutate } = useUpdateCartMutation();

  const total = Array.isArray(data?.items)
    ? data?.items.reduce(
        (acc: number, item: Item) => acc + (item.price * item.quantity || 0),
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
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : null}

          {isLoading && <p className="text-center text-gray-500">Loading...</p>}

          {!isLoading && data?.items?.length === 0 && (
            <p className="text-gray-500 text-center">Cart is empty</p>
          )}

          {data?.items.map((item: Item) => (
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
                    onClick={() => {
                      if (item.quantity <= 1) {
                        removeFromCart(item.productId);
                      } else {
                        updateCartMutate({
                          productId: item.productId,
                          type: "dec",
                        });
                      }
                    }}
                  >
                    -
                  </Button>

                  <span className="text-sm font-medium">{item.quantity}</span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateCartMutate({
                        productId: item.productId,
                        type: "inc",
                      })
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-2"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-lg">Total: ₹ {total}</h3>

          {data?.items?.length >= 1 && (
            <Button
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setOpenCart(false);
                router.push("/checkout");
              }}
            >
              Checkout
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
