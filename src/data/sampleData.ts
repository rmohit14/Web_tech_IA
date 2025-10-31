// Sample data for development before backend is ready
// This will be replaced with actual API calls

export const sampleDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    bio: 'Specializing in cardiovascular health with over 15 years of experience.',
    availability: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrics',
    experience: 12,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    bio: 'Dedicated to providing comprehensive care for children of all ages.',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    experience: 10,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    bio: 'Expert in skin health and cosmetic dermatology procedures.',
    availability: ['Monday', 'Tuesday', 'Thursday'],
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    bio: 'Specialized in joint replacement and sports medicine.',
    availability: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: '5',
    name: 'Dr. Priya Patel',
    specialty: 'Neurology',
    experience: 14,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
    bio: 'Expert in treating neurological disorders and brain health.',
    availability: ['Tuesday', 'Wednesday', 'Friday'],
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    specialty: 'General Practice',
    experience: 20,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    bio: 'Providing comprehensive primary care for the whole family.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
];

export const sampleAppointments = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2024-01-15',
    timeSlot: '10:00',
    status: 'confirmed',
    reason: 'Annual checkup',
  },
  {
    id: '2',
    doctorId: '3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    date: '2024-01-18',
    timeSlot: '14:00',
    status: 'pending',
    reason: 'Skin consultation',
  },
];

export const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const specialties = [
  'All Specialties',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'General Practice',
];
