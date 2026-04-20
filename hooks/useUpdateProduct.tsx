import { auth } from "@/lib/firebase";
import {  updateProduct } from "@/services/productServices";
import { Product } from "@/types/product";
import toast from "react-hot-toast";



export function useUpdateProduct({id , setOpen , fetchProducts} : {id : string , setOpen : (open:boolean)=>void, fetchProducts:()=>void}){
    return async function handleUpdateProduct(data:Product){
    const token = await auth.currentUser?.getIdToken();
    try {
      const res = await updateProduct(id,data,token || "");

      if (res?.success) {
        toast.success("Product updated!");
        setOpen(false);

       fetchProducts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed");
    }
}}