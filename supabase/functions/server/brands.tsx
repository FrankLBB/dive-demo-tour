import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface Brand {
  id: string;
  name: string;
  logo: string;
  url: string;
  email: string;
  shortDescription: string;
  details: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const brandsApp = new Hono();

// Helper to create Supabase client with service role
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
};

// Storage bucket name
const BUCKET_NAME = "make-281a395c-brand-logos";

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

// Get all brands
brandsApp.get("/", async (c) => {
  try {
    const brands = await kv.getByPrefix<Brand>("brand:");
    
    // Sort alphabetically by name
    const sortedBrands = brands.sort((a, b) => 
      a.name.localeCompare(b.name, 'de')
    );
    
    console.log(`✅ Fetched ${sortedBrands.length} brands`);
    return c.json({ success: true, brands: sortedBrands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return c.json({ success: false, error: "Failed to fetch brands" }, 500);
  }
});

// Get single brand by ID
brandsApp.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const brand = await kv.get<Brand>(`brand:${id}`);
    
    if (!brand) {
      return c.json({ success: false, error: "Brand not found" }, 404);
    }
    
    console.log(`✅ Fetched brand: ${brand.name}`);
    return c.json({ success: true, brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return c.json({ success: false, error: "Failed to fetch brand" }, 500);
  }
});

// Create new brand
brandsApp.post("/", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    const requiredFields = ["name", "logo", "url", "email", "shortDescription", "status"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return c.json(
          { success: false, error: `Missing required field: ${field}` },
          400
        );
      }
    }
    
    // Generate unique ID
    const id = crypto.randomUUID();
    
    const newBrand: Brand = {
      id,
      name: body.name,
      logo: body.logo,
      url: body.url,
      email: body.email,
      shortDescription: body.shortDescription,
      details: body.details || "",
      status: body.status,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`brand:${id}`, newBrand);
    
    console.log(`✅ Created new brand: ${newBrand.name}`);
    return c.json({ success: true, brand: newBrand }, 201);
  } catch (error) {
    console.error("Error creating brand:", error);
    return c.json({ success: false, error: "Failed to create brand" }, 500);
  }
});

// Update brand
brandsApp.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    // Check if brand exists
    const existingBrand = await kv.get<Brand>(`brand:${id}`);
    if (!existingBrand) {
      return c.json({ success: false, error: "Brand not found" }, 404);
    }
    
    // Validate required fields
    const requiredFields = ["name", "logo", "url", "email", "shortDescription", "status"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return c.json(
          { success: false, error: `Missing required field: ${field}` },
          400
        );
      }
    }
    
    const updatedBrand: Brand = {
      ...existingBrand,
      name: body.name,
      logo: body.logo,
      url: body.url,
      email: body.email,
      shortDescription: body.shortDescription,
      details: body.details || "",
      status: body.status,
    };
    
    await kv.set(`brand:${id}`, updatedBrand);
    
    console.log(`✅ Updated brand: ${updatedBrand.name}`);
    return c.json({ success: true, brand: updatedBrand });
  } catch (error) {
    console.error("Error updating brand:", error);
    return c.json({ success: false, error: "Failed to update brand" }, 500);
  }
});

// Delete brand
brandsApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Check if brand exists
    const existingBrand = await kv.get<Brand>(`brand:${id}`);
    if (!existingBrand) {
      return c.json({ success: false, error: "Brand not found" }, 404);
    }
    
    await kv.del(`brand:${id}`);
    
    console.log(`✅ Deleted brand: ${existingBrand.name}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return c.json({ success: false, error: "Failed to delete brand" }, 500);
  }
});

// POST /upload-logo - Upload brand logo to Supabase Storage
brandsApp.post("/upload-logo", async (c) => {
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
    
    console.log(`📤 Uploading logo: ${file.name}`);
    
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
    
    console.log(`✅ Logo uploaded: ${filePath}`);
    
    return c.json({
      success: true,
      logoUrl: signedUrlData.signedUrl,
      filePath,
      message: "Logo uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
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