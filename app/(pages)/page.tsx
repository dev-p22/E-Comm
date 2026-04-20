"use client";

import Navbar from "@/components/common/Navbar";
import ProductList from "@/components/common/ProductList";
import { useFetchAllProducts } from "@/lib/query";

export default function Home() {
  const { isPending, data } = useFetchAllProducts();

  if (isPending) {
    return <h3 className="text-xl font-bold">Loading...</h3>;
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      <ProductList products={data} />
    </div>
  );
}
