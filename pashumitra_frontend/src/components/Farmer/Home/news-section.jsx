"use client"

import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"

const articles = [
  {
    title: "New Lumpy Skin Disease Outbreak Prevention Tips",
    excerpt: "Learn how to protect your cattle from the recent LSD outbreak with proper vaccination and care.",
    author: "Dr. Rajesh Sharma",
    date: "2 days ago",
    category: "Prevention",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Monsoon Vaccination Schedule for Livestock",
    excerpt: "Essential vaccination your animals need before the monsoon season arrives.",
    author: "Dr. Priya Mehta",
    date: "5 days ago",
    category: "Prevention",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Heat Stress Management in Dairy Cattle",
    excerpt: "Effective strategies to keep your dairy cattle cool and productive during hot weather.",
    author: "Dr. Sunil Kumar",
    date: "1 week ago",
    category: "Care",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest Awareness & News</h2>
          <p className="text-gray-600">
            Stay updated with the latest in veterinary care, disease alerts, and expert tips
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{article.category}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.date}
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors duration-300"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Load More Articles
          </button>
        </motion.div>
      </div>
    </section>
  )
}
