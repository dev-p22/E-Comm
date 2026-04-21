import { queryKeys } from "@/constant/querykey";
import { getCart } from "@/services/cartServices";
import { fetchAllProducts } from "@/services/productServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: fetchAllProducts,
    staleTime:10000
  });
}


export function useGetCart(){
  return useQuery({
    queryKey:queryKeys.cart.all,
    queryFn: getCart
  })
}