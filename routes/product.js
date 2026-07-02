const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products?keyword=iphone&page=1&limit=10

router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {
      name: {
        $regex: keyword,
        $options: "i",
      },
    };

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
