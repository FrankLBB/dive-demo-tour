import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2.47.10";
import * as kv from "./kv_store.tsx";

const homepageApp = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Bucket name for homepage images
const BUCKET_NAME = "make-281a395c-homepage";

// Initialize bucket on first request
let bucketInitialized = false;

async function ensureBucketExists() {
  if (bucketInitialized) return;

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`✅ Created bucket: ${BUCKET_NAME}`);
    }

    bucketInitialized = true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
}

// GET homepage settings
homepageApp.get("/homepage", async (c) => {
  try {
    console.log("📥 GET /homepage - Fetching homepage settings");

    const settings = await kv.get("homepage_settings");

    if (!settings) {
      // Return default settings
      const defaultSettings = {
        logo: null,
        headerTitle: "DIVE DEMO TOUR",
        headerSubtitle: "Test-Events für Taucher",
        backgroundImage: null,
        headerLogo: null,
      };

      console.log("✅ Returning default homepage settings");
      return c.json({ settings: defaultSettings });
    }

    console.log("✅ Homepage settings retrieved successfully");
    return c.json({ settings });
  } catch (error) {
    console.error("❌ Error fetching homepage settings:", error);
    return c.json({ error: "Failed to fetch homepage settings" }, 500);
  }
});

// PUT homepage settings
homepageApp.put("/homepage", async (c) => {
  try {
    console.log("📤 PUT /homepage - Updating homepage settings");

    const body = await c.req.json();
    const { logo, headerTitle, headerSubtitle, backgroundImage, headerLogo } = body;

    // Validate required fields
    if (!headerTitle || !headerSubtitle) {
      return c.json({ error: "Header title and subtitle are required" }, 400);
    }

    const settings = {
      logo: logo || null,
      headerTitle,
      headerSubtitle,
      backgroundImage: backgroundImage || null,
      headerLogo: headerLogo || null,
      updatedAt: new Date().toISOString(),
    };

    await kv.set("homepage_settings", settings);

    console.log("✅ Homepage settings updated successfully");
    return c.json({ success: true, settings });
  } catch (error) {
    console.error("❌ Error updating homepage settings:", error);
    return c.json({ error: "Failed to update homepage settings" }, 500);
  }
});

// POST upload logo
homepageApp.post("/homepage/upload-logo", async (c) => {
  try {
    console.log("📤 POST /homepage/upload-logo");

    await ensureBucketExists();

    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        { error: "Invalid file type. Only images are allowed." },
        400
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `logo-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload logo" }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 315360000); // 10 years in seconds

    if (!signedUrlData?.signedUrl) {
      console.error("Failed to create signed URL");
      return c.json({ error: "Failed to create signed URL" }, 500);
    }

    console.log("✅ Logo uploaded successfully:", signedUrlData.signedUrl);
    return c.json({ imageUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error("❌ Error uploading logo:", error);
    return c.json({ error: "Failed to upload logo" }, 500);
  }
});

// POST upload background image
homepageApp.post("/homepage/upload-background", async (c) => {
  try {
    console.log("📤 POST /homepage/upload-background");

    await ensureBucketExists();

    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        { error: "Invalid file type. Only images are allowed." },
        400
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `background-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload background image" }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 315360000); // 10 years in seconds

    if (!signedUrlData?.signedUrl) {
      console.error("Failed to create signed URL");
      return c.json({ error: "Failed to create signed URL" }, 500);
    }

    console.log("✅ Background image uploaded successfully:", signedUrlData.signedUrl);
    return c.json({ imageUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error("❌ Error uploading background image:", error);
    return c.json({ error: "Failed to upload background image" }, 500);
  }
});

// POST upload header logo
homepageApp.post("/homepage/upload-header-logo", async (c) => {
  try {
    console.log("📤 POST /homepage/upload-header-logo");

    await ensureBucketExists();

    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        { error: "Invalid file type. Only images are allowed." },
        400
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `header-logo-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload header logo" }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 315360000); // 10 years in seconds

    if (!signedUrlData?.signedUrl) {
      console.error("Failed to create signed URL");
      return c.json({ error: "Failed to create signed URL" }, 500);
    }

    console.log("✅ Header logo uploaded successfully:", signedUrlData.signedUrl);
    return c.json({ imageUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error("❌ Error uploading header logo:", error);
    return c.json({ error: "Failed to upload header logo" }, 500);
  }
});

export { homepageApp };