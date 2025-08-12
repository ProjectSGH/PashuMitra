const Post = require("../models/Common/postModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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

        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await streamUpload(file.buffer);
                uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
            }
        }

        const post = new Post({
            author: authorId,
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

// 📌 Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "fullName email")
            .populate("comments.user", "fullName email")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Like / Unlike Post
exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Add Comment
exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({ user: userId, text });
        await post.save();

        res.status(201).json({ message: "Comment added", comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
