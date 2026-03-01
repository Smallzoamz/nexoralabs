import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Missing sessionId parameter" },
                { status: 400 }
            );
        }

        const { data: messages, error } = await supabase
            .from("chat_messages")
            .select("id, sender, content, created_at")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching chat history:", error);
            return NextResponse.json(
                { error: "Failed to fetch chat history" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { messages: messages || [] },
            { status: 200 }
        );
    } catch (error) {
        console.error("Chat history API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
