import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { bookAppointment, getDoctorById, getAvailableSlots } from '@/services/api';
import { sampleDoctors, timeSlots } from '@/data/sampleData';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadDoctorDetails = async () => {
    try {
      // BACKEND INTEGRATION: This calls GET /api/doctors/:id
      // For now, using sample data
      const foundDoctor = sampleDoctors.find((d) => d.id === doctorId);
      setDoctor(foundDoctor);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load doctor details',
        variant: 'destructive',
      });
    }
  };

  const loadAvailableSlots = async () => {
    if (!doctorId || !selectedDate) return;

    try {
      // BACKEND INTEGRATION: This calls GET /api/appointments/available-slots
      // For now, using sample data
      setAvailableSlots(timeSlots);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load available slots',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to book an appointment',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime || !reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // BACKEND INTEGRATION: This calls POST /api/appointments
      const response = await bookAppointment({
        doctorId: doctorId!,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTime,
        reason,
      });

      toast({
        title: 'Success',
        description: 'Appointment booked successfully!',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Unable to book appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Book Appointment</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Doctor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className="text-primary">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {doctor.experience} years of experience
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {doctor.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose your preferred appointment slot</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Time Slot</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedTime === slot ? 'default' : 'outline'}
                          onClick={() => setSelectedTime(slot)}
                          className="w-full"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe your symptoms or reason for consultation"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Booking...' : 'Confirm Appointment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
