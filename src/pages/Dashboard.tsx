import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { getPatientAppointments, cancelAppointment } from '@/services/api';
import { sampleAppointments } from '@/data/sampleData';

const Dashboard = () => {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      // BACKEND INTEGRATION: This calls GET /api/appointments/patient
      // For now, using sample data
      // const response = await getPatientAppointments();
      // setAppointments(response.appointments);
      setAppointments(sampleAppointments);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      // BACKEND INTEGRATION: This calls DELETE /api/appointments/:id
      await cancelAppointment(selectedAppointment);

      setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment));
      
      toast({
        title: 'Success',
        description: 'Appointment cancelled successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel appointment',
        variant: 'destructive',
      });
    } finally {
      setSelectedAppointment(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">My Dashboard</h1>
            <Button onClick={() => navigate('/doctors')}>
              <Calendar className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't booked any appointments yet
                </p>
                <Button onClick={() => navigate('/doctors')}>
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{appointment.doctorName}</span>
                            <Badge variant="outline">{appointment.specialty}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.timeSlot}</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Reason: {appointment.reason}
                          </p>

                          <Badge variant={getStatusBadgeVariant(appointment.status) as any}>
                            {appointment.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                          {appointment.status !== 'cancelled' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // BACKEND INTEGRATION: Implement reschedule
                                  toast({
                                    title: 'Coming Soon',
                                    description: 'Reschedule feature will be available soon',
                                  });
                                }}
                              >
                                Reschedule
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setSelectedAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAppointment}>
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
