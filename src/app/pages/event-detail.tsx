import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ExternalLink,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Tag,
  Grid3x3,
  Globe,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ModuleRegistrationDialog } from "@/app/components/module-registration-dialog";
import { isEventFinished, isEventToday, isEventSoon } from "@/app/utils/date-helpers";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { Event } from "@/app/data/events";
import type { EventModule } from "@/app/components/admin-event-module-management";
import type { Brand } from "@/app/components/admin-brand-management";
import type { Partner } from "@/app/components/admin-partner-management";

export function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<EventModule[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);

  // Fetch event from backend
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Fetch from backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.event) {
            console.log("✅ Event loaded from backend:", data.event.title);
            setEvent(data.event);
          } else {
            setError("Event nicht gefunden");
          }
        } else {
          setError("Event nicht gefunden");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Event konnte nicht geladen werden");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch modules, brands, and partners for the event
  useEffect(() => {
    const fetchModulesAndRelations = async () => {
      if (!event || !event.moduleIds || event.moduleIds.length === 0) {
        console.log("ℹ️ No modules assigned to this event");
        setModules([]);
        return;
      }

      console.log("📦 Fetching modules for event:", event.title);
      console.log("📋 Module IDs:", event.moduleIds);
      setIsLoadingModules(true);
      
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

        // Fetch all brands
        const brandsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/brands`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        // Fetch all partners
        const partnersResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/partners`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (modulesResponse.ok && brandsResponse.ok && partnersResponse.ok) {
          const modulesData = await modulesResponse.json();
          const brandsData = await brandsResponse.json();
          const partnersData = await partnersResponse.json();

          console.log("✅ Total modules fetched:", modulesData.modules?.length || 0);
          console.log("✅ Total brands fetched:", brandsData.brands?.length || 0);
          console.log("✅ Total partners fetched:", partnersData.partners?.length || 0);

          setBrands(brandsData.brands || []);
          setPartners(partnersData.partners || []);

          // Filter modules that belong to this event and are active
          const eventModules = (modulesData.modules || []).filter(
            (module: EventModule) =>
              event.moduleIds?.includes(module.id) && module.status === "active"
          );

          console.log("✅ Active modules for this event:", eventModules.length);

          // Sort by brand name and then by module title
          const sortedModules = eventModules.sort((a: EventModule, b: EventModule) => {
            const brandA = brandsData.brands?.find((brand: Brand) => brand.id === a.brandId)?.name || "";
            const brandB = brandsData.brands?.find((brand: Brand) => brand.id === b.brandId)?.name || "";
            
            if (brandA !== brandB) {
              return brandA.localeCompare(brandB);
            }
            return a.title.localeCompare(b.title);
          });

          setModules(sortedModules);
          console.log("✅ Event modules loaded and sorted:", sortedModules.length);
        } else {
          console.error("❌ Failed to fetch data:", {
            modulesOk: modulesResponse.ok,
            brandsOk: brandsResponse.ok,
            partnersOk: partnersResponse.ok,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching modules:", err);
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModulesAndRelations();
  }, [event]);

  // Helper function to get brand name
  const getBrandName = (brandId: string | null): string => {
    if (!brandId) return "";
    const brand = brands.find((b) => b.id === brandId);
    return brand?.name || "";
  };

  // Helper function to get partner name
  const getPartnerName = (partnerId: string | null): string => {
    if (!partnerId) return "";
    const partner = partners.find((p) => p.id === partnerId);
    return partner?.name || "";
  };

  // Helper function to get partner details
  const getPartner = (partnerId: string | null): Partner | null => {
    if (!partnerId) return null;
    return partners.find((p) => p.id === partnerId) || null;
  };

  // Helper function to get brand logo
  const getBrandLogo = (brandId: string | null): string | null => {
    if (!brandId) return null;
    const brand = brands.find((b) => b.id === brandId);
    return brand?.logo || null;
  };

  // Helper function to check if module date is in the past
  const isModuleDatePast = (module: EventModule): boolean => {
    // If module is daily, it's never considered past based on module date
    if (module.timeType === "daily") {
      return false;
    }
    
    // If module has a specific date/time, check if it's in the past
    if (module.specificDateTime) {
      try {
        // Parse the date string - assuming format like "DD.MM.YYYY HH:MM"
        const dateMatch = module.specificDateTime.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
        if (dateMatch) {
          const [, day, month, year, hours, minutes] = dateMatch;
          const moduleDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
          );
          const now = new Date();
          return moduleDate < now;
        }
      } catch (e) {
        console.error("Error parsing module date:", e);
      }
    }
    
    // If no specific date/time, don't consider it past
    return false;
  };

  // Helper function to check if registration should be shown
  const shouldShowRegistration = (module: EventModule): boolean => {
    // Don't show if registration is not required
    if (module.registrationRequired !== true) {
      return false;
    }
    
    // Don't show if event is finished
    if (isFinished) {
      return false;
    }
    
    // Don't show if module date is in the past
    if (isModuleDatePast(module)) {
      return false;
    }
    
    return true;
  };

  // Get unique brands from modules
  const getUniqueBrands = (): Brand[] => {
    const uniqueBrandIds = Array.from(new Set(modules.map((m) => m.brandId).filter(Boolean)));
    return uniqueBrandIds
      .map((brandId) => brands.find((b) => b.id === brandId))
      .filter((brand): brand is Brand => brand !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  };

  // Filter modules based on selected brand
  const filteredModules = selectedBrandFilter
    ? modules.filter((module) => module.brandId === selectedBrandFilter)
    : modules;

  const uniqueBrands = getUniqueBrands();

  // Format date range display
  const dateDisplay = event?.begin_date === event?.end_date 
    ? event?.begin_date 
    : `${event?.begin_date} - ${event?.end_date}`;
  
  // Format time range display
  const timeDisplay = `${event?.begin_time} - ${event?.end_time} Uhr`;

  // Check if event is finished
  const isFinished = event ? isEventFinished(event.end_date) : false;
  
  // Check event status
  const isToday = event ? isEventToday(event.begin_date) : false;
  const isSoon = event ? !isToday && isEventSoon(event.begin_date) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-10 mb-4 animate-spin" />
          <h1 className="text-4xl mb-4">
            Event wird geladen
          </h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-10 mb-4 text-red-500" />
          <h1 className="text-4xl mb-4">
            {error || "Event nicht gefunden"}
          </h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className={`w-full h-full object-cover ${isFinished ? 'grayscale' : ''}`}
        />
        
        {/* Event Status Labels */}
        {isToday && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
            Heute!
          </div>
        )}
        {isSoon && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
            Nicht verpassen!
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link to="/">
              <Button
                variant="outline"
                className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 size-4" />
                Zurück zur Übersicht
              </Button>
            </Link>
            <h1 className="text-5xl text-white mb-2">
              {event.title}
            </h1>
            <p className="text-xl text-white/90">
              {event.city}, {event.country}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h2 className={`text-3xl ${isFinished ? 'text-gray-500' : ''}`}>
                  Über dieses Event
                </h2>
              </CardHeader>
              <CardContent>
                <p className={`text-lg leading-relaxed ${
                  isFinished ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {event.longDescription || event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Modules Section */}
            {isLoadingModules && (
              <Card className="shadow-lg">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="size-6 animate-spin" />
                    <p className="text-gray-600">Module werden geladen...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoadingModules && modules.length > 0 && (
              <div className="space-y-4">
                <h2 className={`text-3xl ${isFinished ? 'text-gray-500' : ''}`}>
                  Programm nach Marken (alphabetisch)
                </h2>
                
                {/* Brand Filter - Only show if more than 1 brand */}
                {uniqueBrands.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedBrandFilter === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBrandFilter(null)}
                      className={selectedBrandFilter === null ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                    >
                      Alle ({modules.length})
                    </Button>
                    {uniqueBrands.map((brand) => {
                      const brandModuleCount = modules.filter((m) => m.brandId === brand.id).length;
                      return (
                        <Button
                          key={brand.id}
                          variant={selectedBrandFilter === brand.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedBrandFilter(brand.id)}
                          className={selectedBrandFilter === brand.id ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                        >
                          <Tag className="size-3 mr-1" />
                          {brand.name} ({brandModuleCount})
                        </Button>
                      );
                    })}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  {filteredModules.map((module) => {
                    const brandName = getBrandName(module.brandId);
                    const brandLogo = getBrandLogo(module.brandId);
                    const partner = getPartner(module.partnerId);
                    
                    return (
                      <Card key={module.id} className={`shadow-md hover:shadow-lg transition-shadow ${isFinished ? 'opacity-60' : ''}`}>
                        <CardHeader>
                          <div className="space-y-3">
                            {/* Invisible Table: Brand Logo (left) and Brand Name (right) */}
                            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                              {/* Left Column: Brand Logo */}
                              {brandLogo && (
                                <div className="w-32">
                                  <ImageWithFallback
                                    src={brandLogo}
                                    alt={brandName}
                                    className="w-full h-auto object-contain object-left"
                                    style={{ aspectRatio: '3 / 1' }}
                                  />
                                </div>
                              )}
                              
                              {/* Right Column: Brand Name */}
                              <div>
                                <h3 className={`text-2xl font-bold ${isFinished ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {brandName}
                                </h3>
                              </div>
                            </div>
                            
                            {/* Module Title */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className={`text-xl font-semibold mb-2 ${isFinished ? 'text-gray-500' : ''}`}>
                                  {module.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {module.details && (
                            <p className={`${isFinished ? 'text-gray-500' : 'text-gray-700'}`}>
                              {module.details}
                            </p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                            {/* Time Information */}
                            <div className="flex items-start gap-2">
                              <Clock className={`size-4 mt-0.5 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`} />
                              <div>
                                <p className={`text-xs ${isFinished ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Zeit
                                </p>
                                <p className={`text-sm font-medium ${isFinished ? 'text-gray-500' : ''}`}>
                                  {module.timeType === "daily" ? "Täglich" : module.specificDateTime || "Zeitpunkt noch offen"}
                                </p>
                              </div>
                            </div>

                            {/* Duration Information */}
                            <div className="flex items-start gap-2">
                              <Clock className={`size-4 mt-0.5 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`} />
                              <div>
                                <p className={`text-xs ${isFinished ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Dauer
                                </p>
                                <p className={`text-sm font-medium ${isFinished ? 'text-gray-500' : ''}`}>
                                  {module.durationType === "event" ? "Ganzes Event" : module.customDuration || "Noch festzulegen"}
                                </p>
                              </div>
                            </div>

                            {/* Max Participants */}
                            {module.maxParticipants && module.maxParticipants > 0 && (
                              <div className="flex items-start gap-2">
                                <Users className={`size-4 mt-0.5 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`} />
                                <div>
                                  <p className={`text-xs ${isFinished ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Max. Teilnehmer (wenn dieses Modul täglich angeboten wird, dann pro Tag)
                                  </p>
                                  <p className={`text-sm font-medium ${isFinished ? 'text-gray-500' : ''}`}>
                                    {module.maxParticipants}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Cost */}
                            {module.cost && module.cost.trim() !== '' && (
                              <div className="flex items-start gap-2">
                                <span className={`text-sm mt-0.5 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`}>€</span>
                                <div>
                                  <p className={`text-xs ${isFinished ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Kosten
                                  </p>
                                  <p className={`text-sm font-medium ${isFinished ? 'text-gray-500' : ''}`}>
                                    {module.cost}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Registration Information */}
                          {shouldShowRegistration(module) && (
                            <div className={`pt-3 border-t ${isFinished ? 'bg-gray-50' : 'bg-orange-50'} -mx-6 px-6 py-3`}>
                              <p className={`text-sm font-semibold mb-2 ${isFinished ? 'text-gray-500' : 'text-orange-700'}`}>
                                Anmeldung erforderlich
                              </p>
                              <div className="space-y-2">
                                {/* Registration Button */}
                                <ModuleRegistrationDialog
                                  module={module}
                                  event={event}
                                  isFinished={isFinished}
                                />
                                
                                {/* Registration Phone */}
                                {module.registrationPhone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className={`size-3 ${isFinished ? 'text-gray-400' : 'text-orange-600'}`} />
                                    <a
                                      href={`tel:${module.registrationPhone}`}
                                      className={`hover:underline ${isFinished ? 'text-gray-500' : 'text-orange-600'}`}
                                    >
                                      {module.registrationPhone}
                                    </a>
                                  </div>
                                )}
                                
                                {/* Registration URL */}
                                {module.registrationUrl && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <ExternalLink className={`size-3 ${isFinished ? 'text-gray-400' : 'text-orange-600'}`} />
                                    <a
                                      href={module.registrationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`hover:underline ${isFinished ? 'text-gray-500' : 'text-orange-600'}`}
                                    >
                                      Online anmelden
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Partner / Responsible Information */}
                          {partner && (
                            <div className={`pt-3 border-t ${isFinished ? 'bg-gray-50' : 'bg-gray-50'} -mx-6 px-6 py-3 ${!module.registrationRequired ? '-mb-6 rounded-b-lg' : ''}`}>
                              <p className={`text-sm font-semibold mb-2 ${isFinished ? 'text-gray-500' : 'text-gray-700'}`}>
                                Verantwortlich:
                              </p>
                              
                              {/* Invisible Table Layout */}
                              <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                                {/* Column 1: Partner Logo */}
                                {partner.logo && (
                                  <div className="w-24">
                                    <ImageWithFallback
                                      src={partner.logo}
                                      alt={partner.name}
                                      className="w-full h-auto object-contain object-left"
                                      style={{ aspectRatio: '3 / 1' }}
                                    />
                                  </div>
                                )}
                                
                                {/* Column 2: Partner Name, Email, URL */}
                                <div className="space-y-2">
                                  {/* Partner Name */}
                                  {partner.name && (
                                    <p className={`text-sm font-medium ${isFinished ? 'text-gray-500' : 'text-gray-900'}`}>
                                      {partner.name}
                                    </p>
                                  )}
                                  
                                  {/* Partner Contact Info */}
                                  <div className="space-y-1 text-sm">
                                    {partner.email && partner.email.trim() !== '' && (
                                      <div className="flex items-center gap-2">
                                        <Mail className={`size-3 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`} />
                                        <a
                                          href={`mailto:${partner.email}?subject=${encodeURIComponent(`Frage zum Event ${event.title}`)}`}
                                          className={`hover:underline ${isFinished ? 'text-gray-500' : 'text-gray-700'}`}
                                        >
                                          {partner.email}
                                        </a>
                                      </div>
                                    )}
                                    {partner.url && partner.url.trim() !== '' && (
                                      <div className="flex items-center gap-2">
                                        <Globe className={`size-3 ${isFinished ? 'text-gray-400' : 'text-gray-600'}`} />
                                        <a
                                          href={partner.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`hover:underline ${isFinished ? 'text-gray-500' : 'text-gray-700'}`}
                                        >
                                          {partner.url}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <h2 className={`text-2xl ${isFinished ? 'text-gray-500' : ''}`}>
                  Event-Details
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {(event.begin_date || event.end_date) && (
                  <div className="flex items-start gap-3">
                    <Calendar className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Datum
                      </p>
                      <p className={`text-lg font-semibold ${
                        isToday 
                          ? 'text-green-600' 
                          : isSoon 
                          ? 'text-orange-600' 
                          : isFinished
                          ? 'text-gray-500'
                          : ''
                      }`}>
                        {dateDisplay}
                      </p>
                    </div>
                  </div>
                )}

                {(event.begin_time || event.end_time) && (
                  <div className="flex items-start gap-3">
                    <Clock className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Uhrzeit
                      </p>
                      <p className={`text-lg ${
                        isFinished ? 'text-gray-500' : ''
                      }`}>
                        {timeDisplay}
                      </p>
                    </div>
                  </div>
                )}

                {(event.location || event.city || event.country) && (
                  <div className="flex items-start gap-3">
                    <MapPin className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Ort
                      </p>
                      {event.location && (
                        <p className={`text-lg ${
                          isFinished ? 'text-gray-500' : ''
                        }`}>
                          {event.location}
                        </p>
                      )}
                      {(event.city || event.country) && (
                        <p className={`${
                          isFinished ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {event.city}{event.city && event.country ? ', ' : ''}{event.country}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {event.location_URL && event.location_URL.trim() !== '' && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Website
                      </p>
                      <a
                        href={event.location_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-lg hover:underline break-all ${
                          isFinished ? 'text-gray-500' : 'text-blue-600 hover:text-blue-700'
                        }`}>
                        {event.location_URL}
                      </a>
                    </div>
                  </div>
                )}

                {event.location_email && event.location_email.trim() !== '' && (
                  <div className="flex items-start gap-3">
                    <Mail className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        E-Mail für allgemeine Rückfragen zum Event
                      </p>
                      <a
                        href={`mailto:${event.location_email}?subject=${encodeURIComponent(`Frage zum Event ${event.title}`)}`}
                        className={`text-lg hover:underline break-all ${
                          isFinished ? 'text-gray-500' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {event.location_email}
                      </a>
                    </div>
                  </div>
                )}

                {event.location_phone && event.location_phone.trim() !== '' && (
                  <div className="flex items-start gap-3">
                    <Phone className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Telefon
                      </p>
                      <a
                        href={`tel:${event.location_phone}`}
                        className={`text-lg hover:underline ${
                          isFinished ? 'text-gray-500' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {event.location_phone}
                      </a>
                    </div>
                  </div>
                )}

                {(event.attendees !== null && event.attendees !== undefined && event.attendees > 0) && (
                  <div className="flex items-start gap-3">
                    <Users className={`size-5 mt-1 ${
                      isFinished ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <p className={`text-sm ${
                        isFinished ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Max. Teilnehmer
                      </p>
                      <p className={`text-lg ${
                        isFinished ? 'text-gray-500' : ''
                      }`}>
                        {event.attendees} Teilnehmer
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {event.eventNote && event.eventNote.trim() !== '' && (
              <Card className={`shadow-lg ${
                isFinished 
                  ? 'bg-gray-50 border-gray-200' 
                  : event.status === 'confirmed' 
                  ? 'bg-orange-50 border-orange-400 border-2' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <CardContent className="pt-6">
                  <h3 className={`text-lg mb-2 font-semibold ${
                    isFinished 
                      ? 'text-gray-500' 
                      : event.status === 'confirmed' 
                      ? 'text-orange-600' 
                      : ''
                  }`}>
                    Hinweis
                  </h3>
                  <p className={`text-sm whitespace-pre-wrap ${
                    isFinished ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {event.eventNote}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}