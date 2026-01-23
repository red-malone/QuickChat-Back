import User from "../models/User.js";
import bcrypt from "bcryptjs";
//Signup a new user
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
