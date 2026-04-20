import { auth } from "@/lib/firebase";
import { addProduct } from "@/services/productServices";
import { Product } from "@/types/product";
import toast from "react-hot-toast";



export function useAddProduct(reset : ()=>void){
    return async function handleAddProduct(data:Product){
    const token = await auth.currentUser?.getIdToken();

    const res = await addProduct(data, token || "");

    if (res.success) {
      toast.success("Product added successfully!");
    } else {
      toast.error("Failed to add Product");
    }
    reset();
    }
}