import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import { useAuth } from "../context/AuthContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleCreateProduct = async (newProduct) => {
    // Prepare complete product object
    const createdItem = {
      ...newProduct,
      // Inject fallback semantic tags for AI vector simulation
      tags: [
        newProduct.category.toLowerCase(),
        ...newProduct.name.toLowerCase().split(" ").filter(w => w.length > 2)
      ],
      aiEmbeddingsContext: `Conceptual representation of ${newProduct.name}. Category: ${newProduct.category}. Details: ${newProduct.description}`
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(createdItem)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create product");
      }

      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "Error creating product");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product Item"
        subtitle="Catalog a new product in the database. Vector embeddings will be compiled automatically."
      />

      <ProductForm
        onSubmit={handleCreateProduct}
        buttonText="Create Product Item"
      />
    </div>
  );
}
