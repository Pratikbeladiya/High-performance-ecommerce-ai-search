import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function ProductForm({
  initialData,
  onSubmit,
  buttonText = "Save Product"
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    imageUrl: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category || "Electronics",
        stock: initialData.stock || "",
        imageUrl: initialData.imageUrl || ""
      });
    }
  }, [initialData]);

  const categories = ["Electronics", "Home & Living", "Apparel"];

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Product name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      tempErrors.price = "Enter a valid positive price.";
    }
    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      tempErrors.stock = "Stock count must be a non-negative integer.";
    }
    if (!formData.imageUrl.trim() || !formData.imageUrl.startsWith("http")) {
      tempErrors.imageUrl = "Provide a valid image URL starting with http/https.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? (value === "" ? "" : Number(value)) : value
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name] : "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulating submittal transition delay
    setTimeout(() => {
      // Derive status automatically from stock level
      let status = "In Stock";
      if (formData.stock === 0) status = "Out of Stock";
      else if (formData.stock <= 5) status = "Low Stock";

      onSubmit({
        ...formData,
        status,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Fields Section */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-panel p-6 rounded-2xl space-y-4.5">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                PRODUCT NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. AeroSound Headphones"
                className={`w-full bg-slate-900 border ${
                  errors.name ? "border-rose-500/70 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500"
                } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              />
              {errors.name && <p className="text-[10px] text-rose-400 font-semibold">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe product highlights, dimensions, and specifications..."
                className={`w-full bg-slate-900 border ${
                  errors.description ? "border-rose-500/70 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500"
                } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none`}
              />
              {errors.description && <p className="text-[10px] text-rose-400 font-semibold">{errors.description}</p>}
            </div>

            {/* Price, Stock, Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  CATEGORY
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  PRICE (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="299.99"
                  className={`w-full bg-slate-900 border ${
                    errors.price ? "border-rose-500/70 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500"
                  } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
                {errors.price && <p className="text-[10px] text-rose-400 font-semibold">{errors.price}</p>}
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  STOCK QUANTITY
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  className={`w-full bg-slate-900 border ${
                    errors.stock ? "border-rose-500/70 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500"
                  } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
                {errors.stock && <p className="text-[10px] text-rose-400 font-semibold">{errors.stock}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Media / Image Preview Column */}
        <div className="space-y-5">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Product Image Media
            </h3>

            {/* Image URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                IMAGE URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={`w-full bg-slate-900 border ${
                  errors.imageUrl ? "border-rose-500/70" : "border-slate-800 focus:border-indigo-500"
                } rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none transition-all`}
              />
              {errors.imageUrl && <p className="text-[10px] text-rose-400 font-semibold">{errors.imageUrl}</p>}
            </div>

            {/* Preview Box */}
            <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden aspect-square flex items-center justify-center relative group">
              {formData.imageUrl && !errors.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover transition-transform duration-355 group-hover:scale-105"
                  onError={() => {
                    setErrors((prev) => ({ ...prev, imageUrl: "Failed to load image from URL." }));
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <span className="text-xs text-slate-500">Image Preview Window</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-900">
        <Link
          to="/admin/products"
          className="flex items-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-slate-200 font-medium rounded-xl text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
