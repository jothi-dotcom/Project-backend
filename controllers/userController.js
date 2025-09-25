const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};


const RegisterAPI = async (req, res) => {
  const { username, email, mobile, password, role } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User account already exists" });
    }

    // password hashing
    const hashPassword = await bcrypt.hash(password, 10);

  
    const roleToSave = role || "user";

    const newUser = new User({
      username,
      email,
      mobile,
      password: hashPassword,
      role: roleToSave,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const loginAPI = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });
    }

    // verify password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = generateToken(existingUser);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { RegisterAPI, loginAPI };
