import express from "express";
import mongoose from "mongoose";
import ConsultationRequest from "../../models/Common/consultationRequestModel.js";
import Doctor from "../../models/Doctor/DoctorModel.js";
import Notification from "../../models/Common/notificationModel.js"; // optional
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";

const router = express.Router();

// ✅ Create consultation request
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

// ✅ Check consultation status for farmer
router.get("/status/:doctorId/:farmerUserId", async (req, res) => {
  try {
    const { doctorId, farmerUserId } = req.params;

    // Find Farmer document using userId
    const farmerProfile = await Farmer.findOne({ userId: farmerUserId });
    if (!farmerProfile) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Find consultation request
    const consultation = await ConsultationRequest.findOne({
      doctorId,
      farmerId: farmerProfile._id
    }).sort({ createdAt: -1 }); // get the most recent one

    if (!consultation) {
      return res.json({
        status: "none",
        consultation: null
      });
    }

    res.json({
      status: consultation.status,
      consultation: {
        _id: consultation._id,
        doctorId: consultation.doctorId,
        farmerId: consultation.farmerId,
        date: consultation.date,
        startTime: consultation.startTime,
        endTime: consultation.endTime,
        fee: consultation.fee,
        status: consultation.status,
        createdAt: consultation.createdAt,
        updatedAt: consultation.updatedAt
      }
    });
  } catch (err) {
    console.error("Error fetching consultation status:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all consultations for a farmer - FIXED FOR CORRECT DATA MODEL
router.get("/farmer/:farmerUserId", async (req, res) => {
  try {
    const { farmerUserId } = req.params;

    // Find Farmer document using userId
    const farmerProfile = await Farmer.findOne({ userId: farmerUserId });
    if (!farmerProfile) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Find all consultation requests for this farmer
    const consultations = await ConsultationRequest.find({
      farmerId: farmerProfile._id
    }).sort({ createdAt: -1 });

    // Manually populate doctor information with CORRECT data structure
    const consultationsWithDoctors = await Promise.all(
      consultations.map(async (consultation) => {
        let doctorInfo = {
          fullName: "Doctor Not Available",
          specialization: "Unknown",
          experience: 0,
          fee: 0
        };

        // Manually lookup doctor if doctorId exists
        if (consultation.doctorId) {
          try {
            // CORRECTED: Directly use Doctor_User model which contains the profile data
            const doctor = await Doctor.findById(consultation.doctorId);
            
            console.log("Found doctor:", doctor); // Debug log
            
            if (doctor) {
              doctorInfo = {
                fullName: doctor.fullName || "Unknown Doctor",
                specialization: doctor.specialization || "General Practitioner",
                experience: doctor.experience || 0,
                fee: doctor.fee || 0
              };
            }
          } catch (doctorErr) {
            console.error(`Error fetching doctor ${consultation.doctorId}:`, doctorErr);
          }
        }

        return {
          _id: consultation._id,
          doctorId: consultation.doctorId,
          farmerId: consultation.farmerId,
          date: consultation.date,
          startTime: consultation.startTime,
          endTime: consultation.endTime,
          status: consultation.status,
          fee: consultation.fee,
          consultationNotes: consultation.consultationNotes || "",
          diagnosis: consultation.diagnosis || "",
          treatmentPlan: consultation.treatmentPlan || "",
          nextSteps: consultation.nextSteps || "",
          medicationsPrescribed: consultation.medicationsPrescribed || [],
          consultationDuration: consultation.consultationDuration || 0,
          followUpDate: consultation.followUpDate,
          symptoms: consultation.symptoms || "",
          recommendations: consultation.recommendations || "",
          createdAt: consultation.createdAt,
          updatedAt: consultation.updatedAt,
          doctorInfo: doctorInfo
        };
      })
    );

    res.json(consultationsWithDoctors);
  } catch (err) {
    console.error("Error fetching farmer consultations:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Doctor -> list requests - UPDATED: Include all statuses
router.get("/doctor/:doctorId/requests", async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { doctorId: req.params.doctorId };
    
    // Add status filter if provided, otherwise show all except rejected
    if (status && status !== 'all') {
      if (status === 'active') {
        query.status = { $in: ['pending', 'approved'] };
      } else {
        query.status = status;
      }
    } else {
      // Default: show all except rejected
      query.status = { $ne: 'rejected' };
    }

    // 1️⃣ Fetch requests and populate Farmer_User
    const requests = await ConsultationRequest.find(query)
      .populate("farmerId") // populate Farmer document
      .sort({ createdAt: -1 }); // Sort by newest first

    // 2️⃣ Normalize data to include User info and farmer user ID
    const normalized = await Promise.all(
      requests.map(async (r) => {
        if (!r.farmerId) {
          return {
            _id: null,
            farmerUserId: null,
            fullName: "Unknown Farmer",
            email: "",
            phone: "",
            status: r.status,
            date: r.date,
            startTime: r.startTime,
            endTime: r.endTime,
            fee: r.fee,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
          };
        }

        // fetch User linked to Farmer
        const user = await User.findById(r.farmerId.userId);

        return {
          _id: r.farmerId._id,   // Farmer document _id
          farmerUserId: r.farmerId.userId, // ✅ This is the user ID used in chat
          requestId: r._id,      // ConsultationRequest _id
          fullName: r.farmerId.fullName,
          email: user?.email || "",
          phone: user?.phone || "",
          status: r.status,
          date: r.date,
          startTime: r.startTime,
          endTime: r.endTime,
          fee: r.fee,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          // Include consultation details for completed ones
          consultationNotes: r.consultationNotes || "",
          diagnosis: r.diagnosis || "",
          treatmentPlan: r.treatmentPlan || ""
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


// ConsultationRoutes.js - FIXED ROUTES

// ✅ Get consultation details by ID - FIXED FOR CORRECT DATA MODEL
router.get("/:id", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findById(req.params.id)
      .populate({
        path: "farmerId",
        select: "fullName userId animals"
      })
      .populate({
        path: "doctorId",
        select: "fullName specialization experience fee" // CORRECTED: Direct fields from Doctor_User
      });

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Get user details for farmer
    const farmerUser = await User.findById(consultation.farmerId.userId).select("email phone");
    
    const consultationData = {
      id: consultation._id,
      farmerName: consultation.farmerId.fullName,
      farmerEmail: farmerUser?.email || "",
      farmerPhone: farmerUser?.phone || "",
      animalType: consultation.farmerId.animals?.[0]?.animalType || "Not specified",
      animalBreed: consultation.farmerId.animals?.[0]?.breed || "Not specified",
      animalAge: consultation.farmerId.animals?.[0]?.age || "Not specified",
      // CORRECTED: Direct fields from doctorId (Doctor_User)
      doctorName: consultation.doctorId?.fullName || "Unknown Doctor",
      doctorSpecialization: consultation.doctorId?.specialization || "General",
      date: consultation.date,
      startTime: consultation.startTime,
      endTime: consultation.endTime,
      status: consultation.status,
      consultationNotes: consultation.consultationNotes || "",
      diagnosis: consultation.diagnosis || "",
      treatmentPlan: consultation.treatmentPlan || "",
      nextSteps: consultation.nextSteps || "",
      medicationsPrescribed: consultation.medicationsPrescribed || [],
      consultationDuration: consultation.consultationDuration || 0,
      followUpDate: consultation.followUpDate,
      fee: consultation.fee || 0,
      symptoms: consultation.symptoms || "",
      recommendations: consultation.recommendations || "",
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt
    };

    res.json(consultationData);
  } catch (err) {
    console.error("Error fetching consultation:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ error: "Failed to fetch consultation details" });
  }
});

// ✅ Get consultation history for doctor - FIXED
router.get("/doctor/:doctorId/history", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = { doctorId };
    
    // Status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        query.status = 'completed';
      } else if (status === 'follow_up') {
        query.status = 'follow_up';
      } else if (status === 'active') {
        query.status = { $in: ['approved', 'pending'] };
      }
    }

    const consultations = await ConsultationRequest.find(query)
      .populate({
        path: "farmerId",
        select: "fullName userId animals"
      })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ConsultationRequest.countDocuments(query);

    const normalized = await Promise.all(
      consultations.map(async (consultation) => {
        const farmerUser = await User.findById(consultation.farmerId.userId).select("email phone");
        
        return {
          id: consultation._id,
          farmerId: consultation.farmerId._id,
          farmerUserId: consultation.farmerId.userId,
          farmerName: consultation.farmerId.fullName,
          farmerEmail: farmerUser?.email || "",
          farmerPhone: farmerUser?.phone || "",
          animalType: consultation.farmerId.animals?.[0]?.animalType || "Not specified",
          issue: consultation.diagnosis || consultation.consultationNotes || "General consultation",
          treatmentDate: consultation.date.toLocaleDateString('en-GB'),
          startTime: consultation.startTime,
          status: consultation.status,
          statusDisplay: consultation.status === 'completed' ? 'Completed' : 
                        consultation.status === 'follow_up' ? 'Follow-up Required' : 
                        consultation.status === 'approved' ? 'Active' : 'Pending',
          statusColor: consultation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      consultation.status === 'follow_up' ? 'bg-yellow-100 text-yellow-800' : 
                      consultation.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800',
          consultationNotes: consultation.consultationNotes || "",
          diagnosis: consultation.diagnosis || "",
          treatmentPlan: consultation.treatmentPlan || "",
          nextSteps: consultation.nextSteps || "",
          medicationsPrescribed: consultation.medicationsPrescribed || [],
          consultationDuration: consultation.consultationDuration || 0,
          followUpDate: consultation.followUpDate,
          fee: consultation.fee || 0,
          createdAt: consultation.createdAt
        };
      })
    );

    res.json({
      consultations: normalized,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    console.error("Error fetching consultation history:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update consultation details - FIXED
router.put("/:id/update", async (req, res) => {
  try {
    const {
      consultationNotes,
      diagnosis,
      treatmentPlan,
      nextSteps,
      followUpDate,
      medicationsPrescribed,
      consultationDuration,
      status,
      symptoms,
      recommendations
    } = req.body;

    const updateData = {
      ...(consultationNotes !== undefined && { consultationNotes }),
      ...(diagnosis !== undefined && { diagnosis }),
      ...(treatmentPlan !== undefined && { treatmentPlan }),
      ...(nextSteps !== undefined && { nextSteps }),
      ...(followUpDate !== undefined && { followUpDate }),
      ...(medicationsPrescribed !== undefined && { medicationsPrescribed }),
      ...(consultationDuration !== undefined && { consultationDuration }),
      ...(symptoms !== undefined && { symptoms }),
      ...(recommendations !== undefined && { recommendations })
    };

    // Update status if provided
    if (status) {
      updateData.status = status;
      if (status === 'follow_up') {
        updateData.followUpRequired = true;
      }
    }

    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json({
      message: "Consultation updated successfully",
      consultation: {
        id: consultation._id,
        status: consultation.status,
        consultationNotes: consultation.consultationNotes,
        diagnosis: consultation.diagnosis,
        treatmentPlan: consultation.treatmentPlan,
        nextSteps: consultation.nextSteps,
        medicationsPrescribed: consultation.medicationsPrescribed,
        consultationDuration: consultation.consultationDuration,
        followUpDate: consultation.followUpDate,
        symptoms: consultation.symptoms,
        recommendations: consultation.recommendations
      }
    });
  } catch (err) {
    console.error("Error updating consultation:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Complete consultation - ADD THIS ENDPOINT
router.put("/:id/complete", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: "completed",
        completedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Optional: Send notification to farmer
    if (Notification) {
      await Notification.create({
        userId: consultation.farmerId,
        title: "Consultation Completed",
        message: `Your consultation with the doctor has been marked as completed.`,
        type: "consultation",
      });
    }

    res.json({
      message: "Consultation marked as completed",
      consultation: {
        id: consultation._id,
        status: consultation.status,
        completedAt: consultation.completedAt
      }
    });
  } catch (err) {
    console.error("Error completing consultation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Schedule follow-up - ADD THIS ENDPOINT TOO
router.put("/:id/schedule-followup", async (req, res) => {
  try {
    const { followUpDate, notes } = req.body;

    const consultation = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: "follow_up",
        followUpDate: followUpDate,
        followUpNotes: notes,
        followUpScheduledAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Optional: Send notification to farmer
    if (Notification) {
      await Notification.create({
        userId: consultation.farmerId,
        title: "Follow-up Scheduled",
        message: `A follow-up consultation has been scheduled for ${new Date(followUpDate).toLocaleDateString()}.`,
        type: "consultation",
      });
    }

    res.json({
      message: "Follow-up scheduled successfully",
      consultation: {
        id: consultation._id,
        status: consultation.status,
        followUpDate: consultation.followUpDate,
        followUpNotes: consultation.followUpNotes
      }
    });
  } catch (err) {
    console.error("Error scheduling follow-up:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;