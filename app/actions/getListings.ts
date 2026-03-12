"use server";

import { supabaseAdmin } from "@/app/libs/supabase";

export default async function getListings() {
  try {
    const { data: listings, error } = await supabaseAdmin
      .from("listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return listings || [];
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return [];
  }
}