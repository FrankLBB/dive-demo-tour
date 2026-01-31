import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Tag,
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
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  url: string;
  email: string;
  shortDescription: string;
  details: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface AdminBrandManagementProps {
  onBrandChange?: () => void;
}

export function AdminBrandManagement({ onBrandChange }: AdminBrandManagementProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [logoUploadProgress, setLogoUploadProgress] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    url: "",
    email: "",
    shortDescription: "",
    details: "",
    status: "active" as "active" | "inactive",
  });

  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();
      console.log("✅ Marken geladen:", data.brands.length);
      setBrands(data.brands || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Fehler beim Laden der Marken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      url: "",
      email: "",
      shortDescription: "",
      details: "",
      status: "active",
    });
    setEditingBrand(null);
  };

  const handleOpenDialog = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        logo: brand.logo,
        url: brand.url,
        email: brand.email,
        shortDescription: brand.shortDescription,
        details: brand.details,
        status: brand.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingBrand
        ? `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands/${editingBrand.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands`;

      const method = editingBrand ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save brand");
      }

      console.log(
        editingBrand
          ? "✅ Marke aktualisiert"
          : "✅ Neue Marke erstellt"
      );

      await fetchBrands();
      handleCloseDialog();
      onBrandChange?.();
    } catch (err) {
      console.error("Error saving brand:", err);
      alert("Fehler beim Speichern der Marke");
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
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }

      console.log("✅ Marke gelöscht");
      await fetchBrands();
      setDeleteConfirmId(null);
      onBrandChange?.();
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert("Fehler beim Löschen der Marke");
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    setLogoUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands/upload-logo`,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="size-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mit Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="size-8 text-blue-600" />
              <div>
                <h3 className="text-2xl">Marken-Verwaltung</h3>
                <p className="text-sm text-gray-600">
                  {brands.length} {brands.length === 1 ? "Marke" : "Marken"} vorhanden
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="size-5 mr-2" />
              Neue Marke
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Marken-Liste */}
      <div className="grid grid-cols-1 gap-4">
        {brands.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="size-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl text-gray-600 mb-2">Keine Marken vorhanden</h4>
              <p className="text-gray-500 mb-4">
                Erstellen Sie Ihre erste Marke, um zu beginnen
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-5 mr-2" />
                Erste Marke erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-60 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Tag className="size-10 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {brand.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge
                            variant={brand.status === "active" ? "default" : "secondary"}
                            className={
                              brand.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {brand.status === "active" ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(brand)}
                        >
                          <Edit className="size-4 mr-1" />
                          Bearbeiten
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                          className={
                            deleteConfirmId === brand.id
                              ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                              : ""
                          }
                        >
                          <Trash2 className="size-4 mr-1" />
                          {deleteConfirmId === brand.id ? "Bestätigen?" : "Löschen"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{brand.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {brand.url && (
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Globe className="size-4" />
                          Website
                        </a>
                      )}
                      {brand.email && (
                        <a
                          href={`mailto:${brand.email}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Mail className="size-4" />
                          {brand.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog/Modal für Erstellen/Bearbeiten */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl">
                  {editingBrand ? "Marke bearbeiten" : "Neue Marke erstellen"}
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
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Markenname */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Markenname *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="z.B. TechBrand GmbH"
                    required
                  />
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
                    Website URL *
                  </label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://www.example.com"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-Mail-Adresse *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="kontakt@example.com"
                    required
                  />
                </div>

                {/* Kurzbeschreibung */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kurzbeschreibung *
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    placeholder="Eine kurze Beschreibung der Marke..."
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Details
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    placeholder="Ausführliche Informationen zur Marke..."
                    rows={5}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Nur aktive Marken werden auf der Marken-Seite angezeigt
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Speichere...
                      </>
                    ) : (
                      <>
                        <Save className="size-5 mr-2" />
                        {editingBrand ? "Änderungen speichern" : "Marke erstellen"}
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