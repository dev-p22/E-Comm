"use client";

import Navbar from "@/components/common/Navbar";
import ProductList from "@/components/common/ProductList";
import { fetchAllProducts } from "@/services/productServices";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await fetchAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  if (loading) {
    return <h3 className="text-xl font-bold">Loading...</h3>;
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      <ProductList products={products} loading={loading} fetchProducts={fetchProducts}/>
    </div>
  );
}
