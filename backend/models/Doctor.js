const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required']
  },
  image: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  availability: [{
    day: String,
    slots: [String]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);