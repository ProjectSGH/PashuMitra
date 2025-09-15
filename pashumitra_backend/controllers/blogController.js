const DocBlog = require("../models/Common/blogModel");
const Doctor = require("../models/Doctor/DoctorModel");
const User = require("../models/UserModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
const axios = require("axios");

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper for buffer upload with original name + ext
const streamUpload = (buffer, originalname, mimetype) => {
    return new Promise((resolve, reject) => {
        const fileExt = path.extname(originalname).replace(".", "");
        const fileBaseName = path.basename(originalname, path.extname(originalname));

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "doc_blog",
                resource_type: "auto",
                type: "upload",         // force public delivery
                public_id: fileBaseName,
                format: fileExt,
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


// 📌 Create Document/Blog (Doctor side)
exports.createDocBlog = async (req, res) => {
    try {
        const { title, caption, blogContent, author } = req.body;

        let authorName = "Unknown";
        const doctor = await Doctor.findOne({ userId: author });
        if (doctor) {
            authorName = doctor.fullName;
        } else {
            const user = await User.findById(author);
            if (user) authorName = user.fullName || "User";
        }

        let uploadedFile = {};
        if (req.file) {
            const result = await streamUpload(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            uploadedFile = {
                url: result.secure_url,
                public_id: result.public_id,
                name: req.file.originalname,
                fileType: req.file.mimetype,
            };
        }

        const docBlog = new DocBlog({
            author,
            authorName,
            title,
            caption,
            blogContent,
            file: uploadedFile,
        });

        await docBlog.save();
        res.status(201).json({ message: "Document/Blog created successfully", docBlog });
    } catch (error) {
        console.error("Create DocBlog error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Get all Docs/Blogs (Farmer side)
exports.getAllDocBlogs = async (req, res) => {
    try {
        const docs = await DocBlog.find().sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        console.error("Fetch Docs error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Increment Views
exports.incrementViews = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await DocBlog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        res.json(doc);
    } catch (error) {
        console.error("Increment view error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Increment Downloads
exports.incrementDownloads = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await DocBlog.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
        res.json(doc);
    } catch (error) {
        console.error("Increment download error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Force Download Route
exports.downloadDocBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocBlog.findById(id);
    if (!doc || !doc.file?.url) {
      return res.status(404).json({ message: "File not found" });
    }

    // Cloudinary URL ला fetch करून stream कर
    const response = await axios({
      url: doc.file.url,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.file.name || "document.pdf"}"`
    );
    res.setHeader("Content-Type", doc.file.fileType || "application/pdf");

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get total documents/blogs by doctor
exports.getDocCountByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const count = await DocBlog.countDocuments({ author: doctorId });
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doc count", error: error.message });
  }
};

// ✅ Get recent docs/blogs by doctor
exports.getRecentDocsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const docs = await DocBlog.find({ author: doctorId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent docs", error: error.message });
  }
};

