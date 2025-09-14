import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Contact from "../../models/Common/queryModel.js"; // your mongoose model

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body; // ✅ add subject

    // Save in DB
    const newContact = new Contact({ name, email, phone, subject, message }); // ✅ include subject
    await newContact.save();

    // 2️⃣ Setup transporter (use EMAIL_USER + EMAIL_PASS)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Fancy HTML email
    const mailOptions = {
      from: `"HexCode Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px; border-radius:10px; background:#f4f7fb; color:#333;">
          <h2 style="color:#2c3e50;">New Contact Form Submission 🚀</h2>
          <p style="font-size:16px;">You’ve received a new message from your website:</p>

          <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr>
              <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">Subject</td>
              <td style="padding:10px; border:1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">Name</td>
              <td style="padding:10px; border:1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">Email</td>
              <td style="padding:10px; border:1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">Phone</td>
              <td style="padding:10px; border:1px solid #ddd;">${phone || "Not Provided"}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">Message</td>
              <td style="padding:10px; border:1px solid #ddd;">${message}</td>
            </tr>
          </table>

          <p style="font-size:14px; color:#555;">💡 This is an automated mail from your Contact Form.</p>
        </div>
      `,
    };

    // 4️⃣ Send mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Contact saved & email sent!" });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to process contact form" });
  }
});

export default router;
