import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userText = body.question || body.message || body.prompt;

    if (!userText) {
      return Response.json({ answer: "Ask me something!", reply: "Ask me something!" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ answer: "API Key missing in Vercel!", reply: "API Key missing!" });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userText }] }],
    });

    const text = result.text || "I am MEGA AI ULTRA 2099!";

    // Return ALL formats so frontend never fails
    return Response.json({ 
      answer: text,
      reply: text,
      response: text,
      text: text
    });
    
  } catch (e: any) {
    console.error(e);
    return Response.json({ 
      answer: "I am online! " + e.message,
      reply: "I am online! " + e.message,
      response: "I am online! " + e.message
    });
  }
}
