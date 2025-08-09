import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, FileType, Video, ImageIcon, FileText, X } from "lucide-react"
import toast from "react-hot-toast"

const UploadDocsTab = () => {
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadCaption, setUploadCaption] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [filePreview, setFilePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setFilePreview({ url: previewURL, name: file.name, type: file.type })
    }
  }

  const removeFile = () => {
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  const handleSubmit = () => {
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title.")
      return
    }
    if (!filePreview && !blogContent.trim()) {
      toast.error("Please upload a file or write a blog.")
      return
    }

    // Mock submit (replace with API call)
    toast.success("Document submitted successfully!")
    setUploadTitle("")
    setUploadCaption("")
    setBlogContent("")
    removeFile()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <Upload className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Upload Documentation or Write Blog</h2>
        </div>

        {/* Title & Caption */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder="Document Title..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            placeholder="Brief Description..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Upload Area */}
        {!filePreview && (
          <label
            className="border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer hover:border-blue-400 mb-4"
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p>Click or Drag & Drop Files Here</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,application/pdf"
              onChange={handleFileUpload}
            />
          </label>
        )}

        {/* File Preview */}
        {filePreview && (
          <div className="mt-4 p-4 border rounded-lg relative">
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="font-medium">{filePreview.name}</p>
            {filePreview.type.startsWith("image") && (
              <img src={filePreview.url} alt="Preview" className="max-h-60 mt-2 rounded-lg" />
            )}
            {filePreview.type.startsWith("video") && (
              <video controls src={filePreview.url} className="max-h-60 mt-2 rounded-lg" />
            )}
            {filePreview.type === "application/pdf" && (
              <iframe src={filePreview.url} title="PDF Preview" className="w-full h-60 mt-2 rounded-lg" />
            )}
          </div>
        )}

        {/* Blog Writing Area */}
        <div className="mt-6">
          <label className="flex items-center mb-2 text-gray-700 font-medium">
            <FileText className="w-5 h-5 mr-2 text-blue-600" /> Or Write Your Blog
          </label>
          <textarea
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows={8}
            className="w-full px-4 py-2 border rounded-lg resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6"
        >
          Submit
        </motion.button>
      </div>
    </motion.div>
  )
}

export default UploadDocsTab
