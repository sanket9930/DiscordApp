// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const userRoutes = require('./routes/user');
const subscriptionRoutes = require('./routes/subscription');
const cors = require('cors')

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.use(cors({origin: '*'}))
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
