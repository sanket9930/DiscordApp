// routes/subscription.js
const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const verifyToken = require('../middleware/auth'); // JWT middleware

// Create a subscription (Authenticated users only)
router.post('/create' , verifyToken , async (req, res) => {
  try {
    const { serviceName, serviceLink, monthlyFee } = req.body;
    const newSubscription = new Subscription({
      serviceName,
      serviceLink,
      monthlyFee,
      userID: req.user._id
    });
    await newSubscription.save();

    res.status(201).json({ message: 'Subscription created successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read user's subscriptions (Authenticated users only)
router.get('/list', verifyToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userID: req.user._id });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a subscription (Authenticated users only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { serviceName, serviceLink, monthlyFee } = req.body;
    const updatedSubscription = {
      serviceName,
      serviceLink,
      monthlyFee,
    };
    await Subscription.findByIdAndUpdate(req.params.id, updatedSubscription);
    res.json({ message: 'Subscription updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a subscription (Authenticated users only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Subscription.findByIdAndRemove(req.params.id);
    res.json({ message: 'Subscription deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
