import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const initialProducts = [
  {
    name: "AeroSound Max Headphones",
    description: "Premium wireless noise-canceling over-ear headphones with spatial audio, 40-hour battery life, and ultra-soft memory foam earcups.",
    price: 299.99,
    category: "Electronics",
    stock: 42,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    tags: ["audio", "music", "noise-canceling", "wireless", "headphones"],
    aiEmbeddingsContext: "High-end sound systems, audio equipment, noise suppression, traveling gadgets, music streaming devices.",
    isVisible: true
  },
  {
    name: "Horizon Active Smartwatch",
    description: "Sleek fitness smartwatch featuring a vibrant AMOLED display, 24/7 heart rate monitoring, GPS tracking, and stress tracking metrics.",
    price: 189.99,
    category: "Electronics",
    stock: 5,
    status: "Low Stock",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    tags: ["wearable", "smartwatch", "fitness", "tracker", "health"],
    aiEmbeddingsContext: "Wrist wearable trackers, exercise monitors, heart rate analysis, modern tech fashion, sport sensors.",
    isVisible: true
  },
  {
    name: "HydroPulse Stainless Flask",
    description: "Double-walled vacuum insulated water bottle that keeps drinks ice-cold for 24 hours or piping hot for 12 hours. BPA-free leakproof lid.",
    price: 34.50,
    category: "Home & Living",
    stock: 128,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    tags: ["bottle", "water", "insulated", "flask", "gym"],
    aiEmbeddingsContext: "Hydration solutions, warm coffee containers, fitness gear accessories, sustainable metal cups, camping gear.",
    isVisible: true
  },
  {
    name: "Apex Velocity Running Shoes",
    description: "Ultra-lightweight breathable running shoes engineered with carbon fiber plates for maximum energy return and premium shock absorption.",
    price: 145.00,
    category: "Apparel",
    stock: 0,
    status: "Out of Stock",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    tags: ["shoes", "running", "sneakers", "sports", "footwear"],
    aiEmbeddingsContext: "Athletic shoe gear, workout jog sneakers, orthopedic foot protection, marathon training gear, breathable sportswear.",
    isVisible: true
  },
  {
    name: "Nomad Canvas Backpack",
    description: "Water-resistant commuter backpack with a dedicated padded 16-inch laptop compartment, hidden security pockets, and magnetic strap closures.",
    price: 85.00,
    category: "Apparel",
    stock: 35,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    tags: ["bag", "backpack", "travel", "laptop", "canvas"],
    aiEmbeddingsContext: "Baggage for office workers, tech travel gear, school bags, heavy load carriers, ergonomic rucksacks.",
    isVisible: true
  },
  {
    name: "Barista Brew Espresso Maker",
    description: "Compact 15-bar pump espresso machine with integrated milk frother steam wand for barista-quality lattes, cappuccinos, and flat whites.",
    price: 249.99,
    category: "Home & Living",
    stock: 12,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&auto=format&fit=crop&q=60",
    tags: ["coffee", "espresso", "barista", "kitchen", "appliance"],
    aiEmbeddingsContext: "Morning beverage appliances, caffeine brewers, kitchen heating devices, premium latte makers.",
    isVisible: true
  },
  {
    name: "ClickFlow Mechanical Keyboard",
    description: "Tenkeyless hot-swappable mechanical keyboard featuring tactile brown switches, pre-lubed stabilizers, and customizable per-key RGB backlighting.",
    price: 119.99,
    category: "Electronics",
    stock: 4,
    status: "Low Stock",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    tags: ["keyboard", "mechanical", "gaming", "typing", "rgb"],
    aiEmbeddingsContext: "Computer input accessories, typing switches, home office setup, mechanical clicky gadgets, desk upgrades.",
    isVisible: true
  },
  {
    name: "Lumina Brass Desk Lamp",
    description: "Mid-century modern table lamp featuring a solid brushed brass stem, adjustable dome shade, and dimmable soft-glow warm LED bulb.",
    price: 65.00,
    category: "Home & Living",
    stock: 22,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
    tags: ["lamp", "lighting", "desk", "decor", "home"],
    aiEmbeddingsContext: "Indoor light sources, workspace illumination, home design decoration, nightstand tables, reading lamps.",
    isVisible: true
  },
  {
    name: "Urban Shield Polarized Sunglasses",
    description: "Classic retro-style polarized sunglasses featuring durable acetate frames and 100% UV protection glare-reducing lenses.",
    price: 55.00,
    category: "Apparel",
    stock: 67,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    tags: ["sunglasses", "eyewear", "summer", "polarized", "fashion"],
    aiEmbeddingsContext: "Eye shade accessories, summer holiday wearables, glare protection, trendy frames, outdoor visual aids.",
    isVisible: true
  },
  {
    name: "Minimalist Terracotta Planter",
    description: "Handcrafted unglazed terracotta pot featuring a matching drainage tray, ideal for succulents, cacti, or small indoor house plants.",
    price: 24.00,
    category: "Home & Living",
    stock: 55,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60",
    tags: ["planter", "pot", "plant", "gardening", "ceramic"],
    aiEmbeddingsContext: "Flora holding pots, interior green decor, plant soil bases, home gardening accessories, clay vessels.",
    isVisible: true
  },
  {
    name: "AromaMist Ceramic Diffuser",
    description: "Ultrasonic cool mist essential oil diffuser featuring a textured ceramic cover, auto-shutoff safety, and 7-color ambient LED breathing light.",
    price: 39.99,
    category: "Home & Living",
    stock: 0,
    status: "Out of Stock",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60",
    tags: ["diffuser", "aromatherapy", "mist", "spa", "wellness"],
    aiEmbeddingsContext: "Fragrant vapors, home spa therapy, air humidifier devices, relaxing scent sprayers.",
    isVisible: true
  },
  {
    name: "Classic Saddle Leather Wallet",
    description: "Slim bifold wallet handcrafted from full-grain vegetable-tanned leather. Features 6 card slots, a cash compartment, and RFID blocking lining.",
    price: 45.00,
    category: "Apparel",
    stock: 89,
    status: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1627124765135-56af27b3d3c1?w=500&auto=format&fit=crop&q=60",
    tags: ["wallet", "leather", "accessory", "cardholder", "classic"],
    aiEmbeddingsContext: "Pocket money organizers, real hide leather products, coin bags, security card shielding sleeves.",
    isVisible: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    console.log("Cleared old products, orders, and users.");

    // Seed products
    const seededProducts = await Product.insertMany(initialProducts);
    console.log(`Successfully seeded ${seededProducts.length} products.`);

    // Seed default admin user
    const adminUser = new User({
      name: "Super Admin",
      email: "admin@vectorcommerce.io",
      password: "password123", // Hashes automatically via pre-save hook
      role: "admin",
      phone: "+1 (555) 019-2834",
      address: "100 AI Boulevard",
      city: "San Francisco",
      zip: "94107",
      country: "United States"
    });

    // Seed a test customer user
    const customerUser = new User({
      name: "Pratik Beladiya",
      email: "pratik@example.com",
      password: "password123",
      role: "customer",
      phone: "+91 98765 43210",
      address: "123 E-Commerce Way",
      city: "Surat",
      zip: "395006",
      country: "India"
    });

    await adminUser.save();
    await customerUser.save();
    console.log("Successfully seeded default Admin & Customer accounts.");

    console.log("Database Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
