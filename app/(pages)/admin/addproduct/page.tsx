"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "@/zod/productSchema";
import { useAddProduct } from "@/hooks/useAddProduct";

function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const handleAddProduct = useAddProduct(reset);


  return (
    <div className="w-full h-screen">
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-4">
          <div>
            <input
              {...register("title")}
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("price", { valueAsNumber: true })} // ✅ FIX
              type="number"
              placeholder="Price"
              className="w-full p-2 border rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("category")}
              placeholder="Category"
              className="w-full p-2 border rounded"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
          <Button
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
