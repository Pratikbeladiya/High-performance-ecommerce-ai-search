import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import { initialProducts } from "../data/products";
import { getProductsFromLocalStorage, setProductsToLocalStorage } from "../utils/localStorageHelpers";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleCreateProduct = (newProduct) => {
    const currentList = getProductsFromLocalStorage(initialProducts);
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
    setProductsToLocalStorage(updatedList);
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
