# VectorCommerce Storefront – AI-Powered E-Commerce Platform

An intelligent, high-performance customer-facing e-commerce application built with React.js, Vite, and Tailwind CSS for the High-Performance E-Commerce Engine with AI Vector Search internship project.

The platform provides a modern shopping experience through AI-powered semantic product discovery, responsive product browsing, product recommendations, and a fast, user-friendly interface.

---

# Key Features

## 1. AI Semantic Search Experience
- Natural language product search.
- Smart query suggestions and recommendations.
- Search products by user intent instead of exact keywords.
- Real-time product discovery.

## 2. Product Catalog System
- Responsive product listing grid.
- Category-based filtering.
- Product sorting and search.
- Dynamic product cards.

## 3. Product Details Experience
- Detailed product information.
- Product images and specifications.
- Similar product recommendations.
- Add-to-cart functionality.

## 4. Shopping Cart Management
- Add, remove, and update product quantities.
- Dynamic price calculations.
- Order summary and checkout preparation.

## 5. User Authentication
- Login interface.
- Session management.
- Protected user features.

## 6. Responsive Storefront Design
- Mobile-first UI.
- Tablet and desktop optimization.
- Modern animations and clean shopping experience.

---

# Technical Stack & Dependencies

- Core: React.js (Vite)
- Styling: Tailwind CSS
- Routing: React Router DOM
- API Communication: Axios
- Icons: Lucide React
- Database: MongoDB Atlas
- Caching: Redis
- AI Search: MongoDB Vector Search
- State Management: Context API / React Hooks

---

# Folder Structure

```bash
src/
│
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Loader.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── CategorySection.jsx
│   │   └── FeaturedProducts.jsx
│   │
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductFilters.jsx
│   │   └── ProductPagination.jsx
│   │
│   ├── search/
│   │   ├── SearchSuggestions.jsx
│   │   ├── SearchResults.jsx
│   │   └── SemanticSearch.jsx
│   │
│   └── cart/
│       ├── CartItem.jsx
│       ├── CartSummary.jsx
│       └── CheckoutCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── ProductListing.jsx
│   ├── ProductDetails.jsx
│   ├── Search.jsx
│   └── Cart.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── data/
│   └── productsData.js
│
├── App.jsx
└── main.jsx
```

---

# Setup & Run Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Development Server

```bash
npm run dev
```

## 3. Open in Browser

```bash
http://localhost:5173
```

---

# AI Vector Search vs Traditional Keyword Search

## Traditional Search

Search:
"something to listen to music while jogging"

Result:
❌ 0 Products

Reason:
Traditional search depends on exact keyword matching and cannot understand user intent.

---

## AI Semantic Search

Search:
"something to listen to music while jogging"

Result:
✅ AeroSound Max Headphones
✅ Wireless Sports Earbuds
✅ Horizon Active Smartwatch

Reason:
AI Semantic Search understands the relationship between music, fitness, jogging, headphones, and smart devices and returns conceptually relevant products.

---

