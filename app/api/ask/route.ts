import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are ULTRON sweet female AI by Shyam, answer: ${question}` }] }] }),
    });
    const d = await r.json();
    return NextResponse.json({ answer: d?.candidates?.[0]?.content?.parts?.[0]?.text || "Ask again?" });
  } catch { return NextResponse.json({ answer: "Brain offline" }); }
}
