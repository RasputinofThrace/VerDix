export interface ScanHistory {
  id: string;
  productName: string;
  brand: string;
  score: number;
  date: string;
  category: string;
  image?: string;
}

// Extract product info from Gemini analysis
export function extractProductInfo(analysis: string): {
  productName: string;
  brand: string;
  score: number;
  category: string;
} {
  // Default values
  let productName = 'Unknown Product';
  let brand = 'Unknown Brand';
  let score = 5;
  let category = 'General';

  // Extract Product Name
  const nameMatch = analysis.match(/Product Name:\s*(.+?)(?:\n|Brand:)/i);
  if (nameMatch) {
    productName = nameMatch[1].trim();
  }

  // Extract Brand
  const brandMatch = analysis.match(/Brand:\s*(.+?)(?:\n|Category:)/i);
  if (brandMatch) {
    brand = brandMatch[1].trim();
  }

  // Extract Score (look for "X/10" pattern)
  const scoreMatch = analysis.match(/SUSTAINABILITY SCORE:\s*(\d+)\/10/i);
  if (scoreMatch) {
    score = parseInt(scoreMatch[1]);
  }

  // Extract Category
  const categoryMatch = analysis.match(/Category:\s*(.+?)(?:\n|Size)/i);
  if (categoryMatch) {
    category = categoryMatch[1].trim();
  }

  return { productName, brand, score, category };
}

// Add scan to history
export function addToScanHistory(
  analysis: string,
  imageBase64: string
): void {
  try {
    // Extract info from analysis
    const { productName, brand, score, category } = extractProductInfo(analysis);

    // Create new scan entry
    const newScan: ScanHistory = {
      id: `scan_${Date.now()}`,
      productName,
      brand,
      score,
      date: new Date().toISOString(),
      category,
      image: imageBase64
    };

    // Get existing history
    const existingHistory = localStorage.getItem('verdix-scanHistory');
    const history: ScanHistory[] = existingHistory 
      ? JSON.parse(existingHistory) 
      : [];

    // Add new scan to beginning
    history.unshift(newScan);

    // Keep only last 50 scans
    const limitedHistory = history.slice(0, 50);

    // Save back to localStorage
    localStorage.setItem('verdix-scanHistory', JSON.stringify(limitedHistory));

    console.log('✅ Scan added to history:', newScan);
  } catch (error) {
    console.error('❌ Error adding scan to history:', error);
  }
}

// Get scan history
export function getScanHistory(): ScanHistory[] {
  try {
    const history = localStorage.getItem('verdix-scanHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('❌ Error getting scan history:', error);
    return [];
  }
}

// Clear scan history
export function clearScanHistory(): void {
  localStorage.removeItem('verdix-scanHistory');
}