const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "consultation", "transportation"], default: "info" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }}, { timestamps: true });
module.exports = mongoose.model('pashumitra_notifications', notificationSchema);