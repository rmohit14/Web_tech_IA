const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const sampleDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: 15,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
    bio: "Experienced cardiologist with over 15 years in heart disease treatment.",
    rating: 4.8,
    availability: [
      { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] }
    ]
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: 12,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
    bio: "Specialized in brain disorders and neurological conditions.",
    rating: 4.7,
    availability: [
      { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Doctor.deleteMany({});
    await Doctor.insertMany(sampleDoctors);
    
    console.log('Sample doctors added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();