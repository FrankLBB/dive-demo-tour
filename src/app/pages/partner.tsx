import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Handshake, Loader2, Globe, Mail, AlertCircle, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Partner } from "@/app/components/admin-partner-management";
import { PageHeader } from "@/app/components/page-header";

export function Partner() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("Alle");

  useEffect(() => {
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
        
        // Filter nur aktive Partner (Backend macht schon alphabetische Sortierung)
        const activePartners = data.partners.filter((partner: Partner) => partner.status === "active");
        
        console.log("✅ Aktive Partner geladen:", activePartners.length);
        setPartners(activePartners);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError("Fehler beim Laden der Partner");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Mit Partnern unterwegs"
        subtitle="Gemeinsam für ein umfassendes Test-Erlebnis"
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
              Die DIVE TEMO TOUR hat zum Ziel, den Besuchern und Teilnehmern möglichst viele Produkte und kompetente Beratung an einem Ort zu bieten.
              Aus diesem Grund organisieren wir die Events in der Regel gemeinsam mit Partnern vor Ort und stellen das ausgestellte Produktsortiment entsprechend zusammen.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Partner werden geladen...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="size-5" />
                <p>{error}</p>
              </div>
            </div>
          ) : partners.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Handshake className="size-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl text-gray-600 mb-2">Keine Partner verfügbar</h4>
                <p className="text-gray-500">
                  Aktuell sind keine Partner vorhanden. Schauen Sie später wieder vorbei.
                </p>
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
                <div className="space-y-12">
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

                  {filteredTypes.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Handshake className="size-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-xl text-gray-600 mb-2">Keine Partner in dieser Kategorie</h4>
                        <p className="text-gray-500">
                          Bitte wählen Sie eine andere Kategorie aus.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTypes.map((type) => (
                      <div key={type} className="space-y-6">
                        {/* Zwischenüberschrift für Partner-Art (ohne Rahmen und Hintergrund) */}
                        <div className="text-center">
                          <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                            {type}
                          </h3>
                          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                        </div>

                        {/* Partner dieser Kategorie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedPartners[type].map((partner) => (
                            <Card key={partner.id} className="shadow-lg hover:shadow-xl transition-shadow">
                              <CardHeader>
                                <div className="flex flex-col items-center text-center">
                                  {/* Logo */}
                                  <div className="flex items-center justify-center mb-4 overflow-hidden p-2" style={{ minWidth: '90px', minHeight: '30px' }}>
                                    {partner.logo ? (
                                      <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="w-full h-full object-contain"
                                        style={{ minWidth: '90px', minHeight: '30px' }}
                                      />
                                    ) : (
                                      <Handshake className="size-16 text-gray-400" />
                                    )}
                                  </div>

                                  {/* Name */}
                                  <h3 className="text-4xl text-black mb-2">{partner.name}</h3>
                                </div>
                              </CardHeader>

                              <CardContent>
                                {/* Kurzbeschreibung */}
                                <p className="text-gray-700 mb-4 text-center min-h-[60px]">
                                  {partner.shortDescription}
                                </p>

                                {/* Adresse (unter Kurzbeschreibung) */}
                                {partner.address && (
                                  <div className="flex items-start gap-2 text-gray-600 text-sm mb-4">
                                    <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                                    <span className="whitespace-pre-line">{partner.address}</span>
                                  </div>
                                )}

                                {/* Details (falls vorhanden) */}
                                {partner.details && (
                                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{partner.details}</p>
                                  </div>
                                )}

                                {/* Kontaktinformationen */}
                                <div className="flex flex-col gap-2 pt-4 border-t">
                                  {partner.url && (
                                    <a
                                      href={partner.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline text-sm break-all"
                                    >
                                      <Globe className="size-4 flex-shrink-0" />
                                      <span>{partner.url.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                  )}
                                  {partner.email && (
                                    <a
                                      href={`mailto:${partner.email}`}
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline text-sm break-all"
                                    >
                                      <Mail className="size-4 flex-shrink-0" />
                                      <span>{partner.email}</span>
                                    </a>
                                  )}
                                  {partner.phone && (
                                    <a
                                      href={`tel:${partner.phone}`}
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline text-sm"
                                    >
                                      <Phone className="size-4 flex-shrink-0" />
                                      {partner.phone}
                                    </a>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })()
          )}

          {/* Info Box */}
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="text-2xl mb-3">Partner werden</h3>
            <p className="text-gray-700 mb-4">
              Sie interessieren sich dafür, als Partner (Hersteller, Dienstleister, gemeinnützige Organisation etc.) an der DIVE DEMO TOUR teilzunehmen?
            </p>
            <p className="text-gray-700">
              Kontaktieren Sie uns unter:{" "}
              <a href="mailto:partner@dive-demo-tour.eu" className="text-blue-600 hover:underline">
                info@dive-demo-tour.eu
              </a>
            </p>
          </div>

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