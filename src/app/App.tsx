import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/app/routes.tsx";
import { MaintenancePage } from "@/app/components/maintenance-page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Check maintenance mode
    const checkMaintenanceMode = () => {
      const maintenanceMode = localStorage.getItem("maintenanceMode") === "true";
      setIsMaintenanceMode(maintenanceMode);
    };

    // Initial checks
    checkMaintenanceMode();

    // Listen for storage changes (when admin toggles maintenance mode)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "maintenanceMode") {
        setIsMaintenanceMode(e.newValue === "true");
      }
    };

    // Listen for URL changes
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      // Reset bypass when navigating
      const adminSession = sessionStorage.getItem("adminSessionToken");
      if (!adminSession) {
        setBypassMaintenance(false);
      }
    };

    // Listen for custom session change event
    const handleSessionChange = () => {
      const adminSession = sessionStorage.getItem("adminSessionToken");
      if (!adminSession) {
        setBypassMaintenance(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("sessionchange", handleSessionChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("sessionchange", handleSessionChange);
    };
  }, []);

  // Check admin status directly from sessionStorage (not from state)
  // This ensures we always have the most current value
  const isAdmin = !!sessionStorage.getItem("adminSessionToken");

  // If maintenance mode is active and user is not bypassing
  // BUT allow access to /admin route so users can log in
  if (isMaintenanceMode && !bypassMaintenance && currentPath !== "/admin") {
    return (
      <MaintenancePage
        isAdmin={isAdmin}
        onAdminAccess={() => setBypassMaintenance(true)}
      />
    );
  }

  return <RouterProvider router={router} />;
}