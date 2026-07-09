const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "Name, price and category are required",
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be greater than 0",
    });
  }

  next();
};

module.exports = validateProduct;
