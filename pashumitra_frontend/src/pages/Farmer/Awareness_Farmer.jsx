"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  FileText,
  Megaphone,
  Heart,
  Download,
  ExternalLink,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function FarmerHealthAwareness() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Demo content
  const posts = [
    {
      doctorName: "Dr. Pashumitra",
      doctorImg: "https://via.placeholder.com/40x40?text=DP",
      title: "Vaccination Awareness",
      description: "Importance of timely vaccination for livestock health.",
      hashtags: ["LivestockCare", "Vaccination", "HealthyFarms"],
      likes: 120,
      images: [
        "https://via.placeholder.com/300x200?text=Image+1",
        "https://via.placeholder.com/300x200?text=Image+2",
        "https://via.placeholder.com/300x200?text=Image+3",
      ],
    },
    {
      doctorName: "Dr. Pashumitra",
      doctorImg: "https://via.placeholder.com/40x40?text=DP",
      title: "Summer Feeding Tips",
      description:
        "How to keep your cattle hydrated and well-fed in hot weather.",
      hashtags: ["SummerCare", "AnimalHealth"],
      likes: 85,
      images: [
        "https://via.placeholder.com/300x200?text=Image+1",
        "https://via.placeholder.com/300x200?text=Image+2",
      ],
    },
  ];

  const blogs = [
    {
      title: "Importance of Deworming in Livestock",
      description:
        "Learn why regular deworming is essential for your cattle’s health.",
      readTime: "4 min read",
      link: "https://example.com/full-deworming-blog",
      downloadLink: "/docs/deworming-guide.pdf",
    },
    {
      title: "Summer Care for Dairy Animals",
      description:
        "Practical tips to prevent heat stress and keep your animals healthy.",
      readTime: "5 min read",
      link: "https://example.com/summer-care",
      downloadLink: "/docs/summer-care.pdf",
    },
  ];

  const campaigns = [
    {
      title: "Free Vaccination Camp",
      date: "15th August 2025",
      location: "Village Panchayat Hall",
      description:
        "Bring your cattle for a free vaccination drive organized by local vets.",
      contact: "+91 9876543210",
    },
    {
      title: "Nutrition Awareness Drive",
      date: "1st September 2025",
      location: "Community Center",
      description: "Learn about balanced feeding for improved milk production.",
      contact: "+91 9123456780",
    },
  ];

  // Track image index for each post
  const [imageIndexes, setImageIndexes] = useState(posts.map(() => 0));

  const nextImage = (postIndex) => {
    setImageIndexes((prev) =>
      prev.map((val, i) =>
        i === postIndex
          ? val === posts[postIndex].images.length - 1
            ? 0
            : val + 1
          : val
      )
    );
  };

  const prevImage = (postIndex) => {
    setImageIndexes((prev) =>
      prev.map((val, i) =>
        i === postIndex
          ? val === 0
            ? posts[postIndex].images.length - 1
            : val - 1
          : val
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[80vw] mx-auto space-y-12">
        {/* Posts Section */}
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {posts.map((post, postIndex) => (
            <motion.div
              key={postIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md mx-auto overflow-hidden"
            >
              {/* Doctor Header */}
              <div className="flex items-center space-x-3 p-4">
                <img
                  src={post.doctorImg}
                  alt={post.doctorName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-semibold text-gray-900">
                  {post.doctorName}
                </span>
              </div>

              {/* Image Carousel */}
              <div className="relative w-full h-80 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={post.images[imageIndexes[postIndex]]}
                  alt={`Post ${imageIndexes[postIndex] + 1}`}
                  className="w-full h-full object-cover"
                />
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(postIndex)}
                      className="absolute left-2 bg-black bg-opacity-50 text-white rounded-full px-2 py-1"
                    >
                      {"<"}
                    </button>
                    <button
                      onClick={() => nextImage(postIndex)}
                      className="absolute right-2 bg-black bg-opacity-50 text-white rounded-full px-2 py-1"
                    >
                      {">"}
                    </button>
                    <div className="absolute bottom-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                      {imageIndexes[postIndex] + 1} / {post.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-around px-4 py-3 border-t border-gray-100">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-red-500">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Likes */}
              <div className="px-4 py-2 text-sm font-semibold">
                {post.likes} likes
              </div>

              {/* Caption */}
              <div className="px-4 pb-4 text-sm">
                <span className="font-semibold">{post.doctorName} </span>
                {post.description}
                <div className="text-blue-600">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="mr-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Blogs Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" /> Blogs & Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-3">{blog.description}</p>
                <p className="text-xs text-gray-500 mb-4">{blog.readTime}</p>
                <div className="flex gap-3">
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> Read More
                  </a>
                  <a
                    href={blog.downloadLink}
                    download
                    className="flex items-center gap-1 text-green-600 hover:underline text-sm"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Campaigns Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-orange-600" /> Campaigns
          </h2>
          <div className="space-y-6">
            {campaigns.map((camp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-orange-50 border border-orange-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-orange-800 mb-1">
                  {camp.title}
                </h3>
                <p className="text-sm text-orange-700 mb-2">
                  {camp.date} — {camp.location}
                </p>
                <p className="text-orange-600 mb-3">{camp.description}</p>
                <p className="flex items-center gap-1 text-sm text-orange-800">
                  <Phone className="w-4 h-4" /> Contact: {camp.contact}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
