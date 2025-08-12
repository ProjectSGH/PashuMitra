"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Heart, Share2, X } from "lucide-react";
import toast from "react-hot-toast";

const CreatePostTab = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);

    if (mediaFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 media files.");
      return;
    }

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file, // Store the original File for backend
    }));

    setMediaFiles((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async () => {
  if (!postTitle.trim() && !postContent.trim() && mediaFiles.length === 0) {
    toast.error("Please add some content or media before publishing.");
    return;
  }

  try {
    const userData = JSON.parse(localStorage.getItem("user")); 
    if (!userData || !userData._id) {
      toast.error("User not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("description", postContent);
    formData.append("hashtags", postTags);
    formData.append("author", userData._id); // send user ID

    // Append media files (make sure field name matches backend "images")
    mediaFiles.forEach((fileObj) => {
      formData.append("images", fileObj.file);
    });

    const res = await fetch("http://localhost:5000/api/posts/create", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to create post");

    toast.success("Post published successfully!");
    setPostTitle("");
    setPostContent("");
    setPostTags("");
    setMediaFiles([]);
  } catch (err) {
    console.error(err);
    toast.error("Error creating post. Please try again.");
  }
};

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Create Post Form */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <PlusCircle className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Create Awareness Post
          </h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Post Title..."
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your content..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg resize-none"
          />

          <input
            type="text"
            value={postTags}
            onChange={(e) => setPostTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Instagram style media upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (max 5 files)
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
            >
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
            onClick={handleSubmit}
          >
            Publish Post
          </motion.button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">
            {postTitle || "Post Title"}
          </h3>
          <p className="text-gray-700">{postContent || "Post Content"}</p>
          <div className="mt-2">
            {postTags ? (
              postTags.split(",").map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                >
                  {tag.trim()}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No Tags</span>
            )}
          </div>
          {mediaFiles.length > 0 && (
            <div className="mt-4 flex space-x-4 overflow-x-auto pb-2">
              {mediaFiles.map((media, idx) => (
                <div key={idx} className="relative flex-shrink-0">
                  {media.type.startsWith("image") ? (
                    <img
                      src={media.url}
                      alt="Preview"
                      className="rounded-lg max-h-60 object-cover"
                    />
                  ) : (
                    <video
                      controls
                      src={media.url}
                      className="rounded-lg max-h-60"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center mt-3 space-x-4 text-sm text-gray-600">
            <button className="flex items-center">
              <Heart className="w-4 h-4 mr-1" /> Like
            </button>
            <button className="flex items-center">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePostTab;
