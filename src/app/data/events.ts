export interface Event {
  id: string;
  title: string;
  begin_date: string;
  begin_time: string;
  end_date: string;
  end_time: string;
  location: string;
  location_URL: string;
  location_email: string;
  location_phone: string;
  city: string;
  country: string;
  description: string;
  image: string;
  attendees: number;
  status: "preparing" | "confirmed" | "past" | "completed";
  longDescription?: string;
  eventNote?: string;
  speakers?: string[];
  topics?: string[];
  moduleIds?: string[];
}

// Static events removed - all events are now managed via database
export const events: Event[] = [];