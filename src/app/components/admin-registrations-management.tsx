import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Loader2,
  Trash2,
  Search,
  Calendar,
  Mail,
  Phone,
  Building2,
  User,
  Grid3x3,
  Download,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Event } from "@/app/data/events";
import type { EventModule } from "@/app/components/admin-event-module-management";

interface Registration {
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  eventId: string;
  eventTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  registrationEmail?: string;
  registeredAt: string;
}

export function AdminRegistrationsManagement() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [modules, setModules] = useState<EventModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEventId, setFilterEventId] = useState<string>("all");
  const [filterModuleId, setFilterModuleId] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch registrations
      const regResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/registrations`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (regResponse.ok) {
        const regData = await regResponse.json();
        setRegistrations(regData.registrations || []);
        console.log("✅ Registrations loaded:", regData.registrations?.length || 0);
      } else {
        console.warn("⚠️ Failed to fetch registrations, using empty array");
        setRegistrations([]);
      }

      // Fetch events - with error handling
      try {
        const eventsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);
          console.log("✅ Events loaded:", eventsData.events?.length || 0);
        } else {
          console.warn("⚠️ Failed to fetch events, using empty array");
          setEvents([]);
        }
      } catch (eventsError) {
        console.warn("⚠️ Error fetching events:", eventsError);
        setEvents([]);
      }

      // Fetch modules - with error handling
      try {
        const modulesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          setModules(modulesData.modules || []);
          console.log("✅ Modules loaded:", modulesData.modules?.length || 0);
        } else {
          console.warn("⚠️ Failed to fetch modules, using empty array");
          setModules([]);
        }
      } catch (modulesError) {
        console.warn("⚠️ Error fetching modules:", modulesError);
        setModules([]);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      // Set empty arrays as fallback
      setRegistrations([]);
      setEvents([]);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string, registrationId: string) => {
    if (!confirm("Möchten Sie diese Anmeldung wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/registrations/${eventId}/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        console.log("✅ Registration deleted successfully");
        setRegistrations(
          registrations.filter((r) => r.registrationId !== registrationId)
        );
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to delete registration:", errorData);
        alert("Fehler beim Löschen der Anmeldung");
      }
    } catch (error) {
      console.error("❌ Error deleting registration:", error);
      alert("Fehler beim Löschen der Anmeldung");
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredRegistrations();
    
    const csvHeaders = [
      "Vorname",
      "Nachname",
      "E-Mail",
      "Telefon",
      "Organisation",
      "Event",
      "Modul",
      "Angemeldet am",
      "Nachricht",
      "Bevorzugtes Datum",
      "Bevorzugte Zeit",
    ];

    const csvRows = filtered.map((reg) => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone || "",
      reg.organization || "",
      reg.eventTitle,
      reg.moduleTitle || "Kein Modul",
      new Date(reg.registeredAt).toLocaleString("de-DE"),
      reg.message ? reg.message.replace(/"/g, '""') : "",
      reg.preferredDate || "",
      reg.preferredTime || "",
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
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

  const getFilteredRegistrations = () => {
    return registrations
      .filter((reg) => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          searchTerm === "" ||
          reg.firstName.toLowerCase().includes(searchLower) ||
          reg.lastName.toLowerCase().includes(searchLower) ||
          reg.email.toLowerCase().includes(searchLower) ||
          reg.eventTitle.toLowerCase().includes(searchLower) ||
          (reg.moduleTitle && reg.moduleTitle.toLowerCase().includes(searchLower));

        // Event filter
        const matchesEvent = filterEventId === "all" || reg.eventId === filterEventId;

        // Module filter
        const matchesModule =
          filterModuleId === "all" ||
          (filterModuleId === "no-module" && !reg.moduleId) ||
          reg.moduleId === filterModuleId;

        return matchesSearch && matchesEvent && matchesModule;
      })
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  };

  const filteredRegistrations = getFilteredRegistrations();

  // Get unique events and modules from registrations
  const registeredEvents = Array.from(
    new Set(registrations.map((r) => r.eventId))
  ).map((eventId) => events.find((e) => e.id === eventId) || null).filter((e): e is Event => e !== null);

  const registeredModules = Array.from(
    new Set(registrations.map((r) => r.moduleId).filter(Boolean))
  ).map((moduleId) => modules.find((m) => m.id === moduleId) || null).filter((m): m is EventModule => m !== null);

  const hasModuleRegistrations = registrations.some((r) => r.moduleId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-gray-600">Lade Anmeldungen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl mb-2">Anmeldungsverwaltung</h3>
              <p className="text-sm text-gray-600">
                Verwalten Sie alle Event- und Modul-Anmeldungen
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {filteredRegistrations.length} {filteredRegistrations.length === 1 ? "Anmeldung" : "Anmeldungen"}
              </Badge>
              {filteredRegistrations.length > 0 && (
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  CSV Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Suche nach Name, E-Mail, Event oder Modul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Event Filter */}
            <div>
              <Select value={filterEventId} onValueChange={setFilterEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Events</SelectItem>
                  {registeredEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Module Filter */}
            {hasModuleRegistrations && (
              <div>
                <Select value={filterModuleId} onValueChange={setFilterModuleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Module</SelectItem>
                    <SelectItem value="no-module">Kein Modul</SelectItem>
                    {registeredModules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Registrations List */}
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="size-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keine Anmeldungen gefunden
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterEventId !== "all" || filterModuleId !== "all"
                  ? "Versuchen Sie, die Filter zu ändern"
                  : "Es wurden noch keine Anmeldungen eingereicht"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => {
                const registeredDate = new Date(registration.registeredAt).toLocaleString(
                  "de-DE",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                );

                return (
                  <Card key={registration.registrationId} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Name and Registration Date */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {registration.firstName} {registration.lastName}
                              </h4>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="size-3" />
                                Angemeldet am {registeredDate}
                              </p>
                            </div>
                          </div>

                          {/* Event and Module Info */}
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {registration.eventTitle}
                            </Badge>
                            {registration.moduleTitle && (
                              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 flex items-center gap-1">
                                <Grid3x3 className="size-3" />
                                {registration.moduleTitle}
                              </Badge>
                            )}
                          </div>

                          {/* Contact Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="size-4" />
                              <a
                                href={`mailto:${registration.email}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {registration.email}
                              </a>
                            </div>
                            {registration.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="size-4" />
                                <a
                                  href={`tel:${registration.phone}`}
                                  className="hover:text-blue-600 hover:underline"
                                >
                                  {registration.phone}
                                </a>
                              </div>
                            )}
                            {registration.organization && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building2 className="size-4" />
                                <span>{registration.organization}</span>
                              </div>
                            )}
                            {registration.preferredDate && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="size-4" />
                                <span>
                                  <span className="font-semibold">Wunschdatum:</span> {registration.preferredDate}
                                </span>
                              </div>
                            )}
                            {registration.preferredTime && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="size-4" />
                                <span>
                                  <span className="font-semibold">Wunschzeit:</span> {registration.preferredTime}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          {registration.message && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Nachricht:</span>{" "}
                                {registration.message}
                              </p>
                            </div>
                          )}

                          {/* Registration ID */}
                          <div className="text-xs text-gray-400 font-mono">
                            ID: {registration.registrationId}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDelete(registration.eventId, registration.registrationId)
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}