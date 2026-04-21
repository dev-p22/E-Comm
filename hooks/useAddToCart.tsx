import { useAddToCartMutation } from "@/lib/mutation";
import { Product } from "@/types/product";

export function useAddToCart(userId: string, product: Product) {
  const { mutate } = useAddToCartMutation();

  return async function handleAddToCart() {
    mutate({ userId, product });
  };
}
