const express = require("express");
const multer = require("multer");
const {
  createDocBlog,
  getAllDocBlogs,
  incrementViews,
  incrementDownloads,
  downloadDocBlog,
} = require("../../controllers/blogController");

const router = express.Router();
const upload = multer(); // memory storage (for Cloudinary)

// Doctor side
router.post("/create", upload.single("file"), createDocBlog);
// Farmer side
router.get("/", getAllDocBlogs);
router.put("/:id/view", incrementViews);
router.put("/:id/download", incrementDownloads);
router.get("/:id/download", downloadDocBlog);

module.exports = router;
