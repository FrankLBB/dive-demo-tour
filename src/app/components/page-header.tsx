import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface HomepageSettings {
  logo: string | null;
  headerLogo: string | null;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const [settings, setSettings] = useState<HomepageSettings>({
    logo: null,
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
        setSettings({
          logo: data.settings.logo,
          headerLogo: data.settings.headerLogo,
        });
      }
    } catch (err) {
      console.error("Error fetching homepage settings:", err);
    }
  };

  return (
    <header className="relative bg-white text-white overflow-hidden border-b-4 border-gray-900 shadow-lg">
      {/* Header Background Image */}
      {settings.logo && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${settings.logo}')`,
          }}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Optional back button or other content */}
        {children}
        
        <div className="flex items-start justify-between gap-8">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-5xl mb-4">{title}</h1>
            <p className="text-xl text-blue-50 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Right: Header Logo */}
          {settings.headerLogo && (
            <div className="flex-shrink-0">
              <img
                src={settings.headerLogo}
                alt="Header Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
