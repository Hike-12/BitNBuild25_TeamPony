require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const menuRoutes = require("./routes/menuRoutes");
const authRoutes = require("./routes/venderAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const orderRoutes = require('./routes/orderRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Vite default ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug logging
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit if database connection fails
  });

  
// Auth & API routes
app.use('/api/vendor', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userAuthRoutes);
  app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get("/", (req, res) => res.send("Tiffin backend running!"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
