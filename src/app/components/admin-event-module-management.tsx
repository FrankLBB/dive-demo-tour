import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Grid3x3,
  Tag,
  Handshake,
  Clock,
  Users,
  Mail,
  Euro,
  Filter,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Brand } from "@/app/components/admin-brand-management";
import type { Partner } from "@/app/components/admin-partner-management";

export interface EventModule {
  id: string;
  internalName: string;
  status: "active" | "inactive";
  brandId: string | null;
  partnerId: string | null;
  title: string;
  details: string;
  timeType: "daily" | "specific";
  specificDateTime: string | null;
  durationType: "event" | "custom";
  customDuration: string | null;
  maxParticipants: number | null;
  registrationRequired: boolean;
  registrationEmail: string;
  registrationUrl: string;
  registrationEmailAlt: string;
  registrationPhone: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminEventModuleManagement() {
  const [modules, setModules] = useState<EventModule[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<EventModule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterBrandId, setFilterBrandId] = useState<string>("all");

  const emptyModule: Omit<EventModule, "id" | "createdAt" | "updatedAt"> = {
    internalName: "",
    status: "active",
    brandId: null,
    partnerId: null,
    title: "",
    details: "",
    timeType: "daily",
    specificDateTime: null,
    durationType: "event",
    customDuration: null,
    maxParticipants: null,
    registrationRequired: false,
    registrationEmail: "",
    registrationUrl: "",
    registrationEmailAlt: "",
    registrationPhone: "",
    cost: "",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch modules
      const modulesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!modulesResponse.ok) {
        throw new Error("Failed to fetch modules");
      }

      const modulesData = await modulesResponse.json();
      setModules(modulesData.modules || []);

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
      }

      // Fetch partners
      const partnersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (partnersResponse.ok) {
        const partnersData = await partnersResponse.json();
        setPartners(partnersData.partners || []);
      }

