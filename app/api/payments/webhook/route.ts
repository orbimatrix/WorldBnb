import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/app/libs/stripe";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const bookingId = session?.metadata?.bookingId;
        const clerkUserId = session?.metadata?.clerkUserId;

        if (!bookingId) {
            return new NextResponse("Booking ID not found in metadata", { status: 400 });
        }

        // 1. Update booking status to 'upcoming'
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from("bookings")
            .update({
                status: "upcoming",
                stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq("id", bookingId)
            .select()
            .single();

        if (bookingError) {
            console.error("Error updating booking:", bookingError);
            return new NextResponse("Error updating booking", { status: 500 });
        }

        // 2. Create notification for user
        await supabaseAdmin.from("notifications").insert({
            clerk_user_id: clerkUserId,
            title: "Payment Successful! 🎉",
            body: `Your booking for ${bookingId} has been confirmed. Confirmation code: ${booking.confirmation_code}`,
            type: "booking",
            related_booking_id: bookingId,
        });

        console.log(`Booking ${bookingId} confirmed.`);
    }

    if (event.type === "checkout.session.expired") {
        const bookingId = session?.metadata?.bookingId;
        if (bookingId) {
            await supabaseAdmin
                .from("bookings")
                .update({ status: "cancelled" })
                .eq("id", bookingId);
        }
    }

    return new NextResponse(null, { status: 200 });
}
