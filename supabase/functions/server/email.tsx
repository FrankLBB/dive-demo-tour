interface ModuleEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  moduleTitle: string;
  eventTitle: string;
  eventBeginDate: string;
  eventEndDate: string;
  eventCity: string;
  eventCountry: string;
  registrationId: string;
  preferredDate?: string;
  preferredTime?: string;
}

interface EmailParams {
  to: string;
  firstName: string;
  lastName: string;
  eventTitle: string;
  eventBeginDate: string;
  eventEndDate: string;
  eventCity: string;
  eventCountry: string;
  registrationId: string;
  preferredDate?: string;
  preferredTime?: string;
}

interface AdminNotificationParams {
  registration: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    organization?: string;
    message?: string;
    registrationId: string;
    registeredAt: string;
  };
  event: {
    title: string;
    date: string;
    city: string;
    country: string;
    id: string;
  };
}

// Helper function to format date strings to DD.MM.YYYY
function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  // Try to parse the date string
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    // If the date string is already in DD.MM.YYYY format, return as is
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return dateString;
    }
    // Otherwise return the original string
    return dateString;
  }
  
  // Format as DD.MM.YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Helper function to check if Resend is in test mode (only allows sending to owner email)
function getResendOwnerEmail(): string | null {
  // In test mode, Resend only allows sending to the account owner's email
  // This should be configured in environment variables
  return Deno.env.get("RESEND_OWNER_EMAIL")?.trim() || null;
}

export async function sendConfirmationEmail(params: EmailParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();

  if (!apiKey || apiKey === "your-resend-api-key-here") {
    console.warn("⚠️ RESEND_API_KEY is not configured - skipping confirmation email");
    return false;
  }

  console.log("🔑 Using Resend API key:", apiKey.substring(0, 10) + "...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eingangsbestätigung - DIVE DEMO TOUR</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #06b6d4); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">DIVE DEMO TOUR</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">Test-Events für Tauch- und Wassersport</p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; text-align: center;">Anmeldung erfolgreich!</h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${params.firstName} ${params.lastName},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Ihre Anmeldung zur DIVE DEMO TOUR ist bei uns eingegangen und wird nun bearbeitet.
              </p>
              
              <!-- Event Details Box -->
              <table role="presentation" style="width: 100%; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Event-Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">
                          <strong>Event:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.eventTitle}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Datum:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Ort:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.eventCity}, ${params.eventCountry}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Bestätigungs-ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: monospace;">
                          ${params.registrationId}
                        </td>
                      </tr>
                      ${params.preferredDate ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Wunschdatum:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Eine Rückmeldung erhalten Sie in den kommenden Tagen per E-Mail.
              </p>
              
              <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Bei Fragen stehen wir Ihnen gerne zur Verfügung:
              </p>
              
              <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;">
                📧 E-Mail: <a href="mailto:info@dive-demo-tour.eu" style="color: #2563eb; text-decoration: none;">info@dive-demo-tour.eu</a>
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px;">
                🌐 Web: <a href="https://dive-demo-tour.eu" style="color: #2563eb; text-decoration: none;">dive-demo-tour.eu</a>
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://dive-demo-tour.eu" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #2563eb, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Zur Website
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Wir freuen uns auf Sie!<br>
                Ihr DIVE DEMO TOUR Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                DIVE DEMO TOUR 2026
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
DIVE DEMO TOUR - Eingangsbestätigung

Hallo ${params.firstName} ${params.lastName},

Ihre Anmeldung zur DIVE DEMO TOUR ist bei uns eingegangen und wird nun bearbeitet.

Event-Details:
- Event: ${params.eventTitle}
- Datum: ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)}
- Ort: ${params.eventCity}, ${params.eventCountry}
- Bestätigungs-ID: ${params.registrationId}
${params.preferredDate ? `Wunschdatum: ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}\n` : ""}

Eine Rückmeldung erhalten Sie in den kommenden Tagen per E-Mail.

Bei Fragen stehen wir Ihnen gerne zur Verfügung:
📧 E-Mail: info@dive-demo-tour.eu
🌐 Web: https://dive-demo-tour.eu

