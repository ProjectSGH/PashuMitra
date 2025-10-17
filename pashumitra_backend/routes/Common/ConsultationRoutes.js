import express from "express";
import mongoose from "mongoose";
import ConsultationRequest from "../../models/Common/consultationRequestModel.js";
import Doctor from "../../models/Doctor/DoctorModel.js";
import Notification from "../../models/Common/notificationModel.js";
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";
import { getIO } from "../../services/socket.js";

const router = express.Router();

// ✅ Test route to verify the route is working
router.get("/test", (req, res) => {
  console.log("✅ Consultation test route hit!");
  res.json({
    message: "Consultation routes are working!",
    timestamp: new Date().toISOString()
  });
});

// ✅ Create consultation request (Fixed for your data structure)
router.post("/", async (req, res) => {
  try {
    const { doctorId, farmerId, date, startTime, endTime } = req.body;

    console.log("📝 Received consultation request:", {
      doctorId,
      farmerId,
      date,
      startTime,
      endTime
    });

    // 🔍 DEBUG: Check what farmerId we're receiving
    console.log("🔍 farmerId from request:", farmerId);
    console.log("🔍 farmerId type:", typeof farmerId);

    // 0️⃣ Fetch Farmer document using userId (farmerId is User._id from frontend)
    const farmerProfile = await Farmer.findOne({ userId: farmerId });
    console.log("🔍 Found farmer profile:", farmerProfile);

    if (!farmerProfile) {
      console.log("❌ Farmer not found for userId:", farmerId);
      return res.status(404).json({
        error: "Farmer profile not found",
        details: `No farmer profile found for user ID: ${farmerId}`
      });
    }

    // 🔍 DEBUG: Check the IDs
    console.log("🔍 ID Comparison:", {
      farmerIdFromRequest: farmerId,
      farmerProfileId: farmerProfile._id.toString(),
      farmerUserId: farmerProfile.userId.toString(),
      isFarmerIdEqual: farmerId === farmerProfile.userId.toString()
    });

    // 1️⃣ Check if farmer already has a pending or approved request with this doctor
    const activeRequest = await ConsultationRequest.findOne({
      doctorId,
      farmerId: farmerProfile._id, // Use Farmer._id here
      status: { $in: ["pending", "approved"] },
    });

    if (activeRequest) {
      console.log("⚠️ Duplicate request found:", activeRequest._id);
      return res.status(409).json({
        message: "You already have an active consultation request with this doctor. Please wait for it to be processed.",
      });
    }

    // 2️⃣ Check overlapping approved appointments
    const existing = await ConsultationRequest.findOne({
      doctorId,
      date,
      startTime,
      status: "approved",
    });

    if (existing) {
      console.log("⏰ Slot already booked");
      return res.status(409).json({ message: "This time slot is already booked. Please choose a different time." });
    }

    // 3️⃣ Fetch doctor details
    const doctorProfile = await Doctor.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const fee = doctorProfile?.fee || 0;
    const doctorName = doctorProfile?.fullName || "Doctor"; // FIXED: Direct access to fullName

    console.log("🔍 Doctor details:", {
      doctorId: doctorProfile._id,
      doctorName: doctorName,
      fee: fee
    });

    // 4️⃣ Create ConsultationRequest - Use Farmer._id as farmerId
    const consultationRequest = await ConsultationRequest.create({
      doctorId,
      farmerId: farmerProfile._id, // This should be Farmer._id
      date,
      startTime,
      endTime,
      fee,
      status: "pending",
    });

    console.log("✅ Consultation request created:", consultationRequest._id);
    console.log("🔍 Consultation request details:", {
      doctorId: consultationRequest.doctorId,
      farmerId: consultationRequest.farmerId, // This should be Farmer._id
      farmerUserId: farmerId // This is the original User._id from request
    });

    try {
      // 5️⃣ Create notification for doctor
      const doctorNotification = await Notification.create({
        userIds: [doctorId],
        title: "New Consultation Request 📅",
        message: `New consultation request from ${farmerProfile.fullName} on ${new Date(date).toDateString()} at ${startTime}`,
        type: "consultation_request",
        relatedId: consultationRequest._id,
        isReadBy: [],
      });

      // 6️⃣ Create notification for farmer - Use the original farmerId (User._id)
      const farmerNotification = await Notification.create({
        userIds: [farmerId], // This should be User._id
        title: "Consultation Request Sent ✅",
        message: `Your consultation request to Dr. ${doctorName} has been sent for ${new Date(date).toDateString()} at ${startTime}. You'll be notified when they respond.`,
        type: "consultation_confirmation",
        relatedId: consultationRequest._id,
        isReadBy: [],
      });

      // 7️⃣ Emit socket events
      const io = getIO();
      if (io) {
        io.to(doctorId.toString()).emit("newNotification", doctorNotification);
        io.to(farmerId.toString()).emit("newNotification", farmerNotification);
        console.log("🔔 Socket notifications emitted");
      } else {
        console.log("⚠️ Socket.io not available for notifications");
      }

    } catch (notificationError) {
      console.error("❌ Notification creation failed, but consultation was created:", notificationError);
      // Don't fail the entire request if notifications fail
    }

    res.status(201).json({
      ...consultationRequest.toObject(),
      message: "Consultation request submitted successfully"
    });

  } catch (err) {
    console.error("❌ Error creating consultation request:", err);
    res.status(500).json({
      error: "Failed to create consultation request",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// ✅ Get consultation status for specific doctor-farmer pair (Fixed)
router.get("/status/:doctorId/:farmerId", async (req, res) => {
  try {
    const { doctorId, farmerId } = req.params;

    console.log("🔍 Checking consultation status:", {
      doctorId,
      farmerId,
      farmerIdType: typeof farmerId
    });

    // Find farmer profile using userId (farmerId from params is User._id)
    const farmerProfile = await Farmer.findOne({ userId: farmerId });
    console.log("🔍 Farmer profile found:", farmerProfile);

    if (!farmerProfile) {
      console.log("❌ Farmer profile not found for userId:", farmerId);
      return res.status(404).json({ error: "Farmer profile not found" });
    }

    const consultation = await ConsultationRequest.findOne({
      doctorId,
      farmerId: farmerProfile._id, // Use Farmer._id to search
    }).sort({ createdAt: -1 });

    if (!consultation) {
      console.log("ℹ️ No consultation request found");
      return res.json({ status: "no_request" });
    }

    console.log("✅ Consultation status:", consultation.status);
    res.json({
      status: consultation.status,
      date: consultation.date,
      startTime: consultation.startTime,
      endTime: consultation.endTime,
      fee: consultation.fee,
      requestId: consultation._id,
    });
  } catch (err) {
    console.error("❌ Error fetching consultation status:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Doctor -> list requests (Fixed)
router.get("/doctor/:doctorId/requests", async (req, res) => {
  try {
    console.log("📋 Fetching requests for doctor:", req.params.doctorId);

    const requests = await ConsultationRequest.find({ doctorId: req.params.doctorId })
      .populate("farmerId") // This populates Farmer_User document
      .sort({ date: 1 });

    console.log(`🔍 Found ${requests.length} consultation requests`);

    const normalized = await Promise.all(
      requests.map(async (r) => {
        console.log("🔍 Processing request:", r._id);
        console.log("🔍 Farmer data:", r.farmerId);

        if (!r.farmerId) {
          return {
            _id: null,
            fullName: "Unknown Farmer",
            email: "",
            phone: "",
            status: r.status,
            date: r.date,
            startTime: r.startTime,
            endTime: r.endTime,
            fee: r.fee,
          };
        }

        // Fetch User linked to Farmer to get email/phone
        const user = await User.findById(r.farmerId.userId);
        console.log("🔍 Found user for farmer:", user);

        return {
          _id: r.farmerId._id,   // Farmer _id
          requestId: r._id,      // ConsultationRequest _id
          fullName: r.farmerId.fullName,
          email: user?.email || "",
          phone: user?.phone || "",
          status: r.status,
          date: r.date,
          startTime: r.startTime,
          endTime: r.endTime,
          fee: r.fee,
        };
      })
    );

    console.log(`✅ Returning ${normalized.length} normalized requests`);
    res.json(normalized);
  } catch (err) {
    console.error("❌ Error fetching doctor requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Approve request (Fixed)
router.put("/:id/approve", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("farmerId"); // Populate to get Farmer details

    if (!consultation) return res.status(404).json({ error: "Request not found" });

    // Get farmer's user ID from the populated farmer document
    const farmerUser = await User.findById(consultation.farmerId.userId);
    if (!farmerUser) return res.status(404).json({ error: "Farmer user not found" });

    const doctorProfile = await Doctor.findById(consultation.doctorId);
    const doctorName = doctorProfile?.fullName || "the doctor"; // FIXED: Direct access to fullName

    // Create notification for farmer - use User._id
    const farmerNotification = await Notification.create({
      userIds: [farmerUser._id],
      title: "Consultation Approved! 🎉",
      message: `Your consultation with Dr. ${doctorName} has been approved for ${new Date(consultation.date).toDateString()} at ${consultation.startTime}. Chat will be available during the scheduled time.`,
      type: "consultation_approved",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Create notification for doctor
    const doctorNotification = await Notification.create({
      userIds: [consultation.doctorId],
      title: "Consultation Scheduled ✅",
      message: `You approved consultation with ${consultation.farmerId.fullName} on ${new Date(consultation.date).toDateString()} at ${consultation.startTime}`,
      type: "consultation_scheduled",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(farmerUser._id.toString()).emit("newNotification", farmerNotification);
      io.to(consultation.doctorId.toString()).emit("newNotification", doctorNotification);
    }

    res.json(consultation);
  } catch (err) {
    console.error("Error approving consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reject request (Fixed)
router.put("/:id/reject", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("farmerId");

    if (!consultation) return res.status(404).json({ error: "Request not found" });

    // Get farmer's user ID
    const farmerUser = await User.findById(consultation.farmerId.userId);
    if (!farmerUser) return res.status(404).json({ error: "Farmer user not found" });

    const doctorProfile = await Doctor.findById(consultation.doctorId);
    const doctorName = doctorProfile?.fullName || "the doctor"; // FIXED: Direct access to fullName

    // Create notification for farmer
    const farmerNotification = await Notification.create({
      userIds: [farmerUser._id],
      title: "Consultation Request Rejected ❌",
      message: `Your consultation request with Dr. ${doctorName} for ${new Date(consultation.date).toDateString()} at ${consultation.startTime} was rejected.`,
      type: "consultation_rejected",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Create notification for doctor
    const doctorNotification = await Notification.create({
      userIds: [consultation.doctorId],
      title: "Consultation Rejected",
      message: `You rejected consultation request from ${consultation.farmerId.fullName}`,
      type: "consultation_rejected",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(farmerUser._id.toString()).emit("newNotification", farmerNotification);
      io.to(consultation.doctorId.toString()).emit("newNotification", doctorNotification);
    }

    res.json(consultation);
  } catch (err) {
    console.error("Error rejecting consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Confirm consultation (Fixed)
router.put("/confirm", async (req, res) => {
  try {
    const { doctorId, farmerId } = req.body; // farmerId is User._id
    if (!doctorId || !farmerId) {
      return res.status(400).json({ error: "doctorId and farmerId required" });
    }

    const farmerProfile = await Farmer.findOne({ userId: farmerId });
    if (!farmerProfile) return res.status(404).json({ error: "Farmer not found" });

    const consultation = await ConsultationRequest.findOneAndUpdate(
      { doctorId, farmerId: farmerProfile._id, status: "pending" }, // Use Farmer._id
      { status: "approved" },
      { new: true }
    );

    if (!consultation) return res.status(404).json({ error: "Request not found" });

    // Get doctor details for notification
    const doctorProfile = await Doctor.findById(doctorId);
    const doctorName = doctorProfile?.fullName || "the doctor"; // FIXED: Direct access to fullName

    // Create notification for farmer - use User._id
    const farmerNotification = await Notification.create({
      userIds: [farmerId],
      title: "Consultation Confirmed ✅",
      message: `Your consultation has been confirmed by the doctor for ${new Date(consultation.date).toDateString()} at ${consultation.startTime}.`,
      type: "consultation_confirmed",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Create notification for doctor
    const doctorNotification = await Notification.create({
      userIds: [doctorId],
      title: "Consultation Confirmed",
      message: `You confirmed consultation with ${farmerProfile.fullName}`,
      type: "consultation_confirmed",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(farmerId).emit("newNotification", farmerNotification);
      io.to(doctorId).emit("newNotification", doctorNotification);
    }

    res.json(consultation);
  } catch (err) {
    console.error("Error confirming consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Check if chat is allowed (time-based)
router.get("/chat-allowed/:requestId", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findById(req.params.requestId);

    if (!consultation || consultation.status !== "approved") {
      return res.json({ allowed: false, reason: "Consultation not approved" });
    }

    const consultationDate = new Date(consultation.date);
    const now = new Date();

    // Check if it's the same day
    if (consultationDate.toDateString() !== now.toDateString()) {
      return res.json({ allowed: false, reason: "Consultation is not today" });
    }

    // Check time window (allow 15 minutes before and after scheduled time)
    const [startHour, startMin] = consultation.startTime.split(":").map(Number);
    const [endHour, endMin] = consultation.endTime.split(":").map(Number);

    const startDateTime = new Date(consultationDate);
    startDateTime.setHours(startHour, startMin - 15, 0, 0); // 15 mins early

    const endDateTime = new Date(consultationDate);
    endDateTime.setHours(endHour, endMin + 15, 0, 0); // 15 mins late

    const allowed = now >= startDateTime && now <= endDateTime;

    res.json({
      allowed,
      reason: allowed ? "Chat available" : "Outside consultation hours"
    });
  } catch (err) {
    console.error("Error checking chat availability:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Complete consultation (Fixed)
router.put("/:id/complete", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    ).populate("farmerId");

    if (!consultation) return res.status(404).json({ error: "Request not found" });

    // Get farmer's user ID
    const farmerUser = await User.findById(consultation.farmerId.userId);
    if (!farmerUser) return res.status(404).json({ error: "Farmer user not found" });

    // Create notification for farmer
    const farmerNotification = await Notification.create({
      userIds: [farmerUser._id],
      title: "Consultation Completed ✅",
      message: `Your consultation on ${new Date(consultation.date).toDateString()} has been marked as completed. Thank you for using our service!`,
      type: "consultation_completed",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Create notification for doctor
    const doctorNotification = await Notification.create({
      userIds: [consultation.doctorId],
      title: "Consultation Completed",
      message: `You marked consultation with ${consultation.farmerId.fullName} as completed.`,
      type: "consultation_completed",
      relatedId: consultation._id,
      isReadBy: [],
    });

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(farmerUser._id.toString()).emit("newNotification", farmerNotification);
      io.to(consultation.doctorId.toString()).emit("newNotification", doctorNotification);
    }

    res.json(consultation);
  } catch (err) {
    console.error("Error completing consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;