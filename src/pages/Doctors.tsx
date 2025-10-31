import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DoctorCard from '@/components/DoctorCard';
import Navbar from '@/components/Navbar';
import { getDoctors } from '@/services/api';
import { sampleDoctors, specialties } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

const Doctors = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [doctors, setDoctors] = useState(sampleDoctors);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      // BACKEND INTEGRATION: This calls GET /api/doctors
      // For now, using sample data
      // const response = await getDoctors();
      // setDoctors(response.doctors);
      setDoctors(sampleDoctors);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load doctors. Using sample data.',
        variant: 'destructive',
      });
      setDoctors(sampleDoctors);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors =
    selectedSpecialty === 'All Specialties'
      ? doctors
      : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Expert Doctors
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our team of qualified healthcare professionals
            </p>
          </div>

          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Filter by:</span>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No doctors found for this specialty.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} {...doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
