import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/User.js";

export const createUserAccount = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const existing = await UserModel.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.createUser(email, hashedPassword, role || 'USER');
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeUserAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await UserModel.deleteUserById(Number(id));
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};