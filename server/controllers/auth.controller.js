import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const checkAuth = async(req, res) => {
  //Get email and password
  const { email, password } = req.body;
  //Get user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(403).json({ error: "Invalid email" });
  //Check if password is accurate
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ error: "Invalid password" });
  //create token
  const token = jwt.sign({ userId: user._id }, "jwt-secret", { expiresIn: "1h" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
  });

  res.status(201).json({ status: "Logged in!" });
};

const logOut = async(req, res) =>{
  res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
  });
  res.status(200).json({ status: "Logged out!" });
}

export {checkAuth, logOut};