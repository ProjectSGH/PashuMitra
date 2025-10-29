import express from "express";
import mongoose from "mongoose";
import ConsultationRequest from "../../models/Common/consultationRequestModel.js";
import Doctor from "../../models/Doctor/DoctorModel.js";
import Notification from "../../models/Common/notificationModel.js"; // optional
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";
import PDFDocument from "pdfkit";

const router = express.Router();

// ✅ Create consultation request - UPDATED to include animal details and symptoms
router.post("/", async (req, res) => {
  try {
    const { 
      doctorId, 
      farmerId, 
      date, 
      startTime, 
      endTime,
      animalType,
      animalBreed,
      animalAge,
      symptoms
    } = req.body;

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

    // 4️⃣ Create ConsultationRequest with new fields
    const reqDoc = await ConsultationRequest.create({
      doctorId,
      farmerId: farmerProfile._id,
      date,
      startTime,
      endTime,
      fee,
      status: "pending",
      // NEW FIELDS
      symptoms: symptoms || "",
      // Store animal details in consultation (they might be different from farmer profile)
      animalDetails: {
        animalType: animalType || "Not specified",
        animalBreed: animalBreed || "Not specified",
        animalAge: animalAge || "Not specified"
      }
    });

    // 5️⃣ Optional notification for doctor
    if (Notification) {
      await Notification.create({
        userId: doctorId,
        title: "New Consultation Request",
        message: `New consultation request from ${farmerProfile.fullName} for ${animalType || 'animal'}`,
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

// ✅ Get all consultations for a farmer - FIXED DOCTOR LOOKUP
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

    console.log(`Found ${consultations.length} consultations for farmer ${farmerUserId}`);

    // Manually populate doctor information with CORRECT lookup
    const consultationsWithDoctors = await Promise.all(
      consultations.map(async (consultation) => {
        let doctorInfo = {
          fullName: "Doctor Not Available",
          specialization: "Unknown",
          experience: 0,
          fee: 0
        };

        // Manually lookup doctor using userId (since doctorId stores User ID)
        if (consultation.doctorId) {
          try {
            console.log(`Looking up doctor with User ID: ${consultation.doctorId}`);
            
            // CORRECTED: Find Doctor document by userId field
            const doctor = await Doctor.findOne({ userId: consultation.doctorId });
            
            console.log("Doctor lookup result:", doctor);
            
            if (doctor) {
              doctorInfo = {
                fullName: doctor.fullName || "Unknown Doctor",
                specialization: doctor.specialization || "General Practitioner",
                experience: doctor.experience || 0,
                fee: doctor.fee || 0
              };
              console.log(`Found doctor: ${doctorInfo.fullName}`);
            } else {
              console.log(`Doctor not found with User ID: ${consultation.doctorId}`);
              
              // Fallback: Try direct ID lookup in case some records use different structure
              const doctorById = await Doctor.findById(consultation.doctorId);
              if (doctorById) {
                doctorInfo = {
                  fullName: doctorById.fullName || "Unknown Doctor",
                  specialization: doctorById.specialization || "General Practitioner",
                  experience: doctorById.experience || 0,
                  fee: doctorById.fee || 0
                };
                console.log(`Found doctor by direct ID: ${doctorInfo.fullName}`);
              }
            }
          } catch (doctorErr) {
            console.error(`Error fetching doctor ${consultation.doctorId}:`, doctorErr);
          }
        } else {
          console.log("No doctorId found for consultation:", consultation._id);
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

    console.log("Final consultations data:", consultationsWithDoctors);
    res.json(consultationsWithDoctors);
  } catch (err) {
    console.error("Error fetching farmer consultations:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Doctor -> list requests - UPDATED: Include animal details
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
            updatedAt: r.updatedAt,
            symptoms: r.symptoms || "",
            // FIX: Include animal details from consultation request
            animalType: r.animalDetails?.animalType || "Not specified",
            animalBreed: r.animalDetails?.animalBreed || "Not specified",
            animalAge: r.animalDetails?.animalAge || "Not specified",
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
          treatmentPlan: r.treatmentPlan || "",
          // FIX: Include animal details from consultation request
          symptoms: r.symptoms || "",
          animalType: r.animalDetails?.animalType || "Not specified",
          animalBreed: r.animalDetails?.animalBreed || "Not specified",
          animalAge: r.animalDetails?.animalAge || "Not specified",
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

// ✅ Get consultation details by ID - UPDATED to include consultation animal details
router.get("/:id", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findById(req.params.id)
      .populate({
        path: "farmerId",
        select: "fullName userId animals"
      });

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    console.log("Consultation doctorId:", consultation.doctorId);

    // Get user details for farmer
    const farmerUser = await User.findById(consultation.farmerId.userId).select("email phone");
    
    // Handle doctor data properly - lookup by userId
    let doctorName = "Unknown Doctor";
    let doctorSpecialization = "General";
    
    if (consultation.doctorId) {
      try {
        // Lookup Doctor document by userId field
        const doctor = await Doctor.findOne({ userId: consultation.doctorId });
        if (doctor) {
          doctorName = doctor.fullName || "Unknown Doctor";
          doctorSpecialization = doctor.specialization || "General";
          console.log(`Found doctor: ${doctorName}`);
        } else {
          console.log(`Doctor not found with userId: ${consultation.doctorId}`);
        }
      } catch (doctorErr) {
        console.error("Error fetching doctor:", doctorErr);
      }
    }

    // FIX: Get animal details from consultation request (priority) or farmer profile
    const animalDetails = consultation.animalDetails || {};

    const consultationData = {
      id: consultation._id,
      farmerName: consultation.farmerId.fullName,
      farmerEmail: farmerUser?.email || "",
      farmerPhone: farmerUser?.phone || "",
      // FIX: Use animal details from consultation request first, then fallback to farmer profile
      animalType: animalDetails.animalType || consultation.farmerId.animals?.[0]?.animalType || "Not specified",
      animalBreed: animalDetails.animalBreed || consultation.farmerId.animals?.[0]?.breed || "Not specified",
      animalAge: animalDetails.animalAge || consultation.farmerId.animals?.[0]?.age || "Not specified",
      doctorName: doctorName,
      doctorSpecialization: doctorSpecialization,
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

// ✅ Get consultation history for doctor - UPDATED to include animal details and symptoms
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
        
        // FIX: Get animal details from consultation request instead of farmer profile
        const animalDetails = consultation.animalDetails || {};
        
        return {
          id: consultation._id,
          farmerId: consultation.farmerId._id,
          farmerUserId: consultation.farmerId.userId,
          farmerName: consultation.farmerId.fullName,
          farmerEmail: farmerUser?.email || "",
          farmerPhone: farmerUser?.phone || "",
          // FIX: Use animal details from consultation request
          animalType: animalDetails.animalType || consultation.farmerId.animals?.[0]?.animalType || "Not specified",
          animalBreed: animalDetails.animalBreed || consultation.farmerId.animals?.[0]?.breed || "Not specified",
          animalAge: animalDetails.animalAge || consultation.farmerId.animals?.[0]?.age || "Not specified",
          // FIX: Include symptoms from consultation
          symptoms: consultation.symptoms || "No symptoms recorded",
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

// ✅ Generate and download prescription PDF - FIXED VERSION
router.get("/:id/prescription", async (req, res) => {
  try {
    const consultation = await ConsultationRequest.findById(req.params.id)
      .populate({
        path: "farmerId",
        select: "fullName userId animals"
      });

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    console.log("Consultation found for prescription:", consultation._id);

    // Get doctor information
    let doctorName = "Unknown Doctor";
    let doctorSpecialization = "General";
    
    if (consultation.doctorId) {
      try {
        const doctor = await Doctor.findOne({ userId: consultation.doctorId });
        if (doctor) {
          doctorName = doctor.fullName || "Unknown Doctor";
          doctorSpecialization = doctor.specialization || "General";
          console.log(`Found doctor: ${doctorName}`);
        } else {
          console.log(`Doctor not found with userId: ${consultation.doctorId}`);
        }
      } catch (doctorErr) {
        console.error("Error fetching doctor:", doctorErr);
      }
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    const fileName = `Prescription_${doctorName.replace(/\s+/g, '_')}_${new Date(consultation.date).toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF using the helper function
    addPrescriptionContent(doc, consultation, doctorName, doctorSpecialization);

    // Finalize PDF
    doc.end();

  } catch (err) {
    console.error("Error generating prescription PDF:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ error: "Failed to generate prescription PDF" });
  }
});

// ✅ Helper function to add prescription content - FIXED
const addPrescriptionContent = (doc, consultation, doctorName, doctorSpecialization) => {
  try {
    const farmerName = consultation.farmerId?.fullName || 'Patient';
    const date = new Date(consultation.date).toLocaleDateString();

    // Header
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#1e40af')
       .text('MEDICAL PRESCRIPTION', { align: 'center' });
    
    doc.moveDown(0.5);
    
    // Patient Information
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#374151')
       .text('PATIENT INFORMATION:');
    
    doc.font('Helvetica').fillColor('#000000')
       .text(`Name: ${farmerName}`);
    doc.text(`Animal Type: ${consultation.farmerId?.animals?.[0]?.animalType || 'Not specified'}`);
    doc.text(`Breed: ${consultation.farmerId?.animals?.[0]?.breed || 'Not specified'}`);
    doc.text(`Age: ${consultation.farmerId?.animals?.[0]?.age || 'Not specified'}`);
    
    doc.moveDown();

    // Prescription Details
    doc.font('Helvetica-Bold').fillColor('#374151')
       .text('PRESCRIPTION DETAILS:');
    
    doc.font('Helvetica').fillColor('#000000')
       .text(`Date: ${date}`);
    doc.text(`Time: ${consultation.startTime}`);
    doc.text(`Consultation ID: ${consultation._id}`);
    doc.text(`Fee: ₹${consultation.fee || 0}`);
    
    doc.moveDown();

    // Doctor Information
    doc.font('Helvetica-Bold').fillColor('#1e40af')
       .text('PRESCRIBING VETERINARIAN:');
    
    doc.font('Helvetica').fillColor('#000000')
       .text(`Dr. ${doctorName}`);
    doc.text(`Specialization: ${doctorSpecialization}`);
    doc.text(`Duration: ${consultation.consultationDuration || 0} minutes`);
    
    doc.moveDown();

    // Symptoms
    if (consultation.symptoms) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('SYMPTOMS REPORTED:');
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.symptoms, { width: 500 });
      doc.moveDown();
    }

    // Diagnosis
    if (consultation.diagnosis) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('DIAGNOSIS:');
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.diagnosis, { width: 500 });
      doc.moveDown();
    }

    // Medications
    if (consultation.medicationsPrescribed && consultation.medicationsPrescribed.length > 0) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('PRESCRIBED MEDICATIONS:');
      
      consultation.medicationsPrescribed.forEach((med, index) => {
        doc.font('Helvetica').fillColor('#000000')
           .text(`${index + 1}. ${med.name || 'Unnamed Medication'}`);
        doc.text(`   Dosage: ${med.dosage || 'Not specified'}`);
        doc.text(`   Duration: ${med.duration || 'Not specified'}`);
        doc.text(`   Instructions: ${med.instructions || 'Not specified'}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Treatment Plan
    if (consultation.treatmentPlan) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('TREATMENT PLAN:');
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.treatmentPlan, { width: 500 });
      doc.moveDown();
    }

    // Recommendations
    if (consultation.recommendations) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('RECOMMENDATIONS:');
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.recommendations, { width: 500 });
      doc.moveDown();
    }

    // Doctor's Notes
    if (consultation.consultationNotes) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text("DOCTOR'S NOTES:");
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.consultationNotes, { width: 500 });
      doc.moveDown();
    }

    // Next Steps
    if (consultation.nextSteps) {
      doc.font('Helvetica-Bold').fillColor('#374151')
         .text('NEXT STEPS:');
      doc.font('Helvetica').fillColor('#000000')
         .text(consultation.nextSteps, { width: 500 });
      doc.moveDown();
    }

    // Follow-up Information
    if (consultation.followUpDate) {
      doc.font('Helvetica-Bold').fillColor('#92400e')
         .text('FOLLOW-UP APPOINTMENT:');
      doc.font('Helvetica').fillColor('#000000')
         .text(`Scheduled for: ${new Date(consultation.followUpDate).toLocaleDateString()}`);
      if (consultation.followUpNotes) {
        doc.text(`Notes: ${consultation.followUpNotes}`);
      }
      doc.moveDown();
    }

    // Footer
    const bottomY = doc.page.height - 100;
    doc.y = bottomY;
    
    doc.fontSize(10).fillColor('#6b7280')
       .text(`Generated by PashuMitra • ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(8).fillColor('#9ca3af')
       .text('This is a computer-generated prescription', { align: 'center' });

    // Signatures
    doc.y = bottomY + 30;
    doc.fontSize(10).fillColor('#374151')
       .text('Veterinarian\'s Signature:', 50, doc.y)
       .text('_________________________', 50, doc.y + 15)
       .text(`Dr. ${doctorName}`, 50, doc.y + 30);
    
    doc.text('Patient\'s Acknowledgement:', doc.page.width - 200, doc.y)
       .text('_________________________', doc.page.width - 200, doc.y + 15)
       .text(farmerName, doc.page.width - 200, doc.y + 30);

  } catch (error) {
    console.error('Error in addPrescriptionContent:', error);
    doc.text('Error generating prescription content. Please try again.');
  }
};

export default router;