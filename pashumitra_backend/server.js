import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";   
import connectDB from "./config/db.js";
import cors from "cors";
import { initSocket } from "./services/socket.js";

import userRoutes from "./routes/userRoutes.js";
import farmer_verification from "./routes/Farmer/farmerVarificationRoutes.js";
import doctor_verification from "./routes/Doctor/doctorVerificationRoutes.js";
import scheduleRoutes from "./routes/Doctor/scheduleRoutes.js";
import postRoutes from "./routes/Common/PostRoutes.js";
import docBlogRoutes from "./routes/Common/BlogRoutes.js";  
import campaignRoutes from "./routes/Common/CampaignRoutes.js";
import campaignRegistrationRoutes from "./routes/Farmer/campaignRegistrationRoutes.js";
import queryRoutes from "./routes/Common/QueryRoutes.js";
import chatRoutes from "./routes/Common/ChatRoutes.js"
import "./services/campaignCron.js";
import DashboardRoutes from "./routes/Common/DashboardRoutes.js"
import consultationRoutes from "./routes/Common/ConsultationRoutes.js";
import Notification from "./routes/Common/NotificationRoutes.js";
import medicineRoutes from "./routes/MedicalStore/medicineRoutes.js";
import MedicalscheduleRoutes from "./routes/MedicalStore/scheduleRoutes.js";

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
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/notifications", Notification);
app.use("/api/medicines", medicineRoutes);
app.use("/api/schedul", MedicalscheduleRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server with WebSocket running on port ${PORT}`);
});
