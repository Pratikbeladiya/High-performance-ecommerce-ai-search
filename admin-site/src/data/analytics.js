// Mock Sales Data (for the main Sales Chart)
export const salesTrends = [
  { month: "Jan", sales: 18500, orders: 120 },
  { month: "Feb", sales: 22000, orders: 145 },
  { month: "Mar", sales: 30000, orders: 198 },
  { month: "Apr", sales: 28000, orders: 170 },
  { month: "May", sales: 35000, orders: 220 },
  { month: "Jun", sales: 45000, orders: 310 },
  { month: "Jul", sales: 42000, orders: 290 },
  { month: "Aug", sales: 48000, orders: 335 },
  { month: "Sep", sales: 55000, orders: 380 },
  { month: "Oct", sales: 52000, orders: 350 },
  { month: "Nov", sales: 68000, orders: 480 },
  { month: "Dec", sales: 85000, orders: 610 }
];

// Mock Category Distribution Data
export const categoryDistribution = [
  { name: "Electronics", value: 42800, count: 12, color: "#6366f1" },
  { name: "Home & Living", value: 24500, count: 28, color: "#14b8a6" },
  { name: "Apparel", value: 18700, count: 19, color: "#ec4899" }
];

// Mock Inventory Performance Data
export const inventoryStatusSummary = {
  totalProducts: 12,
  totalCategories: 3,
  totalStockCount: 413,
  totalValue: 32675.25,
  lowStockItemsCount: 3,
  outOfStockItemsCount: 2
};

// Recent Activity Log Stream
export const recentActivities = [
  {
    id: "act-1",
    time: "10 minutes ago",
    type: "inventory",
    description: "Low stock alert: 'Horizon Active Smartwatch' is down to 5 items.",
    status: "warning"
  },
  {
    id: "act-2",
    time: "1 hour ago",
    type: "order",
    description: "New order #10892 received for 2x 'AeroSound Max Headphones' ($599.98).",
    status: "success"
  },
  {
    id: "act-3",
    time: "3 hours ago",
    type: "product",
    description: "Product updated: 'Classic Saddle Leather Wallet' description modified.",
    status: "info"
  },
  {
    id: "act-4",
    time: "5 hours ago",
    type: "search",
    description: "AI Vector index rebuilt successfully. 12/12 embeddings synchronized.",
    status: "success"
  },
  {
    id: "act-5",
    time: "1 day ago",
    type: "inventory",
    description: "Out of stock: 'Apex Velocity Running Shoes' stock count reached 0.",
    status: "danger"
  }
];

// Mock search comparison database.
// This highlights the core capability differences between Traditional Search (text-matching)
// and AI Semantic Vector Search (understanding contextual intent).
export const searchTestCases = [
  {
    query: "something to listen to music while jogging",
    traditional: {
      latency: "8ms",
      queryType: "SQL SELECT WHERE LIKE '%music%' OR LIKE '%jogging%'",
      results: [],
      matchedTokens: []
    },
    ai: {
      latency: "45ms",
      queryType: "Vector Cosine Similarity (1536 dimensions)",
      results: [
        {
          id: "prod-1",
          name: "AeroSound Max Headphones",
          relevancy: 94,
          reason: "Matches 'listen to music' context (Headphones, audio, noise-canceling, wireless)."
        },
        {
          id: "prod-2",
          name: "Horizon Active Smartwatch",
          relevancy: 86,
          reason: "Matches 'jogging' and 'music' accessories context (wearable smart companion, tracking metrics)."
        },
        {
          id: "prod-4",
          name: "Apex Velocity Running Shoes",
          relevancy: 78,
          reason: "Matches 'jogging' activity context (running, athletic sneakers)."
        }
      ]
    }
  },
  {
    query: "keep cold drinks in summer",
    traditional: {
      latency: "5ms",
      queryType: "SQL SELECT WHERE LIKE '%cold%' OR LIKE '%drinks%'",
      results: [],
      matchedTokens: []
    },
    ai: {
      latency: "42ms",
      queryType: "Vector Cosine Similarity (1536 dimensions)",
      results: [
        {
          id: "prod-3",
          name: "HydroPulse Stainless Flask",
          relevancy: 97,
          reason: "Matches 'keep cold drinks' context (double-walled vacuum insulated flask, keeps cold for 24h)."
        },
        {
          id: "prod-9",
          name: "Urban Shield Polarized Sunglasses",
          relevancy: 72,
          reason: "Semantic connection to 'summer' holiday gear and sun protection."
        }
      ]
    }
  },
  {
    query: "office desk clicky typing",
    traditional: {
      latency: "12ms",
      queryType: "SQL SELECT WHERE LIKE '%office%' OR LIKE '%clicky%'",
      results: [],
      matchedTokens: []
    },
    ai: {
      latency: "38ms",
      queryType: "Vector Cosine Similarity (1536 dimensions)",
      results: [
        {
          id: "prod-7",
          name: "ClickFlow Mechanical Keyboard",
          relevancy: 99,
          reason: "Direct semantic match for 'clicky typing' (tactile brown switches, mechanical keyboard)."
        },
        {
          id: "prod-8",
          name: "Lumina Brass Desk Lamp",
          relevancy: 76,
          reason: "Conceptual match for 'office desk' environment (brass table lamp, workspace illumination)."
        }
      ]
    }
  },
  {
    query: "headphones",
    traditional: {
      latency: "4ms",
      queryType: "SQL SELECT WHERE LIKE '%headphones%'",
      results: [
        {
          id: "prod-1",
          name: "AeroSound Max Headphones",
          relevancy: 100,
          reason: "Exact word match for 'Headphones' in name."
        }
      ],
      matchedTokens: ["headphones"]
    },
    ai: {
      latency: "49ms",
      queryType: "Vector Cosine Similarity (1536 dimensions)",
      results: [
        {
          id: "prod-1",
          name: "AeroSound Max Headphones",
          relevancy: 98,
          reason: "Exact semantic match for auditory headphones."
        },
        {
          id: "prod-7",
          name: "ClickFlow Mechanical Keyboard",
          relevancy: 65,
          reason: "Weak context connection (desktop audio/electronics peripheral workspace)."
        }
      ]
    }
  }
];
