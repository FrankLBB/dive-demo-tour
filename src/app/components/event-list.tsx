import { EventCard } from "@/app/components/event-card";
import { events } from "@/app/data/events";

export function EventList() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl mb-8 text-center">Event-Termine</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}