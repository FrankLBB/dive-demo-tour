import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Loader2,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Type,
  AlertCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface HomepageSettings {
  logo: string | null;
  headerTitle: string;
  headerSubtitle: string;
  backgroundImage: string | null;
  headerLogo: string | null;
}

export function AdminHomepageManagement() {
  const [settings, setSettings] = useState<HomepageSettings>({
    logo: null,
    headerTitle: "",
    headerSubtitle: "",
    backgroundImage: null,
    headerLogo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState(false);
  const [backgroundUploadProgress, setBackgroundUploadProgress] = useState(false);
  const [headerLogoUploadProgress, setHeaderLogoUploadProgress] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch homepage settings");
      }

      const data = await response.json();
      setSettings(data.settings);
      console.log("✅ Homepage settings loaded:", data.settings);
    } catch (err) {
      console.error("Error fetching homepage settings:", err);
      setError("Fehler beim Laden der Einstellungen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Maximal 5MB erlaubt.");
      return;
    }

    setLogoUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage/upload-logo`,
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
      console.log("✅ Logo uploaded:", data.imageUrl);

      setSettings((prev) => ({ ...prev, logo: data.imageUrl }));
      alert("Header-Hintergrundbild erfolgreich hochgeladen!");
    } catch (err) {
      console.error("Error uploading logo:", err);
      alert(`Fehler beim Hochladen: ${err.message}`);
    } finally {
      setLogoUploadProgress(false);
    }
  };

  const handleBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Maximal 10MB erlaubt.");
      return;
    }

    setBackgroundUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage/upload-background`,
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
        throw new Error(errorData.error || "Failed to upload background image");
      }

      const data = await response.json();
      console.log("✅ Background image uploaded:", data.imageUrl);

      setSettings((prev) => ({ ...prev, backgroundImage: data.imageUrl }));
      alert("Seiten-Hintergrundbild erfolgreich hochgeladen!");
    } catch (err) {
      console.error("Error uploading background image:", err);
      alert(`Fehler beim Hochladen: ${err.message}`);
    } finally {
      setBackgroundUploadProgress(false);
    }
  };

  const handleHeaderLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Maximal 5MB erlaubt.");
      return;
    }

    setHeaderLogoUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage/upload-header-logo`,
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
        throw new Error(errorData.error || "Failed to upload header logo");
      }

      const data = await response.json();
      console.log("✅ Header logo uploaded:", data.imageUrl);

      setSettings((prev) => ({ ...prev, headerLogo: data.imageUrl }));
      alert("Header-Logo erfolgreich hochgeladen!");
    } catch (err) {
      console.error("Error uploading header logo:", err);
      alert(`Fehler beim Hochladen: ${err.message}`);
    } finally {
      setHeaderLogoUploadProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("📤 Submitting homepage settings:", settings);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update settings");
      }

      console.log("✅ Homepage settings updated successfully");
      alert("Einstellungen erfolgreich gespeichert!");
    } catch (err) {
      console.error("Error updating homepage settings:", err);
      alert(`Fehler beim Speichern: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchSettings} className="mt-4">
              Erneut versuchen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <ImageIcon className="size-8 text-blue-600" />
          <div>
            <h3 className="text-2xl">Startseiten-Einstellungen</h3>
            <p className="text-sm text-gray-600">
              Logo, Header-Text und Hintergrundbild verwalten
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="size-5" />
              Header-Hintergrundbild
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Header-Hintergrundbild hochladen
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={logoUploadProgress}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {logoUploadProgress ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      <span>
                        {logoUploadProgress ? "Hochladen..." : "Bild auswählen"}
                      </span>
                    </div>
                  </label>
                  {settings.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, logo: null }))
                      }
                    >
                      <X className="size-4 mr-1" />
                      Entfernen
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Empfohlen: Hochauflösendes Bild im Querformat, max. 5MB
                </p>
              </div>

              {settings.logo && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-2">Vorschau:</p>
                  <img
                    src={settings.logo}
                    alt="Header-Hintergrundbild"
                    className="w-full max-w-2xl h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Header Text */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Type className="size-5" />
              Header-Text
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Haupttitel *
                </label>
                <Input
                  value={settings.headerTitle}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      headerTitle: e.target.value,
                    }))
                  }
                  required
                  placeholder="z.B. DIVE DEMO TOUR"
                  className="text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Untertitel *
                </label>
                <Input
                  value={settings.headerSubtitle}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      headerSubtitle: e.target.value,
                    }))
                  }
                  required
                  placeholder="z.B. Test-Events für Taucher"
                />
              </div>
            </div>
          </div>

          {/* Background Image Upload */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="size-5" />
              Seiten-Hintergrundbild
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Seiten-Hintergrundbild hochladen (für Event-Termine-Bereich)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                      disabled={backgroundUploadProgress}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {backgroundUploadProgress ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      <span>
                        {backgroundUploadProgress
                          ? "Hochladen..."
                          : "Bild auswählen"}
                      </span>
                    </div>
                  </label>
                  {settings.backgroundImage && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          backgroundImage: null,
                        }))
                      }
                    >
                      <X className="size-4 mr-1" />
                      Entfernen
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hintergrundbild für den Event-Termine-Bereich. Empfohlen: Hochauflösendes Bild, max. 10MB
                </p>
              </div>

              {settings.backgroundImage && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-2">Vorschau:</p>
                  <img
                    src={settings.backgroundImage}
                    alt="Seiten-Hintergrundbild"
                    className="w-full max-w-2xl h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Header Logo Upload */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="size-5" />
              Header-Logo
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Header-Logo hochladen
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeaderLogoUpload}
                      className="hidden"
                      disabled={headerLogoUploadProgress}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {headerLogoUploadProgress ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      <span>
                        {headerLogoUploadProgress ? "Hochladen..." : "Bild auswählen"}
                      </span>
                    </div>
                  </label>
                  {settings.headerLogo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, headerLogo: null }))
                      }
                    >
                      <X className="size-4 mr-1" />
                      Entfernen
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Empfohlen: Hochauflösendes Bild, max. 5MB
                </p>
              </div>

              {settings.headerLogo && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-2">Vorschau:</p>
                  <img
                    src={settings.headerLogo}
                    alt="Header-Logo"
                    className="w-full max-w-2xl h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Einstellungen speichern
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}