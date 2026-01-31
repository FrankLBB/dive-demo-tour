import { Header } from "@/app/components/header";
import { EventList } from "@/app/components/event-list";
import { Footer } from "@/app/components/footer";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface HomepageSettings {
  logo: string | null;
  headerTitle: string;
  headerSubtitle: string;
  backgroundImage: string | null;
  headerLogo: string | null;
}

export function Home() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);

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
      }
    } catch (err) {
      console.error("Error fetching homepage settings:", err);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: settings?.backgroundImage 
          ? `url('${settings.backgroundImage}')` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Optional overlay for better readability */}
      {settings?.backgroundImage && (
        <div className="fixed inset-0 bg-white/30 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        <Header />
        <EventList />
        <Footer />
      </div>
    </div>
  );
}