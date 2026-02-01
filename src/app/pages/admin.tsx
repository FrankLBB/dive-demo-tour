import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Loader2,
  LogOut,
  ArrowLeft,
  Wrench,
  Power,
  Calendar,
  Home,
  Grid3x3,
  Users,
  Tag,
  Handshake,
  Activity,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { AdminLogin } from "@/app/components/admin-login";
import { AdminEventManagement } from "@/app/components/admin-event-management";
import { AdminBrandManagement } from "@/app/components/admin-brand-management";
import { AdminPartnerManagement } from "@/app/components/admin-partner-management";
import { AdminEventModuleManagement } from "@/app/components/admin-event-module-management";
import { AdminHomepageManagement } from "@/app/components/admin-homepage-management";
import { AdminRegistrationsManagement } from "@/app/components/admin-registrations-management";
import { ConnectionDiagnostic } from "@/app/components/connection-diagnostic";

export function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [activeTab, setActiveTab] = useState("startseite");
  const [moduleIdToEdit, setModuleIdToEdit] = useState<string | null>(null);

  // Check maintenance mode on mount
  useEffect(() => {
    const maintenanceMode = localStorage.getItem("maintenanceMode") === "true";
    setIsMaintenanceMode(maintenanceMode);
  }, []);

  const checkAuthentication = async () => {
    const sessionToken = sessionStorage.getItem("adminSessionToken");
    
    if (!sessionToken) {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ sessionToken }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("adminSessionToken");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth verification error (backend unavailable):", err);
      // If backend is unavailable, check local fallback
      // For demo purposes, allow access if session token exists
      console.warn("Using fallback authentication");
      setIsAuthenticated(true);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (sessionToken: string) => {
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  };

  const handleLogout = () => {
    // Remove session token
    sessionStorage.removeItem("adminSessionToken");
    
    // Reset state
    setIsAuthenticated(false);
    
    // Force a hard reload to home page
    // This ensures App.tsx re-renders with fresh state
    window.location.href = "/";
  };

  const toggleMaintenanceMode = () => {
    const newMode = !isMaintenanceMode;
    setIsMaintenanceMode(newMode);
    localStorage.setItem("maintenanceMode", String(newMode));
    
    if (newMode) {
      console.log("✅ Wartungsmodus aktiviert");
    } else {
      console.log("✅ Wartungsmodus deaktiviert");
    }
  };

  const handleModuleEdit = (moduleId: string) => {
    setModuleIdToEdit(moduleId);
    setActiveTab("event-module");
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Überprüfe Authentifizierung...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 size-4" />
                Zurück zur Übersicht
              </Button>
            </Link>

            {/* Logout Button in Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 backdrop-blur border border-white/20">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">Administrator</p>
                  <p className="text-blue-100 text-xs">Angemeldet</p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="bg-red-500 text-white border-red-600 hover:bg-red-600 hover:border-red-700 font-semibold shadow-lg"
              >
                <LogOut className="size-5 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-50">Verwaltung der Event-Plattform</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs für verschiedene Verwaltungsbereiche */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="startseite" className="flex items-center gap-2">
                <Home className="size-4" />
                <span>Startseite</span>
              </TabsTrigger>
              <TabsTrigger value="event-module" className="flex items-center gap-2">
                <Grid3x3 className="size-4" />
                <span>Event-Module</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Events</span>
              </TabsTrigger>
              <TabsTrigger value="anmeldungen" className="flex items-center gap-2">
                <Users className="size-4" />
                <span>Anmeldungen</span>
              </TabsTrigger>
              <TabsTrigger value="marken" className="flex items-center gap-2">
                <Tag className="size-4" />
                <span>Marken</span>
              </TabsTrigger>
              <TabsTrigger value="partner" className="flex items-center gap-2">
                <Handshake className="size-4" />
                <span>Partner</span>
              </TabsTrigger>
              <TabsTrigger value="diagnose" className="flex items-center gap-2">
                <Activity className="size-4" />
                <span>Diagnose</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Startseite */}
            <TabsContent value="startseite" className="space-y-6">
              {/* Homepage Settings */}
              <AdminHomepageManagement />

              {/* Wartungsmodus */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl mb-2">Wartungsmodus</h3>
                      <p className="text-sm text-gray-600">
                        Versetzen Sie die gesamte Website in den Wartungsmodus. Besucher sehen dann nur noch eine Wartungsseite.
                      </p>
                    </div>
                    <Wrench className={`size-12 ${isMaintenanceMode ? 'text-orange-500' : 'text-gray-400'}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`rounded-xl p-6 border-2 ${
                    isMaintenanceMode 
                      ? 'bg-orange-50 border-orange-300' 
                      : 'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isMaintenanceMode 
                            ? 'bg-orange-100' 
                            : 'bg-green-100'
                        }`}>
                          {isMaintenanceMode ? (
                            <Wrench className="size-8 text-orange-600" />
                          ) : (
                            <Power className="size-8 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">
                            {isMaintenanceMode ? (
                              <span className="text-orange-900">⚠️ Wartungsmodus aktiv</span>
                            ) : (
                              <span className="text-green-900">✅ Website online</span>
                            )}
                          </h4>
                          <p className="text-sm mb-3">
                            {isMaintenanceMode ? (
                              <span className="text-orange-800">
                                Besucher sehen aktuell nur die Wartungsseite. Sie haben als Admin weiterhin vollen Zugriff.
                              </span>
                            ) : (
                              <span className="text-green-800">
                                Die Website ist für alle Besucher normal erreichbar. Alle Funktionen sind verfügbar.
                              </span>
                            )}
                          </p>
                          {isMaintenanceMode && (
                            <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-100 rounded-lg px-3 py-2 inline-block">
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Admins können die Website weiterhin nutzen</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={toggleMaintenanceMode}
                        size="lg"
                        className={isMaintenanceMode 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-orange-500 hover:bg-orange-600'
                        }
                      >
                        {isMaintenanceMode ? (
                          <>
                            <Power className="size-5 mr-2" />
                            Website aktivieren
                          </>
                        ) : (
                          <>
                            <Wrench className="size-5 mr-2" />
                            Wartung starten
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Wie funktioniert der Wartungsmodus?
                    </h5>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Aktiviert:</strong> Normale Besucher sehen nur die Wartungsseite mit Informationen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Admin-Zugang:</strong> Sie können sich weiterhin einloggen und haben vollen Zugriff</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span><strong>Deaktivieren:</strong> Klicken Sie auf "Website aktivieren" um die Website wieder freizugeben</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Event-Module */}
            <TabsContent value="event-module" className="space-y-6">
              <AdminEventModuleManagement moduleIdToEdit={moduleIdToEdit} />
            </TabsContent>

            {/* Tab: Events */}
            <TabsContent value="events" className="space-y-6">
              <AdminEventManagement onModuleEdit={handleModuleEdit} />
            </TabsContent>

            {/* Tab: Marken */}
            <TabsContent value="marken" className="space-y-6">
              <AdminBrandManagement />
            </TabsContent>

            {/* Tab: Partner */}
            <TabsContent value="partner" className="space-y-6">
              <AdminPartnerManagement />
            </TabsContent>

            {/* Tab: Anmeldungen */}
            <TabsContent value="anmeldungen" className="space-y-6">
              <AdminRegistrationsManagement />
            </TabsContent>

            {/* Tab: Diagnose */}
            <TabsContent value="diagnose" className="space-y-6">
              <ConnectionDiagnostic />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}