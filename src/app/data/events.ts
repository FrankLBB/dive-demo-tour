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

export const events: Event[] = [
  {
    id: "1",
    title: "Testtauch-Event Hemmoor",
    begin_date: "1. Februar 2026",
    begin_time: "09:00",
    end_date: "5. Februar 2026",
    end_time: "18:00",
    location: "Tauchbasis Kreidesee",
    location_URL: "https://www.kreidesee.de",
    location_email: "info@kreidesee.de",
    location_phone: "+49 4771 6009990",
    city: "Hemmoor",
    country: "Deutschland",
    description: "Probetauchen, Beratung, Demonstrationen",
    longDescription: "Die Kick-off Veranstaltung markiert den Beginn einer spannenden europäischen Tour. In Hamburg präsentieren wir die neuesten Innovationen im Bereich der Unterwassertechnologie. Erwarten Sie spannende Keynotes, interaktive Demonstrationen und exklusive Einblicke in zukunftsweisende Projekte. Das Event bietet zudem hervorragende Networking-Möglichkeiten mit Branchenexperten, Forschern und Entwicklern aus ganz Europa.",
    image: "/images/Hemmoor.png",
    attendees: 150,
    status: "confirmed",
    speakers: [],
    topics: ["Kallweit", "Kwark", "Seacraft", "Thermovalve", "Tecline", "Upstream"],
  },
  {
    id: "2",
    title: "Tauchsicherheit & Innovation",
    begin_date: "22. Januar 2026",
    begin_time: "09:00",
    end_date: "23. Januar 2026",
    end_time: "17:00",
    location: "Messe Amsterdam",
    location_URL: "",
    location_email: "info@messe-amsterdam.nl",
    location_phone: "",
    city: "Amsterdam",
    country: "Niederlande",
    description: "Fokus auf Sicherheitsinnovationen im Tauchsport mit Workshops, Expertengesprächen und praktischen Demonstrationen neuer Sicherheitsausrüstung.",
    longDescription: "Sicherheit steht im Mittelpunkt dieser Veranstaltung. Wir präsentieren die neuesten Entwicklungen in Tauchcomputer-Technologie, Notfallsystemen und Schutzausrüstung. Praktische Workshops ermöglichen es den Teilnehmern, neue Technologien selbst zu testen. Renommierte Sicherheitsexperten teilen ihre Erkenntnisse und Best Practices für sichere Tauchoperationen in verschiedenen Umgebungen.",
    image: "https://images.unsplash.com/photo-1692810123077-ebb9993aaff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlJTIwc2N1YmElMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2OTUzMDIxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 200,
    status: "confirmed",
    speakers: ["Jan van Berg", "Sophie Bakker", "Thomas Jansen"],
    topics: ["Tauchcomputer der Zukunft", "Notfallprotokolle", "Dekompressionsforschung"],
  },
  {
    id: "3",
    title: "Unterwasser-Robotik Symposium",
    begin_date: "10. Mai 2026",
    begin_time: "11:00",
    end_date: "10. Mai 2026",
    end_time: "19:00",
    location: "Kongresszentrum",
    location_URL: "https://www.bellacenter.dk",
    location_email: "contact@bellacenter.dk",
    location_phone: "+45 32 47 32 00",
    city: "Kopenhagen",
    country: "Dänemark",
    description: "Präsentation modernster Unterwasser-Roboter und autonomer Tauchsysteme mit Live-Demos im nahegelegenen Hafen.",
    longDescription: "Tauchen Sie ein in die Welt der autonomen Unterwasser-Robotik. Diese Veranstaltung zeigt die neuesten Entwicklungen in AUV (Autonomous Underwater Vehicles) und ROV (Remotely Operated Vehicles) Technologie. Live-Demonstrationen im Kopenhagener Hafen bieten einzigartige Einblicke in die praktische Anwendung dieser Systeme. Von Tiefseeerkundung bis zur Infrastrukturinspektion – erleben Sie die Zukunft der Unterwasserrobotik.",
    image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 180,
    status: "confirmed",
    speakers: ["Dr. Erik Nielsen", "Lisa Andersen", "Mikkel Hansen"],
    topics: ["Autonome Navigation", "KI im Unterwasser-Bereich", "Sensortechnologie"],
  },
  {
    id: "4",
    title: "Marine Forschung Expo",
    begin_date: "30. Januar 2026",
    begin_time: "10:00",
    end_date: "31. Januar 2026",
    end_time: "18:00",
    location: "Ozeaneum",
    location_URL: "https://en.akvariet.no",
    location_email: "info@akvariet.no",
    location_phone: "+47 55 55 71 71",
    city: "Bergen",
    country: "Norwegen",
    description: "Zusammenarbeit zwischen Forschung und Industrie mit Fokus auf nachhaltige Meeresforschung und Tauchtechnologien.",
    longDescription: "Die Marine Forschung Expo bringt Wissenschaft und Praxis zusammen. Präsentationen renommierter Meeresforscher zeigen aktuelle Forschungsprojekte und deren praktische Umsetzung. Besonderer Fokus liegt auf nachhaltigen Forschungsmethoden und umweltschonenden Technologien. Das Ozeaneum Bergen bietet die perfekte Kulisse für dieses einzigartige Event, das Bildung, Forschung und Innovation vereint.",
    image: "https://images.unsplash.com/photo-1692810123077-ebb9993aaff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlJTIwc2N1YmElMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2OTUzMDIxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 120,
    status: "preparing",
    speakers: ["Dr. Ingrid Larsen", "Bjørn Solberg", "Astrid Knutsen"],
    topics: ["Klimaforschung", "Artenvielfalt", "Nachhaltige Technologien"],
  },
  {
    id: "5",
    title: "Tiefsee-Technologie Forum",
    begin_date: "5. Juli 2026",
    begin_time: "09:30",
    end_date: "5. Juli 2026",
    end_time: "17:30",
    location: "Maritime Institut",
    location_URL: "https://www.stockholmmassancongresscenter.se",
    location_email: "info@stockholmmassancongresscenter.se",
    location_phone: "+46 8 736 00 00",
    city: "Stockholm",
    country: "Schweden",
    description: "Spezialisierte Konferenz über Tiefsee-Explorationstechnologien mit internationalen Experten und Industrie-Leaders.",
    longDescription: "Entdecken Sie die extremen Herausforderungen und faszinierenden Lösungen der Tiefseeforschung. Internationale Experten präsentieren Technologien für Tauchgänge in extreme Tiefen, Druckresistente Systeme und innovative Beleuchtungslösungen. Das Forum bietet einzigartige Einblicke in aktuelle Tiefsee-Expeditionen und diskutiert zukünftige Entwicklungen in diesem spannenden Bereich der Meeresforschung.",
    image: "https://images.unsplash.com/photo-1555881400-edfa57db45be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBoYXJib3J8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 160,
    status: "preparing",
    speakers: ["Prof. Anders Svensson", "Emma Johansson", "Dr. Karl Bergström"],
    topics: ["Hochdrucktechnologie", "Tiefsee-Exploration", "Biolumineszenz"],
  },
  {
    id: "6",
    title: "DIVE Demo Finale",
    begin_date: "20. August 2026",
    begin_time: "10:00",
    end_date: "20. August 2026",
    end_time: "20:00",
    location: "Waterfront Convention Center",
    location_URL: "https://www.messukeskus.com",
    location_email: "info@messukeskus.com",
    location_phone: "+358 9 150 91",
    city: "Helsinki",
    country: "Finnland",
    description: "Abschlussveranstaltung der Tour mit Highlights aller Events, Auszeichnungen und großer Gala am Abend.",
    longDescription: "Das große Finale der DIVE Demo Tour vereint alle Highlights der vergangenen Monate. Eine umfassende Ausstellung zeigt die besten Innovationen und Projekte der gesamten Tour. Am Abend findet eine festliche Gala statt, bei der herausragende Beiträge zur Unterwassertechnologie ausgezeichnet werden. Feiern Sie mit uns den Erfolg dieser außergewöhnlichen europäischen Initiative und blicken Sie voraus auf zukünftige Entwicklungen in der Branche.",
    image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 250,
    status: "preparing",
    speakers: ["Alle Speaker der Tour", "Gastredner aus der Industrie"],
    topics: ["Tour Review", "Auszeichnungen", "Zukunftsausblick"],
  },
];