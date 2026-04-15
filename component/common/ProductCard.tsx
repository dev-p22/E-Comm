"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ProductCard({ product, user, onDelete, onEdit }: any) {
  const handleAddToCart = async () => {
    const res = await axios.post("/api/cart", {
      userId: user.uid,
      product,
    });

    if (res.data?.success) {
      toast.success("Product added to cart!");
    } else {
      toast.error("Failed to add to cart");
    }
  };

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
                onClick={() => onDelete(product.id)}
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
