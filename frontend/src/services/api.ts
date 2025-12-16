// Point to local backend by default during development.
// You can override this with VITE_API_BASE_URL in a .env file if needed.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  error?: string;
  timestamp: string;
}

export async function analyzeProduct(imageBase64: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    const data: AnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to server',
      timestamp: new Date().toISOString(),
    };
  }
}