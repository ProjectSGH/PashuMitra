import cron from "node-cron";
import { autoDeleteExpiredCampaigns } from "../controllers/campaignController.js";

// रोज रात्री 12 वाजता चालेल
cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running Campaign Cleanup Job...");
  await autoDeleteExpiredCampaigns();
});
