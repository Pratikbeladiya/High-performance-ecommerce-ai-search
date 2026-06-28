import { initialProducts } from "../data/products";

// ─── Cart Helpers ─────────────────────────────────────────────
export const getCart = () => {
  try { return JSON.parse(localStorage.getItem("user_cart") || "[]"); } catch { return []; }
};
export const setCart = (cart) => localStorage.setItem("user_cart", JSON.stringify(cart));
export const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const existing = cart.find(i => i.product.id === product.id);
  if (existing) { existing.quantity += qty; } else { cart.push({ product, quantity: qty }); }
  setCart(cart); return cart;
};
export const removeFromCart = (productId) => {
  const cart = getCart().filter(i => i.product.id !== productId);
  setCart(cart); return cart;
};
export const updateCartQty = (productId, qty) => {
  const cart = getCart()
    .map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    .filter(i => i.quantity > 0);
  setCart(cart); return cart;
};
export const clearCart = () => { localStorage.setItem("user_cart", "[]"); };
export const getCartTotal = (cart) => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
export const getCartCount = (cart) => cart.reduce((sum, i) => sum + i.quantity, 0);

// ─── Orders Helpers ───────────────────────────────────────────
export const getOrders = async (token) => {
  if (!token) {
    try { return JSON.parse(localStorage.getItem("user_orders") || "[]"); } catch { return []; }
  }
  try {
    const res = await fetch("http://localhost:5000/api/orders/myorders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.map(o => ({ ...o, id: o.orderId }));
  } catch (err) {
    console.error("Error fetching orders from DB, using fallback:", err);
    try { return JSON.parse(localStorage.getItem("user_orders") || "[]"); } catch { return []; }
  }
};

export const addOrder = async (order, token) => {
  const localOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
  localOrders.unshift(order);
  localStorage.setItem("user_orders", JSON.stringify(localOrders));

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers,
      body: JSON.stringify(order),
    });
    if (!res.ok) console.warn("Failed to sync order with backend database");
  } catch (err) {
    console.error("Backend order sync failed:", err.message);
  }
  return localOrders;
};

// ─── Profile Helpers ──────────────────────────────────────────
const DEFAULT_PROFILE = { name: "Guest User", email: "user@example.com", phone: "", address: "", city: "", country: "United States", zip: "" };
export const getProfile = () => {
  try {
    const stored = localStorage.getItem("user_profile");
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  } catch { return DEFAULT_PROFILE; }
};
export const setProfile = (profile) => localStorage.setItem("user_profile", JSON.stringify(profile));



/**
 * Returns all publicly visible products from MongoDB.
 * Filters out products where isVisible === false.
 * Falls back to initialProducts if local connection is down.
 */
export async function getPublicProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.map(p => ({ ...p, id: p._id }));
  } catch (err) {
    console.error("Failed to fetch public products from API, using local storage fallback:", err);
    try {
      const stored = localStorage.getItem("admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((p) => p.isVisible !== false);
        }
      }
    } catch {
      // fall through
    }
    return initialProducts.filter((p) => p.isVisible !== false);
  }
}

/**
 * Returns a single product by id from MongoDB.
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return { ...data, id: data._id };
  } catch (err) {
    console.error(`Failed to fetch product details for ${id} from API, using fallback:`, err);
    try {
      const stored = localStorage.getItem("admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.find((p) => p.id === id || p._id === id) || null;
        }
      }
    } catch {
      // fall through
    }
    return initialProducts.find((p) => p.id === id) || null;
  }
}

/**
 * Groups products by category and returns counts.
 */
export function getCategoryCounts() {
  const products = getPublicProducts();
  return products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Simulated AI semantic relevance scoring.
 * Scores a product against a query by keyword + synonym matching
 * across name, description, tags, and aiEmbeddingsContext.
 * Returns a score 0-100.
 */
export function computeAIRelevance(product, query) {
  if (!query || !query.trim()) return 0;

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  const corpus = [
    (product.name || "").toLowerCase(),
    (product.description || "").toLowerCase(),
    (product.category || "").toLowerCase(),
    (Array.isArray(product.tags) ? product.tags.join(" ") : "").toLowerCase(),
    (product.aiEmbeddingsContext || "").toLowerCase(),
  ].join(" ");

  // Synonym map for common shopping intents
  const synonyms = {
    headphones: ["audio", "music", "earphones", "sound", "noise"],
    shoes: ["footwear", "sneakers", "running", "sport"],
    watch: ["smartwatch", "wearable", "fitness", "tracker"],
    coffee: ["espresso", "barista", "brew", "latte"],
    bag: ["backpack", "travel", "luggage", "rucksack"],
    lamp: ["light", "lighting", "desk", "illumination"],
    wallet: ["leather", "cardholder", "bifold", "purse"],
    plant: ["planter", "pot", "gardening", "succulent"],
    keyboard: ["mechanical", "typing", "gaming", "switch", "rgb"],
    water: ["bottle", "flask", "hydration", "drink"],
    glasses: ["sunglasses", "eyewear", "polarized", "shades"],
    diffuser: ["aromatherapy", "mist", "spa", "wellness"],
    cheap: ["affordable", "budget", "low", "price"],
    fast: ["quick", "speed", "velocity", "rapid"],
    wireless: ["bluetooth", "cordless", "wifi"],
    premium: ["luxury", "high-end", "quality", "professional"],
  };

  let score = 0;
  const maxScore = words.length * 30;

  for (const word of words) {
    // Direct word match in corpus
    if (corpus.includes(word)) {
      score += 30;
      continue;
    }
    // Partial / substring match
    if (corpus.split(" ").some((token) => token.startsWith(word) || word.startsWith(token))) {
      score += 15;
      continue;
    }
    // Synonym match
    for (const [key, syns] of Object.entries(synonyms)) {
      if (word === key || syns.includes(word)) {
        const allTerms = [key, ...syns];
        if (allTerms.some((t) => corpus.includes(t))) {
          score += 20;
          break;
        }
      }
    }
  }

  // Bonus: full phrase found
  if (corpus.includes(q)) score += 20;

  // Normalize to 0-100
  const normalized = Math.min(100, Math.round((score / Math.max(maxScore, 1)) * 100));
  return normalized;
}

/**
 * Format price as USD currency string.
 */
export function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
