import express from "express";
import { 
  getCampaignCountByDoctor, 
  getRecentCampaignsByDoctor 
} from "../../controllers/campaignController.js";

import { 
  getPostCountByDoctor, 
  getRecentPostsByDoctor 
} from "../../controllers/postController.js";

import { 
  getDocCountByDoctor, 
  getRecentDocsByDoctor 
} from "../../controllers/blogController.js";

const router = express.Router();

// Campaigns
router.get("/campaigns/count/:doctorId", getCampaignCountByDoctor);
router.get("/campaigns/recent/:doctorId", getRecentCampaignsByDoctor);

// Posts
router.get("/posts/count/:doctorId", getPostCountByDoctor);
router.get("/posts/recent/:doctorId", getRecentPostsByDoctor);

// Docs
router.get("/docs/count/:doctorId", getDocCountByDoctor);
router.get("/docs/recent/:doctorId", getRecentDocsByDoctor);

export default router;
