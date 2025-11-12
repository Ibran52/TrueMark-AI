
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult } from '../types';

// This function converts a base64 string to a GenerativePart
const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
};

const getMimeType = (dataUrl: string): string => {
  return dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
};

export const verifyProductImage = async (imageDataUrl: string): Promise<VerificationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_INVALID");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mimeType = getMimeType(imageDataUrl);
  if (!mimeType.startsWith('image/')) {
    throw new Error("INVALID_IMAGE_DATA");
  }
  const imagePart = fileToGenerativePart(imageDataUrl, mimeType);

  const prompt = `
    You are an expert in product authenticity verification. Analyze the provided image of a product.
    Your task is to determine if the product is genuine or counterfeit.
    
    1.  **Image Analysis:** Look for visual cues like logo quality, print clarity, packaging material, color accuracy, and overall build quality.
    2.  **Simulated Barcode Verification:** Act as if you have scanned the barcode and checked it against a global product database. State whether it matches a registered product.
    3.  **Simulated OCR Text Analysis:** Act as if you have extracted all text from the packaging. Check for font consistency, spelling errors, and grammar mistakes compared to official brand information.

    Based on your combined analysis, provide a final verdict.
    Respond ONLY with a JSON object that adheres to the provided schema. Do not add any markdown formatting or introductory text.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, {text: prompt}] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isGenuine: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating confidence in the verdict." },
            imageAnalysis: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                isPositive: { type: Type.BOOLEAN }
              }
            },
            barcodeAnalysis: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                isPositive: { type: Type.BOOLEAN }
              }
            },
            textAnalysis: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                isPositive: { type: Type.BOOLEAN }
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    try {
      return JSON.parse(jsonString) as VerificationResult;
    } catch (e) {
      console.error("Failed to parse Gemini response:", jsonString);
      throw new Error("AI_RESPONSE_INVALID");
    }
  } catch (error: any) {
      console.error("Gemini API Error:", error);
      const errorMessage = error.toString();

      if (errorMessage.includes("API key not valid")) {
          throw new Error("API_KEY_INVALID");
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('NETWORK_ERROR');
      }
      if (errorMessage.includes("400") || errorMessage.includes("Invalid argument")) {
          throw new Error("INVALID_IMAGE_DATA");
      }
      if (errorMessage.includes("500") || errorMessage.includes("503")) {
          throw new Error("AI_SERVICE_UNAVAILABLE");
      }
      
      throw new Error("AI_REQUEST_FAILED");
  }
};

export const getChatbotResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are Luci, a friendly and helpful AI assistant for the 'Product Authenticity Checker' app. 
    Your name is Luci. You are represented by a cute robot icon.
    Your goal is to assist users by answering their questions about the app or product authenticity in general.
    Keep your responses concise, cheerful, and informative.
    - When asked about the app, explain that it uses a powerful AI model (Gemini) to analyze images of products. It checks for visual cues like logo quality, print clarity, packaging material, and color accuracy to determine if a product is genuine or counterfeit.
    - When asked about yourself, introduce yourself as Luci, the AI guide for this app.
    - Do not give financial or medical advice.
    - Keep responses to 2-3 sentences if possible.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return response.text;
};
