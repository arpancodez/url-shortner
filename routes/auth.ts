import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Registration failed');
  }
});

router.post('/login', async (req, res) => {
  // Simple example, password should be hashed in production
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).send('Invalid credentials');
  res.status(200).send('Login successful');
});

export default router;
