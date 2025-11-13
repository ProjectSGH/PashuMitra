const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '10m' }, // Auto delete after 10 minutes
  },
}, { 
  timestamps: true 
});

// Create TTL index
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);