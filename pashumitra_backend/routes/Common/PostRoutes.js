const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createPost, getAllPosts, toggleLike, addComment } = require("../../controllers/postController");

// Multer setup for memory buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });



// Create post with multiple images
router.post("/create", upload.array("images", 5), createPost);

// Get all posts
router.get("/", getAllPosts);

// Like / Unlike post
router.put("/:postId/like", toggleLike);

// Add comment
router.post("/:postId/comment", addComment);

module.exports = router;
