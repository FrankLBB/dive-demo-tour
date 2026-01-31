import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Tag, Loader2, Globe, Mail, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Brand } from "@/app/components/admin-brand-management";
import { PageHeader } from "@/app/components/page-header";

export function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        
        // Filter nur aktive Marken und sortiere alphabetisch (Backend macht schon alphabetische Sortierung)
        const activeBrands = data.brands.filter((brand: Brand) => brand.status === "active");
        
        console.log("✅ Aktive Marken geladen:", activeBrands.length);
        setBrands(activeBrands);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Fehler beim Laden der Marken");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Interessante Marken"
        subtitle="Hochwertige Produkte und Lösungen von führenden Herstellern"
      >
        <Link to="/">
          <Button
            variant="outline"
            className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 size-4" />
            Zurück zur Übersicht
          </Button>
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Wir streben stets danach, bei Events interessante und hochwertige Produkte zu präsentieren. Daher sind aktuell folgende Marken vertreten (in alphabetischer Reihenfolge):
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Marken werden geladen...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="size-5" />
                <p>{error}</p>
              </div>
            </div>
          ) : brands.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Tag className="size-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl text-gray-600 mb-2">Keine Marken verfügbar</h4>
                <p className="text-gray-500">
                  Aktuell sind keine Marken vorhanden. Schauen Sie später wieder vorbei.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand) => (
                <Card key={brand.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center">
                      {/* Logo */}
                      <div className="w-48 h-16 flex items-center justify-center mb-4 overflow-hidden p-2">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Tag className="size-16 text-gray-400" />
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-4xl text-black mb-2">{brand.name}</h3>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Kurzbeschreibung */}
                    <p className="text-gray-700 mb-4 text-center min-h-[60px]">
                      {brand.shortDescription}
                    </p>

                    {/* Details (falls vorhanden) */}
                    {brand.details && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{brand.details}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      {brand.url && (
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <Globe className="size-4" />
                          {brand.url}
                        </a>
                      )}
                      {brand.email && (
                        <a
                          href={`mailto:${brand.email}`}
                          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <Mail className="size-4" />
                          {brand.email}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 hover:underline text-lg">
              ← Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}