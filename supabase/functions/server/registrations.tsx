import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { sendConfirmationEmail, sendAdminNotification, sendModuleRegistrationEmail, sendModuleRegistrationToOrganizer } from "./email.tsx";

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
  registrationEmailAlt?: string;
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
      registrationEmailAlt: body.registrationEmailAlt || "",
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

    // Helper function to delay execution (respects Resend rate limit of 2 requests/second)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Send emails sequentially with delays to avoid rate limiting (2 requests/second = 500ms between requests)
    (async () => {
      try {
        // Check if this is a module registration
        const isModuleRegistration = body.moduleId && body.moduleTitle;

        // 1. Send confirmation email to participant (only for non-module registrations)
        if (!isModuleRegistration) {
          const confirmationSuccess = await sendConfirmationEmail({
            to: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            eventTitle: body.eventTitle,
            eventBeginDate: body.eventBeginDate || "",
            eventEndDate: body.eventEndDate || "",
            eventCity: body.eventCity || "",
            eventCountry: body.eventCountry || "",
            registrationId,
            preferredDate: body.preferredDate,
            preferredTime: body.preferredTime,
          });
          
          if (confirmationSuccess) {
            console.log(`✅ Confirmation email sent to ${body.email}`);
          } else {
            console.warn(`⚠️ Failed to send confirmation email to ${body.email}`);
          }

          // Wait 600ms before next email (safely below 2 requests/second)
          await delay(600);
        }

        // 2. Send notification email to admin
        const adminSuccess = await sendAdminNotification({
          registration: fullRegistration,
          event: {
            id: body.eventId,
            title: body.eventTitle,
            date: body.eventDate || "",
            city: body.eventCity || "",
            country: body.eventCountry || "",
          },
        });
        
        if (adminSuccess) {
          console.log(`✅ Admin notification sent for registration ${registrationId}`);
        } else {
          console.warn(`⚠️ Failed to send admin notification for registration ${registrationId}`);
        }

        // 3. Send module registration emails if applicable
        if (isModuleRegistration) {
          // Wait 600ms before next email
          await delay(600);

          const moduleSuccess = await sendModuleRegistrationEmail({
            to: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            moduleTitle: body.moduleTitle,
            eventTitle: body.eventTitle,
            eventBeginDate: body.eventBeginDate || "",
            eventEndDate: body.eventEndDate || "",
            eventCity: body.eventCity || "",
            eventCountry: body.eventCountry || "",
            registrationId,
            preferredDate: body.preferredDate,
            preferredTime: body.preferredTime,
          });
          
          if (moduleSuccess) {
            console.log(`✅ Module registration email sent to ${body.email}`);
          } else {
            console.warn(`⚠️ Failed to send module registration email to ${body.email}`);
          }

          // 4. Send module registration email to organizer if specified
          if (body.registrationEmailAlt) {
            // Wait 600ms before next email
            await delay(600);

            const organizerSuccess = await sendModuleRegistrationToOrganizer({
              to: body.registrationEmailAlt,
              firstName: body.firstName,
              lastName: body.lastName,
              moduleTitle: body.moduleTitle,
              eventTitle: body.eventTitle,
              eventBeginDate: body.eventBeginDate || "",
              eventEndDate: body.eventEndDate || "",
              eventCity: body.eventCity || "",
              eventCountry: body.eventCountry || "",
              registrationId,
              preferredDate: body.preferredDate,
              preferredTime: body.preferredTime,
              phone: body.phone,
              organization: body.organization,
              message: body.message,
              participantEmail: body.email,
            });
            
            if (organizerSuccess) {
              console.log(`✅ Module registration email sent to organizer ${body.registrationEmailAlt}`);
            } else {
              console.warn(`⚠️ Failed to send module registration email to organizer ${body.registrationEmailAlt}`);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error in email sending sequence: ${error}`);
      }
    })();

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