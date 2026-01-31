import { useState, useEffect } from "react";
import { EventCard } from "@/app/components/event-card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Event } from "@/app/data/events";
import React from "react";

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error("Failed to fetch events from backend");
      }

      const data = await response.json();
      
      if (data.events) {
        console.log("✅ Events loaded from backend:", data.events.length);
        
        // Filter events: only show "confirmed" or "past" status
        const filteredEvents = data.events.filter((event: Event) => 
          event.status === "confirmed" || event.status === "past"
        );
        
        console.log(`📋 Filtered events (confirmed/past only): ${filteredEvents.length} of ${data.events.length}`);
        
        // Sort events by begin_date and begin_time in ascending order
        const sortedEvents = filteredEvents.sort((a: Event, b: Event) => {
          // Parse dates - handle both "DD.MM.YYYY" and "D. Month YYYY" formats
          const parseDate = (dateStr: string) => {
            try {
              // Try format "DD.MM.YYYY" or "D.M.YYYY"
              if (dateStr.includes('.') && !dateStr.match(/[a-zA-Z]/)) {
                const parts = dateStr.split('.').map(s => s.trim());
                if (parts.length === 3) {
                  const day = parseInt(parts[0]);
                  const month = parseInt(parts[1]);
                  const year = parseInt(parts[2]);
                  if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    return new Date(year, month - 1, day);
                  }
                }
              }
              
              // Try format "D. Month YYYY" (e.g., "1. Februar 2026")
              const monthNames: { [key: string]: number } = {
                'januar': 0, 'februar': 1, 'märz': 2, 'april': 3,
                'mai': 4, 'juni': 5, 'juli': 6, 'august': 7,
                'september': 8, 'oktober': 9, 'november': 10, 'dezember': 11
              };
              
              const match = dateStr.match(/(\d+)\.\s*(\w+)\s*(\d+)/);
              if (match) {
                const day = parseInt(match[1]);
                const monthName = match[2].toLowerCase();
                const year = parseInt(match[3]);
                const month = monthNames[monthName];
                
                if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                  return new Date(year, month, day);
                }
              }
              
              // Fallback: try Date.parse
              const fallbackDate = new Date(dateStr);
              if (!isNaN(fallbackDate.getTime())) {
                return fallbackDate;
              }
              
              // If all else fails, return a far future date
              console.warn('Could not parse date:', dateStr);
              return new Date(9999, 0, 1);
            } catch (error) {
              console.error('Error parsing date:', dateStr, error);
              return new Date(9999, 0, 1);
            }
          };
          
          const dateA = parseDate(a.begin_date);
          const dateB = parseDate(b.begin_date);
          
          // First, compare dates
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
          
          // If dates are equal, compare times (format: HH:MM)
          const parseTime = (timeStr: string) => {
            try {
              const [hours, minutes] = timeStr.split(':').map(Number);
              if (!isNaN(hours) && !isNaN(minutes)) {
                return hours * 60 + minutes;
              }
              return 0;
            } catch (error) {
              console.error('Error parsing time:', timeStr, error);
              return 0;
            }
          };
          
          const timeA = parseTime(a.begin_time);
          const timeB = parseTime(b.begin_time);
          
          return timeA - timeB;
        });
        
        setEvents(sortedEvents);
      } else {
        console.log("ℹ️ No events in backend");
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Fehler beim Laden der Events. Bitte versuchen Sie es später erneut.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-8 py-4">
            <h2 className="text-4xl text-white text-center">Event-Termine</h2>
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
            <h2 className="text-4xl text-white text-center mb-0">Event-Termine</h2>
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