import axios from 'axios';

// BACKEND INTEGRATION: Configure your base API URL
// For development, you might use: http://localhost:3000/api
// For production, update with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTHENTICATION ====================

/**
 * BACKEND INTEGRATION: POST /api/auth/register
 * Expected request body: { name, email, password, phone }
 * Expected response: { success: true, user: {...}, token: "..." }
 */
export const registerPatient = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * BACKEND INTEGRATION: POST /api/auth/login
 * Expected request body: { email, password }
 * Expected response: { success: true, user: {...}, token: "..." }
 */
export const loginPatient = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * BACKEND INTEGRATION: POST /api/auth/logout
 * Expected response: { success: true }
 */
export const logoutPatient = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  } catch (error: any) {
    localStorage.removeItem('authToken');
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// ==================== DOCTORS ====================

/**
 * BACKEND INTEGRATION: GET /api/doctors
 * Expected response: { success: true, doctors: [{id, name, specialty, experience, image, rating, availability}] }
 */
export const getDoctors = async (specialty?: string) => {
  try {
    const params = specialty ? { specialty } : {};
    const response = await api.get('/doctors', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch doctors' };
  }
};

/**
 * BACKEND INTEGRATION: GET /api/doctors/:id
 * Expected response: { success: true, doctor: {id, name, specialty, experience, image, rating, bio, availability} }
 */
export const getDoctorById = async (doctorId: string) => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch doctor details' };
  }
};

// ==================== APPOINTMENTS ====================

/**
 * BACKEND INTEGRATION: POST /api/appointments
 * Expected request body: { doctorId, date, timeSlot, reason }
 * Expected response: { success: true, appointment: {...} }
 */
export const bookAppointment = async (appointmentData: {
  doctorId: string;
  date: string;
  timeSlot: string;
  reason: string;
}) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to book appointment' };
  }
};

/**
 * BACKEND INTEGRATION: GET /api/appointments/patient
 * Expected response: { success: true, appointments: [{id, doctor, date, time, status, reason}] }
 */
export const getPatientAppointments = async () => {
  try {
    const response = await api.get('/appointments/patient');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch appointments' };
  }
};

/**
 * BACKEND INTEGRATION: PUT /api/appointments/:id
 * Expected request body: { date, timeSlot }
 * Expected response: { success: true, appointment: {...} }
 */
export const rescheduleAppointment = async (
  appointmentId: string,
  newData: { date: string; timeSlot: string }
) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}`, newData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to reschedule appointment' };
  }
};

/**
 * BACKEND INTEGRATION: DELETE /api/appointments/:id
 * Expected response: { success: true }
 */
export const cancelAppointment = async (appointmentId: string) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to cancel appointment' };
  }
};

/**
 * BACKEND INTEGRATION: GET /api/appointments/available-slots
 * Expected query params: doctorId, date
 * Expected response: { success: true, slots: ["09:00", "10:00", "11:00", ...] }
 */
export const getAvailableSlots = async (doctorId: string, date: string) => {
  try {
    const response = await api.get('/appointments/available-slots', {
      params: { doctorId, date },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch available slots' };
  }
};

// ==================== ADMIN ====================

/**
 * BACKEND INTEGRATION: GET /api/admin/appointments
 * Expected response: { success: true, appointments: [{id, patient, doctor, date, time, status}] }
 * Note: Requires admin authentication
 */
export const getAllAppointments = async () => {
  try {
    const response = await api.get('/admin/appointments');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch all appointments' };
  }
};

/**
 * BACKEND INTEGRATION: PUT /api/admin/appointments/:id/status
 * Expected request body: { status: "confirmed" | "cancelled" | "completed" }
 * Expected response: { success: true, appointment: {...} }
 * Note: Requires admin authentication
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  try {
    const response = await api.put(`/admin/appointments/${appointmentId}/status`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update appointment status' };
  }
};

/**
 * BACKEND INTEGRATION: POST /api/admin/doctors
 * Expected request body: { name, specialty, experience, image, bio }
 * Expected response: { success: true, doctor: {...} }
 * Note: Requires admin authentication
 */
export const addDoctor = async (doctorData: {
  name: string;
  specialty: string;
  experience: number;
  image: string;
  bio: string;
}) => {
  try {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to add doctor' };
  }
};

export default api;
