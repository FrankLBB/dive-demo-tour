import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface Partner {
  id: string;
  name: string;
  partnerType?: string;
  logo: string;
  url: string;
  email: string;
  address: string;
  phone: string;
  shortDescription: string;
  details: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const partnersApp = new Hono();

// Helper to create Supabase client with service role
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
};

// Storage bucket name
const BUCKET_NAME = "make-281a395c-partner-logos";

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

// Get all partners
partnersApp.get("/", async (c) => {
  try {
    const partners = await kv.getByPrefix<Partner>("partner:");
    
    // Sort alphabetically by name
    const sortedPartners = partners.sort((a, b) => 
      a.name.localeCompare(b.name, 'de')
    );
    
    console.log(`✅ Fetched ${sortedPartners.length} partners`);
    return c.json({ success: true, partners: sortedPartners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return c.json({ success: false, error: "Failed to fetch partners" }, 500);
  }
});

// Get single partner by ID
partnersApp.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const partner = await kv.get<Partner>(`partner:${id}`);
    
    if (!partner) {
      return c.json({ success: false, error: "Partner not found" }, 404);
    }
    
    console.log(`✅ Fetched partner: ${partner.name}`);
    return c.json({ success: true, partner });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return c.json({ success: false, error: "Failed to fetch partner" }, 500);
  }
});

// Create new partner
partnersApp.post("/", async (c) => {
  try {
    const body = await c.req.json();
    
    const partner: Partner = {
      id: crypto.randomUUID(),
      name: body.name || "",
      partnerType: body.partnerType || "",
      logo: body.logo || "",
      url: body.url || "",
      email: body.email || "",
      address: body.address || "",
      phone: body.phone || "",
      shortDescription: body.shortDescription || "",
      details: body.details || "",
      status: body.status || "active",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`partner:${partner.id}`, partner);
    
    console.log(`✅ Created partner: ${partner.name}`);
    return c.json({ success: true, partner });
  } catch (error) {
    console.error("Error creating partner:", error);
    return c.json({ success: false, error: "Failed to create partner" }, 500);
  }
});

// Update partner
partnersApp.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existingPartner = await kv.get<Partner>(`partner:${id}`);
    if (!existingPartner) {
      return c.json({ success: false, error: "Partner not found" }, 404);
    }
    
    const updatedPartner: Partner = {
      ...existingPartner,
      name: body.name || existingPartner.name,
      partnerType: body.partnerType || existingPartner.partnerType,
      logo: body.logo || existingPartner.logo,
      url: body.url !== undefined ? body.url : existingPartner.url,
      email: body.email !== undefined ? body.email : existingPartner.email,
      address: body.address !== undefined ? body.address : existingPartner.address,
      phone: body.phone !== undefined ? body.phone : existingPartner.phone,
      shortDescription: body.shortDescription !== undefined ? body.shortDescription : existingPartner.shortDescription,
      details: body.details !== undefined ? body.details : existingPartner.details,
      status: body.status || existingPartner.status,
    };
    
    await kv.set(`partner:${id}`, updatedPartner);
    
    console.log(`✅ Updated partner: ${updatedPartner.name}`);
    return c.json({ success: true, partner: updatedPartner });
  } catch (error) {
    console.error("Error updating partner:", error);
    return c.json({ success: false, error: "Failed to update partner" }, 500);
  }
});

// Delete partner
partnersApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const existingPartner = await kv.get<Partner>(`partner:${id}`);
    if (!existingPartner) {
      return c.json({ success: false, error: "Partner not found" }, 404);
    }
    
    await kv.del(`partner:${id}`);
    
    console.log(`✅ Deleted partner: ${existingPartner.name}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return c.json({ success: false, error: "Failed to delete partner" }, 500);
  }
});

// POST /upload-logo - Upload partner logo to Supabase Storage
partnersApp.post("/upload-logo", async (c) => {
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
    
    console.log(`📤 Uploading partner logo: ${file.name}`);
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.",
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
    const filePath = `logos/${fileName}`;
    
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
          error: "Failed to upload logo",
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
    
    console.log(`✅ Partner logo uploaded: ${filePath}`);
    
    return c.json({
      success: true,
      logoUrl: signedUrlData.signedUrl,
      filePath,
      message: "Logo uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading partner logo:", error);
    return c.json(
      {
        success: false,
        error: "Failed to upload logo",
        message: error.message,
      },
      500
    );
  }
});