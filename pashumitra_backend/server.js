const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const farmer_verification = require('./routes/Farmer/farmerVarificationRoutes');
const doctor_verification = require('./routes/Doctor/doctorVerificationRoutes');
const scheduleRoutes = require('./routes/Doctor/scheduleRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/farmer/varify', farmer_verification);
app.use('/api/doctor/varify', doctor_verification);
app.use("/api/schedules", scheduleRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
