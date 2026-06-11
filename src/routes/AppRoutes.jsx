import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Analytics from "../pages/Analytics";
import SearchTesting from "../pages/SearchTesting";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Layout Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirect from base /admin to dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="search-testing" element={<SearchTesting />} />
      </Route>

      {/* Wildcard redirects to dashboard (protected check will redirect to login if unauthenticated) */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
