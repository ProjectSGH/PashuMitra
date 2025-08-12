const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Doctor user who created it
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true }, // Cloudinary / S3 link
        public_id: { type: String }, // Optional if using Cloudinary
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
