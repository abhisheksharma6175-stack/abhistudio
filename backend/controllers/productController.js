const Product = require("../models/Product");

// Create a product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, brand, description, price, discountPrice, stock } = req.body;
    if (!name || !category || !brand || !description || !price || !stock || !req.file) {
      return res.status(400).json({ error: "All product fields and image are required." });
    }

    const product = await Product.create({
      name,
      category,
      brand,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice || 0),
      stock: Number(stock),
      image: req.file.path,
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

// Get all products with optional search and category filter.
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).populate("category", "name");
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

// Update a product.
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      price: Number(req.body.price),
      discountPrice: Number(req.body.discountPrice || 0),
      stock: Number(req.body.stock),
    };

    if (req.file) {
      updates.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true }).populate("category", "name");
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

// Delete a product.
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID.
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    res.json({ product });
  } catch (error) {
    next(error);
  }
};
