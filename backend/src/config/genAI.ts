import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const apiKeyTwo = process.env.GEMINI_API_KEY_TWO;

if (!apiKey) {
  console.warn("⚠️  GEMINI_API_KEY not set - AI features will not work");
}

// Export null if no API key, so consumers can check before using
export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;
export const genAI_Two = apiKeyTwo ? new GoogleGenAI({ apiKey: apiKeyTwo }) : null;