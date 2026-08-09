import { VercelRequest, VercelResponse } from "@vercel/node";
import { uploadToCloudinary } from "../lib/cloudinary";

export async function handleImageUpload(req: VercelRequest): Promise<string | null> {
  try {
    if (!req.body) {
      return null;
    }

    // Check if the request has base64 image data
    const imageData = req.body.image || req.body.poster;
    if (!imageData) {
      return null;
    }

    // Handle both base64 strings and Buffer objects
    let buffer: Buffer;
    if (typeof imageData === "string") {
      // If it's a base64 string
      buffer = Buffer.from(imageData, "base64");
    } else if (Buffer.isBuffer(imageData)) {
      buffer = imageData;
    } else {
      return null;
    }

    const fileName = `poster_${Date.now()}`;
    const result = await uploadToCloudinary(buffer, fileName);

    if (result && typeof result === "object" && "secure_url" in result) {
      return result.secure_url;
    }

    return null;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
}

export async function validateImageUploadRequest(
  req: VercelRequest
): Promise<{ valid: boolean; error?: string }> {
  if (!req.body) {
    return { valid: false, error: "Request body is required" };
  }

  const imageData = req.body.image || req.body.poster;
  if (!imageData) {
    return {
      valid: true, // Image upload is optional
    };
  }

  // Validate base64 string format
  if (typeof imageData === "string") {
    try {
      if (!imageData.match(/^[A-Za-z0-9+/=]+$/)) {
        return { valid: false, error: "Invalid base64 format" };
      }
    } catch {
      return { valid: false, error: "Invalid image data" };
    }
  }

  return { valid: true };
}
