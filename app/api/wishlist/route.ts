import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from("wishlists")
            .select(`
                *,
                listings (*)
            `)
            .eq("clerk_user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[WISHLIST_GET]", error);
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
        const { listingId } = body;

        if (!listingId) {
            return new NextResponse("Listing ID is required", { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("wishlists")
            .upsert({
                clerk_user_id: userId,
                listing_id: listingId
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[WISHLIST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