Wir freuen uns auf Sie!
Ihr DIVE DEMO TOUR Team

---
DIVE DEMO TOUR 2026
Diese E-Mail wurde automatisch generiert.
  `.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DIVE DEMO TOUR <onboarding@resend.dev>",
        to: params.to,
        subject: `Anmeldungsbestätigung - ${params.eventTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending email via Resend:", error);
      return false;
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendModuleRegistrationEmail(params: ModuleEmailParams): Promise<boolean> {
  return await sendModuleConfirmationEmail(params);
}

async function sendModuleConfirmationEmail(params: ModuleEmailParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();

  if (!apiKey || apiKey === "your-resend-api-key-here") {
    console.warn("⚠️ RESEND_API_KEY is not configured - skipping module confirmation email");
    return false;
  }

  console.log("🔑 Using Resend API key:", apiKey.substring(0, 10) + "...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Modul-Anmeldung - DIVE DEMO TOUR</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #ea580c, #f97316); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">DIVE DEMO TOUR</h1>
              <p style="margin: 10px 0 0 0; color: #fed7aa; font-size: 16px;">Modul-Anmeldungsbestätigung</p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; text-align: center;">Eingangsbestätigung!</h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${params.firstName} ${params.lastName},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Ihre Anmeldung ist bei uns eingegangen und wird nun bearbeitet.
              </p>
              
              <!-- Module Details Box -->
              <table role="presentation" style="width: 100%; background-color: #fff7ed; border-radius: 8px; border-left: 4px solid #ea580c; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #9a3412; font-size: 18px;">📦 Modul-Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">
                          <strong>Modul:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.moduleTitle}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Event:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.eventTitle}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Datum:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Ort:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.eventCity}, ${params.eventCountry}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Bestätigungs-ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: monospace;">
                          ${params.registrationId}
                        </td>
                      </tr>
                      ${params.preferredDate ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Wunschdatum:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Eine Rückmeldung erhalten Sie in den kommenden Tagen per E-Mail.
              </p>
              
              <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Bei Fragen stehen wir Ihnen gerne zur Verfügung:
              </p>
              
              <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;">
                📧 E-Mail: <a href="mailto:info@dive-demo-tour.eu" style="color: #ea580c; text-decoration: none;">info@dive-demo-tour.eu</a>
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px;">
                🌐 Web: <a href="https://dive-demo-tour.eu" style="color: #ea580c; text-decoration: none;">dive-demo-tour.eu</a>
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://dive-demo-tour.eu" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #ea580c, #f97316); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Zur Website
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Wir freuen uns auf Sie!<br>
                Ihr DIVE DEMO TOUR Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                DIVE DEMO TOUR 2026
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
DIVE DEMO TOUR - Eingangsbestätigung

Hallo ${params.firstName} ${params.lastName},

wir haben Ihre Anmeldung zum Event-Modul erhalten - diese wird nun bearbeitet.

Modul-Details:
- Modul: ${params.moduleTitle}
- Event: ${params.eventTitle}
- Datum: ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)}
- Ort: ${params.eventCity}, ${params.eventCountry}
- Bestätigungs-ID: ${params.registrationId}
${params.preferredDate ? `Wunschdatum: ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}\n` : ""}

Eine Rückmeldung erhalten Sie in den kommenden Tagen per E-Mail.

Bei Fragen stehen wir Ihnen gerne zur Verfügung:
📧 E-Mail: info@dive-demo-tour.eu
🌐 Web: https://dive-demo-tour.eu

Wir freuen uns auf Sie!
Ihr DIVE DEMO TOUR Team

---
DIVE DEMO TOUR 2026
Diese E-Mail wurde automatisch generiert.
  `.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DIVE Demo Tour <onboarding@resend.dev>",
        to: params.to,
        subject: `Eingangsbestätigung - ${params.moduleTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending module confirmation email via Resend:", error);
      return false;
    }

    const result = await response.json();
    console.log("Module confirmation email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send module confirmation email:", error);
    return false;
  }
}

