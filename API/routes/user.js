// routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Subscription = require('../models/subscription');
const verifyToken = require('../middleware/auth');
const user = require('../models/user');
const { ObjectId } = require('mongodb');

// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET); 
    res.header('Authorization', token).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const userInfo = await User.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "userID",
          as: "Subscriptions"
        }
      },
      {
        $match: { _id: new ObjectId(req.user._id) }
      }
  ]);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
