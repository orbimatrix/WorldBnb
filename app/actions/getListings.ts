"use server";

import { supabaseAdmin } from "@/app/libs/supabase";

export interface IListingsParams {
  category?: string;
  location?: string;
  guests?: string;
  checkIn?: string;
  ownerId?: string;
}

export default async function getListings(params?: IListingsParams) {
  try {
    let query = supabaseAdmin
      .from("listings")
      .select("*");

    // Location search
    if (params?.location) {
        query = query.or(`location.ilike.%${params.location}%,title.ilike.%${params.location}%,country.ilike.%${params.location}%`);
    }

    // Guest filtering
    if (params?.guests) {
        const guestCount = parseInt(params.guests, 10);
        if (!isNaN(guestCount)) {
            query = query.gte('max_guests', guestCount);
        }
    }

    // Owner filtering
    if (params?.ownerId) {
        query = query.contains("amenities", [`host:${params.ownerId}`]);
    }

    // Date Availability filtering
    if (params?.checkIn) {
        const searchDate = params.checkIn;
        
        // Find all listings that have a booking that includes this date
        const { data: blockedBookings } = await supabaseAdmin
            .from("bookings")
            .select("listing_id")
            .lte("check_in", searchDate)
            .gte("check_out", searchDate);

        if (blockedBookings && blockedBookings.length > 0) {
            const blockedIds = blockedBookings.map((b: any) => b.listing_id);
            query = query.not("id", "in", `(${blockedIds.join(",")})`);
        }
    }

    const { data: listings, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    return listings || [];
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return [];
  }
}