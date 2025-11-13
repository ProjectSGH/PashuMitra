const nodemailer = require('nodemailer');

// Create transporter - FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendVerificationCode = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code - PashuMitra',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">PashuMitra Password Reset</h2>
          <p>You have requested to reset your password. Use the verification code below:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">PashuMitra - Animal Healthcare Platform</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = { sendVerificationCode };