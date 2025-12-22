import express from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

// TEMP storage (Week 1 only)
const users = [];

/**
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  const existingUser = users.find((u) => u.email === email);
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(user);

  res.status(201).json({ message: "User registered successfully" });
});

/**
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({ token });
});

export default router;
