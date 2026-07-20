const Category = require("../models/Category");

// Create new category.
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required." });

    const category = await Category.create({ name, description });
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

// Get all categories.
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Update category.
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { name: req.body.name, description: req.body.description };
    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// Delete category.
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
