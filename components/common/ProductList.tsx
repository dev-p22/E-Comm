"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import UpdateProductDialog from "../admin/UpdateProductDialog";
import { deleteProduct } from "@/services/productServices";

export default function ProductList({
  products,
  loading,
  fetchProducts,
}: {
  products: any[];
  loading: boolean;
  fetchProducts: () => void;
}) {
  const user = useSelector((state: any) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleDelete = async (id: string) => {
    const token = await auth.currentUser?.getIdToken();

    const res = await deleteProduct(id, token || "");

    if (res?.success) {
      toast.success("Product deleted successfully!");
      fetchProducts();
    }
  };

  const handleEdit = (product: any) => {
    setOpen(true);

    setSelectedProduct(product);
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Products</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <ProductCard
            key={p.id}
            product={p}
            user={user}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <UpdateProductDialog
        open={open}
        setOpen={setOpen}
        product={selectedProduct}
        fetchProducts={fetchProducts}
      />
    </div>
  );
}
