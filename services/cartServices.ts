import { CART_API } from "@/constant/endpoints";
import axiosClient from "@/constant/apiClient";
import { Product } from "@/types/product";

export const addToCart = async (userId: string, product: Product) => {
  try {
    const res = await axiosClient.post(CART_API.ADD_TO_CART_API, {
      userId,
      product,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCart = async () => {
  try {
    const res = await axiosClient.get(CART_API.GET_CART_API);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    const response = await axiosClient.delete(CART_API.REMOVE_FROM_CART_API, {
      data: { productId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateCart = async (productId: string, type: string) => {
  try {
    console.log(productId, type, "djfalsdfj");
    const response = await axiosClient.patch(CART_API.UPDATE_CART_API, {
      productId,
      type,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
