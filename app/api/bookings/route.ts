import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let query = supabaseAdmin
            .from("bookings")
            .select(`
                *,
                listings (*)
            `)
            .eq("clerk_user_id", userId);

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[BOOKINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { listingId, checkIn, checkOut, guests, totalPrice } = body;

        const confirmationCode = `WB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .insert({
                clerk_user_id: userId,
                listing_id: listingId,
                check_in: checkIn,
                check_out: checkOut,
                guests,
                total_price: totalPrice,
                status: 'upcoming', // For direct demo, marking as upcoming. Usually would be 'pending' till Stripe confirms.
                confirmation_code: confirmationCode
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Create booking notification
        await supabaseAdmin.from("notifications").insert({
            clerk_user_id: userId,
            title: "Booking Confirmed",
            body: `Your stay has been confirmed. Confirmation Code: ${confirmationCode}`,
            type: 'booking',
            related_booking_id: data.id
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("[BOOKINGS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
