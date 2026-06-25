import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import { initialProducts } from "../data/products";
import EmptyState from "../components/common/EmptyState";
import { PackageSearch } from "lucide-react";
import { getProductsFromLocalStorage, setProductsToLocalStorage } from "../utils/localStorageHelpers";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    const currentList = getProductsFromLocalStorage(initialProducts);
    return currentList.find((p) => p.id === id) || null;
  }, [id]);

  const handleUpdateProduct = (updatedProduct) => {
    const currentList = getProductsFromLocalStorage(initialProducts);
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
            aiEmbeddingsContext: `Conceptual representation of ${updatedProduct.name}. Category: ${updatedProduct.category}. Details: ${updatedProduct.description}`,
          }
        : p
    );

    setProductsToLocalStorage(updatedList);
    navigate("/admin/products");
  };


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
