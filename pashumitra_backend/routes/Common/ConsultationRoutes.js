import express from "express";
import mongoose from "mongoose";
import ConsultationRequest from "../../models/Common/consultationRequestModel.js";
import Doctor from "../../models/Doctor/DoctorModel.js";
import Notification from "../../models/Common/notificationModel.js"; // optional
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";

const router = express.Router();

// ✅ Create consultation request
// ✅ Create consultation request (Updated: prevents duplicate requests)
router.post("/", async (req, res) => {
  try {
    const { doctorId, farmerId, date, startTime, endTime } = req.body;

    // 0️⃣ Fetch Farmer document using userId (farmerId comes from request)
    const farmerProfile = await Farmer.findOne({ userId: farmerId });
    if (!farmerProfile) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // 1️⃣ Check if farmer already has a pending or approved request with this doctor
    const activeRequest = await ConsultationRequest.findOne({
      doctorId,
      farmerId: farmerProfile._id,
      status: { $in: ["pending", "approved"] },
    });
    if (activeRequest) {
      return res.status(409).json({
        message:
          "You already have a consultation request with this doctor. Please wait until it is completed.",
      });
    }

    // 2️⃣ Check overlapping approved appointments for this doctor at same slot
    const existing = await ConsultationRequest.findOne({
      doctorId,
      date,
      startTime,
      status: "approved",
    });
    if (existing) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    // 3️⃣ Fetch doctor fee
    const doctorProfile = await Doctor.findById(doctorId);
    const fee = doctorProfile?.fee || 0;

    // 4️⃣ Create ConsultationRequest
    const reqDoc = await ConsultationRequest.create({
      doctorId,
      farmerId: farmerProfile._id,
      date,
      startTime,
      endTime,
      fee,
      status: "pending",
    });

    // 5️⃣ Optional notification for doctor
    if (Notification) {
      await Notification.create({
        userId: doctorId,
        title: "New Consultation Request",
        message: `New request on ${new Date(date).toDateString()} at ${startTime}`,
        type: "consultation",
      });
    }

    res.status(201).json(reqDoc);
  } catch (err) {
    console.error("Error creating consultation request:", err);
    res.status(500).json({ error: "Failed to create consultation request" });
  }
});

// ✅ Doctor -> list requests
router.get("/doctor/:doctorId/requests", async (req, res) => {
  try {
    // 1️⃣ Fetch requests and populate Farmer_User
    const requests = await ConsultationRequest.find({ doctorId: req.params.doctorId })
      .populate("farmerId") // populate Farmer_User
      .sort({ date: 1 });

    // 2️⃣ Normalize data to include User info
    const normalized = await Promise.all(
      requests.map(async (r) => {
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

        // fetch User linked to Farmer
        const user = await User.findById(r.farmerId.userId);

        return {
          _id: r.farmerId._id,   // Farmer _id (used for mapping & UI)
          requestId: r._id,      // ConsultationRequest _id (used for API calls)
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

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching doctor requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Approve request
router.put("/:id/approve", async (req, res) => {
  try {
    const cr = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!cr) return res.status(404).json({ error: "Request not found" });

    // optional notification to farmer
    if (Notification) {
      await Notification.create({
        userId: cr.farmerId, // still links to Farmer _id
        title: "Consultation Approved",
        message: `Your consultation request with doctor ${cr.doctorId} was approved.`,
        type: "consultation",
      });
    }

    res.json(cr);
  } catch (err) {
    console.error("Error approving consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reject request
router.put("/:id/reject", async (req, res) => {
  try {
    const cr = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!cr) return res.status(404).json({ error: "Request not found" });

    if (Notification) {
      await Notification.create({
        userId: cr.farmerId,
        title: "Consultation Rejected",
        message: `Your consultation request was rejected.`,
        type: "consultation",
      });
    }

    res.json(cr);
  } catch (err) {
    console.error("Error rejecting consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Confirm consultation (doctor+farmer)
router.put("/confirm", async (req, res) => {
  try {
    const { doctorId, farmerId } = req.body;
    if (!doctorId || !farmerId) {
      return res.status(400).json({ error: "doctorId and farmerId required" });
    }

    const farmerProfile = await Farmer.findOne({ userId: farmerId });
    if (!farmerProfile) return res.status(404).json({ error: "Farmer not found" });

    const cr = await ConsultationRequest.findOneAndUpdate(
      { doctorId, farmerId: farmerProfile._id, status: "pending" },
      { status: "approved" },
      { new: true }
    );

    if (!cr) return res.status(404).json({ error: "Request not found" });

    if (Notification) {
      await Notification.create({
        userId: farmerId,
        title: "Consultation Confirmed",
        message: `Doctor has confirmed your consultation.`,
        type: "consultation",
      });
    }

    res.json(cr);
  } catch (err) {
    console.error("Error confirming consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
