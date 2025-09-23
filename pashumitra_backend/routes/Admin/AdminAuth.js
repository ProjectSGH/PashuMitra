// routes/adminAuth.js
const express = require("express");
const router = express.Router();
const Admin = require("../../models/Common/Admin");

// ✅ Create admin
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Admin already exists" });

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.json({ success: true, message: "New admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    if (admin.password !== password) return res.status(401).json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ List all admins
router.get("/list", async (req, res) => {
  const admins = await Admin.find({}, "email");
  res.json({ success: true, admins });
});

// ✅ Remove admin
router.delete("/remove", async (req, res) => {
  const { email } = req.body;
  const deleted = await Admin.findOneAndDelete({ email });
  if (!deleted) return res.status(404).json({ success: false, message: "Admin not found" });

  res.json({ success: true, message: "Admin removed successfully" });
});

module.exports = router;
