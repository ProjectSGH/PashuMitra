"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AwarenessBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [filterAuthor, setFilterAuthor] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [filterRecent, setFilterRecent] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/docs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to load blogs");
    }
  };

  const handleView = async (id, blog) => {
    if (!blog.file?.url) {
      toast.error("No file attached to view");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/docs/${id}/view`);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, views: (b.views || 0) + 1 } : b
        )
      );
      setSelectedBlog(blog);
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
  };

  const handleDownload = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/docs/${id}/download`);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, downloads: (b.downloads || 0) + 1 } : b
        )
      );
      window.open(`http://localhost:5000/api/docs/${id}/download`, "_blank");
    } catch (err) {
      console.error("Error incrementing download:", err);
    }
  };

  // Extract unique authors and tags for filter dropdowns
  const authors = Array.from(new Set(blogs.map((b) => b.authorName || "Unknown")));
  const tags = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));

  // Apply all filters
  const filteredBlogs = blogs.filter((b) => {
    const authorMatch = filterAuthor === "all" || b.authorName === filterAuthor;
    const tagMatch = filterTag === "all" || (b.tags || []).includes(filterTag);
    const recentMatch = !filterRecent || new Date(b.createdAt) > new Date(Date.now() - 7*24*60*60*1000);
    return authorMatch && tagMatch && recentMatch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" /> Blogs & Documents
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Author Filter */}
          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Authors</option>
            {authors.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Tags</option>
            {tags.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

          {/* Recent Filter */}
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={filterRecent}
              onChange={(e) => setFilterRecent(e.target.checked)}
            />
            Recent (last 7 days)
          </label>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition"
          >
            {/* Header with PDF icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-gray-700 font-medium">PDF</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              {blog.title}
            </h3>

            {/* Caption */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {blog.caption}
            </p>

            {/* Author */}
            <p className="text-gray-500 text-sm mb-6">
              By {blog.authorName || "Unknown"}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{blog.downloads || 0} downloads</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleView(blog._id, blog)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              {blog.file?.url && (
                <button
                  onClick={() => handleDownload(blog._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for PDF Preview */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 h-4/5 rounded-lg relative shadow-xl flex flex-col">
            <button
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              onClick={() => setSelectedBlog(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://docs.google.com/gview?url=${selectedBlog.file.url}&embedded=true`}
              title="PDF Preview"
              className="w-full h-full rounded-b-lg"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