      console.log("✅ Data loaded successfully");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Fehler beim Laden der Daten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingModule) return;

    // Validation
    if (!editingModule.title.trim()) {
      setError("Titel ist erforderlich");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const url = editingModule.id
        ? `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules/${editingModule.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules`;

      const method = editingModule.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(editingModule),
      });

      if (!response.ok) {
        throw new Error("Failed to save module");
      }

      const result = await response.json();
      console.log("✅ Module saved:", result);

      await fetchData();
      setEditingModule(null);
      setIsCreating(false);
    } catch (err) {
      console.error("Error saving module:", err);
      setError("Fehler beim Speichern des Moduls");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie dieses Modul wirklich löschen?")) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/modules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete module");
      }

      console.log("✅ Module deleted:", id);
      await fetchData();
    } catch (err) {
      console.error("Error deleting module:", err);
      setError("Fehler beim Löschen des Moduls");
    }
  };

  const handleEdit = (module: EventModule) => {
    setEditingModule({ ...module });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingModule({ ...emptyModule, id: "", createdAt: "", updatedAt: "" });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingModule(null);
    setIsCreating(false);
    setError(null);
  };

  const getBrandById = (id: string | null) => {
    if (!id) return null;
    return brands.find((b) => b.id === id);
  };

  const getPartnerById = (id: string | null) => {
    if (!id) return null;
    return partners.find((p) => p.id === id);
  };

  // Filter modules by brand
  const filteredModules = (filterBrandId === "all"
    ? modules
    : modules.filter(module =>
        filterBrandId === "none"
          ? module.brandId === null
          : module.brandId === filterBrandId
      )
  ).sort((a, b) => {
    // Get brand names
    const brandA = getBrandById(a.brandId);
    const brandB = getBrandById(b.brandId);
    const brandNameA = brandA?.name || "";
    const brandNameB = brandB?.name || "";
    
    // Sort by brand name first
    const brandComparison = brandNameA.localeCompare(brandNameB, 'de', { sensitivity: 'base' });
    if (brandComparison !== 0) {
      return brandComparison;
    }
    
    // If same brand (or both no brand), sort by module title
    return a.title.localeCompare(b.title, 'de', { sensitivity: 'base' });
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Module werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="size-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {!editingModule && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl mb-2">Event-Module</h3>
            <p className="text-gray-600">
              Verwalten Sie wiederverwendbare Module für Ihre Events
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 size-4" />
            Neues Modul
          </Button>
        </div>
      )}

      {/* Filter UI */}
      {!editingModule && modules.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="size-5 text-gray-600" />
              <div className="flex-1">
                <Label className="text-sm text-gray-700 mb-1 block">
                  Nach Marke filtern
                </Label>
                <Select value={filterBrandId} onValueChange={setFilterBrandId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Alle Marken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Marken</SelectItem>
                    <SelectItem value="none">Keine Marke</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {filterBrandId !== "all" && (
                <p className="text-sm text-gray-600">
                  {filteredModules.length} von {modules.length} Modulen
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {editingModule ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? "Neues Modul erstellen" : "Modul bearbeiten"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interne Bezeichnung */}
            <div className="space-y-2">
              <Label>Interne Bezeichnung</Label>
              <Input
                type="text"
                value={editingModule.internalName}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, internalName: e.target.value })
                }
                placeholder="z.B. Modul-A, Workshop-01"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editingModule.status}
                onValueChange={(value) => setEditingModule({ ...editingModule, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marke */}
            <div className="space-y-2">
              <Label>Marke</Label>
              <Select
                value={editingModule.brandId || "none"}
                onValueChange={(value) =>
                  setEditingModule({
                    ...editingModule,
                    brandId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marke auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine Marke</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Partner */}
            <div className="space-y-2">
              <Label>Partner</Label>
              <Select
                value={editingModule.partnerId || "none"}
                onValueChange={(value) =>
                  setEditingModule({
                    ...editingModule,
                    partnerId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Partner auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kein Partner</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Titel */}
            <div className="space-y-2">
              <Label>Titel *</Label>
              <Input
                type="text"
                value={editingModule.title}
                onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                placeholder="z.B. Tauchgang mit Unterwasserdrohne"
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea
                value={editingModule.details}
                onChange={(e) => setEditingModule({ ...editingModule, details: e.target.value })}
                placeholder="Ausführliche Beschreibung des Moduls"
                rows={4}
              />
            </div>

            {/* Zeitpunkt */}
            <div className="space-y-2">
              <Label>Zeitpunkt</Label>
              <Select
                value={editingModule.timeType}
                onValueChange={(value: "daily" | "specific") =>
                  setEditingModule({ ...editingModule, timeType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Täglich</SelectItem>
                  <SelectItem value="specific">Datum und Uhrzeit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spezifisches Datum/Uhrzeit (wenn "specific" gewählt) */}
            {editingModule.timeType === "specific" && (
              <div className="space-y-2">
                <Label>Datum und Uhrzeit</Label>
                <Input
                  type="datetime-local"
                  value={editingModule.specificDateTime || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      specificDateTime: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Dauer */}
            <div className="space-y-2">
              <Label>Dauer</Label>
              <Select
                value={editingModule.durationType}
                onValueChange={(value: "event" | "custom") =>
                  setEditingModule({ ...editingModule, durationType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Siehe Eventdauer</SelectItem>
                  <SelectItem value="custom">Zeitangabe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Benutzerdefinierte Dauer (wenn "custom" gewählt) */}
            {editingModule.durationType === "custom" && (
              <div className="space-y-2">
                <Label>Zeitangabe</Label>
                <Input
                  type="text"
                  value={editingModule.customDuration || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      customDuration: e.target.value,
                    })
                  }
                  placeholder="z.B. 2 Stunden, 30 Minuten"
                />
              </div>
            )}

            {/* Max. Teilnehmerzahl */}
            <div className="space-y-2">
              <Label>Max. Teilnehmerzahl</Label>
              <Input
                type="number"
                value={editingModule.maxParticipants || ""}
                onChange={(e) =>
                  setEditingModule({
                    ...editingModule,
                    maxParticipants: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Leer lassen für unbegrenzt"
                min="1"
              />
            </div>

            {/* Anmeldung erforderlich */}
            <div className="space-y-2">
              <Label>Anmeldung erforderlich</Label>
              <Select
                value={editingModule.registrationRequired ? "yes" : "no"}
                onValueChange={(value) =>
                  setEditingModule({
                    ...editingModule,
                    registrationRequired: value === "yes",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Ja</SelectItem>
                  <SelectItem value="no">Nein</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Anmeldung URL */}
            <div className="space-y-2">
              <Label>Anmeldung URL</Label>
              <Input
                type="url"
                value={editingModule.registrationUrl}
                onChange={(e) =>
                  setEditingModule({
                    ...editingModule,
                    registrationUrl: e.target.value,
                  })
                }
                placeholder="https://beispiel.de/anmeldung"
              />
            </div>

            {/* Anmeldung E-Mail */}
            <div className="space-y-2">
              <Label>Anmeldung E-Mail</Label>
              <Input
                type="email"
                value={editingModule.registrationEmailAlt}
                onChange={(e) =>
                  setEditingModule({
                    ...editingModule,
                    registrationEmailAlt: e.target.value,
                  })
                }
                placeholder="anmeldung@beispiel.de"
              />
            </div>

            {/* Anmeldung Rufnummer */}
            <div className="space-y-2">
              <Label>Anmeldung Rufnummer</Label>
              <Input
                type="tel"
                value={editingModule.registrationPhone}
                onChange={(e) =>
                  setEditingModule({
                    ...editingModule,
                    registrationPhone: e.target.value,
                  })
                }
                placeholder="+49 123 456789"
              />
            </div>

            {/* Kosten */}
            <div className="space-y-2">
              <Label>Kosten</Label>
              <Input
                type="text"
                value={editingModule.cost}
                onChange={(e) => setEditingModule({ ...editingModule, cost: e.target.value })}
                placeholder="z.B. Kostenlos, 50 €, 20-30 €"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Speichern
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                <X className="mr-2 size-4" />
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredModules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Grid3x3 className="size-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl text-gray-600 mb-2">Keine Module vorhanden</h4>
            <p className="text-gray-500 mb-6">
              Erstellen Sie Ihr erstes Event-Modul
            </p>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 size-4" />
              Neues Modul erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredModules.map((module) => {
            const brand = getBrandById(module.brandId);
            const partner = getPartnerById(module.partnerId);
            const isInactive = module.status === "inactive";

            return (
              <Card key={module.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Brand Logo */}
                        {brand && brand.logo && (
                          <div className="w-20 h-8 flex items-center justify-center overflow-hidden">
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className={`w-full h-full object-contain ${
                                isInactive ? "grayscale opacity-60" : ""
                              }`}
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className={`text-xl mb-2 ${isInactive ? "text-gray-400" : ""}`}>
                            {module.title}
                          </h3>

                          {/* Interne Bezeichnung */}
                          {module.internalName && (
                            <p className={`text-sm mb-2 ${isInactive ? "text-gray-400" : "text-gray-500"}`}>
                              Intern: {module.internalName}
                            </p>
                          )}

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {/* Status Badge */}
                            <Badge
                              className={
                                module.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {module.status === "active" ? "Aktiv" : "Inaktiv"}
                            </Badge>

                            {brand && (
                              <Badge className={isInactive ? "bg-gray-100 text-gray-500" : "bg-purple-100 text-purple-800"}>
                                <Tag className="mr-1 size-3" />
                                {brand.name}
                              </Badge>
                            )}
                            {partner && (
                              <Badge className={isInactive ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-800"}>
                                <Handshake className="mr-1 size-3" />
                                {partner.name}
                              </Badge>
                            )}
                            {module.registrationRequired && (
                              <Badge className={isInactive ? "bg-gray-100 text-gray-500" : "bg-orange-100 text-orange-800"}>
                                <Mail className="mr-1 size-3" />
                                Anmeldung erforderlich
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      {module.details && (
                        <p className={`mb-3 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                          {module.details}
                        </p>
                      )}

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {/* Zeitpunkt */}
                        <div className={`flex items-center gap-2 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                          <Clock className="size-4" />
                          <span>
                            {module.timeType === "daily"
                              ? "Täglich"
                              : module.specificDateTime
                              ? new Date(module.specificDateTime).toLocaleString("de-DE")
                              : "Termin offen"}
                          </span>
                        </div>

                        {/* Dauer */}
                        <div className={`flex items-center gap-2 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                          <Clock className="size-4" />
                          <span>
                            {module.durationType === "event"
                              ? "Eventdauer"
                              : module.customDuration || "N/A"}
                          </span>
                        </div>

                        {/* Teilnehmer - nur anzeigen wenn gesetzt */}
                        {module.maxParticipants && module.maxParticipants > 0 && (
                          <div className={`flex items-center gap-2 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                            <Users className="size-4" />
                            <span>Max. {module.maxParticipants}</span>
                          </div>
                        )}

                        {/* Anmeldung - nur anzeigen wenn erforderlich */}
                        {module.registrationRequired && (
                          <div className={`flex items-center gap-2 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                            <Mail className="size-4" />
                            <span>Anmeldung erforderlich</span>
                          </div>
                        )}

                        {/* Kosten */}
                        {module.cost && (
                          <div className={`flex items-center gap-2 ${isInactive ? "text-gray-400" : "text-gray-600"}`}>
                            <Euro className="size-4" />
                            <span>{module.cost}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(module)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(module.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
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
    </div>
  );
}