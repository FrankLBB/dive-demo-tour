import { Calendar, MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1682957205538-7ba9957b01a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3ViYSUyMGRpdmluZyUyMHVuZGVyd2F0ZXIlMjBvY2VhbnxlbnwxfHx8fDE3Njk1NDEzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/55 to-cyan-700/50" />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="size-10" />
          <h1 className="text-5xl">DIVE DEMO TOUR</h1>
        </div>
        <p className="text-xl text-blue-50 max-w-2xl">
          Test-Events für Taucher
        </p>
      </div>
    </header>
  );
}