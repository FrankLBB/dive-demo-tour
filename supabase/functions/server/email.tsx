interface EmailParams {
  to: string;
  firstName: string;
  lastName: string;
  eventTitle: string;
  eventDate: string;
  eventCity: string;
  eventCountry: string;
  registrationId: string;
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

export async function sendConfirmationEmail(params: EmailParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    console.error("RESEND_API_KEY environment variable is not set");
    return false;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anmeldungsbestätigung - DIVE Demo Tour</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #06b6d4); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">DIVE Demo Tour</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">Europas führende Tauchtechnologie-Tour</p>
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
                vielen Dank für Ihre Anmeldung zur DIVE Demo Tour! Wir freuen uns, Sie bei unserem Event begrüßen zu dürfen.
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
                          ${params.eventDate}
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
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Weitere Informationen zum Programm und Ablauf erhalten Sie in den kommenden Tagen per E-Mail.
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
                Ihr DIVE Demo Tour Team
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
DIVE Demo Tour - Anmeldungsbestätigung

Hallo ${params.firstName} ${params.lastName},

vielen Dank für Ihre Anmeldung zur DIVE Demo Tour! Wir freuen uns, Sie bei unserem Event begrüßen zu dürfen.

Event-Details:
- Event: ${params.eventTitle}
- Datum: ${params.eventDate}
- Ort: ${params.eventCity}, ${params.eventCountry}
- Bestätigungs-ID: ${params.registrationId}

Weitere Informationen zum Programm und Ablauf erhalten Sie in den kommenden Tagen per E-Mail.

Bei Fragen stehen wir Ihnen gerne zur Verfügung:
📧 E-Mail: info@dive-demo-tour.eu
🌐 Web: https://dive-demo-tour.eu

Wir freuen uns auf Sie!
Ihr DIVE Demo Tour Team

---
DIVE Demo Tour 2026
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
        from: "DIVE Demo Tour <noreply@dive-demo-tour.eu>",
        to: [params.to],
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

export async function sendAdminNotification(params: AdminNotificationParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");

  if (!apiKey) {
    console.error("RESEND_API_KEY environment variable is not set");
    return false;
  }

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL environment variable is not set - skipping admin notification");
    return false;
  }

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
  <title>Neue Event-Anmeldung - DIVE Demo Tour</title>
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
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">DIVE Demo Tour Admin-Benachrichtigung</p>
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
                DIVE Demo Tour 2026 - Admin-Benachrichtigung
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
🔔 Neue Event-Anmeldung - DIVE Demo Tour

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
DIVE Demo Tour 2026 - Admin-Benachrichtigung
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
        from: "DIVE Demo Tour Admin <info@dive-demo-tour.eu>",
        to: [adminEmail],
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