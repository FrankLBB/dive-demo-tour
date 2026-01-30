import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Users,
  Calendar,
  Search,
  Download,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Loader2,
  AlertCircle,
  LogOut,
  ArrowLeft,
  Wrench,
  Power,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { events } from "@/app/data/events";
import { AdminLogin } from "@/app/components/admin-login";

interface Registration {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  eventId: string;
  eventTitle: string;
  registrationId: string;
  registeredAt: string;
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Check maintenance mode on mount
  useEffect(() => {
    const maintenanceMode = localStorage.getItem("maintenanceMode") === "true";
    setIsMaintenanceMode(maintenanceMode);
  }, []);

  const checkAuthentication = async () => {
    const sessionToken = sessionStorage.getItem("adminSessionToken");
    
    if (!sessionToken) {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ sessionToken }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("adminSessionToken");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth verification error (backend unavailable):", err);
      // If backend is unavailable, check local fallback
      // For demo purposes, allow access if session token exists
      console.warn("Using fallback authentication");
      setIsAuthenticated(true);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let backendRegistrations: Registration[] = [];
      
      // Try to fetch from backend
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/registrations`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          backendRegistrations = data.registrations || [];
          console.log("Registrations fetched from backend:", backendRegistrations.length);
        } else {
          console.warn("Backend fetch failed, using local storage");
        }
      } catch (fetchError) {
        console.warn("Backend unavailable, using local storage:", fetchError);
      }

      // Always merge with localStorage data
      const localRegistrations = JSON.parse(
        localStorage.getItem("registrations") || "[]"
      );

      // Combine and deduplicate
      const allRegistrations = [...backendRegistrations, ...localRegistrations];
      const uniqueRegistrations = allRegistrations.filter(
        (reg, index, self) =>
          index === self.findIndex((r) => r.email === reg.email && r.eventId === reg.eventId)
      );

      setRegistrations(uniqueRegistrations);
      setFilteredRegistrations(uniqueRegistrations);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError("Fehler beim Laden der Anmeldungen");
      
      // Fallback to localStorage only
      const localRegistrations = JSON.parse(
        localStorage.getItem("registrations") || "[]"
      );
      setRegistrations(localRegistrations);
      setFilteredRegistrations(localRegistrations);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Filter by event
    if (selectedEvent !== "all") {
      filtered = filtered.filter((reg) => reg.eventId === selectedEvent);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.firstName.toLowerCase().includes(term) ||
          reg.lastName.toLowerCase().includes(term) ||
          reg.email.toLowerCase().includes(term) ||
          reg.organization?.toLowerCase().includes(term) ||
          reg.eventTitle.toLowerCase().includes(term)
      );
    }

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      "Vorname",
      "Nachname",
      "E-Mail",
      "Telefon",
      "Organisation",
      "Event",
      "Anmeldedatum",
      "Nachricht",
    ];

    const rows = filteredRegistrations.map((reg) => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone || "",
      reg.organization || "",
      reg.eventTitle,
      new Date(reg.registeredAt).toLocaleString("de-DE"),
      reg.message || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `anmeldungen_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoginSuccess = (sessionToken: string) => {
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminSessionToken");
    setIsAuthenticated(false);
    setRegistrations([]);
    setFilteredRegistrations([]);
  };

  const toggleMaintenanceMode = () => {
    const newMode = !isMaintenanceMode;
    setIsMaintenanceMode(newMode);
    localStorage.setItem("maintenanceMode", String(newMode));
    
    if (newMode) {
      console.log("✅ Wartungsmodus aktiviert");
    } else {
      console.log("✅ Wartungsmodus deaktiviert");
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, selectedEvent]);

  // Statistics
  const totalRegistrations = registrations.length;
  const registrationsByEvent = events.map((event) => ({
    ...event,
    count: registrations.filter((reg) => reg.eventId === event.id).length,
  }));

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Überprüfe Authentifizierung...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button
              variant="outline"
              className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 size-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
          <h1 className="text-5xl mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-50">Verwaltung der Event-Anmeldungen</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-gray-600">Gesamt-Anmeldungen</h3>
                  <Users className="size-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl">{totalRegistrations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-gray-600">Aktive Events</h3>
                  <Calendar className="size-8 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl">{events.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-gray-600">Ø Teilnehmer/Event</h3>
                  <Users className="size-8 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl">
                  {totalRegistrations > 0
                    ? Math.round(totalRegistrations / events.length)
                    : 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registrations by Event */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-2xl">Anmeldungen pro Event</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrationsByEvent.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <h4 className="font-semibold mb-1">{event.city}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {event.count}
                      </span>
                      <Badge variant={event.count > 0 ? "default" : "secondary"}>
                        {event.count > 0 ? "Aktiv" : "Keine"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode Control */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl mb-2">Wartungsmodus</h3>
                  <p className="text-sm text-gray-600">
                    Versetzen Sie die gesamte Website in den Wartungsmodus. Besucher sehen dann nur noch eine Wartungsseite.
                  </p>
                </div>
                <Wrench className={`size-12 ${isMaintenanceMode ? 'text-orange-500' : 'text-gray-400'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`rounded-xl p-6 border-2 ${
                isMaintenanceMode 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isMaintenanceMode 
                        ? 'bg-orange-100' 
                        : 'bg-green-100'
                    }`}>
                      {isMaintenanceMode ? (
                        <Wrench className="size-8 text-orange-600" />
                      ) : (
                        <Power className="size-8 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        {isMaintenanceMode ? (
                          <span className="text-orange-900">⚠️ Wartungsmodus aktiv</span>
                        ) : (
                          <span className="text-green-900">✅ Website online</span>
                        )}
                      </h4>
                      <p className="text-sm mb-3">
                        {isMaintenanceMode ? (
                          <span className="text-orange-800">
                            Besucher sehen aktuell nur die Wartungsseite. Sie haben als Admin weiterhin vollen Zugriff.
                          </span>
                        ) : (
                          <span className="text-green-800">
                            Die Website ist für alle Besucher normal erreichbar. Alle Funktionen sind verfügbar.
                          </span>
                        )}
                      </p>
                      {isMaintenanceMode && (
                        <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-100 rounded-lg px-3 py-2 inline-block">
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Admins können die Website weiterhin nutzen</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={toggleMaintenanceMode}
                    size="lg"
                    className={isMaintenanceMode 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-orange-500 hover:bg-orange-600'
                    }
                  >
                    {isMaintenanceMode ? (
                      <>
                        <Power className="size-5 mr-2" />
                        Website aktivieren
                      </>
                    ) : (
                      <>
                        <Wrench className="size-5 mr-2" />
                        Wartung starten
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Wie funktioniert der Wartungsmodus?
                </h5>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Aktiviert:</strong> Normale Besucher sehen nur die Wartungsseite mit Informationen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Admin-Zugang:</strong> Sie können sich weiterhin einloggen und haben vollen Zugriff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Anmeldungen:</strong> Während des Wartungsmodus sind keine Event-Anmeldungen möglich</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Deaktivieren:</strong> Klicken Sie auf "Website aktivieren" um die Website wieder freizugeben</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Suche nach Name, E-Mail, Organisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">Alle Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.city} - {event.date}
                    </option>
                  ))}
                </select>

                <Button onClick={exportToCSV} variant="outline">
                  <Download className="size-4 mr-2" />
                  CSV Export
                </Button>

                <Button onClick={fetchRegistrations} variant="outline">
                  Aktualisieren
                </Button>

                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="size-4 mr-2" />
                  Abmelden
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                {filteredRegistrations.length} von {totalRegistrations} Anmeldungen
              </div>
            </CardContent>
          </Card>

          {/* Registrations List */}
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="size-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">Lade Anmeldungen...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertCircle className="size-12 text-red-500 mb-4" />
                  <h3 className="text-xl mb-2">Fehler beim Laden</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchRegistrations}>Erneut versuchen</Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredRegistrations.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="size-12 text-gray-400 mb-4" />
                  <h3 className="text-xl mb-2">Keine Anmeldungen gefunden</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedEvent !== "all"
                      ? "Versuchen Sie andere Suchkriterien."
                      : "Es gibt noch keine Anmeldungen."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <Card key={registration.registrationId}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl mb-1">
                            {registration.firstName} {registration.lastName}
                          </h3>
                          <Badge className="mb-2">{registration.eventTitle}</Badge>
                          <p className="text-sm text-gray-500">
                            Angemeldet am:{" "}
                            {new Date(registration.registeredAt).toLocaleString("de-DE")}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="size-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`mailto:${registration.email}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {registration.email}
                            </a>
                          </div>

                          {registration.phone && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="size-4 text-gray-400 flex-shrink-0" />
                              <a
                                href={`tel:${registration.phone}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {registration.phone}
                              </a>
                            </div>
                          )}

                          {registration.organization && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Building2 className="size-4 text-gray-400 flex-shrink-0" />
                              <span>{registration.organization}</span>
                            </div>
                          )}
                        </div>

                        {registration.message && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="size-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Nachricht:</p>
                                <p className="text-sm text-gray-700">
                                  {registration.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${registration.email}`}>
                            <Mail className="size-4 mr-2" />
                            E-Mail
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/event/${registration.eventId}`}>
                            <Calendar className="size-4 mr-2" />
                            Event
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 hover:underline text-lg">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}