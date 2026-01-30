import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState } from "react";
import { RegistrationDialog } from "@/app/components/registration-dialog";
import { Link } from "react-router";
import type { Event } from "@/app/data/events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link to={`/event/${event.id}`}>
          <div className="relative h-48 overflow-hidden cursor-pointer">
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <CardHeader>
          <Link to={`/event/${event.id}`}>
            <h3 className="text-2xl mb-2 hover:text-blue-600 transition-colors cursor-pointer">{event.title}</h3>
          </Link>
          <div className="flex flex-col gap-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{event.location}, {event.city}, {event.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>{event.attendees} erwartete Teilnehmer</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{event.description}</p>

        </CardContent>
      </Card>
      
      <RegistrationDialog
        event={event}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}