import { Hono } from "npm:hono";

export const authApp = new Hono();

// POST /make-server-281a395c/auth/login - Validate admin password
authApp.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;

    if (!password) {
      return c.json(
        { success: false, error: "Password is required" },
        400
      );
    }

    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return c.json(
        { success: false, error: "Server configuration error" },
        500
      );
    }

    // Compare password
    if (password === adminPassword) {
      // Generate a simple session token
      const sessionToken = btoa(`admin:${Date.now()}:${Math.random()}`);
      
      return c.json({
        success: true,
        message: "Authentication successful",
        sessionToken,
      });
    } else {
      return c.json(
        { success: false, error: "Invalid password" },
        401
      );
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return c.json(
      { success: false, error: "Authentication failed", details: String(error) },
      500
    );
  }
});

// POST /make-server-281a395c/auth/verify - Verify session token
authApp.post("/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return c.json(
        { success: false, error: "Session token is required" },
        400
      );
    }

    // Simple token verification (in production, use proper JWT or similar)
    // For this demo, we just check if the token is formatted correctly
    try {
      const decoded = atob(sessionToken);
      if (decoded.startsWith("admin:")) {
        return c.json({
          success: true,
          message: "Session valid",
        });
      }
    } catch {
      // Token is not valid base64
    }

    return c.json(
      { success: false, error: "Invalid session" },
      401
    );
  } catch (error) {
    console.error("Error during session verification:", error);
    return c.json(
      { success: false, error: "Verification failed", details: String(error) },
      500
    );
  }
});
