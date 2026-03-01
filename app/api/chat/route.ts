import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ensure this API route is dynamic
export const dynamic = "force-dynamic";

// Rate limiting (simple in-memory approach per IP is in middleware, but we can do basic checks here if needed)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Need service role to bypass RLS for fetching settings/FAQs reliably inside API
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const { sessionId, message } = await req.json();

        if (!sessionId || !message) {
            return NextResponse.json(
                { error: "ข้อมูลไม่ครบถ้วน (sessionId หรือ message หายไป)" },
                { status: 400 }
            );
        }

        // 1. Save User Message to DB
        const { error: insertUserError } = await supabase
            .from("chat_messages")
            .insert({
                session_id: sessionId,
                sender: "user",
                content: message,
            });

        if (insertUserError) {
            console.error("Error saving user message:", insertUserError);
            return NextResponse.json(
                { error: "เกิดข้อผิดพลาดในการบันทึกข้อความ" },
                { status: 500 }
            );
        }

        // 2. Fetch Chatbot Settings (Bot Name & System Prompt)
        const { data: settingsData, error: settingsError } = await supabase
            .from("chatbot_settings")
            .select("bot_name, system_prompt")
            .eq("is_active", true)
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
            console.error("Error fetching settings:", settingsError);
        }

        const systemPrompt = settingsData?.system_prompt || "You are a helpful assistant.";

        // 3. Fetch Knowledge Base (FAQs)
        // Simplify for prototype: Fetch all active FAQs. 
        // For large scale, we'd use pgvector or full-text search.
        const { data: faqsData, error: faqsError } = await supabase
            .from("chatbot_faqs")
            .select("question, answer")
            .eq("is_active", true);

        if (faqsError) {
            console.error("Error fetching FAQs:", faqsError);
        }

        // --- Core Website Context (Injected from frontend content) ---
        const baseWebsiteContext = `
ข้อมูลพื้นฐานของบริษัท VELOZI | Dev:
- บริการ: ออกแบบและพัฒนาเว็บไซต์ระดับพรีเมียมเพื่อผู้ประกอบการ SME พร้อมระบบ Admin Panel จัดการเนื้อหาเองง่าย ดูแลโดยทีมงานมืออาชีพ
- จุดเด่นบริการหลัก 6 อย่าง:
  1. ออกแบบเว็บไซต์ (Web Design): ทันสมัย สวยงาม ตอบโจทย์ธุรกิจ รองรับทุกอุปกรณ์
  2. พัฒนาระบบ (Development): ด้วยเทคโนโลยีล่าสุด Next.js, React รวดเร็วและปลอดภัย
  3. Hosting & Database: ดูแล Hosting และ Database ด้วย Supabase พร้อม Backup อัตโนมัติ
  4. ความปลอดภัย (Security): ป้องกันการโจมตี อัปเดตระบบอย่างสม่ำเสมอ
  5. SEO Optimization: เพิ่มโอกาสปรากฏบน Google ด้วย SEO ระดับมืออาชีพ
  6. ซัพพอร์ตตลอดการใช้งาน: ทีมงานพร้อมให้ความช่วยเหลือ ตอบกลับภายในเวลาทำการ
- ทำไมต้องเลือกเรา (Why Choose Us):
  1. ตอบกลับรวดเร็ว: ภายในเวลาทำการ, กรณีระบบล่มตอบกลับภายใน 2 ชม.
  2. ปลอดภัย 100%: ระบบรักษาความปลอดภัยระดับองค์กร พร้อม Backup อัตโนมัติ
  3. ซัพพอร์ตตลอดการใช้งาน: ช่วยเหลือตลอดการใช้งาน ไม่มีค่าใช้จ่ายเพิ่ม
  4. เว็บไซต์รวดเร็ว: โหลดเร็ว ทันสมัยด้วย Next.js
  5. Admin Panel ครบครัน: จัดการเนื้อหาเว็บไซต์เองได้ ไม่ต้องพึ่งโปรแกรมเมอร์
  6. SEO Ready: พร้อม SEO ระดับองค์กร
- ช่องทางการติดต่อ:
  - อีเมล: contact@velozi.com (หรือให้ลูกค้าฝากเบอร์/อีเมลไว้ได้เลย)
  - เวลาทำการ: จันทร์ - ศุกร์: 09:00 - 18:00 น.
`;

        let knowledgeContext = baseWebsiteContext + "\nอ้างอิงข้อมูลด้านล่างนี้ (Knowledge Base) เพิ่มเติม:\n";
        if (faqsData && faqsData.length > 0) {
            faqsData.forEach((faq) => {
                knowledgeContext += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
            });
        }

        // Fetch Packages Data to add to Context
        const { data: packagesData, error: packagesError } = await supabase
            .from("packages")
            .select("name, badge, setup_price_min, setup_price_max, monthly_price_min, monthly_price_max")
            .eq("is_active", true)
            .order("order", { ascending: true });

        if (!packagesError && packagesData && packagesData.length > 0) {
            knowledgeContext += "ข้อมูลแพ็กเกจบริการทำเว็บไซต์ (VELOZI Pricing Packages):\n";
            packagesData.forEach((pkg) => {
                const setupPrice = pkg.setup_price_min === pkg.setup_price_max ? `฿${pkg.setup_price_min?.toLocaleString()}` : `฿${pkg.setup_price_min?.toLocaleString()} - ฿${pkg.setup_price_max?.toLocaleString()}`;
                const monthlyPrice = pkg.monthly_price_min === pkg.monthly_price_max ? `฿${pkg.monthly_price_min?.toLocaleString()}` : `฿${pkg.monthly_price_min?.toLocaleString()} - ฿${pkg.monthly_price_max?.toLocaleString()}`;
                knowledgeContext += `- แพ็กเกจ ${pkg.name} (${pkg.badge}): ค่า Setup เริ่มต้น ${setupPrice}, ส่วนค่าดูแลรายเดือน ${monthlyPrice}\n`;
            });
            knowledgeContext += "\nสำคัญ: กรุณาเสนอราคาและข้อมูลแพ็กเกจตามรายการด้านบนนี้เท่านั้น ห้ามแต่งเติมแพ็กเกจใหม่ (เช่น Enterprise) เองเด็ดขาด หากลูกค้าต้องการฟังก์ชันที่ซับซ้อนกว่านี้ ให้แจ้งว่าต้องให้ทีมงานประเมินราคาเพิ่มเติมและขอช่องทางติดต่อลูกค้าครับ\n\n";
        } else {
            // Fallback default packages matching the frontend UI
            knowledgeContext += "ข้อมูลแพ็กเกจบริการทำเว็บไซต์ (VELOZI Pricing Packages) ที่มีให้บริการปัจจุบัน:\n";
            knowledgeContext += "- แพ็กเกจ Starter (แนะนำสำหรับธุรกิจเล็ก): ค่า Setup เริ่มต้น ฿4,500, ส่วนค่าดูแลรายเดือน ฿1,000 (รวมเว็บไซต์, ฟอร์มลูกค้า, Hosting, Backup และแก้เล็กน้อย)\n";
            knowledgeContext += "- แพ็กเกจ Professional (ธุรกิจปานกลาง): ค่า Setup เริ่มต้น ฿10,000, ส่วนค่าดูแลรายเดือน ฿2,000 (รวมระบบ Admin Panel, Dashboard, และ Support ด่วนจัดเต็ม)\n";
            knowledgeContext += "\nสำคัญ: กรุณาเสนอราคาเฉพาะแพ็กเกจ Starter หรือ Professional ตามรายการด้านบนนี้เท่านั้น ห้ามประดิษฐ์แพ็กเกจอื่น (เช่น Enterprise) เองเด็ดขาด หากลูกค้าต้องการฟังก์ชันที่ซับซ้อนกว่านี้ให้บอกให้ติดต่อทีมงานครับ\n\n";

            if (!faqsData || faqsData.length === 0) {
                knowledgeContext += "No additional FAQ information available at this time.\n";
            }
        }

        // 4. Fetch recent chat history (Context window: last 6 messages)
        const { data: historyData, error: historyError } = await supabase
            .from("chat_messages")
            .select("sender, content")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: false })
            .limit(6); // current message + 5 previous

        if (historyError) {
            console.error("Error fetching chat history:", historyError);
        }

        // Reverse to chronological order for OpenAI
        const recentMessages = (historyData || []).reverse().map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
        }));

        // Construct OpenAI Messages Array
        const messagesToSend = [
            {
                role: "system",
                content: `${systemPrompt}\n\n${knowledgeContext}`,
            },
            ...recentMessages,
        ];

        // 5. Call Groq API (Llama 3.3 70B)
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            throw new Error("GROQ_API_KEY is not configured.");
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messagesToSend,
                temperature: 0.3, // Lower temperature for more factual, less creative responses
                max_tokens: 500, // Limit response length
            }),
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            console.error("Groq API Error Status:", groqResponse.status);
            console.error("Groq API Error Body:", errorText);
            console.error("Payload Sent:", JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messagesToSend,
                temperature: 0.3,
                max_tokens: 500,
            }, null, 2));
            throw new Error(`Failed to communicate with Groq: ${groqResponse.status} ${errorText}`);
        }

        const aiData = JSON.parse(await groqResponse.text()); // we use text() instead of json() originally so we must parse
        const aiMessageContent = aiData.choices?.[0]?.message?.content?.trim() || "ขออภัยครับ ระบบไม่สามารถประมวลผลคำตอบได้ในขณะนี้";

        // 6. Save AI Response to DB
        const { error: insertAiError } = await supabase
            .from("chat_messages")
            .insert({
                session_id: sessionId,
                sender: "ai",
                content: aiMessageContent,
            });

        if (insertAiError) {
            console.error("Error saving AI message:", insertAiError);
            // We still return the response to the user even if DB save fails to not break the experience
        }

        return NextResponse.json(
            { response: aiMessageContent },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Chat API error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Internal Server Error", details: errorMessage },
            { status: 500 }
        );
    }
}
