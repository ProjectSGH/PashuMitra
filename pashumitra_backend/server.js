import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import farmer_verification from "./routes/Farmer/farmerVarificationRoutes.js";
import doctor_verification from "./routes/Doctor/doctorVerificationRoutes.js";
import scheduleRoutes from "./routes/Doctor/scheduleRoutes.js";
import postRoutes from "./routes/Common/PostRoutes.js";
import docBlogRoutes from "./routes/Common/BlogRoutes.js";  
import campaignRoutes from "./routes/Common/CampaignRoutes.js";
import campaignRegistrationRoutes from "./routes/Farmer/campaignRegistrationRoutes.js";
import queryRoutes from "./routes/Common/QueryRoutes.js";
import "./services/campaignCron.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/farmer/varify", farmer_verification);
app.use("/api/doctor/varify", doctor_verification);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/docs", docBlogRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaign-registrations", campaignRegistrationRoutes);
app.use("/api/query", queryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
