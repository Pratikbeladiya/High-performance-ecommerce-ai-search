const validateProduct = require("../middleware/validateProduct");
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Search + Filter + Sort + Pagination
router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sort = req.query.sort || "latest";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {
      name: {
        $regex: keyword,
        $options: "i",
      },
    };

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "priceLowToHigh":
        sortOption = { price: 1 };
        break;

      case "priceHighToLow":
        sortOption = { price: -1 };
        break;

      case "name":
        sortOption = { name: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
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
