import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) return Response.json({ answer: "Ask me something!" });
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ answer: "API Key missing in Vercel!" });

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
    });

    const text = result.text || "Ask again?";
    return Response.json({ answer: text });

  } catch (e: any) {
    console.error(e);
    return Response.json({ answer: "Brain Error: " + e.message });
  }
}
