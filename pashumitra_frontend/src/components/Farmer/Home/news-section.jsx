"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import resource from "../../../resource";

export default function NewsSection() {
  const [blogs, setBlogs] = useState([]);

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

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Latest Awareness & News
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with expert-written blogs and important veterinary
            updates — helping you keep your livestock healthy and productive.
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img
              src={resource.Common_Hero_2.src}
              alt="Awareness"
              className="w-[250px] h-[250px] md:w-[40vh] md:h-[40vh] rounded-full object-cover shadow-2xl border-4 border-white"
            />
          </motion.div>

          {/* Right Blogs Preview */}
          {/* Right Blogs Preview */}
          <div className="space-y-6">
            {blogs.slice(0, 3).map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition border-l-4 border-blue-500"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* Blog Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {blog.caption}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blog.authorName || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Read More link (optional) */}
                    <a
                      href="/farmer/awareness"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Explore More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center pt-4"
            >
              <a
                href="/farmer/awareness"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                Explore More Blogs & Docs →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
