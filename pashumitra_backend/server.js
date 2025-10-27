import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";   
import connectDB from "./config/db.js";
import cors from "cors";
import { initSocket } from "./services/socket.js";

import userRoutes from "./routes/userRoutes.js";
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
import UserVerificationRoutes from "./routes/Common/userVerificationRoutes.js";
import GetStoreRoutes from "./routes/Farmer/GetStoreRoutes.js";

// Admin Routes
import adminUserVerificationRoutes from "./routes/Admin/UserVerification_Admin.js";
import AdminUserRoute from "./routes/Admin/AdminUserRoute.js";
import adminNotificationRoutes from "./routes/Admin/NotificationRoute_Admin.js";
import adminAuthRoutes from "./routes/Admin/AdminAuth.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// ✅ ADD ROUTE LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/verification", UserVerificationRoutes);
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
app.use("/api/medicineRoutes", medicineRoutes);
app.use("/api/MedicalscheduleRoutes", MedicalscheduleRoutes);
app.use("/api/stores", GetStoreRoutes);

// Admin routes
app.use("/api/admin/verification", adminUserVerificationRoutes);
app.use("/api/admin", AdminUserRoute);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

// ✅ ADD HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running", 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server with WebSocket running on port ${PORT}`);
});