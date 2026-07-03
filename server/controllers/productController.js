import Product from "../models/Product.js";

const getStatus = (stock = 0) =>
  stock > 5 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { isAdmin } = req.query;
    const filter = isAdmin === "true" ? {} : { isVisible: true };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      imageUrl = "",
      stock = 0,
      tags = [],
      aiEmbeddingsContext = "",
      isVisible = true,
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      tags,
      aiEmbeddingsContext,
      isVisible,
      status: getStatus(stock),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      tags,
      aiEmbeddingsContext,
      isVisible,
    } = req.body;

    const fields = {
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      tags,
      aiEmbeddingsContext,
      isVisible,
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        product[key] = value;
      }
    });

    product.status = getStatus(product.stock);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
