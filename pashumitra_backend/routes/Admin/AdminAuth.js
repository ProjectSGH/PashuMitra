const express = require("express");
const router = express.Router();

// Hardcoded admin credentials (you can keep multiple admins here)
let admins = [
  { email: "admin@pashumitra.com", password: "admin123" },
  { email: "superadmin@pashumitra.com", password: "super123" },
];

router.post("/create", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

  const exists = admins.find(a => a.email === email);
  if (exists) return res.status(409).json({ success: false, message: "Admin already exists" });

  admins.push({ email, password });
  res.json({ success: true, message: "New admin created successfully" });
});

// ✅ Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const admin = admins.find((a) => a.email === email && a.password === password);

  if (!admin) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // simple session token (for demo only)
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

  res.json({
    success: true,
    message: "Login successful",
    token, // frontend can store in localStorage
  });
});

module.exports = router;
