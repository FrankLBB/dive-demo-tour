import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { sendConfirmationEmail, sendAdminNotification, sendModuleRegistrationEmail } from "./email.tsx";

export const registrationsApp = new Hono();

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  eventId: string;
  eventTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  registrationEmail?: string;
}

// POST /make-server-281a395c/registrations - Create a new registration
registrationsApp.post("/", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.eventId) {
      return c.json(
        { error: "Missing required fields: firstName, lastName, email, eventId" },
        400
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(body.email)) {
      return c.json({ error: "Invalid email address" }, 400);
    }

    const registrationData: RegistrationData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || "",
      organization: body.organization || "",
      message: body.message || "",
      preferredDate: body.preferredDate || "",
      preferredTime: body.preferredTime || "",
      eventId: body.eventId,
      eventTitle: body.eventTitle,
      moduleId: body.moduleId || "",
      moduleTitle: body.moduleTitle || "",
      registrationEmail: body.registrationEmail || "",
    };

    const timestamp = new Date().toISOString();
    const registrationId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const key = `registration:${body.eventId}:${registrationId}`;

    const fullRegistration = {
      ...registrationData,
      registrationId,
      registeredAt: timestamp,
    };

    // Store registration with metadata
    await kv.set(key, fullRegistration);

    console.log(`Registration created successfully: ${key}`);

    // Send confirmation email to participant (non-blocking)
    sendConfirmationEmail({
      to: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      eventTitle: body.eventTitle,
      eventDate: body.eventDate || "",
      eventCity: body.eventCity || "",
      eventCountry: body.eventCountry || "",
      registrationId,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
    }).then((success) => {
      if (success) {
        console.log(`Confirmation email sent to ${body.email}`);
      } else {
        console.warn(`Failed to send confirmation email to ${body.email}`);
      }
    }).catch((error) => {
      console.error(`Error sending confirmation email: ${error}`);
    });

    // Send notification email to admin (non-blocking)
    sendAdminNotification({
      registration: fullRegistration,
      event: {
        id: body.eventId,
        title: body.eventTitle,
        date: body.eventDate || "",
        city: body.eventCity || "",
        country: body.eventCountry || "",
      },
    }).then((success) => {
      if (success) {
        console.log(`Admin notification sent for registration ${registrationId}`);
      } else {
        console.warn(`Failed to send admin notification for registration ${registrationId}`);
      }
    }).catch((error) => {
      console.error(`Error sending admin notification: ${error}`);
    });

    // Send module registration email (non-blocking)
    if (body.moduleId && body.moduleTitle) {
      sendModuleRegistrationEmail({
        to: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        moduleTitle: body.moduleTitle,
        eventTitle: body.eventTitle,
        eventDate: body.eventDate || "",
        eventCity: body.eventCity || "",
        eventCountry: body.eventCountry || "",
        registrationId,
        preferredDate: body.preferredDate,
        preferredTime: body.preferredTime,
      }).then((success) => {
        if (success) {
          console.log(`Module registration email sent to ${body.email}`);
        } else {
          console.warn(`Failed to send module registration email to ${body.email}`);
        }
      }).catch((error) => {
        console.error(`Error sending module registration email: ${error}`);
      });
    }

    return c.json({
      success: true,
      message: "Registration successful",
      registrationId,
      registeredAt: timestamp,
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    return c.json(
      { error: "Failed to create registration", details: String(error) },
      500
    );
  }
});

// GET /make-server-281a395c/registrations/:eventId - Get all registrations for an event
registrationsApp.get("/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const prefix = `registration:${eventId}:`;

    const registrations = await kv.getByPrefix(prefix);

    return c.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return c.json(
      { error: "Failed to fetch registrations", details: String(error) },
      500
    );
  }
});

// GET /make-server-281a395c/registrations - Get all registrations
registrationsApp.get("/", async (c) => {
  try {
    const prefix = "registration:";
    const allRegistrations = await kv.getByPrefix(prefix);

    return c.json({
      success: true,
      count: allRegistrations.length,
      registrations: allRegistrations,
    });
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    return c.json(
      { error: "Failed to fetch registrations", details: String(error) },
      500
    );
  }
});

// DELETE /make-server-281a395c/registrations/:eventId/:registrationId - Delete a registration
registrationsApp.delete("/:eventId/:registrationId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const registrationId = c.req.param("registrationId");
    const key = `registration:${eventId}:${registrationId}`;

    await kv.del(key);

    console.log(`Registration deleted successfully: ${key}`);

    return c.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return c.json(
      { error: "Failed to delete registration", details: String(error) },
      500
    );
  }
});