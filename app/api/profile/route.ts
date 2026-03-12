import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("clerk_user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is code for 'no rows returned'
            throw error;
        }

        return NextResponse.json(data || null);
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { fullName, bio, location, phone } = body;

        const { data, error } = await supabaseAdmin
            .from("profiles")
            .upsert({
                clerk_user_id: userId,
                full_name: fullName,
                email: user.emailAddresses[0].emailAddress,
                bio,
                location,
                phone,
                avatar_url: user.imageUrl,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
