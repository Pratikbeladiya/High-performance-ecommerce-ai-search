import mongoose from "mongoose";
import dns from "dns";

// Configure public DNS to resolve MongoDB Atlas hostnames reliably
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected successfully");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;


