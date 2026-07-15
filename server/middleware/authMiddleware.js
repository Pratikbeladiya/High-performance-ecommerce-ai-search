import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

export const protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found associated with this token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token validation failed" });
  }
};

export const optionalProtect = async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      // Ignore invalid optional token
    }
  }
  next();
};

export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin, access denied" });
  }
};
