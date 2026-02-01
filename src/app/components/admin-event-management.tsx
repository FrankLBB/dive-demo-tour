import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Grid3x3,
  Check,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Event } from "@/app/data/events";
import type { EventModule } from "@/app/components/admin-event-module-management";

interface AdminEventManagementProps {
  onEventChange?: () => void;
  onModuleEdit?: (moduleId: string) => void;
}

export function AdminEventManagement({ onEventChange, onModuleEdit }: AdminEventManagementProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(false);
  
  // Module dialog state
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [currentEventForModules, setCurrentEventForModules] = useState<Event | null>(null);
  const [availableModules, setAvailableModules] = useState<EventModule[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isSavingModules, setIsSavingModules] = useState(false);
  
  // All modules for displaying in event cards
  const [allModules, setAllModules] = useState<EventModule[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    begin_date: "",
    begin_time: "",
    end_date: "",
    end_time: "",
    location: "",
    location_URL: "",
    location_email: "",
    location_phone: "",
    city: "",
    country: "",
    description: "",
    longDescription: "",
    image: "",
    attendees: 0,
    status: "preparing" as "preparing" | "confirmed" | "past" | "completed",
    eventNote: "",
  });

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
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      console.log("✅ Events fetched:", data.events?.length || 0);
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Fehler beim Laden der Events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      console.log("✅ Image uploaded:", data.imageUrl);
      
      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      alert("Bild erfolgreich hochgeladen!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert(`Fehler beim Hochladen: ${err.message}`);
    } finally {
      setImageUploadProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("📤 Submitting event data:", formData);
      
      const url = editingEvent
        ? `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events/${editingEvent.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events`;

      const method = editingEvent ? "PUT" : "POST";

      console.log(`${method} ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to save event");
      }

      console.log("✅ Event saved successfully:", responseData.event);

      alert(editingEvent ? "Event aktualisiert!" : "Event erstellt!");
      setIsDialogOpen(false);
      resetForm();
      await fetchEvents();
      onEventChange?.();
    } catch (err) {
      console.error("❌ Error saving event:", err);
      alert(`Fehler beim Speichern des Events: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }

    try {
      console.log("🗑️ Deleting event with ID:", id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log("Delete response status:", response.status);
      
      const responseData = await response.json();
      console.log("Delete response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to delete event");
      }

      console.log("✅ Event deleted successfully:", id);
      alert("Event gelöscht!");
      setDeleteConfirmId(null);
      await fetchEvents();
      onEventChange?.();
    } catch (err) {
      console.error("❌ Error deleting event:", err);
      alert(`Fehler beim Löschen des Events: ${err.message}`);
      setDeleteConfirmId(null);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setFormData({
      title: event.title,
      begin_date: event.begin_date,
      begin_time: event.begin_time,
      end_date: event.end_date,
      end_time: event.end_time,
      location: event.location,
      location_URL: event.location_URL || "",
      location_email: event.location_email || "",
      location_phone: event.location_phone || "",
      city: event.city,
      country: event.country,
      description: event.description,
      longDescription: event.longDescription || "",
      image: event.image,
      attendees: event.attendees,
      status: event.status,
      eventNote: event.eventNote || "",
    });
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      begin_date: "",
      begin_time: "",
      end_date: "",
      end_time: "",
      location: "",
      location_URL: "",
      location_email: "",
      location_phone: "",
      city: "",
      country: "",
      description: "",
      longDescription: "",
      image: "",
      attendees: 0,
      status: "preparing",
      eventNote: "",
    });
  };

  useEffect(() => {
    fetchEvents();
    fetchModulesAndBrands();
  }, []);

  const fetchModulesAndBrands = async () => {
    try {
      // Fetch all modules
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
        setAllModules(modulesData.modules || []);
        console.log("✅ Modules fetched for display:", modulesData.modules.length);
      }

      // Fetch brands
      const brandsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json();
        setBrands(brandsData.brands || []);
        console.log("✅ Brands fetched for display:", brandsData.brands.length);
      }
    } catch (err) {
      console.error("Error fetching modules and brands:", err);
    }
  };

  // Get modules for an event, sorted by brand and title
  const getEventModules = (event: Event): EventModule[] => {
    if (!event.moduleIds || event.moduleIds.length === 0) {
      return [];
    }

    // Filter modules that are assigned to this event
    const eventModules = allModules.filter(module =>
      event.moduleIds?.includes(module.id)
    );

    // Sort by brand name (ascending) and then by title (ascending)
    return eventModules.sort((a, b) => {
      const brandA = brands.find(brand => brand.id === a.brandId);
      const brandB = brands.find(brand => brand.id === b.brandId);
      
      const brandNameA = brandA?.name || "";
      const brandNameB = brandB?.name || "";

      // First sort by brand name
      if (brandNameA !== brandNameB) {
        return brandNameA.localeCompare(brandNameB);
      }

      // If same brand (or no brand), sort by title
      return a.title.localeCompare(b.title);
    });
  };

  const openModuleDialog = async (event: Event) => {
    setCurrentEventForModules(event);
    setIsModuleDialogOpen(true);
    setIsLoadingModules(true);
    
    try {
      // Fetch all modules
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch modules");
      }

      const data = await response.json();
      // Filter for active modules only
      const activeModules = (data.modules || []).filter(
        (module: EventModule) => module.status === "active"
      );
      
      // Sort modules by brand name and then by title
      const sortedModules = activeModules.sort((a: EventModule, b: EventModule) => {
        const brandA = brands.find(brand => brand.id === a.brandId);
        const brandB = brands.find(brand => brand.id === b.brandId);
        
        // If both have brands, sort by brand name first
        if (brandA && brandB) {
          const brandComparison = brandA.name.localeCompare(brandB.name);
          if (brandComparison !== 0) return brandComparison;
        }
        
        // If only one has a brand, put that one first
        if (brandA && !brandB) return -1;
        if (!brandA && brandB) return 1;
        
        // If same brand (or no brand), sort by title
        return a.title.localeCompare(b.title);
      });
      
      setAvailableModules(sortedModules);
      
      // Set currently selected modules
      setSelectedModuleIds(event.moduleIds || []);
      
      console.log("✅ Active modules fetched:", activeModules.length);
    } catch (err) {
      console.error("Error fetching modules:", err);
      alert("Fehler beim Laden der Module");
      setIsModuleDialogOpen(false);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const closeModuleDialog = () => {
    setIsModuleDialogOpen(false);
    setCurrentEventForModules(null);
    setAvailableModules([]);
    setSelectedModuleIds([]);
  };

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModuleIds((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const saveModuleAssignments = async () => {
    if (!currentEventForModules) return;

    setIsSavingModules(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events/${currentEventForModules.id}/modules`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ moduleIds: selectedModuleIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save module assignments");
      }

      console.log("✅ Module assignments saved");
      alert("Module erfolgreich zugeordnet!");
      closeModuleDialog();
      await fetchEvents();
      onEventChange?.();
    } catch (err) {
      console.error("Error saving module assignments:", err);
      alert(`Fehler beim Speichern: ${err.message}`);
    } finally {
      setIsSavingModules(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Event-Verwaltung</h2>
          <p className="text-gray-600">Erstellen und verwalten Sie Events</p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="size-5 mr-2" />
          Neues Event
        </Button>
      </div>

      {/* Events List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="size-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Lade Events...</p>
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
              <Button onClick={fetchEvents}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Calendar className="size-12 text-gray-400 mb-4" />
              <h3 className="text-xl mb-2">Keine Events vorhanden</h3>
              <p className="text-gray-600 mb-4">
                Erstellen Sie Ihr erstes Event
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="size-4 mr-2" />
                Neues Event erstellen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Event Image */}
                  {event.image && (
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              event.status === "confirmed"
                                ? "default"
                                : event.status === "preparing"
                                ? "secondary"
                                : event.status === "completed"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {event.status === "confirmed"
                              ? "Bestätigt"
                              : event.status === "preparing"
                              ? "In Bearbeitung"
                              : event.status === "completed"
                              ? "Abgeschlossen"
                              : "Vergangen"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        <span>
                          {event.begin_date}
                          {event.end_date !== event.begin_date &&
                            ` - ${event.end_date}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-gray-400" />
                        <span>
                          {event.city}, {event.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-gray-400" />
                        <span>{event.attendees} Teilnehmer</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Assigned Modules */}
                    {getEventModules(event).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Grid3x3 className="size-4" />
                          Zugeordnete Module ({getEventModules(event).length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getEventModules(event).map((module) => {
                            const brand = brands.find(b => b.id === module.brandId);
                            return (
                              <button
                                key={module.id}
                                onClick={() => onModuleEdit?.(module.id)}
                                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                              >
                                {brand && (
                                  <span className="text-xs text-blue-600 font-medium">
                                    {brand.name}
                                  </span>
                                )}
                                {brand && <span className="text-blue-300">•</span>}
                                <span className="text-blue-800">{module.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => openEditDialog(event)}
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:flex-none"
                    >
                      <Edit className="size-4 mr-2" />
                      Bearbeiten
                    </Button>
                    <Button
                      onClick={() => openModuleDialog(event)}
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:flex-none"
                    >
                      <Grid3x3 className="size-4 mr-2" />
                      Modul hinzufügen
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant={deleteConfirmId === event.id ? "destructive" : "outline"}
                      size="sm"
                      className="flex-1 lg:flex-none"
                    >
                      <Trash2 className="size-4 mr-2" />
                      {deleteConfirmId === event.id ? "Bestätigen?" : "Löschen"}
                    </Button>
                    {deleteConfirmId === event.id && (
                      <Button
                        onClick={() => setDeleteConfirmId(null)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 lg:flex-none"
                      >
                        Abbrechen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingEvent ? "Event bearbeiten" : "Neues Event erstellen"}
                </h2>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">{/* Increased max-height */}
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Grundinformationen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Titel *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        placeholder="z.B. Testtauch-Event Hemmoor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Startdatum *
                      </label>
                      <Input
                        value={formData.begin_date}
                        onChange={(e) =>
                          setFormData({ ...formData, begin_date: e.target.value })
                        }
                        required
                        placeholder="z.B. 1. Februar 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Startzeit *
                      </label>
                      <Input
                        value={formData.begin_time}
                        onChange={(e) =>
                          setFormData({ ...formData, begin_time: e.target.value })
                        }
                        required
                        placeholder="z.B. 09:00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Enddatum *
                      </label>
                      <Input
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                        required
                        placeholder="z.B. 5. Februar 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Endzeit *
                      </label>
                      <Input
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                        required
                        placeholder="z.B. 18:00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "preparing" | "confirmed" | "past" | "completed",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="preparing">In Bearbeitung</option>
                        <option value="confirmed">Bestätigt</option>
                        <option value="past">Vergangen</option>
                        <option value="completed">Abgeschlossen</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Maximale Teilnehmeranzahl
                      </label>
                      <Input
                        type="number"
                        value={formData.attendees}
                        onChange={(e) =>
                          setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })
                        }
                        placeholder="z.B. 30"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximale Anzahl der Teilnehmer für dieses Event
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Veranstaltungsort</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location *
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                        placeholder="z.B. Tauchbasis Kreidesee"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stadt *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                        placeholder="z.B. Hemmoor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Land *
                      </label>
                      <Input
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                        placeholder="z.B. Deutschland"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website
                      </label>
                      <Input
                        value={formData.location_URL}
                        onChange={(e) =>
                          setFormData({ ...formData, location_URL: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        E-Mail für Rückfragen zum Event
                      </label>
                      <Input
                        value={formData.location_email}
                        onChange={(e) =>
                          setFormData({ ...formData, location_email: e.target.value })
                        }
                        placeholder="info@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Telefon
                      </label>
                      <Input
                        value={formData.location_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, location_phone: e.target.value })
                        }
                        placeholder="+49 ..."
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Beschreibung</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kurzbeschreibung *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Kurze Beschreibung für Übersicht..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ausführliche Beschreibung
                      </label>
                      <textarea
                        value={formData.longDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longDescription: e.target.value,
                          })
                        }
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Detaillierte Beschreibung für Event-Detailseite..."
                      />
                    </div>
                  </div>
                </div>

                {/* Event Note */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hinweis zum Event</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Hinweis
                      </label>
                      <textarea
                        value={formData.eventNote || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, eventNote: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Optionaler Hinweis zum Event (z.B. wichtige Informationen für Teilnehmer)..."
                      />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Event-Bild</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bild hochladen
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={imageUploadProgress}
                          className="flex-1"
                        />
                        {imageUploadProgress && (
                          <Loader2 className="size-6 animate-spin text-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Max. 5MB, Format: JPEG, PNG, WebP
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Oder Bild-URL eingeben
                      </label>
                      <Input
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>

                    {formData.image && (
                      <div className="border rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Vorschau:</p>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Speichert...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      {editingEvent ? "Aktualisieren" : "Erstellen"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Management Dialog */}
      {isModuleDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Module für Event zuordnen
                </h2>
                <button
                  onClick={closeModuleDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isLoadingModules ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="size-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">Lade Module...</p>
                </div>
              ) : availableModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <Grid3x3 className="size-12 text-gray-400 mb-4" />
                  <h3 className="text-xl mb-2">Keine Module verfügbar</h3>
                  <p className="text-gray-600 mb-4">
                    Es sind keine aktiven Module vorhanden.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableModules.map((module) => {
                    const brand = brands.find(b => b.id === module.brandId);
                    return (
                      <div key={module.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedModuleIds.includes(module.id)}
                          onChange={() => toggleModuleSelection(module.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {brand?.logo && (
                              <div className="flex-shrink-0 w-24 h-8 rounded overflow-hidden bg-gray-50 border">
                                <img
                                  src={brand.logo}
                                  alt={brand.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-base font-semibold mb-1">{module.title}</h3>
                              {module.internalName && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Intern: {module.internalName}
                                </p>
                              )}
                              {brand && !brand.logo && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Marke: {brand.name}
                                </p>
                              )}
                              {module.details && (
                                <p className="text-sm text-gray-600">
                                  {module.details}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeModuleDialog}
                disabled={isSavingModules}
              >
                Abbrechen
              </Button>
              <Button
                type="button"
                onClick={saveModuleAssignments}
                disabled={isSavingModules}
              >
                {isSavingModules ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Speichert...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Speichern
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}