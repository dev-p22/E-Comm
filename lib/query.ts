import { queryKeys } from "@/constant/querykey";
import { fetchAllProducts } from "@/services/productServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: fetchAllProducts,
    staleTime:10000
  });
}
