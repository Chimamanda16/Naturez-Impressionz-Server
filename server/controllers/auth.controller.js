import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const checkAuth = async(req, res) => {
  //Get email and password
  const { email, password } = req.body;
  //Get user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  //Check if password is accurate
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  //create token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(201).json({user: user._id}, { status: "Logged in!" });
};

const logOut = async(req, res) =>{
  res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
  });
  res.status(200).json({ status: "Logged out!" });
}

export {checkAuth, logOut};