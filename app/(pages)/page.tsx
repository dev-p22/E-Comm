"use client";

import Navbar from "@/component/common/Navbar";
import ProductList from "@/component/common/ProductList";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await axios.get("/api/products");
    setProducts(res.data);
    setLoading(false)
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
