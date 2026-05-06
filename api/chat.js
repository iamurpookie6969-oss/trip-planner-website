import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // ✅ allow only POST
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    // ✅ IMPORTANT: correct env variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API KEY MISSING");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("🔥 BACKEND ERROR:", error);
    return res.status(500).json({
      reply: "AI Error 😢",
      error: error.message, // 👈 THIS WILL HELP DEBUG
    });
  }
}
