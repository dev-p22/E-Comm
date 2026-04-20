import { auth } from "@/lib/firebase";
import { useAddProductMutation } from "@/lib/mutation";
import { Product } from "@/types/product";

export function useAddProduct(reset: () => void) {
  const { mutate } = useAddProductMutation();

  return async function handleAddProduct(data: Product) {
    const token = (await auth.currentUser?.getIdToken()) ?? "";

    mutate(
      { data, token },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };
}
