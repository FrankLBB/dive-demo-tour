import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { EventModule } from "@/app/components/admin-event-module-management";
import type { Event } from "@/app/data/events";

interface ModuleRegistrationDialogProps {
  module: EventModule;
  event: Event;
  isFinished: boolean;
}

export function ModuleRegistrationDialog({
  module,
  event,
  isFinished,
}: ModuleRegistrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
    preferredDate: event.begin_date || "",
    preferredTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventCity: event.city,
            eventCountry: event.country,
            moduleId: module.id,
            moduleTitle: module.title,
            registrationEmail: module.registrationEmail,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Anmeldung fehlgeschlagen");
      }

      const result = await response.json();
      console.log("✅ Module registration successful:", result);

      setIsSuccess(true);
      
      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          organization: "",
          message: "",
          preferredDate: event.begin_date || "",
          preferredTime: "",
        });
        setIsSuccess(false);
        setOpen(false);
      }, 2000);
    } catch (err) {
      console.error("❌ Module registration error:", err);
      setError(err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        message: "",
        preferredDate: event.begin_date || "",
        preferredTime: "",
      });
      setError(null);
      setIsSuccess(false);
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setOpen(true);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          disabled={isFinished}
        >
          Anmelden
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="size-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Anmeldung erfolgreich!</h3>
                <p className="text-gray-600">
                  Sie erhalten in Kürze eine Bestätigungs-E-Mail.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Anmeldung zum Event-Modul</DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm space-y-1 pt-2">
                  <div className="font-semibold text-gray-900">{module.title}</div>
                  <div className="text-gray-600">
                    {event.title} • {event.date}
                  </div>
                  <div className="text-gray-600">
                    {event.city}, {event.country}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* First Name */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  Vorname <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                  placeholder="Max"
                />
              </div>

              {/* Last Name */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Nachname <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                  placeholder="Mustermann"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">
                  E-Mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                  placeholder="max.mustermann@example.com"
                />
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isSubmitting}
                  placeholder="+49 123 456789"
                />
              </div>

              {/* Organization */}
              <div className="grid gap-2">
                <Label htmlFor="organization">Organisation (optional)</Label>
                <Input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  disabled={isSubmitting}
                  placeholder="Firma / Verein"
                />
              </div>

              {/* Message */}
              <div className="grid gap-2">
                <Label htmlFor="message">Nachricht (optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  disabled={isSubmitting}
                  placeholder="Ihre Nachricht oder Fragen..."
                  rows={3}
                />
              </div>

              {/* Preferred Date */}
              <div className="grid gap-2">
                <Label htmlFor="preferredDate">
                  Wunschdatum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="text"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                  placeholder="DD.MM.YYYY"
                />
              </div>

              {/* Preferred Time */}
              <div className="grid gap-2">
                <Label htmlFor="preferredTime">Wunschzeit (optional)</Label>
                <Input
                  id="preferredTime"
                  type="text"
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  disabled={isSubmitting}
                  placeholder="HH:MM"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isSubmitting ? "Wird gesendet..." : "Anmelden"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}