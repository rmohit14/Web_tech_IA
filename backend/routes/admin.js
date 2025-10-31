const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get all appointments (admin)
router.get('/appointments', auth, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment._id,
        patient: {
          name: appointment.patientId.name,
          email: appointment.patientId.email
        },
        doctor: {
          name: appointment.doctorId.name,
          specialty: appointment.doctorId.specialty
        },
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.timeSlot,
        status: appointment.status,
        reason: appointment.reason
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update appointment status
router.put('/appointments/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patientId', 'name email')
     .populate('doctorId', 'name specialty');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment: {
        id: appointment._id,
        status: appointment.status,
        patient: {
          name: appointment.patientId.name,
          email: appointment.patientId.email
        },
        doctor: {
          name: appointment.doctorId.name
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add doctor
router.post('/doctors', auth, admin, async (req, res) => {
  try {
    const { name, specialty, experience, image, bio, availability } = req.body;

    const doctor = await Doctor.create({
      name,
      specialty,
      experience,
      image,
      bio,
      availability: availability || [
        { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
      ]
    });

    res.status(201).json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        experience: doctor.experience,
        image: doctor.image,
        bio: doctor.bio
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;