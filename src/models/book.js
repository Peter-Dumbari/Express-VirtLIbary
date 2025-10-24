const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    author: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    src: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    reads: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    coverImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
