export const AUTH_API = {
  LOGIN: "/api/login",
  ME: "/api/me",
  LOGOUT: "/api/logout",
};

export const CART_API = {
  ADD_TO_CART_API: "/api/cart",
  GET_CART_API: "/api/cart",
  REMOVE_FROM_CART_API: "/api/cart",
  UPDATE_CART_API: "/api/cart",
};

export const PRODUCT_API = {
  PRODUCT_GET_API: "/api/products",
  PRODUCT_POST_API: "/api/products",
  PRODUCT_DELETE_API: (id: string) => `/api/products/${id}`,
  PRODUCT_UPDATE_API: (id: number) => `/api/products/${id}`,
};
