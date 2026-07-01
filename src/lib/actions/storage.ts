"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(
  file: File,
  bucketName: string = "ads",
  folderPath: string = "images"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Upload image error:", error);
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}