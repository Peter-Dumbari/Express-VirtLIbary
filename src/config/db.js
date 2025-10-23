const mongoose = require("mongoose");

const connectDB = async (url) => {
  await mongoose.connect(url);
  console.log("Database connected successfully!");
  try {
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
