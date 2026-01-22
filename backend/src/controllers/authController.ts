import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch user from DB
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords (bcrypt handles the salt automatically)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      token, 
      role: user.role, 
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};