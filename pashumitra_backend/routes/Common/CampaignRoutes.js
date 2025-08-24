import express from "express";
import { 
  createCampaign, 
  getActiveCampaigns, 
  getDoctorHistory, 
  updateCampaign, 
  deleteCampaign, 
  getCampaignRegistrations   // ✅ added here
} from "../../controllers/campaignController.js";

const router = express.Router();

router.post("/create", createCampaign);
router.get("/active", getActiveCampaigns);
router.get("/history/:doctorId", getDoctorHistory);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

// ✅ Add this new route
router.get("/:campaignId/registrations", getCampaignRegistrations);

export default router;
