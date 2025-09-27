require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/venderAuthRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth & API routes
app.use('/api/vendor', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userAuthRoutes);

// Health check
app.get('/', (req, res) => res.send('Tiffin backend running!'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));