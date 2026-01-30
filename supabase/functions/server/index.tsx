import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { registrationsApp } from "./registrations.tsx";
import { authApp } from "./auth.tsx";

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

// Mount auth routes
app.route("/make-server-281a395c/auth", authApp);

// Mount registrations routes
app.route("/make-server-281a395c/registrations", registrationsApp);

Deno.serve(app.fetch);