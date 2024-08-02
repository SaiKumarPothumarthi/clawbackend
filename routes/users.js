import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';
import Session from '../models/Session.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, name,age } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name,age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Log in an existing user and create a session
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    const session = new Session({ user: user._id, token ,loginTime: new Date()});
    await session.save();

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by email
router.get('/email/:email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all user sessions
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch weather information for a given location
router.get('/weather/:location', authMiddleware, async (req, res) => {
  const { location } = req.params;
  const apiKey = 'my_weather_api_key'; 
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
