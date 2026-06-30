import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { isAdmin } = req.query; // Send from admin panel to see invisible products
    
    let filter = {};
    if (isAdmin !== "true") {
      filter = { isVisible: true };
    }

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
    const { name, price, description, category, imageUrl, stock, tags, aiEmbeddingsContext, isVisible } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      imageUrl: imageUrl || "",
      stock: stock || 0,
      tags: tags || [],
      aiEmbeddingsContext: aiEmbeddingsContext || "",
      isVisible: isVisible !== undefined ? isVisible : true,
      status: stock > 5 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock"
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
    const { name, price, description, category, imageUrl, stock, tags, aiEmbeddingsContext, isVisible } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
      product.stock = stock !== undefined ? stock : product.stock;
      product.tags = tags || product.tags;
      product.aiEmbeddingsContext = aiEmbeddingsContext !== undefined ? aiEmbeddingsContext : product.aiEmbeddingsContext;
      product.isVisible = isVisible !== undefined ? isVisible : product.isVisible;
      
      // Update status dynamically
      product.status = product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
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

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
