import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/services/productServices";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { queryKeys } from "@/constant/querykey";
import { addToCart, removeFromCart } from "@/services/cartServices";
import { updateCart } from "@/services/cartServices";
import { logoutUser } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";

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

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, product }: { userId: string; product: Product }) =>
      addToCart(userId, product),

    onSuccess: (res) => {
      toast.success(res?.message || "Product added To Cart successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    },

    onError: (err: any) => {
      const msg =
        err.response?.data?.error || "Failed to add product Into cart";
      toast.error(msg);
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),

    onSuccess: (res) => {
      toast.success(res?.message || "Product Removed From  Cart successfully");

      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    },

    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to  Removed from cart";
      toast.error(msg);
    },
  });
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      type,
    }: {
      productId: string;
      type: "inc" | "dec";
    }) => updateCart(productId, type),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.all,
      });
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update cart");
    },
  });
};

export const useLogoutUserMutation = () => {
  const dispatch = useDispatch();


  return useMutation({
    mutationFn: () => logoutUser(),

    onSuccess: () => {
      toast.success("Logged out successfully");
      dispatch(logout())
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to Logged Out");
    },
  });
};
