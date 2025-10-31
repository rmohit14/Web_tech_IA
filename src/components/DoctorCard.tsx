import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  availability: string[];
}

const DoctorCard = ({
  id,
  name,
  specialty,
  experience,
  rating,
  image,
  availability,
}: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-primary font-medium mb-2">{specialty}</p>
          <p className="text-sm text-muted-foreground mb-3">
            {experience} years of experience
          </p>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Available:</p>
            <div className="flex flex-wrap gap-1">
              {availability.map((day) => (
                <span
                  key={day}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <Link to={`/book-appointment/${id}`}>
            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
