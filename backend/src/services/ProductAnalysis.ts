import { visionModel } from '../config/gemini';
import { VISUAL_ANALYSIS_PROMPT } from '../prompts/ProductAnalysis';

export interface AnalysisResult {
  success: boolean;
  analysis?: string;
  error?: string;
  timestamp: string;
}

export async function analyzeProductImage(
  imageBase64: string
): Promise<AnalysisResult> {
  try {
    console.log('🔍 Starting product analysis...');

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Prepare the image part for Gemini
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    // Generate content with vision model
    const result = await visionModel.generateContent([
      VISUAL_ANALYSIS_PROMPT,
      imagePart,
    ]);

    const response = await result.response;
    const analysis = response.text();

    console.log('✅ Analysis completed successfully');

    return {
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Analysis error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }
}