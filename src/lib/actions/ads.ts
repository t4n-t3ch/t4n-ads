"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AdData = {
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  status?: "draft" | "active" | "paused" | "archived";
  budget?: number;
  start_date?: string;
  end_date?: string;
  target_audience?: string;
  user_id?: string;
};

export async function createAd(adData: AdData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .insert({
      ...adData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating ad:", error);
    throw new Error(`Failed to create ad: ${error.message}`);
  }

  revalidatePath("/dashboard/ads");
  return data;
}

export async function updateAd(id: string, adData: Partial<AdData>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .update({
      ...adData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ad:", error);
    throw new Error(`Failed to update ad: ${error.message}`);
  }

  revalidatePath("/dashboard/ads");
  revalidatePath(`/dashboard/ads/${id}`);
  return data;
}