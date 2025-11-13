const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const PasswordReset = require('../models/Common/PasswordResetModel');
const { sendVerificationCode } = require('../services/emailService');

// Generate random 6-digit code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Password reset request for:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if email exists
      console.log('User not found for email:', email);
      return res.status(200).json({ 
        message: 'If the email exists, a verification code has been sent' 
      });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated code:', code, 'for email:', email);

    // Save or update reset record
    await PasswordReset.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    // Send email
    const emailSent = await sendVerificationCode(email, code);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({ 
      message: 'Verification code sent to your email',
      email: email
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Verify code and reset password
const verifyAndResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    console.log('Password reset attempt:', { email, code, newPasswordLength: newPassword?.length });

    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        message: 'Email, verification code, and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Find valid reset record
    const resetRecord = await PasswordReset.findOne({
      email: email.toLowerCase(),
      code,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification code' 
      });
    }

    // Find user and update password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ FIX: Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password with hashed version
    user.password = hashedPassword;
    await user.save();

    // Delete used reset record
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    console.log('Password reset successful for:', email);
    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  requestPasswordReset,
  verifyAndResetPassword,
};