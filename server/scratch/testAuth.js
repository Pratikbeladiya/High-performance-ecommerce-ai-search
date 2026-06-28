import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Remove existing test user if any
    await User.deleteOne({ email: "testauth@example.com" });

    // 1. Test Registration
    console.log("Registering test user...");
    const user = await User.create({
      name: "Test Auth User",
      email: "testauth@example.com",
      password: "password123",
      role: "customer"
    });

    console.log("User registered. Hashed Password in DB:", user.password);

    // 2. Test Login Validation
    console.log("Validating login with correct credentials...");
    const isMatch = await user.matchPassword("password123");
    console.log("Login match status (should be true):", isMatch);

    console.log("Validating login with incorrect credentials...");
    const isIncorrectMatch = await user.matchPassword("wrongpassword");
    console.log("Login match status for incorrect password (should be false):", isIncorrectMatch);

    // Cleanup
    await User.deleteOne({ email: "testauth@example.com" });
    console.log("Test user cleaned up.");
    
    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Auth test failed:", err.message);
    process.exit(1);
  }
};

test();
