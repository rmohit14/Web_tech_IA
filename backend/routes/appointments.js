const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      status: 'pending'
    });

    // Populate doctor details
    await appointment.populate('doctorId', 'name specialty');

    res.status(201).json({
      success: true,
      appointment: {
        id: appointment._id,
        doctorId: appointment.doctorId._id,
        patientId: appointment.patientId,
        date: appointment.date.toISOString().split('T')[0],
        timeSlot: appointment.timeSlot,
        reason: appointment.reason,
        status: appointment.status,
        doctor: {
          name: appointment.doctorId.name,
          specialty: appointment.doctorId.specialty
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

// Get patient appointments
router.get('/patient', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialty image')
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment._id,
        doctor: {
          name: appointment.doctorId.name,
          specialty: appointment.doctorId.specialty,
          image: appointment.doctorId.image
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

// Update appointment (reschedule)
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.date = new Date(date);
    appointment.timeSlot = timeSlot;
    appointment.status = 'pending'; // Reset to pending for admin approval
    await appointment.save();

    res.json({
      success: true,
      appointment: {
        id: appointment._id,
        date: appointment.date.toISOString().split('T')[0],
        timeSlot: appointment.timeSlot,
        status: appointment.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      patientId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get available slots
router.get('/available-slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    // Get doctor's availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get booked appointments for that date
    const appointments = await Appointment.find({
      doctorId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedSlots = appointments.map(app => app.timeSlot);
    
    // For simplicity, using fixed slots. You can enhance this with doctor's actual availability
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      slots: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;