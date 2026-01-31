// Helper function to parse German date strings to Date objects
export function parseGermanDate(dateStr: string): Date | null {
  try {
    // Try format "DD.MM.YYYY" or "D.M.YYYY"
    if (dateStr.includes('.') && !dateStr.match(/[a-zA-ZäöüÄÖÜß]/)) {
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

    // Map German month names to numbers (case-insensitive)
    const monthMap: { [key: string]: number } = {
      'januar': 0, 'februar': 1, 'märz': 2, 'april': 3,
      'mai': 4, 'juni': 5, 'juli': 6, 'august': 7,
      'september': 8, 'oktober': 9, 'november': 10, 'dezember': 11
    };

    // Try format: "14. Mai 2026" or "14. mai 2026"
    const match = dateStr.trim().match(/(\d+)\.\s*(\w+)\s*(\d+)/);
    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2].toLowerCase();
      const year = parseInt(match[3]);
      const month = monthMap[monthName];

      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    // Fallback: try Date.parse
    const fallbackDate = new Date(dateStr);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }

    return null;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
}

// Check if event is today
export function isEventToday(beginDate: string): boolean {
  const eventDate = parseGermanDate(beginDate);
  if (!eventDate) return false;

  const today = new Date();
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
}

// Check if event is within next 7 days (but not today)
export function isEventSoon(beginDate: string): boolean {
  const eventDate = parseGermanDate(beginDate);
  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDateNormalized = new Date(eventDate);
  eventDateNormalized.setHours(0, 0, 0, 0);

  const diffTime = eventDateNormalized.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Between 1 and 7 days from now
  return diffDays > 0 && diffDays <= 7;
}

// Check if event is finished (end_date is in the past)
export function isEventFinished(endDate: string): boolean {
  const eventDate = parseGermanDate(endDate);
  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDateNormalized = new Date(eventDate);
  eventDateNormalized.setHours(23, 59, 59, 999); // End of the event day

  return eventDateNormalized.getTime() < today.getTime();
}