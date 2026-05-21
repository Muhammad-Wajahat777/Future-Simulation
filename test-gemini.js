import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  console.log("KEY:", process.env.GEMINI_API_KEY); // DEBUG

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "Hello",
  });

  console.log(response.text);
}

test();