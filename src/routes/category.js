const express = require("express");
const auth = require("../middlewares/auth");
const isAdminOnly = require("../middlewares/isadmin");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const router = express.Router();

router.post("/", auth, isAdminOnly, createCategory);
router.get("/", getAllCategories);
router.put("/:id", auth, isAdminOnly, updateCategory);
router.delete("/:id", auth, isAdminOnly, deleteCategory);

module.exports = router;
