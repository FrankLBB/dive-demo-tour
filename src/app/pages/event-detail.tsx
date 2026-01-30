import { useParams, Link } from "react-router";
import { events } from "@/app/data/events";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { RegistrationDialog } from "@/app/components/registration-dialog";
import { useState } from "react";

export function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">
            Event nicht gefunden
          </h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link to="/">
              <Button
                variant="outline"
                className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 size-4" />
                Zurück zur Übersicht
              </Button>
            </Link>
            <h1 className="text-5xl text-white mb-2">
              {event.title}
            </h1>
            <p className="text-xl text-white/90">
              {event.city}, {event.country}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-3xl">Über dieses Event</h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {event.longDescription || event.description}
                </p>
              </CardContent>
            </Card>

            {event.topics && event.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-3xl">Vertretene Marke(n)</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-base py-1 px-3"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {event.topics && event.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/images/marke1-logo.png"
                        alt="Marke 1 Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <h2 className="text-3xl">Programm Marke 1</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Was</h3>
                    <p className="text-gray-700">
                      Erleben Sie eine spannende Präsentation und interaktive Demonstration der neuesten Produktinnovationen. 
                      Tauchen Sie ein in die Welt der Unterwassertechnologie und erfahren Sie mehr über zukunftsweisende Lösungen.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Wann</h3>
                    <p className="text-gray-700">
                      {event.time}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Max. Teilnehmeranzahl</h3>
                    <p className="text-gray-700">
                      30 Teilnehmer
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Jetzt anmelden
                  </Button>
                </CardContent>
              </Card>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-3xl">Speaker</h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.speakers.map((speaker, index) => (
                      <li
                        key={index}
                        className="text-lg text-gray-700"
                      >
                        • {speaker}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl">Event-Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Datum
                    </p>
                    <p className="text-lg">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Uhrzeit
                    </p>
                    <p className="text-lg">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Ort</p>
                    <p className="text-lg">{event.location}</p>
                    <p className="text-gray-600">
                      {event.city}, {event.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="size-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Teilnehmer
                    </p>
                    <p className="text-lg">
                      {event.attendees} erwartet
                    </p>
                  </div>
                </div>

                {event.status !== "past" && (
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Jetzt anmelden
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-lg mb-2">Hinweis</h3>
                <p className="text-sm text-gray-700">
                  Die Teilnahme an allen Events ist kostenlos.
                  Eine vorherige Anmeldung wird empfohlen, da
                  die Plätze begrenzt sind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RegistrationDialog
        event={event}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}