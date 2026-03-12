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
            .from("notifications")
            .select("*")
            .eq("clerk_user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { error } = await supabaseAdmin
            .from("notifications")
            .update({ is_read: true })
            .eq("clerk_user_id", userId);

        if (error) {
            throw error;
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.error("[NOTIFICATIONS_PATCH_ALL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
