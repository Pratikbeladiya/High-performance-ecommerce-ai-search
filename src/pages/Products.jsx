import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable"; // This was already correct
import { initialProducts } from "../data/products";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"; // Removed unused PackageSearch
import { getProductsFromLocalStorage, setProductsToLocalStorage } from "../utils/localStorageHelpers";

export default function Products() {
  const [products, setProducts] = useState(() => {
    const storedProducts = getProductsFromLocalStorage(initialProducts);
    if (!localStorage.getItem("admin_products")) { // Initialize if not present
      setProductsToLocalStorage(initialProducts);
    }
    return storedProducts;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Wrapped handlers to reset page when search filters change
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  // Filter products derived state
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query match
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category match
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Status match
    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedStatus]);
  
  // Derived category list for dropdown
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);
  
  // Paginated products calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Edit action
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // Delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      setProductsToLocalStorage(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Products Catalog"
        subtitle="Manage inventory items, adjust stock, verify statuses, and build search indexes."
      >
        <Link
          to="/admin/add-product"
          className="py-2 px-4 bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </PageHeader>

      {/* Filters card */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleStatusChange}
        categories={categories}
      />

      {/* Products Table */}
      <ProductTable
        products={paginatedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-slate-900/20 border border-slate-900 rounded-xl">
          <span className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-300">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-300">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-300">{filteredProducts.length}</span> products
          </span>

          <div className="flex items-center gap-2">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage(Math.max(activePage - 1, 1))}
              disabled={activePage === 1}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page counts */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7.5 h-7.5 flex items-center justify-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activePage === page
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(Math.min(activePage + 1, totalPages))}
              disabled={activePage === totalPages}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
