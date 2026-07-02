import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import User from "./models/User.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

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

const startServer = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmin();

    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // API Routes mount
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/cart", cartRoutes);

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
