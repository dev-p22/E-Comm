"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "@/zod/productSchema";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UpdateProductDialog({
  open,
  setOpen,
  product,
  fetchProducts,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  product: any;
  fetchProducts : ()=>void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductType) => {
    const token = await auth.currentUser?.getIdToken();

    try {
      const res = await axios.put(`/api/products/${product.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        toast.success("Product updated!");
        setOpen(false);

       fetchProducts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Product </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

          <input
            {...register("title")}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <input
            {...register("category")}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}