import express from "express";
import {
  registerFarmerToCampaign,
  getCampaignRegistrations,
  getFarmerRegistrations,
  updateAttendance,
} from "../../controllers/campaignRegistrationController.js";

const router = express.Router();

// Farmer registers
router.post("/register", registerFarmerToCampaign);

// Doctor fetches registrations for a campaign
router.get("/campaign/:campaignId", getCampaignRegistrations);

// Farmer sees their registered campaigns
router.get("/farmer/:farmerId", getFarmerRegistrations);

// Doctor updates attendance
router.put("/:regId/attendance", updateAttendance);

export default router;
