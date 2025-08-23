const mongoose = require("mongoose");

const docBlogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    title: { type: String, required: true },
    caption: { type: String },
    blogContent: { type: String },
    file: {
      url: { type: String },
      public_id: { type: String },
      fileType: { type: String }, // pdf / image / video
      name: { type: String },
    },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocBlog", docBlogSchema);
