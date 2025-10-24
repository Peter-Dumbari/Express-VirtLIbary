const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
