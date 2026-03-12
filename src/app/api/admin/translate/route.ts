import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { text, type } = body;

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const apiKey = process.env.BOTHUB_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "BOTHUB_API_KEY is missing in env" }, { status: 500 });
        }

        const baseUrl = process.env.BOTHUB_BASE_URL || "https://bothub.chat/api/v2/openai/v1";

        const systemPrompt = type === "content" 
            ? "You are a professional translator. Translate the following Markdown text from Russian to English. DO NOT wrap your answer in \\`\\`\\`markdown blocks unless the original text had them at the root level. Preserve all Markdown formatting, links, bold, code blocks, etc. Only translate the text."
            : "You are a professional translator. Translate this short text/title from Russian to English. Provide only the translation, nothing else.";

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // fallback model, adjust if needed
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorResult = await response.text();
            console.error("Translation API error:", errorResult);
            return NextResponse.json({ error: "Translation failed", details: errorResult }, { status: response.status });
        }

        const data = await response.json();
        const translatedContent = data.choices?.[0]?.message?.content || "";

        return NextResponse.json({ success: true, translated: translatedContent.trim() });
    } catch (error: any) {
        console.error("Translate POST error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
