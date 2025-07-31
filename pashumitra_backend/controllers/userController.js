// controllers/userController.js
const User = require('../models/UserModel');
const Farmer = require('../models/FarmerModel');
const bcrypt = require('bcrypt');

exports.registerFarmer = async (req, res) => {
  try {
    const { email, password, phone, role, fullName } = req.body;
    const { address, village, city, state, pincode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone,
      role: "Farmer",
      fullName
    });

    const newFarmer = await Farmer.create({
      userId: newUser._id,
      fullName,
      address,
      village,
      city,
      state,
      pincode
    });


    res.status(201).json({ message: "Farmer registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
