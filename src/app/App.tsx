import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/app/routes.tsx";
import { MaintenancePage } from "@/app/components/maintenance-page";

export default function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);

  useEffect(() => {
    // Check maintenance mode
    const maintenanceMode = localStorage.getItem("maintenanceMode") === "true";
    setIsMaintenanceMode(maintenanceMode);

    // Check if user is admin
    const adminSession = sessionStorage.getItem("adminSessionToken");
    setIsAdmin(!!adminSession);

    // Listen for storage changes (when admin toggles maintenance mode)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "maintenanceMode") {
        setIsMaintenanceMode(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // If maintenance mode is active and user is not bypassing
  if (isMaintenanceMode && !bypassMaintenance) {
    return (
      <MaintenancePage
        isAdmin={isAdmin}
        onAdminAccess={() => setBypassMaintenance(true)}
      />
    );
  }

  return <RouterProvider router={router} />;
}