import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { registrationsApp } from "./registrations.tsx";
import { authApp } from "./auth.tsx";
import { eventsApp } from "./events.tsx";
import { brandsApp } from "./brands.tsx";
import { partnersApp } from "./partners.tsx";
import { modulesApp } from "./modules.tsx";
import { homepageApp } from "./homepage.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-281a395c/health", (c) => {
  return c.json({ status: "ok" });
});

// Environment check endpoint (for debugging)
app.get("/make-server-281a395c/check-env", (c) => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  
  return c.json({
    resend_configured: !!resendKey && resendKey !== "your-resend-api-key-here",
    resend_key_length: resendKey ? resendKey.length : 0,
    resend_key_prefix: resendKey ? resendKey.substring(0, 6) + "..." : "nicht gesetzt",
    admin_email_configured: !!adminEmail,
    admin_email: adminEmail || "nicht gesetzt",
    admin_password_configured: !!adminPassword && adminPassword !== "your-password-here",
  });
});

// Mount auth routes
app.route("/make-server-281a395c/auth", authApp);

// Mount registrations routes
app.route("/make-server-281a395c/registrations", registrationsApp);

// Mount events routes
app.route("/make-server-281a395c/events", eventsApp);

// Mount brands routes
app.route("/make-server-281a395c/brands", brandsApp);

// Mount partners routes
app.route("/make-server-281a395c/partners", partnersApp);

// Mount modules routes
app.route("/make-server-281a395c/modules", modulesApp);

// Mount homepage routes
app.route("/make-server-281a395c", homepageApp);

Deno.serve(app.fetch);