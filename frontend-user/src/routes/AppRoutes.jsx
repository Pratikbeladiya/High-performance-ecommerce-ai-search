import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
