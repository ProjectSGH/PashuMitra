// consultationRequestModel.js - UPDATED
import mongoose from "mongoose";

const ConsultationRequestSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor_User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer_User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    fee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "follow_up"],
      default: "pending",
    },
    // NEW FIELDS FOR CONSULTATION MANAGEMENT
    consultationNotes: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatmentPlan: {
      type: String,
      default: "",
    },
    nextSteps: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: Date,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    medicationsPrescribed: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    consultationDuration: {
      type: Number, // in minutes
      default: 0
    },
    symptoms: {
      type: String,
      default: ""
    },
    recommendations: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("ConsultationRequest", ConsultationRequestSchema);