import { Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface HomepageSettings {
  logo: string | null;
  headerTitle: string;
  headerSubtitle: string;
  backgroundImage: string | null;
  headerLogo: string | null;
}

export function Header() {
  const [settings, setSettings] = useState<HomepageSettings>({
    logo: null,
    headerTitle: "DIVE DEMO TOUR",
    headerSubtitle: "Test-Events für Taucher",
    backgroundImage: null,
    headerLogo: null,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/homepage`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        console.log("✅ Header settings loaded:", data.settings);
      }
    } catch (err) {
      console.error("Error fetching homepage settings:", err);
      // Use default settings on error
    }
  };

  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden border-b-4 border-gray-900 shadow-lg">
      {/* Header Background Image */}
      {settings.logo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${settings.logo}')`,
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex items-start justify-between gap-8">
          {/* Left: Text Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-5xl font-bold drop-shadow-lg">{settings.headerTitle}</h1>
            </div>
            <p className="text-xl drop-shadow-md max-w-2xl">
              {settings.headerSubtitle}
            </p>
          </div>
          
          {/* Right: Header Logo */}
          {settings.headerLogo && (
            <div className="flex-shrink-0">
              <img
                src={settings.headerLogo}
                alt="Header Logo"
                className="h-24 w-auto object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}