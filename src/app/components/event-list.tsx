import { useState, useEffect } from "react";
import { EventCard } from "@/app/components/event-card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Event } from "@/app/data/events";
import React from "react";

interface HomepageSettings {
  logo: string | null;
  headerTitle: string;
  headerSubtitle: string;
  backgroundImage: string | null;
  headerLogo: string | null;
  lastChangeDate: string;
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChangeDate, setLastChangeDate] = useState<string>("");

  // Helper function to format date from YYYY-MM-DD to DD.MM.YYYY
  const formatDateToGerman = (dateString: string): string => {
    if (!dateString) return "";
    
    // If already in DD.MM.YYYY format, return as is
    if (dateString.includes(".")) return dateString;
    
    // Convert from YYYY-MM-DD to DD.MM.YYYY
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}.${month}.${year}`;
    }
    return dateString;
  };

  const fetchHomepageSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const settings: HomepageSettings = data.settings;
        if (settings.lastChangeDate) {
          setLastChangeDate(settings.lastChangeDate);
          console.log("✅ Last change date loaded:", settings.lastChangeDate);
        }
      }
    } catch (error) {
      console.error("Failed to fetch homepage settings:", error);
      // Don't show error to user, just skip the date display
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Event fetch error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      // Ensure data is an array
      // Events are already sorted by the backend (ascending by begin_date)
      if (data && Array.isArray(data.events)) {
        // Filter events: only show "confirmed" or "past" status
        const filteredEvents = data.events.filter(
          (event: Event) => event.status === "confirmed" || event.status === "past"
        );
        setEvents(filteredEvents);
        console.log('✅ Events loaded (sorted by backend, filtered for confirmed/past):', filteredEvents.map(e => ({ title: e.title, date: e.begin_date, status: e.status })));
      } else if (Array.isArray(data)) {
        // Fallback: if server returns array directly
        const filteredEvents = data.filter(
          (event: Event) => event.status === "confirmed" || event.status === "past"
        );
        setEvents(filteredEvents);
        console.log('✅ Events loaded (sorted by backend, filtered for confirmed/past):', filteredEvents.map(e => ({ title: e.title, date: e.begin_date, status: e.status })));
      } else {
        console.error('Events data is not an array:', data);
        setEvents([]);
        setError('Ungültiges Datenformat vom Server empfangen');
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch events");
      setEvents([]); // Ensure events is always an array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchHomepageSettings();
  }, []);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-8 py-4">
            <h2 className="text-4xl text-white text-center">
              Event-Termine
              {lastChangeDate && `, Stand ${formatDateToGerman(lastChangeDate)}`}
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="size-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Lade Events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-8 py-4">
            <h2 className="text-4xl text-white text-center mb-0">
              Event-Termine
              {lastChangeDate && `, Stand ${formatDateToGerman(lastChangeDate)}`}
            </h2>
          </div>
          
          {/* Event Count Badge */}
          {!error && events.length > 0 && (
            <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg px-6 py-2">
              <p className="text-sm text-white text-center">
                ✅ {events.length} {events.length === 1 ? "Event" : "Events"} verfügbar
              </p>
            </div>
          )}
        </div>
        
        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">
                  <strong>Fehler:</strong> {error}
                </p>
              </div>
              <Button
                onClick={fetchEvents}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="size-12 text-gray-400 mb-4" />
          <h3 className="text-xl mb-2">Keine Events vorhanden</h3>
          <p className="text-gray-600 mb-4">
            Aktuell sind keine Events geplant. Administratoren können im Admin-Dashboard Events erstellen.
          </p>
          <Button
            onClick={fetchEvents}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <RefreshCw className="size-4 mr-2" />
            Neu laden
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={event.id} className="contents">
              <EventCard event={event} />
              
              {/* Back to top button - only visible on mobile after each card */}
              <div className="md:hidden col-span-1 flex justify-center py-4">
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <svg 
                    className="size-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 10l7-7m0 0l7 7m-7-7v18" 
                    />
                  </svg>
                  Seitenanfang
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}