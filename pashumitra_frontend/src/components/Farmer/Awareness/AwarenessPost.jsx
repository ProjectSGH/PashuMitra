"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

export default function FarmerPosts() {
  const [posts, setPosts] = useState([]);
  const [imageIndexes, setImageIndexes] = useState([]);
  const [newComments, setNewComments] = useState({});

  // ✅ Get current logged-in user properly
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  // 🔹 Debug userId once on mount
  useEffect(() => {
    console.log("📌 userId from localStorage:", userId);
  }, [userId]);

  // 🔹 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
        setImageIndexes(res.data.map(() => 0));
      } catch (err) {
        console.error("Fetch posts error:", err);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 Like Post
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

  // 🔹 Add Comment
  const handleAddComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;

    console.log("📌 Sending Comment:", {
      userId,
      text: newComments[postId],
      postId,
    });

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
      } else {
        console.error("Comment response error:", data);
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

          return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md mx-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  Dr
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.authorName || "Doctor"}
                  </h3>
                  {/* Specialization removed */}
                </div>
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

              {/* Post Content */}
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

                  <button className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5" />
                    {post.comments?.length || 0}
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="px-4 pb-4">
                {post.comments?.map((c, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {c.user?.fullName || "User"}:
                    </span>{" "}
                    {c.text}
                  </div>
                ))}
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
