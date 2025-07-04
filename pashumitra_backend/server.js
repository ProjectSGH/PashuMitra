const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
