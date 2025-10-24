const { validationResult } = require("express-validator");
const Book = require("../models/book");
const cloudinary = require("cloudinary");
const User = require("../models/user");

exports.postBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { author, title, src, description, category } = req.body;
    const book = new Book({
      author,
      title,
      src,
      description,
      category,
      coverImage: req.file
        ? { url: req.file.path, public_id: req.file.filename }
        : null,
    });
    await book.save();
    return res
      .status(201)
      .json({ book: book, message: "Book created successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const user = await User.findById(userId).populate("preferredCategories");

    let books;

    if (user.role === "admin") {
      // Admin can see all books
      books = await Book.find().populate("category").sort({ createdAt: -1 });
    } else {
      // Reader can only see books that match their preferred categories
      books = await Book.find({
        category: { $in: user.preferredCategories },
      })
        .populate("category")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, category } = req.params;

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (category) {
      // If your category is stored as an ObjectId ref
      filter.category = category;
    }

    const books = await Book.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    if (!books.length) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json({ results: books.length, books });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching books" });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;

  const book = Book.findById(id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (req.file) {
    // Delete the old image from Cloudinary (if exists)
    if (book.coverImage && book.coverImage.public_id) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "virtLibrary", // optional folder name
    });

    // Update the cover image fields
    book.coverImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Update other fields
  const { title, author, description, category, recommended } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (description) book.description = description;
  if (category) book.category = category;
  if (recommended !== undefined) book.recommended = recommended;

  // Save updates
  await book.save();

  return res.status(200).json({
    message: "Book updated successfully",
    book,
  });
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the cover image from Cloudinary if it exists
    if (book.coverImage && book.coverImage.public_id) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);
    }

    // Delete the book record from the database
    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
