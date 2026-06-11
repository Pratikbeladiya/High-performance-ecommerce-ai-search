import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import { initialProducts } from "../data/products";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleCreateProduct = (newProduct) => {
    const stored = localStorage.getItem("admin_products");
    let currentList = initialProducts;
    
    if (stored) {
      try {
        currentList = JSON.parse(stored);
      } catch (e) {
        // use default
      }
    }

    // Prepare complete product object
    const createdItem = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      // Inject fallback semantic tags for AI vector simulation
      tags: [
        newProduct.category.toLowerCase(),
        ...newProduct.name.toLowerCase().split(" ").filter(w => w.length > 2)
      ],
      aiEmbeddingsContext: `Conceptual representation of ${newProduct.name}. Category: ${newProduct.category}. Details: ${newProduct.description}`
    };

    const updatedList = [createdItem, ...currentList];
    localStorage.setItem("admin_products", JSON.stringify(updatedList));
    navigate("/admin/products");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        subtitle="Catalog a new product in the database. Vector embeddings will be compiled automatically."
      />

      <ProductForm
        onSubmit={handleCreateProduct}
        buttonText="Create Product"
      />
    </div>
  );
}
