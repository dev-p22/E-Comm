import { addToCart } from "@/services/cartServices";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

export  function useAddToCart(userid : string , product : Product){
    return async function handleAddToCart(){
         const res = await addToCart(userid , product);

    if (res?.success) {
      toast.success("Product added to cart!");
    } else {
      toast.error("Failed to add to cart");
    }
    }
}