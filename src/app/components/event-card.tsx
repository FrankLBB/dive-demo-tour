import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Link } from "react-router";
import type { Event } from "@/app/data/events";
import { isEventToday, isEventSoon, isEventFinished } from "@/app/utils/date-helpers";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Format date range display
  const dateDisplay = event.begin_date === event.end_date 
    ? event.begin_date 
    : `${event.begin_date} - ${event.end_date}`;
  
  // Format time range display
  const timeDisplay = `${event.begin_time} - ${event.end_time} Uhr`;

  // Check event status
  const isToday = isEventToday(event.begin_date);
  const isSoon = !isToday && isEventSoon(event.begin_date);
  const isFinished = isEventFinished(event.end_date);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/event/${event.id}`}>
        <div className="relative h-48 overflow-hidden cursor-pointer">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
              isFinished ? 'grayscale' : ''
            }`}
          />
          
          {/* Event Status Labels */}
          {isToday && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              Heute!
            </div>
          )}
          {isSoon && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              Nicht verpassen!
            </div>
          )}
        </div>
      </Link>
      <CardHeader>
        <Link to={`/event/${event.id}`}>
          <h3 className={`text-2xl mb-2 hover:text-blue-600 transition-colors cursor-pointer ${
            isFinished ? 'text-gray-500' : ''
          }`}>
            {event.title}
          </h3>
        </Link>
        <div className={`flex flex-col gap-2 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span className={`font-semibold ${
              isToday 
                ? 'text-green-600' 
                : isSoon 
                ? 'text-orange-600' 
                : isFinished 
                ? 'text-gray-400' 
                : ''
            }`}>
              {dateDisplay}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{timeDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{event.location}, {event.city}, {event.country}</span>
          </div>
          {(event.attendees !== null && event.attendees !== undefined && event.attendees > 0) && (
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>Max. {event.attendees} Teilnehmer</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className={`mb-4 ${isFinished ? 'text-gray-500' : 'text-gray-700'}`}>
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
}