import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Analytics from "../pages/Analytics";
import SearchTesting from "../pages/SearchTesting";

// Lazy load user pages for code splitting
const UserLayout = lazy(() => import("../layouts/UserLayout"));
const Home = lazy(() => import("../pages/user/Home"));
const Catalog = lazy(() => import("../pages/user/Catalog"));
const ProductDetail = lazy(() => import("../pages/user/ProductDetail"));
const Checkout = lazy(() => import("../pages/user/Checkout"));
const Orders = lazy(() => import("../pages/user/Orders"));
const Profile = lazy(() => import("../pages/user/Profile"));

const UserLoader = () => (
  <div className="min-h-screen bg-[#030712] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* User Storefront Routes */}
      <Route
        path="/"
        element={
          <Suspense fallback={<UserLoader />}>
            <UserLayout />
          </Suspense>
        }
      >
        <Route index element={<Suspense fallback={<UserLoader />}><Home /></Suspense>} />
        <Route path="catalog" element={<Suspense fallback={<UserLoader />}><Catalog /></Suspense>} />
        <Route path="product/:id" element={<Suspense fallback={<UserLoader />}><ProductDetail /></Suspense>} />
        <Route path="checkout" element={<Suspense fallback={<UserLoader />}><Checkout /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<UserLoader />}><Orders /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<UserLoader />}><Profile /></Suspense>} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="search-testing" element={<SearchTesting />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
