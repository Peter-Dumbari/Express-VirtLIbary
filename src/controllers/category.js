const Category = require("../models/categories");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (!existingCategory)
      return res.status(402).json({ message: "Category already exits" });

    const category = await Category.create({ name });
    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.log("Error creating category", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(201).json(categories);
  } catch (error) {
    console.log("error fetching categories", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if any books are assigned to this category
    const booksUsingCategory = await Book.findOne({ category: id });
    if (booksUsingCategory) {
      return res.status(400).json({
        message:
          "Cannot delete category because it is assigned to one or more books",
      });
    }

    // Optional: Check if any users have this category in preferences
    const usersUsingCategory = await User.findOne({ preferredCategories: id });
    if (usersUsingCategory) {
      return res.status(400).json({
        message:
          "Cannot delete category because it is used in user preferences",
      });
    }

    // Safe to delete
    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
