# VectorCommerce Console — E-Commerce Engine & AI Vector Search Dashboard

An executive, high-performance Admin Dashboard built with **React.js**, **Vite**, and **Tailwind CSS**. This dashboard serves as the administrative control center for the **High-Performance E-Commerce Engine with AI Vector Search** internship project, providing catalog management, sales audits, inventory health metrics, and a side-by-side search query playground comparing database keyword matching against AI semantic vector similarity.

---

## Key Features

1. **AI Semantic Search Playground**:
   - Side-by-side comparative UI highlighting query latencies, execution models, and product matches.
   - Contrasts traditional text match (SQL `LIKE %keyword%`) with semantic indexing (Vector Cosine Similarity).
   - Interactive suggested query chips and real-time custom query simulations using the active local catalog.
2. **Dynamic Dashboard Overview**:
   - Real-time catalog statistical counters (Total Products, Categories, Stock Value, Low Stock Alerts).
   - Operations log stream for system events, inventory modifications, and mockup orders.
   - Interactive revenue area charts mapping performance trends.
3. **Product Inventory Management (CRUD)**:
   - Paginated catalog table detailing image assets, descriptions, categories, pricing, stock levels, and status indicators.
   - Fully interactive creation and modification screens.
   - Built-in form validation (price checks, positive stock integrity) and dynamic image URL loading previews.
4. **Interactive Analytics Hub**:
   - Month-by-month sales revenue vs order volumes.
   - Category market share breakdown donut charts.
   - Interactive color-coded stock level bar chart indicators.
5. **Secure Administration Layout**:
   - Modern glassmorphism Login page storing session data locally.
   - Responsive templates featuring collapsible desktop sidebars and sliding mobile overlay drawers.

---

## Technical Stack & Dependencies

- **Core**: React.js (Vite 4)
- **Styling**: Tailwind CSS v3 (processed via PostCSS)
- **Routing**: React Router v7 (`react-router-dom`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)

> [!NOTE]
> **Windows Security Policy Compatibility**: To allow compilation in environments governed by strict Application Control policies (such as AppLocker or WDAC) that block native compiled binaries (`.node` files), this project is engineered using a pure JavaScript/WASM build pipeline. It utilizes **Vite 4** (Rollup 3) and **Tailwind CSS v3** (PostCSS), which run entirely in Javascript without requiring native compiled dependencies.

---

## Folder Structure

The project follows a modular, single-purpose component architecture:

```
src/
├── assets/                  # Static assets
├── components/
│   ├── common/              # Shared dashboard shell layout items
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── PageHeader.jsx
│   │   ├── SearchBar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   ├── dashboard/           # Dashboard widget panels
│   │   ├── StatsCard.jsx
│   │   ├── InventoryCard.jsx
│   │   └── AnalyticsCard.jsx
│   ├── products/            # Catalog management tables & forms
│   │   ├── ProductTable.jsx
│   │   ├── ProductRow.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductFilters.jsx
│   ├── analytics/           # Recharts panels
│   │   ├── SalesChart.jsx
│   │   ├── CategoryChart.jsx
│   │   └── InventoryChart.jsx
│   └── search/              # Search testing blocks
│       ├── SearchComparison.jsx
│       ├── TraditionalSearch.jsx
│       └── AISearch.jsx
├── layouts/
│   └── AdminLayout.jsx      # Protected workspace template shell
├── pages/
│   ├── Login.jsx            # Glassmorphism gatekeeper form
│   ├── Dashboard.jsx        # Landing summary overview
│   ├── Products.jsx         # Product listings & filters
│   ├── AddProduct.jsx       # Catalog creation screen
│   ├── EditProduct.jsx      # Catalog modification screen
│   ├── Analytics.jsx        # Sales & inventory graphs
│   └── SearchTesting.jsx    # Traditional vs Vector comparative console
├── routes/
│   └── AppRoutes.jsx        # Route orchestrator mapping
├── data/
│   ├── products.js          # Mock product data with semantic descriptors
│   └── analytics.js         # Mock sales trends & search cases
├── App.jsx                  # Router wrapper provider
└── main.jsx                 # Entrypoint mounter
```

---

## Setup & Run Instructions

Ensure [Node.js](https://nodejs.org) is installed on your machine.

### 1. Install Dependencies
Run the package installation:
```bash
npm install
```

### 2. Run the Development Server
Launch the hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/admin/login` (or the URL outputted by your terminal).

### 3. Log In
Use the default administrator credentials:
- **Email**: `admin@vectorcommerce.io`
- **Password**: `password123`

### 4. Build for Production
To bundle and optimize the application for deployment, run:
```bash
npm run build
```
This will compile all resources into a pure HTML/JS/CSS output directory (`dist/`) without requiring any native compiler permissions.

---

## AI Vector Search vs Traditional Keyword Search

### Traditional Search
Traditional database search uses exact character matching (SQL `LIKE` queries or strict elastic keywords).
- **Behavior**: If you search for *"something to listen to music while jogging"*, a database query returns **0 results** because the words "listen", "music", and "jogging" do not exist verbatim in the product text.
- **Latency**: Very low (1–5ms), but offers extremely poor relevancy for conceptual user queries.

### AI Vector Search
AI Search converts natural language queries and product metadata into high-dimensional vector embeddings (typically 1536 floats) using models like OpenAI's `text-embedding-3-large`.
- **Behavior**: It calculates the **Cosine Similarity** between the query vector and product vectors. Searching for *"something to listen to music while jogging"* successfully returns **AeroSound Max Headphones** and **Horizon Active Smartwatch** with high relevancy scores because the model understands the semantic relationship between music/listening/jogging and headphones/smartwatches/athletics.
- **Latency**: Slightly higher (30–50ms) due to distance calculation arithmetic, but yields 100% conceptual match relevance.
