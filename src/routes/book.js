const express = require("express");
const isAdminOnly = require("../middlewares/isadmin");
const { bookValidator } = require("../utils/validator");
const {
  postBook,
  getAllBooks,
  searchBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const auth = require("../middlewares/auth");
const upload = require("../config/multer");
const router = express.Router();

router.post(
  "/",
  auth,
  isAdminOnly,
  upload.single("coverImage"),
  bookValidator,
  postBook
);
router.get("/", auth, getAllBooks);
router.get("/search", searchBooks);
router.put("/:id", auth, upload.single("coverImage"), updateBook);
router.delete("/:id", auth, isAdminOnly, deleteBook);

module.exports = router;
