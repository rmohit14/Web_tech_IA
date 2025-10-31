const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    let filter = {};
    
    if (specialty) {
      filter.specialty = new RegExp(specialty, 'i');
    }

    const doctors = await Doctor.find(filter);

    res.json({
      success: true,
      doctors: doctors.map(doctor => ({
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        experience: doctor.experience,
        image: doctor.image,
        rating: doctor.rating,
        availability: doctor.availability,
        bio: doctor.bio
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        experience: doctor.experience,
        image: doctor.image,
        rating: doctor.rating,
        bio: doctor.bio,
        availability: doctor.availability
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