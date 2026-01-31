import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const eventsApp = new Hono();

// Helper to create Supabase client with service role
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
};

// Storage bucket name
const BUCKET_NAME = "make-281a395c-event-images";

// Initialize storage bucket on first request
let bucketInitialized = false;
const initializeBucket = async () => {
  if (bucketInitialized) return;
  
  const supabase = getSupabaseClient();
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${BUCKET_NAME}`);
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log(`✅ Storage bucket created: ${BUCKET_NAME}`);
    } else {
      console.log(`✅ Storage bucket exists: ${BUCKET_NAME}`);
    }
    
    bucketInitialized = true;
  } catch (error) {
    console.error("Error initializing storage bucket:", error);
  }
};

// GET /events - Get all events
eventsApp.get("/", async (c) => {
  try {
    console.log("📥 Fetching all events from KV store");
    
    // Get all events from KV store with prefix
    const eventValues = await kv.getByPrefix("event:");
    console.log(`Found ${eventValues.length} event values in KV store`);
    
    // The values are already parsed JSON objects (JSONB from database)
    // Filter out any null/undefined values and invalid events
    const validEvents = eventValues.filter(event => {
      if (!event) {
        console.warn("⚠️ Skipping null/undefined event");
        return false;
      }
      if (typeof event !== 'object') {
        console.warn("⚠️ Skipping non-object event:", typeof event);
        return false;
      }
      if (!event.id || !event.title) {
        console.warn("⚠️ Skipping event with missing id or title:", event);
        return false;
      }
      return true;
    });
    
    console.log(`✅ Returning ${validEvents.length} valid events (filtered from ${eventValues.length})`);
    
    return c.json({
      success: true,
      events: validEvents.sort((a, b) => {
        // Sort by begin_date (newest first)
        try {
          return new Date(b.begin_date).getTime() - new Date(a.begin_date).getTime();
        } catch (e) {
          return 0;
        }
      }),
    });
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch events",
        message: error.message,
      },
      500
    );
  }
});

// GET /events/:id - Get single event
eventsApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    console.log(`📥 Fetching event with ID: ${id}`);
    
    // Add retry logic for database connection issues
    let eventData = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries && !eventData) {
      try {
        eventData = await kv.get(`event:${id}`);
        break;
      } catch (error) {
        retryCount++;
        console.warn(`⚠️ Retry ${retryCount}/${maxRetries} for event ${id}:`, error.message);
        
        if (retryCount >= maxRetries) {
          throw error;
        }
        
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
      }
    }
    
    if (!eventData) {
      return c.json(
        {
          success: false,
          error: "Event not found",
        },
        404
      );
    }
    
    // eventData is already an object (JSONB from database)
    console.log(`✅ Event found: ${eventData.title}`);
    
    return c.json({
      success: true,
      event: eventData,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch event",
        message: error.message,
        details: "Database connection issue. Please try again or check static events.",
      },
      500
    );
  }
});

// POST /events - Create new event
eventsApp.post("/", async (c) => {
  try {
    const body = await c.req.json();
    console.log("📥 Creating new event:", body.title);
    console.log("📦 Full event data:", JSON.stringify(body, null, 2));
    
    // Generate unique ID
    const id = crypto.randomUUID();
    console.log("🆔 Generated ID:", id);
    
    // Create event object
    const event = {
      id,
      title: body.title || "",
      begin_date: body.begin_date || "",
      begin_time: body.begin_time || "",
      end_date: body.end_date || "",
      end_time: body.end_time || "",
      location: body.location || "",
      location_URL: body.location_URL || "",
      location_email: body.location_email || "",
      location_phone: body.location_phone || "",
      city: body.city || "",
      country: body.country || "",
      description: body.description || "",
      longDescription: body.longDescription || "",
      eventNote: body.eventNote || "",
      image: body.image || "",
      attendees: body.attendees || 0,
      status: body.status || "upcoming",
      speakers: body.speakers || [],
      topics: body.topics || [],
      moduleIds: body.moduleIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log("💾 Saving event to KV store with key:", `event:${id}`);
    console.log("💾 Event object to save:", JSON.stringify(event, null, 2));
    
    // Save to KV store as object (JSONB will handle it)
    await kv.set(`event:${id}`, event);
    console.log("✅ Event saved to KV store successfully");
    
    // Verify it was saved
    const verifyData = await kv.get(`event:${id}`);
    if (verifyData) {
      console.log("✅ Verification: Event retrieved from KV store successfully");
      console.log("📦 Retrieved data:", JSON.stringify(verifyData, null, 2));
    } else {
      console.error("❌ Verification failed: Event not found in KV store after save");
    }
    
    return c.json({
      success: true,
      event,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    console.error("❌ Error stack:", error.stack);
    return c.json(
      {
        success: false,
        error: "Failed to create event",
        message: error.message,
        details: error.stack,
      },
      500
    );
  }
});

// PUT /events/:id - Update event
eventsApp.put("/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    const body = await c.req.json();
    console.log(`📥 Updating event with ID: ${id}`);
    
    // Get existing event
    const existingEvent = await kv.get(`event:${id}`);
    
    if (!existingEvent) {
      return c.json(
        {
          success: false,
          error: "Event not found",
        },
        404
      );
    }
    
    // existingEvent is already an object (JSONB from database)
    // Update event object
    const updatedEvent = {
      ...existingEvent,
      title: body.title || existingEvent.title,
      begin_date: body.begin_date || existingEvent.begin_date,
      begin_time: body.begin_time || existingEvent.begin_time,
      end_date: body.end_date || existingEvent.end_date,
      end_time: body.end_time || existingEvent.end_time,
      location: body.location || existingEvent.location,
      location_URL: body.location_URL !== undefined ? body.location_URL : existingEvent.location_URL,
      location_email: body.location_email !== undefined ? body.location_email : existingEvent.location_email,
      location_phone: body.location_phone !== undefined ? body.location_phone : existingEvent.location_phone,
      city: body.city || existingEvent.city,
      country: body.country || existingEvent.country,
      description: body.description || existingEvent.description,
      longDescription: body.longDescription !== undefined ? body.longDescription : existingEvent.longDescription,
      eventNote: body.eventNote !== undefined ? body.eventNote : existingEvent.eventNote,
      image: body.image || existingEvent.image,
      attendees: body.attendees !== undefined ? body.attendees : existingEvent.attendees,
      status: body.status || existingEvent.status,
      speakers: body.speakers || existingEvent.speakers,
      topics: body.topics || existingEvent.topics,
      moduleIds: body.moduleIds || existingEvent.moduleIds,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to KV store as object (JSONB will handle it)
    await kv.set(`event:${id}`, updatedEvent);
    console.log(`✅ Event updated: ${id}`);
    
    return c.json({
      success: true,
      event: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update event",
        message: error.message,
      },
      500
    );
  }
});

// DELETE /events/:id - Delete event
eventsApp.delete("/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    console.log(`📥 Deleting event with ID: ${id}`);
    
    // Check if event exists
    const existingData = await kv.get(`event:${id}`);
    
    if (!existingData) {
      return c.json(
        {
          success: false,
          error: "Event not found",
        },
        404
      );
    }
    
    // Delete from KV store
    await kv.del(`event:${id}`);
    console.log(`✅ Event deleted: ${id}`);
    
    return c.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete event",
        message: error.message,
      },
      500
    );
  }
});

// PUT /events/:id/modules - Update module assignments for an event
eventsApp.put("/:id/modules", async (c) => {
  const id = c.req.param("id");
  
  try {
    const body = await c.req.json();
    console.log(`📥 Updating module assignments for event ID: ${id}`);
    console.log(`📦 Module IDs to assign:`, body.moduleIds);
    
    // Get existing event
    const existingEvent = await kv.get(`event:${id}`);
    
    if (!existingEvent) {
      return c.json(
        {
          success: false,
          error: "Event not found",
        },
        404
      );
    }
    
    // Update event with new module IDs
    const updatedEvent = {
      ...existingEvent,
      moduleIds: body.moduleIds || [],
      updatedAt: new Date().toISOString(),
    };
    
    // Save to KV store
    await kv.set(`event:${id}`, updatedEvent);
    console.log(`✅ Module assignments updated for event: ${id}`);
    
    return c.json({
      success: true,
      event: updatedEvent,
      message: "Module assignments updated successfully",
    });
  } catch (error) {
    console.error("Error updating module assignments:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update module assignments",
        message: error.message,
      },
      500
    );
  }
});

// POST /upload-image - Upload event image to Supabase Storage
eventsApp.post("/upload-image", async (c) => {
  try {
    await initializeBucket();
    
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json(
        {
          success: false,
          error: "No file provided",
        },
        400
      );
    }
    
    console.log(`📤 Uploading image: ${file.name}`);
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
        },
        400
      );
    }
    
    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return c.json(
        {
          success: false,
          error: "File too large. Maximum size is 5MB.",
        },
        400
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `events/${fileName}`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json(
        {
          success: false,
          error: "Failed to upload image",
          message: uploadError.message,
        },
        500
      );
    }
    
    // Get signed URL (valid for 10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 315360000); // 10 years in seconds
    
    if (signedUrlError || !signedUrlData) {
      console.error("Signed URL error:", signedUrlError);
      return c.json(
        {
          success: false,
          error: "Failed to generate signed URL",
          message: signedUrlError?.message,
        },
        500
      );
    }
    
    console.log(`✅ Image uploaded: ${filePath}`);
    
    return c.json({
      success: true,
      imageUrl: signedUrlData.signedUrl,
      filePath,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json(
      {
        success: false,
        error: "Failed to upload image",
        message: error.message,
      },
      500
    );
  }
});

// POST /migrate-static-events - Migrate static events to database (admin only, one-time use)
eventsApp.post("/migrate-static-events", async (c) => {
  try {
    console.log("📥 Starting migration of static events to database");
    
    // Check if events already exist
    const existingEvents = await kv.getByPrefix("event:");
    
    if (existingEvents.length > 0) {
      console.log(`⚠️ Events already exist in database (${existingEvents.length}), skipping migration`);
      return c.json({
        success: false,
        message: "Events already exist in database. Migration skipped.",
        existingCount: existingEvents.length,
      });
    }
    
    // Static events to migrate (paste from events.ts)
    const staticEvents = [
      {
        id: "1",
        title: "Testtauch-Event Hemmoor",
        begin_date: "1. Februar 2026",
        begin_time: "09:00",
        end_date: "5. Februar 2026",
        end_time: "18:00",
        location: "Tauchbasis Kreidesee",
        location_URL: "https://www.kreidesee.de",
        location_phone: "+49 4771 6009990",
        city: "Hemmoor",
        country: "Deutschland",
        description: "Probetauchen, Beratung, Demonstrationen",
        longDescription: "Die Kick-off Veranstaltung markiert den Beginn einer spannenden europäischen Tour. In Hamburg präsentieren wir die neuesten Innovationen im Bereich der Unterwassertechnologie. Erwarten Sie spannende Keynotes, interaktive Demonstrationen und exklusive Einblicke in zukunftsweisende Projekte. Das Event bietet zudem hervorragende Networking-Möglichkeiten mit Branchenexperten, Forschern und Entwicklern aus ganz Europa.",
        image: "/images/Hemmoor.png",
        attendees: 150,
        status: "confirmed",
        speakers: [],
        topics: ["Kallweit", "Kwark", "Seacraft", "Thermovalve", "Tecline", "Upstream"],
      },
      {
        id: "2",
        title: "Tauchsicherheit & Innovation",
        begin_date: "22. Januar 2026",
        begin_time: "09:00",
        end_date: "23. Januar 2026",
        end_time: "17:00",
        location: "Messe Amsterdam",
        location_URL: "",
        location_phone: "",
        city: "Amsterdam",
        country: "Niederlande",
        description: "Fokus auf Sicherheitsinnovationen im Tauchsport mit Workshops, Expertengesprächen und praktischen Demonstrationen neuer Sicherheitsausrüstung.",
        longDescription: "Sicherheit steht im Mittelpunkt dieser Veranstaltung. Wir präsentieren die neuesten Entwicklungen in Tauchcomputer-Technologie, Notfallsystemen und Schutzausrüstung. Praktische Workshops ermöglichen es den Teilnehmern, neue Technologien selbst zu testen. Renommierte Sicherheitsexperten teilen ihre Erkenntnisse und Best Practices für sichere Tauchoperationen in verschiedenen Umgebungen.",
        image: "https://images.unsplash.com/photo-1692810123077-ebb9993aaff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlJTIwc2N1YmElMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2OTUzMDIxOHww&ixlib=rb-4.1.0&q=80&w=1080",
        attendees: 200,
        status: "confirmed",
        speakers: ["Jan van Berg", "Sophie Bakker", "Thomas Jansen"],
        topics: ["Tauchcomputer der Zukunft", "Notfallprotokolle", "Dekompressionsforschung"],
      },
      {
        id: "3",
        title: "Unterwasser-Robotik Symposium",
        begin_date: "10. Mai 2026",
        begin_time: "11:00",
        end_date: "10. Mai 2026",
        end_time: "19:00",
        location: "Kongresszentrum",
        location_URL: "https://www.bellacenter.dk",
        location_phone: "+45 32 47 32 00",
        city: "Kopenhagen",
        country: "Dänemark",
        description: "Präsentation modernster Unterwasser-Roboter und autonomer Tauchsysteme mit Live-Demos im nahegelegenen Hafen.",
        longDescription: "Tauchen Sie ein in die Welt der autonomen Unterwasser-Robotik. Diese Veranstaltung zeigt die neuesten Entwicklungen in AUV (Autonomous Underwater Vehicles) und ROV (Remotely Operated Vehicles) Technologie. Live-Demonstrationen im Kopenhagener Hafen bieten einzigartige Einblicke in die praktische Anwendung dieser Systeme. Von Tiefseeerkundung bis zur Infrastrukturinspektion – erleben Sie die Zukunft der Unterwasserrobotik.",
        image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        attendees: 180,
        status: "confirmed",
        speakers: ["Dr. Erik Nielsen", "Lisa Andersen", "Mikkel Hansen"],
        topics: ["Autonome Navigation", "KI im Unterwasser-Bereich", "Sensortechnologie"],
      },
      {
        id: "4",
        title: "Marine Forschung Expo",
        begin_date: "30. Januar 2026",
        begin_time: "10:00",
        end_date: "31. Januar 2026",
        end_time: "18:00",
        location: "Ozeaneum",
        location_URL: "https://en.akvariet.no",
        location_phone: "+47 55 55 71 71",
        city: "Bergen",
        country: "Norwegen",
        description: "Zusammenarbeit zwischen Forschung und Industrie mit Fokus auf nachhaltige Meeresforschung und Tauchtechnologien.",
        longDescription: "Die Marine Forschung Expo bringt Wissenschaft und Praxis zusammen. Präsentationen renommierter Meeresforscher zeigen aktuelle Forschungsprojekte und deren praktische Umsetzung. Besonderer Fokus liegt auf nachhaltigen Forschungsmethoden und umweltschonenden Technologien. Das Ozeaneum Bergen bietet die perfekte Kulisse für dieses einzigartige Event, das Bildung, Forschung und Innovation vereint.",
        image: "https://images.unsplash.com/photo-1692810123077-ebb9993aaff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlJTIwc2N1YmElMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2OTUzMDIxOHww&ixlib=rb-4.1.0&q=80&w=1080",
        attendees: 120,
        status: "upcoming",
        speakers: ["Dr. Ingrid Larsen", "Bjørn Solberg", "Astrid Knutsen"],
        topics: ["Klimaforschung", "Artenvielfalt", "Nachhaltige Technologien"],
      },
      {
        id: "5",
        title: "Tiefsee-Technologie Forum",
        begin_date: "5. Juli 2026",
        begin_time: "09:30",
        end_date: "5. Juli 2026",
        end_time: "17:30",
        location: "Maritime Institut",
        location_URL: "https://www.stockholmmassancongresscenter.se",
        location_phone: "+46 8 736 00 00",
        city: "Stockholm",
        country: "Schweden",
        description: "Spezialisierte Konferenz über Tiefsee-Explorationstechnologien mit internationalen Experten und Industrie-Leaders.",
        longDescription: "Entdecken Sie die extremen Herausforderungen und faszinierenden Lösungen der Tiefseeforschung. Internationale Experten präsentieren Technologien für Tauchgänge in extreme Tiefen, Druckresistente Systeme und innovative Beleuchtungslösungen. Das Forum bietet einzigartige Einblicke in aktuelle Tiefsee-Expeditionen und diskutiert zukünftige Entwicklungen in diesem spannenden Bereich der Meeresforschung.",
        image: "https://images.unsplash.com/photo-1555881400-edfa57db45be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBoYXJib3J8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        attendees: 160,
        status: "upcoming",
        speakers: ["Prof. Anders Svensson", "Emma Johansson", "Dr. Karl Bergström"],
        topics: ["Hochdrucktechnologie", "Tiefsee-Exploration", "Biolumineszenz"],
      },
      {
        id: "6",
        title: "DIVE Demo Finale",
        begin_date: "20. August 2026",
        begin_time: "10:00",
        end_date: "20. August 2026",
        end_time: "20:00",
        location: "Waterfront Convention Center",
        location_URL: "https://www.messukeskus.com",
        location_phone: "+358 9 150 91",
        city: "Helsinki",
        country: "Finnland",
        description: "Abschlussveranstaltung der Tour mit Highlights aller Events, Auszeichnungen und großer Gala am Abend.",
        longDescription: "Das große Finale der DIVE Demo Tour vereint alle Highlights der vergangenen Monate. Eine umfassende Ausstellung zeigt die besten Innovationen und Projekte der gesamten Tour. Am Abend findet eine festliche Gala statt, bei der herausragende Beiträge zur Unterwassertechnologie ausgezeichnet werden. Feiern Sie mit uns den Erfolg dieser außergewöhnlichen europäischen Initiative und blicken Sie voraus auf zukünftige Entwicklungen in der Branche.",
        image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NTMwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        attendees: 250,
        status: "upcoming",
        speakers: ["Alle Speaker der Tour", "Gastredner aus der Industrie"],
        topics: ["Tour Review", "Auszeichnungen", "Zukunftsausblick"],
      },
    ];
    
    // Save all events to KV store
    let migratedCount = 0;
    for (const event of staticEvents) {
      const eventData = {
        ...event,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save as object, not JSON string (JSONB will handle it)
      await kv.set(`event:${event.id}`, eventData);
      migratedCount++;
      console.log(`✅ Migrated event: ${event.title}`);
    }
    
    console.log(`✅ Migration complete: ${migratedCount} events migrated`);
    
    return c.json({
      success: true,
      message: "Static events migrated to database successfully",
      migratedCount,
    });
  } catch (error) {
    console.error("Error migrating static events:", error);
    return c.json(
      {
        success: false,
        error: "Failed to migrate static events",
        message: error.message,
      },
      500
    );
  }
});

// POST /cleanup-invalid-events - Clean up invalid events from KV store (admin only)
eventsApp.post("/cleanup-invalid-events", async (c) => {
  try {
    console.log("🧹 Starting cleanup of invalid events");
    
    // Get direct access to KV store to find all event keys
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const { data: allKvData, error } = await supabase
      .from("kv_store_281a395c")
      .select("key, value")
      .like("key", "event:%");
    
    if (error) {
      throw new Error(`Failed to fetch KV data: ${error.message}`);
    }
    
    console.log(`Found ${allKvData?.length || 0} event entries in KV store`);
    
    const invalidKeys: string[] = [];
    const validCount = { count: 0 };
    
    // Check each event
    for (const entry of allKvData || []) {
      const eventData = entry.value;
      
      // Check if event is valid
      if (!eventData || typeof eventData !== 'object' || !eventData.id || !eventData.title) {
        console.warn(`⚠️ Found invalid event with key: ${entry.key}`, eventData);
        invalidKeys.push(entry.key);
      } else {
        validCount.count++;
      }
    }
    
    console.log(`Found ${invalidKeys.length} invalid events to delete`);
    console.log(`Found ${validCount.count} valid events`);
    
    // Delete invalid events
    if (invalidKeys.length > 0) {
      await kv.mdel(invalidKeys);
      console.log(`✅ Deleted ${invalidKeys.length} invalid events`);
    }
    
    return c.json({
      success: true,
      message: "Cleanup completed successfully",
      deletedCount: invalidKeys.length,
      validCount: validCount.count,
      deletedKeys: invalidKeys,
    });
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    return c.json(
      {
        success: false,
        error: "Failed to cleanup invalid events",
        message: error.message,
      },
      500
    );
  }
});

export { eventsApp };