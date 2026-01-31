import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Plus,
  X,
  Loader2,
  Grid3x3,
  Tag,
  Handshake,
  AlertCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { EventModule } from "@/app/components/admin-event-module-management";
import type { Brand } from "@/app/components/admin-brand-management";
import type { Partner } from "@/app/components/admin-partner-management";

interface EventModuleSelectorProps {
  selectedModuleIds: string[];
  onChange: (moduleIds: string[]) => void;
}

export function EventModuleSelector({
  selectedModuleIds,
  onChange,
}: EventModuleSelectorProps) {
  const [modules, setModules] = useState<EventModule[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingModule, setIsAddingModule] = useState(false);

  console.log("🔄 EventModuleSelector render - isAddingModule:", isAddingModule);

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

      console.log("✅ Module data loaded successfully");
    } catch (err) {
      console.error("Error fetching module data:", err);
      setError("Fehler beim Laden der Module");
    } finally {
      setIsLoading(false);
    }
  };

  const getBrandById = (id: string | null) => {
    if (!id) return null;
    return brands.find((b) => b.id === id);
  };

  const getPartnerById = (id: string | null) => {
    if (!id) return null;
    return partners.find((p) => p.id === id);
  };

  const handleAddModule = (moduleId: string) => {
    if (!selectedModuleIds.includes(moduleId)) {
      onChange([...selectedModuleIds, moduleId]);
    }
    setIsAddingModule(false);
  };

  const handleRemoveModule = (moduleId: string) => {
    onChange(selectedModuleIds.filter((id) => id !== moduleId));
  };

  // Sort modules alphabetically by brand name and partner name
  const sortedModules = [...modules].sort((a, b) => {
    const brandA = getBrandById(a.brandId);
    const brandB = getBrandById(b.brandId);
    const partnerA = getPartnerById(a.partnerId);
    const partnerB = getPartnerById(b.partnerId);

    // First sort by brand name
    const brandComparison = (brandA?.name || "zzz").localeCompare(brandB?.name || "zzz");
    if (brandComparison !== 0) return brandComparison;

    // Then sort by partner name
    return (partnerA?.name || "zzz").localeCompare(partnerB?.name || "zzz");
  });

  // Filter only active modules
  const activeModules = sortedModules.filter(module => module.status === "active");

  console.log("📦 All modules:", modules.length);
  console.log("✅ Active modules:", activeModules.length);
  console.log("🔢 Selected module IDs:", selectedModuleIds);

  // Get selected modules (only active ones)
  const selectedModules = activeModules.filter((module) =>
    selectedModuleIds.includes(module.id)
  );

  // Get available modules (active and not selected)
  const availableModules = activeModules.filter(
    (module) => !selectedModuleIds.includes(module.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
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
    <div className="space-y-4">
      {/* Selected Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Zugewiesene Module ({selectedModules.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("🖱️ Button clicked! Current state:", isAddingModule);
              setIsAddingModule(!isAddingModule);
              console.log("🔄 Setting isAddingModule to:", !isAddingModule);
            }}
          >
            <Plus className="size-4 mr-1" />
            Modul hinzufügen
          </Button>
        </div>

        {selectedModules.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Grid3x3 className="size-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Noch keine Module zugewiesen
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedModules.map((module) => {
              const brand = getBrandById(module.brandId);
              const partner = getPartnerById(module.partnerId);

              return (
                <div
                  key={module.id}
                  className="border rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {brand && brand.logo && (
                        <div className="w-16 h-6 flex items-center justify-center overflow-hidden">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h5 className="font-medium text-sm">{module.title}</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {brand && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Tag className="mr-1 size-3" />
                          {brand.name}
                        </Badge>
                      )}
                      {partner && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Handshake className="mr-1 size-3" />
                          {partner.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveModule(module.id)}
                    className="flex-shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Module Dropdown */}
      {isAddingModule && (
        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Verfügbare Module ({availableModules.length})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingModule(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {availableModules.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Alle Module sind bereits zugewiesen
            </p>
          ) : (
            <div className="space-y-2">
              {availableModules.map((module) => {
                const brand = getBrandById(module.brandId);
                const partner = getPartnerById(module.partnerId);

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => handleAddModule(module.id)}
                    className="w-full border rounded-lg p-3 hover:bg-white hover:border-blue-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {brand && brand.logo && (
                        <div className="w-16 h-6 flex items-center justify-center overflow-hidden">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h5 className="font-medium text-sm">{module.title}</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {brand && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          <Tag className="mr-1 size-3" />
                          {brand.name}
                        </Badge>
                      )}
                      {partner && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Handshake className="mr-1 size-3" />
                          {partner.name}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}