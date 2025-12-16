import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Gemini 2.5 Flash 
export const visionModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash', 
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

// Export Function To Get Model
export async function getVisionModel() {
  return genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });
}

console.log('✅ Using Gemini 2.5 Flash for vision analysis');