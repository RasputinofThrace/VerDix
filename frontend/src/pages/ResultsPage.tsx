import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Sparkles,
  Package,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Factory,
  Recycle,
  Droplet,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface ResultsPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  analysisResult: string;
  capturedImage: string;
}

interface ParsedAnalysis {
  productName: string;
  brand: string;
  category: string;
  score: number;
  scoreEmoji: string;
  scoreDescription: string;
  packagingScore: string;
  productionScore: string;
  companyScore: string;
  lifecycleScore: string;
  alternatives: Array<{
    name: string;
    brand: string;
    reason: string;
    price: string;
    availability: string;
  }>;
  pros: string[];
  cons: string[];
  verdict: string;
  tips: {
    disposal: string[];
    reduce: string[];
    choices: string[];
  };
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  onNavigate,
  currentPage,
  analysisResult,
  capturedImage,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview', 'score', 'alternatives', 'pros-cons', 'tips', 'verdict'])
  );

  // Parse analysis using useMemo to avoid re-parsing on every render
  // Parse analysis using useMemo to avoid re-parsing on every render
const parsedData = useMemo(() => {
  try {
    console.log('Raw analysis text:', analysisResult); // Debug

    // Extract product name
    const nameMatch = analysisResult.match(/Product Name:\s*(.+?)(?:\n|$)/i);
    const productName = nameMatch ? nameMatch[1].trim() : 'Product';

    // Extract brand
    const brandMatch = analysisResult.match(/Brand:\s*(.+?)(?:\n|$)/i);
    const brand = brandMatch ? brandMatch[1].trim() : 'Unknown';

    // Extract category
    const categoryMatch = analysisResult.match(/Category:\s*(.+?)(?:\n|$)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : 'General';

    // Extract score
    const scoreMatch = analysisResult.match(/SUSTAINABILITY SCORE:\s*(\d+)\/10/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    // Get score emoji and description
    let scoreEmoji = '⚖️';
    let scoreDescription = 'Average';
    if (score >= 9) {
      scoreEmoji = '🌟';
      scoreDescription = 'Excellent';
    } else if (score >= 7) {
      scoreEmoji = '🌿';
      scoreDescription = 'Very Good';
    } else if (score >= 5) {
      scoreEmoji = '⚖️';
      scoreDescription = 'Average';
    } else if (score >= 3) {
      scoreEmoji = '⚠️';
      scoreDescription = 'Below Average';
    } else {
      scoreEmoji = '🚨';
      scoreDescription = 'Poor';
    }

    // Extract score breakdown - match the exact format from prompt
    const scoreDetailsSection = analysisResult.match(/Score Details:([\s\S]*?)(?:PROS|CONS|ALTERNATIVES)/i);
    let packagingScore = 'N/A';
    let productionScore = 'N/A';
    let companyScore = 'N/A';
    let lifecycleScore = 'N/A';

    if (scoreDetailsSection) {
      const breakdownText = scoreDetailsSection[1];
      const packagingMatch = breakdownText.match(/• Packaging:\s*(\d+)\/3\s*-\s*([^\n]+)/i);
      const productionMatch = breakdownText.match(/• Production:\s*(\d+)\/3\s*-\s*([^\n]+)/i);
      const companyMatch = breakdownText.match(/• Company Ethics:\s*(\d+)\/2\s*-\s*([^\n]+)/i);
      const lifecycleMatch = breakdownText.match(/• Lifecycle Impact:\s*(\d+)\/2\s*-\s*([^\n]+)/i);

      packagingScore = packagingMatch ? `${packagingMatch[1]}/3 - ${packagingMatch[2].trim()}` : 'N/A';
      productionScore = productionMatch ? `${productionMatch[1]}/3 - ${productionMatch[2].trim()}` : 'N/A';
      companyScore = companyMatch ? `${companyMatch[1]}/2 - ${companyMatch[2].trim()}` : 'N/A';
      lifecycleScore = lifecycleMatch ? `${lifecycleMatch[1]}/2 - ${lifecycleMatch[2].trim()}` : 'N/A';
    }

    // Extract pros - simple bullet point parsing
    const pros: string[] = [];
    const prosSection = analysisResult.match(/PROS\s*\n([\s\S]*?)(?:CONS|ALTERNATIVES|ACTION TIPS)/i);
    if (prosSection) {
      const prosText = prosSection[1];
      const proMatches = prosText.matchAll(/•\s*([^\n]+)/g);
      for (const match of proMatches) {
        pros.push(match[1].trim());
      }
    }

    // Extract cons - simple bullet point parsing
    const cons: string[] = [];
    const consSection = analysisResult.match(/CONS\s*\n([\s\S]*?)(?:PROS|ALTERNATIVES|ACTION TIPS)/i);
    if (consSection) {
      const consText = consSection[1];
      const conMatches = consText.matchAll(/•\s*([^\n]+)/g);
      for (const match of conMatches) {
        cons.push(match[1].trim());
      }
    }

    console.log('Pros:', pros, 'Cons:', cons); // Debug

    // Extract alternatives - IMPROVED PARSING for continuous text
const alternatives: ParsedAnalysis['alternatives'] = [];
const altSection = analysisResult.match(/ALTERNATIVES\s*\n([\s\S]*?)(?:ACTION TIPS|VERDICT)/i);

if (altSection) {
  const altText = altSection[1];
  console.log('Alternatives raw text:', altText); // Debug
  
  // Method 1: Try parsing with flexible regex that handles continuous text
  const altRegex = /(\d+)\.\s*([^\n]+?)\s*Brand:\s*([^\n]+?)\s*Why better:\s*([^\n]+?)\s*Price:\s*([^\n]+?)\s*Where:\s*([^\n]+?)(?=\d+\.|ACTION TIPS|VERDICT|$)/gi;
  
  let match;
  while ((match = altRegex.exec(altText)) !== null) {
    console.log('Found alternative (Method 1):', match);
    alternatives.push({
      name: match[2].trim(),
      brand: match[3].trim(),
      reason: match[4].trim(),
      price: match[5].trim(),
      availability: match[6].trim()
    });
  }
  
  // Method 2: If no matches, try with normalized spacing
  if (alternatives.length === 0) {
    const normalizedText = altText.replace(/\s+/g, ' ').trim();
    console.log('Normalized alternatives text:', normalizedText);
    
    const altRegex2 = /(\d+)\.\s*([^B]+?)\s*Brand:\s*([^W]+?)\s*Why better:\s*([^P]+?)\s*Price:\s*([^W]+?)\s*Where:\s*([^\d]+?)(?=\d+\.|$)/gi;
    
    let match2;
    while ((match2 = altRegex2.exec(normalizedText)) !== null) {
      console.log('Found alternative (Method 2):', match2);
      alternatives.push({
        name: match2[2].trim(),
        brand: match2[3].trim(),
        reason: match2[4].trim(),
        price: match2[5].trim(),
        availability: match2[6].trim()
      });
    }
  }
  
  // Method 3: Line-by-line parsing as fallback
  if (alternatives.length === 0) {
    console.log('Trying line-by-line parsing...');
    const lines = altText.split('\n').filter(line => line.trim());
    let currentAlt: any = null;
    let fieldOrder: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Start new alternative
      if (/^\d+\./.test(trimmed)) {
        if (currentAlt && currentAlt.name) {
          alternatives.push(currentAlt);
        }
        currentAlt = { 
          name: trimmed.replace(/^\d+\.\s*/, '').trim() 
        };
        fieldOrder = ['name'];
      }
      // Brand field
      else if (trimmed.toLowerCase().startsWith('brand:')) {
        if (currentAlt) {
          currentAlt.brand = trimmed.replace(/Brand:\s*/i, '').trim();
          fieldOrder.push('brand');
        }
      }
      // Why better field
      else if (trimmed.toLowerCase().startsWith('why better:')) {
        if (currentAlt) {
          currentAlt.reason = trimmed.replace(/Why better:\s*/i, '').trim();
          fieldOrder.push('reason');
        }
      }
      // Price field
      else if (trimmed.toLowerCase().startsWith('price:')) {
        if (currentAlt) {
          currentAlt.price = trimmed.replace(/Price:\s*/i, '').trim();
          fieldOrder.push('price');
        }
      }
      // Where field
      else if (trimmed.toLowerCase().startsWith('where:')) {
        if (currentAlt) {
          currentAlt.availability = trimmed.replace(/Where:\s*/i, '').trim();
          fieldOrder.push('availability');
        }
      }
      // If line doesn't start with a field marker, it might be continuation of previous field
      else if (currentAlt && fieldOrder.length > 0) {
        const lastField = fieldOrder[fieldOrder.length - 1];
        if (lastField && currentAlt[lastField]) {
          currentAlt[lastField] += ' ' + trimmed;
        }
      }
    }
    
    // Don't forget the last alternative
    if (currentAlt && currentAlt.name && currentAlt.brand) {
      alternatives.push(currentAlt);
    }
  }
  
  // Method 4: Last resort - split by numbered items and parse each block
  if (alternatives.length === 0) {
    console.log('Trying block parsing...');
    const altBlocks = altText.split(/(?=\d+\.)/).filter(block => block.trim());
    
    for (const block of altBlocks) {
      try {
        const nameMatch = block.match(/^\d+\.\s*([^\n]+)/);
        const brandMatch = block.match(/Brand:\s*([^\n]+)/i);
        const reasonMatch = block.match(/Why better:\s*([^\n]+)/i);
        const priceMatch = block.match(/Price:\s*([^\n]+)/i);
        const availabilityMatch = block.match(/Where:\s*([^\n]+)/i);
        
        if (nameMatch && brandMatch && reasonMatch && priceMatch && availabilityMatch) {
          alternatives.push({
            name: nameMatch[1].trim(),
            brand: brandMatch[1].trim(),
            reason: reasonMatch[1].trim(),
            price: priceMatch[1].trim(),
            availability: availabilityMatch[1].trim()
          });
        }
      } catch (error) {
        console.log('Error parsing block:', error);
      }
    }
  }
}

console.log('Final alternatives found:', alternatives);

    // Extract tips - FIXED PARSING
    const tipsSection = analysisResult.match(/ACTION TIPS\s*\n([\s\S]*?)(?:VERDICT|$)/i);
    const disposal: string[] = [];
    const reduce: string[] = [];
    const choices: string[] = [];

    if (tipsSection) {
      const tipsText = tipsSection[1];
      console.log('Tips raw text:', tipsText); // Debug

      // Recycling tips - more flexible parsing
      const recyclingMatch = tipsText.match(/Recycling:([\s\S]*?)(?:Reduce Impact|Better Choices|VERDICT|$)/i);
      if (recyclingMatch) {
        const recyclingText = recyclingMatch[1];
        const recyclingTips = recyclingText.matchAll(/•\s*([^\n•]+)/g);
        for (const match of recyclingTips) {
          if (match[1].trim()) disposal.push(match[1].trim());
        }
      }

      // Reduce Impact tips - more flexible parsing
      const reduceMatch = tipsText.match(/Reduce Impact:([\s\S]*?)(?:Better Choices|Recycling|VERDICT|$)/i);
      if (reduceMatch) {
        const reduceText = reduceMatch[1];
        const reduceTips = reduceText.matchAll(/•\s*([^\n•]+)/g);
        for (const match of reduceTips) {
          if (match[1].trim()) reduce.push(match[1].trim());
        }
      }

      // Better Choices tips - more flexible parsing
      const choicesMatch = tipsText.match(/Better Choices:([\s\S]*?)(?:Recycling|Reduce Impact|VERDICT|$)/i);
      if (choicesMatch) {
        const choicesText = choicesMatch[1];
        const choicesTips = choicesText.matchAll(/•\s*([^\n•]+)/g);
        for (const match of choicesTips) {
          if (match[1].trim()) choices.push(match[1].trim());
        }
      }

      // Alternative parsing if the above doesn't work
      if (disposal.length === 0 && reduce.length === 0 && choices.length === 0) {
        const lines = tipsText.split('\n');
        let currentSection = '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.toLowerCase().includes('recycling:')) {
            currentSection = 'recycling';
          } else if (trimmed.toLowerCase().includes('reduce impact:')) {
            currentSection = 'reduce';
          } else if (trimmed.toLowerCase().includes('better choices:')) {
            currentSection = 'choices';
          } else if (trimmed.startsWith('•') && currentSection) {
            const tip = trimmed.replace('•', '').trim();
            if (currentSection === 'recycling' && tip) disposal.push(tip);
            else if (currentSection === 'reduce' && tip) reduce.push(tip);
            else if (currentSection === 'choices' && tip) choices.push(tip);
          }
        }
      }
    }

    console.log('Tips:', { disposal, reduce, choices }); // Debug

    // Extract verdict
    const verdictMatch = analysisResult.match(/VERDICT\s*\n([^\n]+)/i);
    const verdict = verdictMatch ? verdictMatch[1].trim() : '';

    return {
      productName,
      brand,
      category,
      score,
      scoreEmoji,
      scoreDescription,
      packagingScore,
      productionScore,
      companyScore,
      lifecycleScore,
      alternatives,
      pros,
      cons,
      verdict,
      tips: { disposal, reduce, choices }
    };
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return null;
  }
}, [analysisResult]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${parsedData?.productName} - Sustainability Analysis`,
        text: `Sustainability Score: ${parsedData?.score}/10 - ${parsedData?.verdict}`,
      }).catch(console.error);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${parsedData?.productName || 'product'}-analysis-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'from-green-600 to-green-400';
    if (score >= 5) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  if (!parsedData) {
    return (
      <div className="min-h-screen relative text-white overflow-hidden bg-black flex items-center justify-center">
        <StarsBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />

      <div className="relative z-10 pb-20">
        <Header title="Analysis Results" />

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('scan')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">New Scan</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-br from-gray-900/80 to-gray-900/60 backdrop-blur-lg rounded-3xl border border-gray-800 p-6 md:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-48 h-48 flex-shrink-0">
                <img
                  src={capturedImage}
                  alt={parsedData.productName}
                  className="w-full h-full object-contain rounded-2xl bg-black/20"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {parsedData.productName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300">
                        {parsedData.brand}
                      </span>
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300">
                        {parsedData.category}
                      </span>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
                </div>

                {/* Score Display */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Sustainability Score</span>
                    <span className="text-sm text-gray-400">{parsedData.scoreDescription}</span>
                  </div>
                  <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${parsedData.score * 10}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${getScoreColor(parsedData.score)}`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-3xl font-bold">{parsedData.score}/10</span>
                    <span className="text-4xl">{parsedData.scoreEmoji}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => toggleSection('breakdown')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Score Breakdown</h2>
              </div>
              {expandedSections.has('breakdown') ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {expandedSections.has('breakdown') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-800"
                >
                  <div className="p-6 grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'Packaging', value: parsedData.packagingScore, icon: Package, color: 'text-green-400' },
                      { label: 'Production', value: parsedData.productionScore, icon: Factory, color: 'text-blue-400' },
                      { label: 'Company Ethics', value: parsedData.companyScore, icon: CheckCircle, color: 'text-purple-400' },
                      { label: 'Lifecycle', value: parsedData.lifecycleScore, icon: Recycle, color: 'text-yellow-400' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-xl">
                        <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                          <div className="text-white font-semibold text-sm leading-relaxed">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pros & Cons - Collapsible */}
          {(parsedData.pros.length > 0 || parsedData.cons.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection('pros-cons')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold">Pros & Cons</h2>
                </div>
                {expandedSections.has('pros-cons') ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSections.has('pros-cons') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                      {/* Pros */}
                      {parsedData.pros.length > 0 && (
                        <div className="bg-green-900/20 backdrop-blur-lg rounded-xl border border-green-800/30 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <h3 className="text-lg font-bold">Pros</h3>
                          </div>
                          <ul className="space-y-2">
                            {parsedData.pros.map((pro, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-start space-x-2 text-sm text-gray-300"
                              >
                                <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                                <span>{pro}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cons */}
                      {parsedData.cons.length > 0 && (
                        <div className="bg-red-900/20 backdrop-blur-lg rounded-xl border border-red-800/30 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <h3 className="text-lg font-bold">Cons</h3>
                          </div>
                          <ul className="space-y-2">
                            {parsedData.cons.map((con, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-start space-x-2 text-sm text-gray-300"
                              >
                                <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                                <span>{con}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Alternatives */}
          {parsedData.alternatives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection('alternatives')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-bold">Better Alternatives</h2>
                </div>
                {expandedSections.has('alternatives') ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSections.has('alternatives') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6 space-y-4">
                      {parsedData.alternatives.map((alt, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-5 bg-gradient-to-br from-green-900/20 to-gray-800/20 rounded-xl border border-green-800/30 hover:border-green-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">{alt.name}</h4>
                              <p className="text-sm text-gray-400">{alt.brand}</p>
                            </div>
                            <span className="text-2xl">🌿</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3 leading-relaxed">{alt.reason}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300">
                              💰 {alt.price}
                            </span>
                            <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300">
                              📍 {alt.availability}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Action Tips */}
          {(parsedData.tips.disposal.length > 0 || parsedData.tips.reduce.length > 0 || parsedData.tips.choices.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection('tips')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold">Action Tips</h2>
                </div>
                {expandedSections.has('tips') ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSections.has('tips') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6 space-y-6">
                      {parsedData.tips.disposal.length > 0 && (
                        <div>
                          <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-300 mb-3">
                            <Recycle className="w-4 h-4" />
                            <span>Recycling</span>
                          </h4>
                          <ul className="space-y-2">
                            {parsedData.tips.disposal.map((tip, i) => (
                              <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {parsedData.tips.reduce.length > 0 && (
                        <div>
                          <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-300 mb-3">
                            <Droplet className="w-4 h-4" />
                            <span>Reduce Impact</span>
                          </h4>
                          <ul className="space-y-2">
                            {parsedData.tips.reduce.map((tip, i) => (
                              <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-blue-400 mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {parsedData.tips.choices.length > 0 && (
                        <div>
                          <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-300 mb-3">
                            <Leaf className="w-4 h-4" />
                            <span>Better Choices</span>
                          </h4>
                          <ul className="space-y-2">
                            {parsedData.tips.choices.map((tip, i) => (
                              <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Verdict */}
          {parsedData.verdict && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection('verdict')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold">Overall Verdict</h2>
                </div>
                {expandedSections.has('verdict') ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSections.has('verdict') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6">
                      <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/60 backdrop-blur-lg rounded-xl border border-purple-800/30 p-4">
                        <p className="text-gray-300 leading-relaxed">{parsedData.verdict}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => onNavigate('scan')}
              className="py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg"
            >
              Scan Another Product
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 active:scale-[0.98] transition-all border border-gray-700"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default ResultsPage;