"use server";

import { supabaseAdmin } from "@/app/libs/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createListing(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const country = formData.get("country") as string;
  const price_per_night = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  
  if (!title || !description || !location || !price_per_night || !category) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabaseAdmin.from("listings").insert({
    title,
    description,
    location,
    country: country || "Unknown",
    price_per_night,
    category,
    amenities: [`host:${user.id}`]
  });

  if (error) {
    console.error("Failed to create listing:", error);
    throw new Error("Failed to create listing");
  }

  revalidatePath("/listings");
  redirect("/listings");
}
