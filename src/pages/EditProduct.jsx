import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import EmptyState from "../components/common/EmptyState";
import { initialProducts } from "../data/products";
import { PackageSearch } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_products");
    let currentList = initialProducts;

    if (stored) {
      try {
        currentList = JSON.parse(stored);
      } catch (e) {
        // use default
      }
    }

    const found = currentList.find((p) => p.id === id);
    if (found) {
      setProduct(found);
    }
    setLoading(false);
  }, [id]);

  const handleUpdateProduct = (updatedProduct) => {
    const stored = localStorage.getItem("admin_products");
    let currentList = initialProducts;

    if (stored) {
      try {
        currentList = JSON.parse(stored);
      } catch (e) {
        // use default
      }
    }

    const updatedList = currentList.map((p) =>
      p.id === id
        ? {
            ...p,
            ...updatedProduct,
            // Re-evaluate tags and AI context in case name/category changes
            tags: [
              updatedProduct.category.toLowerCase(),
              ...updatedProduct.name.toLowerCase().split(" ").filter(w => w.length > 2)
            ],
            aiEmbeddingsContext: `Conceptual representation of ${updatedProduct.name}. Category: ${updatedProduct.category}. Details: ${updatedProduct.description}`
          }
        : p
    );

    localStorage.setItem("admin_products", JSON.stringify(updatedList));
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12">
        <EmptyState
          title="Product not found"
          description="The product you are trying to edit does not exist or has been deleted."
          icon={PackageSearch}
          actionButtonText="Back to Catalog"
          onActionClick={() => navigate("/admin/products")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Product: ${product.name}`}
        subtitle="Modify product information. Submitting updates the database and recalculates vector indexes."
      />

      <ProductForm
        initialData={product}
        onSubmit={handleUpdateProduct}
        buttonText="Save Changes"
      />
    </div>
  );
}
