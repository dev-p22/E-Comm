"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "@/zod/productSchema";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors  , isSubmitting},
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductType) => {

    const token = await auth.currentUser?.getIdToken();

    console.log("token",token)

    const res = await axios.post("/api/products", data,{
      headers:{
        Authorization : `Bearer ${token}`
      }
    });

    console.log(res)
    if(res.data?.success){
        toast.success("Product added successfully!");
    }else{
        toast.error("Failed to add Product");
    }

    reset();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        
        <div>
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title.message}
            </p>
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
            <p className="text-red-500 text-sm">
              {errors.price.message}
            </p>
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
            <p className="text-red-500 text-sm">
              {errors.category.message}
            </p>
          )}
        </div>       
        <Button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
         {isSubmitting ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}