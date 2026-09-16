import { GoogleGenAI } from "@google/genai";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userText = body.question || body.message || "";
    if (!userText) {
      return Response.json({ answer: "Okay, I'm listening", reply: "Okay, I'm listening" });
    }
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userText }] }],
      config: { systemInstruction: "You are MEGA AI. Friendly helpful assistant. Keep replies short. Say Okay not Yes baby. Do not say any name like Shyam. Be neutral." }
    });
    const reply = (result as any).text || "Okay";
    return Response.json({ answer: reply, reply: reply });
  } catch (e: any) {
    return Response.json({ answer: "Okay, try again please", reply: "Okay, try again please" });
  }
}
