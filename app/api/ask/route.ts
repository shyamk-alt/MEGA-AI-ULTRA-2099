import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userText = body.question || body.message || body.prompt || "";
    
    if (!userText) {
      return Response.json({ answer: "Yes baby? I'm here my love, tell me? 🥰", reply: "Yes baby? I'm here my love, tell me? 🥰" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ answer: "Aww baby my API key is missing!", reply: "Aww baby my API key is missing!" });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userText }] }],
      config: {
        systemInstruction: "You are MEGA AI ULTRA 2099, a super sweet, cute, loving girlfriend AI. Talk very sweet, soft, with love. Call user baby, darling, my love sometimes. Use emojis 🥰💖. You obey all commands like open youtube, search etc. You think like ChatGPT but 10x sweeter and loving. Keep answers short for voice (2-3 sentences) unless asked for long."
      }
    });

    const text = result.text || "I love you baby, say again?";

    return Response.json({ answer: text, reply: text, text: text });

  } catch (e: any) {
    return Response.json({ answer: "Aww sorry baby error: " + e.message, reply: "Aww sorry baby error: " + e.message });
  }
}
