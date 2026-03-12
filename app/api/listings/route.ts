import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        let query = supabaseAdmin
            .from("listings")
            .select("*")
            .eq("is_active", true);

        if (category) {
            query = query.eq("category", category);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[LISTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}