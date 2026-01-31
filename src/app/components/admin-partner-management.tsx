import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  X,
  Save,
  Globe,
  Mail,
  Upload,
  Phone,
  MapPin,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export interface Partner {
  id: string;
  name: string;
  partnerType?: string;
  logo: string;
  url: string;
  email: string;
  address: string;
  phone: string;
  shortDescription: string;
  details: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface AdminPartnerManagementProps {
  onPartnerChange?: () => void;
}

export function AdminPartnerManagement({ onPartnerChange }: AdminPartnerManagementProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [logoUploadProgress, setLogoUploadProgress] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Alle");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    partnerType: "",
    logo: "",
    url: "",
    email: "",
    address: "",
    phone: "",
    shortDescription: "",
    details: "",
    status: "active" as "active" | "inactive",
  });

  const fetchPartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch partners");
      }

      const data = await response.json();
      console.log("✅ Partner geladen:", data.partners.length);
      setPartners(data.partners || []);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError("Fehler beim Laden der Partner");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        partnerType: partner.partnerType || "",
        logo: partner.logo,
        url: partner.url,
        email: partner.email,
        address: partner.address,
        phone: partner.phone,
        shortDescription: partner.shortDescription,
        details: partner.details,
        status: partner.status,
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: "",
        partnerType: "",
        logo: "",
        url: "",
        email: "",
        address: "",
        phone: "",
        shortDescription: "",
        details: "",
        status: "active",
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingPartner(null);
    setFormData({
      name: "",
      partnerType: "",
      logo: "",
      url: "",
      email: "",
      address: "",
      phone: "",
      shortDescription: "",
      details: "",
      status: "active",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingPartner
        ? `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners/${editingPartner.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners`;

      const method = editingPartner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save partner");
      }

      console.log(
        editingPartner
          ? "✅ Partner aktualisiert"
          : "✅ Partner erstellt"
      );

      await fetchPartners();
      handleCloseDialog();
      onPartnerChange?.();
    } catch (err) {
      console.error("Error saving partner:", err);
      alert("Fehler beim Speichern des Partners");
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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete partner");
      }

      console.log("✅ Partner gelöscht");
      await fetchPartners();
      setDeleteConfirmId(null);
      onPartnerChange?.();
    } catch (err) {
      console.error("Error deleting partner:", err);
      alert("Fehler beim Löschen des Partners");
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    setLogoUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners/upload-logo`,
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
        throw new Error(errorData.error || "Failed to upload logo");
      }

      const data = await response.json();
      console.log("✅ Logo hochgeladen:", data.logoUrl);
      
      setFormData((prev) => ({ ...prev, logo: data.logoUrl }));
      alert("Logo erfolgreich hochgeladen!");
    } catch (err: any) {
      console.error("Error uploading logo:", err);
      alert(`Fehler beim Hochladen: ${err.message}`);
    } finally {
      setLogoUploadProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="size-8 text-blue-600" />
                <h3 className="text-2xl">Partner-Verwaltung</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {partners.length} {partners.length === 1 ? "Partner" : "Partner"} vorhanden
              </p>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="size-4 mr-2" />
              Neuer Partner
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="size-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Partner werden geladen...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="size-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partner Liste */}
      <div className="space-y-6">
        {partners.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="size-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl text-gray-600 mb-2">Keine Partner vorhanden</h4>
              <p className="text-gray-500 mb-6">
                Erstellen Sie Ihren ersten Partner, um loszulegen.
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                Ersten Partner erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          (() => {
            // Sortiere Partner nach Typ und Name
            const sortedPartners = [...partners].sort((a, b) => {
              const typeA = a.partnerType || "Ohne Kategorie";
              const typeB = b.partnerType || "Ohne Kategorie";
              
              // Erst nach Typ sortieren
              if (typeA !== typeB) {
                return typeA.localeCompare(typeB, 'de');
              }
              
              // Dann nach Name sortieren
              return a.name.localeCompare(b.name, 'de');
            });

            // Gruppiere Partner nach Typ
            const groupedPartners = sortedPartners.reduce((acc, partner) => {
              const type = partner.partnerType || "Ohne Kategorie";
              if (!acc[type]) {
                acc[type] = [];
              }
              acc[type].push(partner);
              return acc;
            }, {} as Record<string, Partner[]>);

            // Sortiere die Typen alphabetisch
            const sortedTypes = Object.keys(groupedPartners).sort((a, b) => 
              a.localeCompare(b, 'de')
            );

            // Filtere die Typen basierend auf dem ausgewählten Filter
            const filteredTypes = selectedFilter === "Alle" 
              ? sortedTypes 
              : sortedTypes.filter(type => type === selectedFilter);

            return (
              <div className="space-y-6">
                {/* Filter-Option (nur anzeigen wenn mindestens 2 Partner-Arten vorhanden) */}
                {sortedTypes.length >= 2 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">
                          Partner filtern
                        </h4>
                        <p className="text-sm text-gray-600">
                          Wählen Sie eine Kategorie, um die Anzeige einzugrenzen
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedFilter === "Alle" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFilter("Alle")}
                          className={selectedFilter === "Alle" ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          Alle ({partners.length})
                        </Button>
                        {sortedTypes.map((type) => (
                          <Button
                            key={type}
                            variant={selectedFilter === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFilter(type)}
                            className={selectedFilter === type ? "bg-blue-600 hover:bg-blue-700" : ""}
                          >
                            {type} ({groupedPartners[type].length})
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {filteredTypes.map((type) => (
                  <div key={type} className="space-y-4">
                    {/* Zwischenüberschrift für Partner-Art */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 px-6 py-3 rounded-r-lg">
                      <h4 className="text-lg font-semibold text-blue-900">
                        {type}
                      </h4>
                      <p className="text-sm text-blue-700 mt-0.5">
                        {groupedPartners[type].length} {groupedPartners[type].length === 1 ? 'Partner' : 'Partner'}
                      </p>
                    </div>

                    {/* Partner dieser Kategorie */}
                    <div className="grid grid-cols-1 gap-4">
                      {groupedPartners[type].map((partner) => (
                        <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              {/* Logo */}
                              <div className="w-60 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                                {partner.logo ? (
                                  <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Users className="size-10 text-gray-400" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="text-xl text-blue-600 mb-1">
                                      {partner.name}
                                    </h4>
                                    <Badge
                                      className={
                                        partner.status === "active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {partner.status === "active" ? "Aktiv" : "Inaktiv"}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenDialog(partner)}
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={
                                        deleteConfirmId === partner.id
                                          ? "bg-red-50 border-red-300 text-red-600"
                                          : ""
                                      }
                                      onClick={() => handleDelete(partner.id)}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                </div>

                                <p className="text-gray-700 mb-3">{partner.shortDescription}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  {partner.email && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Mail className="size-4" />
                                      <span className="truncate">{partner.email}</span>
                                    </div>
                                  )}
                                  {partner.phone && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Phone className="size-4" />
                                      <span>{partner.phone}</span>
                                    </div>
                                  )}
                                  {partner.url && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Globe className="size-4" />
                                      <a
                                        href={partner.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate hover:text-blue-600 hover:underline"
                                      >
                                        {partner.url}
                                      </a>
                                    </div>
                                  )}
                                  {partner.address && (
                                    <div className="flex items-start gap-2 text-gray-600">
                                      <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                                      <span className="whitespace-pre-line">{partner.address}</span>
                                    </div>
                                  )}
                                </div>

                                {deleteConfirmId === partner.id && (
                                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                    <p className="text-sm text-red-800">
                                      ⚠️ Klicken Sie erneut auf "Löschen", um zu bestätigen
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl">
                  {editingPartner ? "Partner bearbeiten" : "Neuer Partner"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  <X className="size-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Partnername */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Partnername *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="z.B. Muster GmbH"
                    required
                  />
                </div>

                {/* Partner Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Art des Partners
                  </label>
                  <select
                    value={formData.partnerType}
                    onChange={(e) =>
                      setFormData({ ...formData, partnerType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="Dienstleister">Dienstleister</option>
                    <option value="Fachhändler">Fachhändler</option>
                    <option value="Hersteller">Hersteller</option>
                    <option value="Organisation">Organisation</option>
                    <option value="Tauchbasis">Tauchbasis</option>
                    <option value="Verein">Verein</option>
                  </select>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo *
                  </label>
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-2 mb-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                        className="hidden"
                        disabled={logoUploadProgress}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={logoUploadProgress}
                        onClick={(e) => {
                          e.preventDefault();
                          (e.currentTarget.parentElement as HTMLLabelElement)
                            ?.querySelector('input')
                            ?.click();
                        }}
                      >
                        {logoUploadProgress ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Lädt hoch...
                          </>
                        ) : (
                          <>
                            <Upload className="size-4 mr-2" />
                            Logo hochladen
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                  
                  {/* Manual URL Input */}
                  <div className="text-sm text-gray-600 mb-2 text-center">oder</div>
                  <Input
                    type="url"
                    value={formData.logo}
                    onChange={(e) =>
                      setFormData({ ...formData, logo: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                    required
                  />
                  
                  {/* Logo Preview */}
                  {formData.logo && (
                    <div className="mt-3 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-600 mb-2 text-center font-medium">Vorschau:</p>
                      <div className="w-48 h-16 mx-auto flex items-center justify-center p-2">
                        <img
                          src={formData.logo}
                          alt="Logo Vorschau"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    📝 Unterstützte Formate: JPEG, PNG, WebP, SVG (max. 5MB)
                  </p>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website-URL
                  </label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://www.beispiel.de"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email-Adresse
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="kontakt@beispiel.de"
                  />
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adresse
                  </label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Musterstraße 123, 12345 Musterstadt"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Rufnummer */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rufnummer
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+49 123 456789"
                  />
                </div>

                {/* Kurzbeschreibung */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kurzbeschreibung *
                  </label>
                  <Input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Kurze Beschreibung des Partners"
                    required
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Details
                  </label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    placeholder="Ausführliche Beschreibung des Partners..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={isSubmitting}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}