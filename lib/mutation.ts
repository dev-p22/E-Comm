import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/services/productServices";

import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { queryKeys } from "@/constant/querykey";

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: Product; token: string | "" }) =>
      addProduct(data, token),

    onSuccess: (res) => {
      toast.success(res?.message || "Product added successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },

    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to add product";
      toast.error(msg);
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: string;
      data: Product;
      token: string | "";
    }) => updateProduct(id, data, token),

    onSuccess: (res) => {
      toast.success(res?.message || "Product Updated successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },

    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to Update product";
      toast.error(msg);
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string | "" }) =>
      deleteProduct(id, token),

    onSuccess: (res) => {
      toast.success(res?.message || "Product Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },

    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to Delete product";
      toast.error(msg);
    },
  });
};
