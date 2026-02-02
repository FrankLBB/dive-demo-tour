import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { updateLastChangeDate } from "./homepage.tsx";

export const modulesApp = new Hono();

// GET all modules
modulesApp.get("/", async (c) => {
  try {
    const modules = await kv.getByPrefix("module:");
    
    console.log("✅ Modules fetched successfully:", modules.length);
    return c.json({ modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return c.json({ error: "Failed to fetch modules" }, 500);
  }
});

// GET single module by ID
modulesApp.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const module = await kv.get(`module:${id}`);
    
    if (!module) {
      return c.json({ error: "Module not found" }, 404);
    }
    
    console.log("✅ Module fetched:", id);
    return c.json({ module });
  } catch (error) {
    console.error("Error fetching module:", error);
    return c.json({ error: "Failed to fetch module" }, 500);
  }
});

// POST create new module
modulesApp.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const {
      internalName,
      status,
      brandId,
      partnerId,
      title,
      details,
      timeType, // "daily" oder "specific"
      specificDateTime,
      durationType, // "event" oder "custom"
      customDuration,
      maxParticipants,
      registrationRequired, // true oder false
      registrationEmail,
      registrationUrl,
      registrationEmailAlt,
      registrationPhone,
      cost,
    } = body;

    // Validation
    if (!title) {
      return c.json({ error: "Titel ist erforderlich" }, 400);
    }

    const id = crypto.randomUUID();
    const module = {
      id,
      internalName: internalName || "",
      status: status || "active", // "active" oder "inactive"
      brandId: brandId || null,
      partnerId: partnerId || null,
      title,
      details: details || "",
      timeType: timeType || "daily", // "daily" oder "specific"
      specificDateTime: specificDateTime || null,
      durationType: durationType || "event", // "event" oder "custom"
      customDuration: customDuration || null,
      maxParticipants: maxParticipants || null,
      registrationRequired: registrationRequired || false,
      registrationEmail: registrationEmail || "",
      registrationUrl: registrationUrl || "",
      registrationEmailAlt: registrationEmailAlt || "",
      registrationPhone: registrationPhone || "",
      cost: cost || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`module:${id}`, module);
    updateLastChangeDate();
    
    console.log("✅ Module created:", id);
    return c.json({ success: true, module });
  } catch (error) {
    console.error("Error creating module:", error);
    return c.json({ error: "Failed to create module" }, 500);
  }
});

// PUT update module
modulesApp.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existingModule = await kv.get(`module:${id}`);
    if (!existingModule) {
      return c.json({ error: "Module not found" }, 404);
    }

    const updatedModule = {
      ...existingModule,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`module:${id}`, updatedModule);
    updateLastChangeDate();
    
    console.log("✅ Module updated:", id);
    return c.json({ success: true, module: updatedModule });
  } catch (error) {
    console.error("Error updating module:", error);
    return c.json({ error: "Failed to update module" }, 500);
  }
});

// DELETE module
modulesApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const existingModule = await kv.get(`module:${id}`);
    if (!existingModule) {
      return c.json({ error: "Module not found" }, 404);
    }

    await kv.del(`module:${id}`);
    updateLastChangeDate();
    
    console.log("✅ Module deleted:", id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting module:", error);
    return c.json({ error: "Failed to delete module" }, 500);
  }
});