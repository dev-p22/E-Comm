

// src/constants/queryKeys.ts

export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },

  cart: {
    all: ["cart"],
    userCart: (userId: string) => ["cart", userId],
  },

  products: {
    all: ["products"],
    list: ["products", "list"],
    detail: (id: string) => ["products", id],
  },
};