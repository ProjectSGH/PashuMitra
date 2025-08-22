const Post = require("../models/Common/postModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Doctor = require("../models/Doctor/DoctorModel"); // 👈 import doctor model

// Cloudinary config (ensure env vars are set)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function for buffer upload
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "post_images" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// 📌 Create Post
exports.createPost = async (req, res) => {
    try {
        const { title, description, hashtags } = req.body;
        const authorId = req.body.author || req.user?._id;

        // Doctor details घेऊन authorName सेट कर
        let authorName = "Unknown";
        const doctor = await Doctor.findOne({ userId: authorId });
        if (doctor) {
            authorName = doctor.fullName;
        }

        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await streamUpload(file.buffer);
                uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
            }
        }

        const post = new Post({
            author: authorId,
            authorName, // 👈 इथे save कर
            title,
            description,
            hashtags: hashtags ? hashtags.split(",").map((h) => h.trim()) : [],
            images: uploadedImages,
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error("Get posts error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Like / Unlike Post (without middleware)
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // 👈 coming from frontend

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let isLiked = false;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      isLiked = false;
    } else {
      // Like
      post.likes.push(userId.toString());
      isLiked = true;
    }

    await post.save();

    await post.populate("author", "fullName email");
    await post.populate("comments.user", "fullName email");

    res.json({
      message: isLiked ? "Post liked" : "Post unliked",
      likesCount: post.likes.length,   // 🔹 send count
      likes: post.likes,               // 🔹 send all likes
      post
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;

        console.log("📌 Comment API Request:", { postId, userId, text });

        if (!userId || !text) {
            return res.status(400).json({ message: "userId and text are required" });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({ user: userId, text });
        await post.save();

        await post.populate("author", "fullName email");
        await post.populate("comments.user", "fullName email");

        res.status(201).json({ message: "Comment added", post });
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
