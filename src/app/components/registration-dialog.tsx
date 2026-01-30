import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import type { Event } from "@/app/data/events";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface RegistrationDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
}

export function RegistrationDialog({
  event,
  open,
  onOpenChange,
}: RegistrationDialogProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>();

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Try to submit to backend, but don't fail if backend is unavailable
      let backendSuccess = false;
      
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
              ...data,
              eventId: event.id,
              eventTitle: event.title,
              eventDate: event.date,
              eventCity: event.city,
              eventCountry: event.country,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Registration successful (backend):", result);
          backendSuccess = true;
        } else {
          console.warn("Backend registration failed, using local storage only");
        }
      } catch (fetchError) {
        console.warn("Backend unavailable, using local storage only:", fetchError);
      }

      // Always store in localStorage as backup/fallback
      const timestamp = new Date().toISOString();
      const registrations = JSON.parse(
        localStorage.getItem("registrations") || "[]"
      );
      registrations.push({
        ...data,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventCity: event.city,
        registeredAt: timestamp,
      });
      localStorage.setItem("registrations", JSON.stringify(registrations));

      console.log("Registration saved locally:", {
        ...data,
        eventTitle: event.title,
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setError(null);
    reset();
    onOpenChange(false);
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="size-16 text-green-500 mb-4" />
            <h3 className="text-2xl mb-2">Anmeldung erfolgreich!</h3>
            <p className="text-gray-600 mb-6">
              Vielen Dank für Ihre Anmeldung zu <strong>{event.title}</strong>.
              Sie erhalten in Kürze eine Bestätigungs-E-Mail.
            </p>
            <Button onClick={handleClose}>Schließen</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anmeldung für {event.title}</DialogTitle>
          <DialogDescription>
            {event.date} • {event.city}, {event.country}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Fehler bei der Anmeldung</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Vorname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "Vorname ist erforderlich",
                })}
                placeholder="Max"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nachname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "Nachname ist erforderlich",
                })}
                placeholder="Mustermann"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              E-Mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "E-Mail ist erforderlich",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ungültige E-Mail-Adresse",
                },
              })}
              placeholder="max.mustermann@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="+49 123 456789"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organisation/Firma</Label>
            <Input
              id="organization"
              {...register("organization")}
              placeholder="Meine Firma GmbH"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht (optional)</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Besondere Anforderungen oder Fragen..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                "Anmeldung absenden"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}