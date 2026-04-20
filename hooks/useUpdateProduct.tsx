import { auth } from "@/lib/firebase";
import { useUpdateProductMutation } from "@/lib/mutation";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

export function useUpdateProduct({
  id,
  setOpen,
}: {
  id: string;
  setOpen: (open: boolean) => void;
}) {
  const { mutate } = useUpdateProductMutation();

  return async function handleUpdateProduct(data: Product) {
    const token = (await auth.currentUser?.getIdToken()) ?? "";

    try {
      mutate(
        { id, data, token },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };
}
