export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  country: string;
  description: string;
  image: string;
  attendees: number;
  status: "upcoming" | "confirmed" | "past";
  longDescription?: string;
  speakers?: string[];
  topics?: string[];
}

export const events: Event[] = [
  {
    id: "1",
    title: "Testtauch-Event Hemmoor",
    date: "14. bis 17. Mai 2026",
    time: "09:00 - 18:00 Uhr",
    location: "Tauchbasis Kreidesee",
    city: "Hemmoor",
    country: "Deutschland",
    description: "Probetauchen, Beratung, Demonstrationen",
    longDescription: "Die Kick-off Veranstaltung markiert den Beginn einer spannenden europäischen Tour. In Hamburg präsentieren wir die neuesten Innovationen im Bereich der Unterwassertechnologie. Erwarten Sie spannende Keynotes, interaktive Demonstrationen und exklusive Einblicke in zukunftsweisende Projekte. Das Event bietet zudem hervorragende Networking-Möglichkeiten mit Branchenexperten, Forschern und Entwicklern aus ganz Europa.",
    image: "https://images.unsplash.com/photo-1555881400-edfa57db45be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBoYXJib3J8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 150,
    status: "confirmed",
    speakers: [],
    topics: ["Kallweit", "Kwark", "Seacraft", "Thermovalve", "Tecline", "Upstream"],
  },
  {
    id: "2",
    title: "Tauchsicherheit & Innovation",
    date: "22. April 2026",
    time: "09:00 - 17:00 Uhr",
    location: "Messe Amsterdam",
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
    date: "10. Mai 2026",
    time: "11:00 - 19:00 Uhr",
    location: "Kongresszentrum",
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
    date: "18. Juni 2026",
    time: "10:00 - 18:00 Uhr",
    location: "Ozeaneum",
    city: "Bergen",
    country: "Norwegen",
    description: "Zusammenarbeit zwischen Forschung und Industrie mit Fokus auf nachhaltige Meeresforschung und Tauchtechnologien.",
    longDescription: "Die Marine Forschung Expo bringt Wissenschaft und Praxis zusammen. Präsentationen renommierter Meeresforscher zeigen aktuelle Forschungsprojekte und deren praktische Umsetzung. Besonderer Fokus liegt auf nachhaltigen Forschungsmethoden und umweltschonenden Technologien. Das Ozeaneum Bergen bietet die perfekte Kulisse für dieses einzigartige Event, das Bildung, Forschung und Innovation vereint.",
    image: "https://images.unsplash.com/photo-1692810123077-ebb9993aaff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlJTIwc2N1YmElMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2OTUzMDIxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 120,
    status: "upcoming",
    speakers: ["Dr. Ingrid Larsen", "Bjørn Solberg", "Astrid Knutsen"],
    topics: ["Klimaforschung", "Artenvielfalt", "Nachhaltige Technologien"],
  },
  {
    id: "5",
    title: "Tiefsee-Technologie Forum",
    date: "5. Juli 2026",
    time: "09:30 - 17:30 Uhr",
    location: "Maritime Institut",
    city: "Stockholm",
    country: "Schweden",
    description: "Spezialisierte Konferenz über Tiefsee-Explorationstechnologien mit internationalen Experten und Industrie-Leaders.",
    longDescription: "Entdecken Sie die extremen Herausforderungen und faszinierenden Lösungen der Tiefseeforschung. Internationale Experten präsentieren Technologien für Tauchgänge in extreme Tiefen, Druckresistente Systeme und innovative Beleuchtungslösungen. Das Forum bietet einzigartige Einblicke in aktuelle Tiefsee-Expeditionen und diskutiert zukünftige Entwicklungen in diesem spannenden Bereich der Meeresforschung.",
    image: "https://images.unsplash.com/photo-1555881400-edfa57db45be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBoYXJib3J8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 160,
    status: "upcoming",
    speakers: ["Prof. Anders Svensson", "Emma Johansson", "Dr. Karl Bergström"],
    topics: ["Hochdrucktechnologie", "Tiefsee-Exploration", "Biolumineszenz"],
  },
  {
    id: "6",
    title: "DIVE Demo Finale",
    date: "20. August 2026",
    time: "10:00 - 20:00 Uhr",
    location: "Waterfront Convention Center",
    city: "Helsinki",
    country: "Finnland",
    description: "Abschlussveranstaltung der Tour mit Highlights aller Events, Auszeichnungen und großer Gala am Abend.",
    longDescription: "Das große Finale der DIVE Demo Tour vereint alle Highlights der vergangenen Monate. Eine umfassende Ausstellung zeigt die besten Innovationen und Projekte der gesamten Tour. Am Abend findet eine festliche Gala statt, bei der herausragende Beiträge zur Unterwassertechnologie ausgezeichnet werden. Feiern Sie mit uns den Erfolg dieser außergewöhnlichen europäischen Initiative und blicken Sie voraus auf zukünftige Entwicklungen in der Branche.",
    image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    attendees: 250,
    status: "upcoming",
    speakers: ["Alle Speaker der Tour", "Gastredner aus der Industrie"],
    topics: ["Tour Review", "Auszeichnungen", "Zukunftsausblick"],
  },
];