export async function sendAdminNotification(params: AdminNotificationParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  const adminEmail = Deno.env.get("ADMIN_EMAIL")?.trim();

  if (!apiKey || apiKey === "your-resend-api-key-here") {
    console.warn("⚠️ RESEND_API_KEY is not configured - skipping admin notification");
    return false;
  }

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL environment variable is not set - skipping admin notification");
    return false;
  }

  // Validate email format
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(adminEmail)) {
    console.error(`Invalid ADMIN_EMAIL format: "${adminEmail}". Expected format: email@example.com`);
    return false;
  }

  console.log("🔑 Using Resend API key:", apiKey.substring(0, 10) + "...");
  console.log("📧 Sending to admin email:", adminEmail);

  const { registration, event } = params;
  const registeredDate = new Date(registration.registeredAt).toLocaleString("de-DE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Event-Anmeldung - DIVE DEMO TOUR</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #06b6d4); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🔔 Neue Anmeldung</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">DIVE DEMO TOUR Admin-Benachrichtigung</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Eine neue Anmeldung ist eingegangen:
              </p>
              
              <!-- Event Info -->
              <table role="presentation" style="width: 100%; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 18px;">📍 ${event.title}</h3>
                    <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                      ${event.date} • ${event.city}, ${event.country}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Participant Details -->
              <table role="presentation" style="width: 100%; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">👤 Teilnehmer-Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px; vertical-align: top;">
                          <strong>Name:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${registration.firstName} ${registration.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>E-Mail:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          <a href="mailto:${registration.email}" style="color: #2563eb; text-decoration: none;">${registration.email}</a>
                        </td>
                      </tr>
                      ${registration.phone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Telefon:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          <a href="tel:${registration.phone}" style="color: #2563eb; text-decoration: none;">${registration.phone}</a>
                        </td>
                      </tr>
                      ` : ""}
                      ${registration.organization ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Organisation:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${registration.organization}
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Angemeldet am:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${registeredDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Registrierungs-ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: monospace;">
                          ${registration.registrationId}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              ${registration.message ? `
              <!-- Message -->
              <table role="presentation" style="width: 100%; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: bold;">💬 Nachricht:</h4>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${registration.message}</p>
                  </td>
                </tr>
              </table>
              ` : ""}
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://dive-demo-tour.eu/admin" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #2563eb, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Zum Admin-Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                DIVE DEMO TOUR 2026 - Admin-Benachrichtigung
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert. Bitte nicht direkt antworten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
🔔 Neue Event-Anmeldung - DIVE DEMO TOUR

Eine neue Anmeldung ist eingegangen:

EVENT:
📍 ${event.title}
${event.date} • ${event.city}, ${event.country}

TEILNEHMER-DETAILS:
👤 Name: ${registration.firstName} ${registration.lastName}
📧 E-Mail: ${registration.email}
${registration.phone ? `📞 Telefon: ${registration.phone}` : ""}
${registration.organization ? `🏢 Organisation: ${registration.organization}` : ""}
🕐 Angemeldet am: ${registeredDate}
🆔 Registrierungs-ID: ${registration.registrationId}

${registration.message ? `💬 NACHRICHT:\n${registration.message}\n` : ""}
---
DIVE DEMO TOUR - Admin-Benachrichtigung
Zum Admin-Dashboard: https://dive-demo-tour.eu/admin
  `.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DIVE DEMO TOUR Admin <onboarding@resend.dev>",
        to: adminEmail,
        subject: `🔔 Neue Anmeldung: ${event.title} - ${registration.firstName} ${registration.lastName}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending admin notification via Resend:", error);
      return false;
    }

    const result = await response.json();
    console.log("Admin notification sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return false;
  }
}

interface OrganizerEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  moduleTitle: string;
  eventTitle: string;
  eventBeginDate: string;
  eventEndDate: string;
  eventCity: string;
  eventCountry: string;
  registrationId: string;
  preferredDate?: string;
  preferredTime?: string;
  phone?: string;
  organization?: string;
  message?: string;
  participantEmail?: string;
}

export async function sendModuleRegistrationToOrganizer(params: OrganizerEmailParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();

  if (!apiKey || apiKey === "your-resend-api-key-here") {
    console.warn("⚠️ RESEND_API_KEY is not configured - skipping organizer notification email");
    return false;
  }

  console.log("🔑 Using Resend API key for organizer:", apiKey.substring(0, 10) + "...");

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Modul-Anmeldung - DIVE Demo Tour</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #ea580c, #f97316); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🔔 Neue Anmeldung</h1>
              <p style="margin: 10px 0 0 0; color: #fed7aa; font-size: 16px;">DIVE DEMO TOUR - Modul-Benachrichtigung</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Eine neue Anmeldung für Ihr Event-Modul ist eingegangen:
              </p>
              
              <!-- Module Info -->
              <table role="presentation" style="width: 100%; background-color: #fff7ed; border-radius: 8px; border-left: 4px solid #ea580c; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <h3 style="margin: 0 0 8px 0; color: #9a3412; font-size: 18px;">📦 ${params.moduleTitle}</h3>
                    <p style="margin: 0; color: #9a3412; font-size: 14px;">
                      ${params.eventTitle} • ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)} • ${params.eventCity}, ${params.eventCountry}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Participant Details -->
              <table role="presentation" style="width: 100%; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">👤 Teilnehmer-Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px; vertical-align: top;">
                          <strong>Name:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.firstName} ${params.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>E-Mail:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          <a href="mailto:${params.participantEmail || params.firstName.toLowerCase() + '@example.com'}" style="color: #ea580c; text-decoration: none;">${params.participantEmail || 'Nicht angegeben'}</a>
                        </td>
                      </tr>
                      ${params.phone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Telefon:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          <a href="tel:${params.phone}" style="color: #ea580c; text-decoration: none;">${params.phone}</a>
                        </td>
                      </tr>
                      ` : ""}
                      ${params.organization ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Organisation:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${params.organization}
                        </td>
                      </tr>
                      ` : ""}
                      ${params.preferredDate ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Wunschdatum:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
                          <strong>Registrierungs-ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: monospace;">
                          ${params.registrationId}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              ${params.message ? `
              <!-- Message -->
              <table role="presentation" style="width: 100%; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: bold;">💬 Nachricht vom Teilnehmer:</h4>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${params.message}</p>
                  </td>
                </tr>
              </table>
              ` : ""}
              
              <p style="margin: 20px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Bitte kontaktieren Sie den Teilnehmer direkt für weitere Details.<br>
                DIVE DEMO TOUR Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                DIVE Demo Tour 2026
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
DIVE DEMO TOUR - Neue Modul-Anmeldung

Eine neue Anmeldung für Ihr Event-Modul ist eingegangen:

Modul: ${params.moduleTitle}
Event: ${params.eventTitle}
Datum: ${formatDate(params.eventBeginDate)} - ${formatDate(params.eventEndDate)}
Ort: ${params.eventCity}, ${params.eventCountry}

Teilnehmer-Details:
- Name: ${params.firstName} ${params.lastName}
- E-Mail: ${params.participantEmail || 'Nicht angegeben'}
${params.phone ? `- Telefon: ${params.phone}\n` : ""}${params.organization ? `- Organisation: ${params.organization}\n` : ""}${params.preferredDate ? `- Wunschdatum: ${formatDate(params.preferredDate)}${params.preferredTime ? ` um ${params.preferredTime} Uhr` : ""}\n` : ""}
- Registrierungs-ID: ${params.registrationId}

${params.message ? `Nachricht vom Teilnehmer:\n${params.message}\n\n` : ""}
Bitte kontaktieren Sie den Teilnehmer direkt für weitere Details.

DIVE DEMO TOUR Team

---
DIVE DEMO TOUR 2026
Diese E-Mail wurde automatisch generiert.
  `.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DIVE Demo Tour <onboarding@resend.dev>",
        to: params.to,
        subject: `Neue Anmeldung: ${params.moduleTitle} - ${params.firstName} ${params.lastName}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error sending organizer notification email via Resend:", error);
      return false;
    }

    const result = await response.json();
    console.log("Organizer notification email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send organizer notification email:", error);
    return false;
  }
}