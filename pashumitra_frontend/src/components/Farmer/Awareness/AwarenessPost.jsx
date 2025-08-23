"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

export default function FarmerPosts() {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [activePostId, setActivePostId] = useState(null); // which post drawer is open

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Fetch posts error:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (data.post) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? data.post : p)));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text: newComments[postId] }),
        }
      );
      const data = await res.json();
      if (data.post) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? data.post : p)));
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {posts.map((post) => {
          const isLiked = post.likes?.includes(userId);
          const isActive = activePostId === post._id;

          return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md mx-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  Dr
                </div>
                <h3 className="font-semibold text-gray-900">
                  {post.authorName || "Doctor"}
                </h3>
              </div>

              {/* Post Image */}
              <div className="w-full max-h-[400px] bg-gray-100 overflow-hidden flex justify-center items-center">
                <img
                  src={
                    post.images?.[0]?.url ||
                    "https://via.placeholder.com/600x300.png?text=Post+Image"
                  }
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-1">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{post.description}</p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-evenly text-gray-600 text-sm border-t pt-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 ${
                      isLiked ? "text-pink-500" : "text-gray-600"
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isLiked ? "pink" : "none"}
                    />
                    {post.likes?.length || 0}
                  </button>

                  <button
                    className="flex items-center gap-1"
                    onClick={() =>
                      setActivePostId(isActive ? null : post._id)
                    }
                  >
                    <MessageCircle className="w-5 h-5" />
                    {post.comments?.length || 0}
                  </button>
                </div>
              </div>

              {/* 🔹 Bottom-to-up Drawer (INSIDE the post card) */}
              {/* 🔹 Bottom-to-up Drawer (INSIDE the post card) */}
<AnimatePresence>
  {isActive && (
    <>
      {/* Backdrop (click to close) */}
      <div
        onClick={() => setActivePostId(null)}
        className="absolute inset-0 bg-black bg-opacity-30"
      ></div>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-white border-t rounded-t-xl shadow-lg h-1/2 p-4 flex flex-col z-10"
      >
        {/* Drawer Header with close button */}
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-900">Comments</h4>
          <button
            onClick={() => setActivePostId(null)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {post.comments?.map((c, idx) => (
            <div key={idx} className="text-sm text-gray-700">
              <span className="font-semibold">{c.userName || "User"}:</span>{" "}
              {c.text}
            </div>
          ))}
        </div>

        {/* Add comment input */}
        <div className="flex mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComments[post._id] || ""}
            onChange={(e) =>
              setNewComments((prev) => ({
                ...prev,
                [post._id]: e.target.value,
              }))
            }
            className="flex-1 border rounded-l px-2 py-1 text-sm"
          />
          <button
            onClick={() => handleAddComment(post._id)}
            className="bg-blue-500 text-white px-3 rounded-r text-sm"
          >
            Post
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
