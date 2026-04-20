"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useAddToCart } from "@/hooks/useAddToCart";
import useDeleteProduct from "@/hooks/useDeleteProduct";

export default function ProductCard({ product, user, onEdit }: any) {
  const handleAddToCart = useAddToCart(user?.id, product);

  const handleDeleteProduct = useDeleteProduct(product?.id);

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border">
      <div className="relative">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPYwxUp3JKC6jOxAZeioI-VF4o_Chj9yF2A&s"
          alt={product.title}
          width={400}
          height={200}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg line-clamp-1">{product.title}</h2>

        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <p className="text-blue-600 font-bold text-lg">₹ {product.price}</p>

        <div className="flex gap-2 mt-3">
          {user?.role !== "admin" && (
            <Button
              className="flex-1 bg-black hover:bg-gray-800 text-white cursor-pointer"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}

          {user?.role === "admin" && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(product)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteProduct}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
