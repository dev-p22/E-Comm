import { PRODUCT_API } from "@/constant/api";
import axiosClient from "@/constant/apiClient"
import { Product } from "@/types/product";

export const fetchAllProducts = async ()=>{
    try{
        const res = await axiosClient.get(PRODUCT_API.PRODUCT_GET_API);
        return res.data;
    }catch(error){
        console.error("Error fetching products:",error);
        throw error;
    }
}

export const addProduct = async (data: Product , token : string | "")=>{
   try{
      const res = await axiosClient.post(PRODUCT_API.PRODUCT_POST_API,data,{
        headers : {
            Authorization : `Bearer ${token}`
        }
      })

      return res.data;
   }catch(error){
    throw error;
   }
}

export const updateProduct = async (id:number , data : Product , token : string | "")=>{
    try{
       const response = await axiosClient.put(PRODUCT_API.PRODUCT_UPDATE_API(id), data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return response.data;
    }catch(error){
        throw error;
    }
}

export const deleteProduct = async (id:string , token : string | "")=>{
    try{
        const response = await axiosClient.delete(PRODUCT_API.PRODUCT_DELETE_API(id),{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data;
    }catch(error){
        throw error;
    }
}