import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import EmptyState from "../components/common/EmptyState";
import { PackageSearch } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct({ ...data, id: data._id });
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (updatedProduct) => {
    const updatedItem = {
      ...updatedProduct,
      // Re-evaluate tags and AI context in case name/category changes
      tags: [
        updatedProduct.category.toLowerCase(),
        ...updatedProduct.name.toLowerCase().split(" ").filter(w => w.length > 2)
      ],
      aiEmbeddingsContext: `Conceptual representation of ${updatedProduct.name}. Category: ${updatedProduct.category}. Details: ${updatedProduct.description}`,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedItem)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update product");
      }

      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "Error updating product");
    }
  };


  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
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
        key={product.id}
        initialData={product}
        onSubmit={handleUpdateProduct}
        buttonText="Save Changes"
      />
    </div>
  );
}
