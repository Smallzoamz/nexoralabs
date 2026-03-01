import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS for session creation if needed
// Or use standard client depending on RLS. Since we allowed INSERT TO PUBLIC, anon is fine,,
// but we'll use standard anon key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function POST(req: NextRequest) {
    try {
        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "กรุณากรอกชื่อและอีเมลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // Insert new session into chat_sessions table
        const { data: sessionData, error: sessionError } = await supabase
            .from("chat_sessions")
            .insert({
                customer_name: name,
                customer_email: email,
                status: "active",
            })
            .select("id")
            .single();

        if (sessionError) {
            console.error("Error creating chat session:", sessionError);
            return NextResponse.json(
                { error: "เกิดข้อผิดพลาดในการเริ่มเซสชันการแชท" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { sessionId: sessionData.id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Chat session error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
