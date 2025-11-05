
// import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
// import { Offer } from '../types';

// const API_KEY = process.env.API_KEY; // This should be set in your environment

// if (!API_KEY) {
//   console.warn("API_KEY for Gemini is not set. AI Assistant will not function.");
// }

// const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// export const generateOfferSuggestions = async (
//   userQuery: string,
//   availableOffers: Offer[]
// ): Promise<string> => {
//   if (!ai) {
//     throw new Error("Gemini API client is not initialized. Check API_KEY.");
//   }

//   const offersString = availableOffers
//     .map(offer => `Title: ${offer.title}, Description: ${offer.description}, Category: ${offer.category}, Merchant: ${offer.merchant}`)
//     .join('\\n'); // Use double backslash for newline in template literal passed to API

//   const prompt = `
// You are a helpful assistant for finding card offers. Based on the user's query and the following list of available offers, please suggest up to 3 relevant offers. For each suggestion, provide the offer title and a brief explanation (1-2 sentences) of why it's a good match.

// User Query: "${userQuery}"

// Available Offers:
// ${offersString}

// If no offers are a good match, you can provide general advice related to the user's query or suggest what kind of offers they might look for. Respond in a friendly and concise manner. Format your response clearly, perhaps using bullet points for each suggested offer.
//   `;

//   try {
//     const result: GenerateContentResponse = await ai.models.generateContent({
//         model: 'gemini-2.5-flash-preview-04-17', 
//         contents: prompt,
//     });
//     return result.text;
//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     throw new Error('Failed to get suggestions from AI. Please try again later.');
//   }
// };

// This file is a placeholder to show where Gemini service logic would reside.
// For this example, the logic is directly in AIAssistantModal.tsx for brevity.
// In a production app, encapsulate API calls here.
export {};
