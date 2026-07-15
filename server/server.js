import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Activity from "./models/Activity.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// Load env vars
dotenv.config();

const ensureDefaultAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@vectorcommerce.io").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || "Super Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`Created default admin user: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Failed to ensure default admin user:", error.message);
  }
};

const seedDefaultActivities = async () => {
  try {
    const count = await Activity.countDocuments();
    if (count === 0) {
      await Activity.insertMany([
        {
          description: "Low stock alert: 'Horizon Active Smartwatch' is down to 5 items.",
          type: "inventory",
          status: "warning",
          createdAt: new Date(Date.now() - 10 * 60 * 1000)
        },
        {
          description: "New order #10892 received for 2x 'AeroSound Max Headphones' ($599.98).",
          type: "order",
          status: "success",
          createdAt: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          description: "Product updated: 'Classic Saddle Leather Wallet' description modified.",
          type: "product",
          status: "info",
          createdAt: new Date(Date.now() - 180 * 60 * 1000)
        },
        {
          description: "AI Vector index rebuilt successfully. 12/12 embeddings synchronized.",
          type: "search",
          status: "success",
          createdAt: new Date(Date.now() - 300 * 60 * 1000)
        },
        {
          description: "Out of stock: 'Apex Velocity Running Shoes' stock count reached 0.",
          type: "inventory",
          status: "danger",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]);
      console.log("Seeded default activity stream successfully.");
    }
  } catch (error) {
    console.error("Failed to seed default activities:", error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmin();
    await seedDefaultActivities();

    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // API Routes mount
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/activities", activityRoutes);

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.json({ status: "healthy", timestamp: new Date() });
    });

    // Custom 404 Route handler
    app.use((req, res, next) => {
      res.status(404).json({ message: `API route not found - ${req.originalUrl}` });
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
