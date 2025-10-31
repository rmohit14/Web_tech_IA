const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-appointment-system')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB connection failed:', err.message));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'patient' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: String,
  date: Date,
  timeSlot: String,
  reason: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running with MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Register request:', req.body);
    
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    console.log('✅ User created in MongoDB:', user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Book appointment endpoint
app.post('/api/appointments', async (req, res) => {
  try {
    console.log('📅 Book appointment:', req.body);
    
    const { doctorId, date, timeSlot, reason, patientId } = req.body;

    const appointment = await Appointment.create({
      patientId, // You'll need to get this from the authenticated user
      doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      status: 'pending'
    });

    console.log('✅ Appointment created in MongoDB:', appointment._id);

    res.json({
      success: true,
      appointment: {
        id: appointment._id,
        doctorId: appointment.doctorId,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        reason: appointment.reason,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error('❌ Appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get doctors endpoint (static for now)
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    doctors: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        experience: 15,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        rating: 4.8,
        availability: ['Monday', 'Wednesday', 'Friday']
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        experience: 12,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
        rating: 4.7,
        availability: ['Tuesday', 'Thursday']
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 BACKEND SERVER STARTED SUCCESSFULLY!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 CORS: Enabled for all origins`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  MongoDB: Connected to clinic-appointment-system`);
});