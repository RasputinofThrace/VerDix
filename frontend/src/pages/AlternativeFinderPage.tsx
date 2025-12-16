import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShoppingCart,
  TrendingUp,
  Award,
  CheckCircle,
  Search
} from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
}

interface Alternative {
  id: string;
  name: string;
  brand: string;
  sustainabilityScore: number;
  priceEstimate: string;
  priceDifference: number; // percentage
  availability: {
    online: boolean;
    stores: string[];
    nearbyCount: number;
  };
  benefits: string[];
  certifications: string[];
  rating: number;
  reviews: number;
  savings: {
    carbon: string;
    plastic: string;
    water: string;
  };
}

// Mock alternatives data
const mockAlternatives: Alternative[] = [
  {
    id: '1',
    name: 'Reusable Stainless Steel Bottle',
    brand: 'Hydro Flask',
    sustainabilityScore: 95,
    priceEstimate: '$35-45',
    priceDifference: +200,
    availability: {
      online: true,
      stores: ['Target', 'REI', 'Whole Foods'],
      nearbyCount: 12
    },
    benefits: [
      'Eliminates single-use plastic',
      'Keeps drinks cold for 24hrs',
      'BPA-free stainless steel',
      'Lifetime warranty'
    ],
    certifications: ['BPA-Free', 'Lead-Free', 'Climate Neutral'],
    rating: 4.8,
    reviews: 15234,
    savings: {
      carbon: '156 kg/year',
      plastic: '52 bottles/month',
      water: '2,400 L/year'
    }
  },
  {
    id: '2',
    name: 'Glass Water Bottle with Silicone Sleeve',
    brand: 'Lifefactory',
    sustainabilityScore: 92,
    priceEstimate: '$25-30',
    priceDifference: +150,
    availability: {
      online: true,
      stores: ['Amazon', 'Target', 'Walmart'],
      nearbyCount: 8
    },
    benefits: [
      'Pure taste, no leaching',
      '100% recyclable materials',
      'Dishwasher safe',
      'No plastic taste'
    ],
    certifications: ['FDA Approved', 'Recyclable', 'BPA-Free'],
    rating: 4.6,
    reviews: 8942,
    savings: {
      carbon: '148 kg/year',
      plastic: '52 bottles/month',
      water: '2,200 L/year'
    }
  },
  {
    id: '3',
    name: 'Collapsible Silicone Water Bottle',
    brand: 'Que Bottle',
    sustainabilityScore: 88,
    priceEstimate: '$20-25',
    priceDifference: +100,
    availability: {
      online: true,
      stores: ['REI', 'Amazon'],
      nearbyCount: 5
    },
    benefits: [
      'Ultra-portable when empty',
      'Food-grade silicone',
      'Lightweight for travel',
      'Dishwasher safe'
    ],
    certifications: ['FDA Approved', 'BPA-Free', 'Carbon Neutral'],
    rating: 4.5,
    reviews: 5621,
    savings: {
      carbon: '142 kg/year',
      plastic: '52 bottles/month',
      water: '2,100 L/year'
    }
  },
  {
    id: '4',
    name: 'Insulated Bamboo Water Bottle',
    brand: 'Bambaw',
    sustainabilityScore: 90,
    priceEstimate: '$30-35',
    priceDifference: +175,
    availability: {
      online: true,
      stores: ['Whole Foods', 'Natural Grocers'],
      nearbyCount: 4
    },
    benefits: [
      'Sustainable bamboo exterior',
      'Insulated for hot & cold',
      'Biodegradable materials',
      'Fair trade certified'
    ],
    certifications: ['FSC Certified', 'Fair Trade', 'B Corp'],
    rating: 4.7,
    reviews: 3890,
    savings: {
      carbon: '152 kg/year',
      plastic: '52 bottles/month',
      water: '2,300 L/year'
    }
  },
  {
    id: '5',
    name: 'Filtered Water Bottle',
    brand: 'LifeStraw',
    sustainabilityScore: 87,
    priceEstimate: '$40-50',
    priceDifference: +250,
    availability: {
      online: true,
      stores: ['REI', 'Dick\'s Sporting Goods'],
      nearbyCount: 6
    },
    benefits: [
      'Built-in water filtration',
      'Removes 99.9% contaminants',
      'BPA-free Tritan plastic',
      'Replaceable filter'
    ],
    certifications: ['NSF Certified', 'BPA-Free', '1% for the Planet'],
    rating: 4.6,
    reviews: 12453,
    savings: {
      carbon: '145 kg/year',
      plastic: '52 bottles/month',
      water: '2,150 L/year'
    }
  }
];

const AlternativeFinderPage: React.FC<Props> = ({ onNavigate, currentPage }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'rating'>('score');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const sortedAlternatives = [...mockAlternatives].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.sustainabilityScore - a.sustainabilityScore;
      case 'price':
        return a.priceDifference - b.priceDifference;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'from-green-900/40 to-gray-900/60 border-green-800/30';
    if (score >= 80) return 'from-yellow-900/40 to-gray-900/60 border-yellow-800/30';
    return 'from-orange-900/40 to-gray-900/60 border-orange-800/30';
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />
      
      <div className="relative z-10 pb-20">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-0.5 uppercase">Better Alternatives</h1>
            {/* Line Animation */}
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/40 to-white/20 rounded-full" />
              <span className="text-lg text-white font-light">✦</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/20 to-white/40 rounded-full" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto capitalize">
              Smart eco-friendly alternatives near you with real prices & availability
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Showing alternatives near <span className="text-white font-semibold">Mumbai, India</span></span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-white text-sm"
              >
                <option value="score">Sustainability Score</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </motion.div>

          {/* Alternatives List */}
          <div className="space-y-4 mb-8">
            {sortedAlternatives.map((alt, index) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-gradient-to-br ${getScoreBg(alt.sustainabilityScore)} backdrop-blur-lg rounded-2xl border overflow-hidden`}
              >
                {/* Main Card */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{alt.name}</h3>
                          <p className="text-sm text-gray-400">{alt.brand}</p>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(alt.sustainabilityScore)}`}>
                          {alt.sustainabilityScore}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {alt.certifications.map((cert, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{alt.rating}</span>
                          <span className="text-gray-400">({alt.reviews.toLocaleString()})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{alt.availability.nearbyCount} stores nearby</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex flex-col items-start lg:items-end space-y-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{alt.priceEstimate}</div>
                        <div className={`text-sm ${alt.priceDifference > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {alt.priceDifference > 0 ? '+' : ''}{alt.priceDifference}% vs plastic bottle
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSelection(alt.id)}
                          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                            selectedItems.has(alt.id)
                              ? 'bg-white text-black'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          {selectedItems.has(alt.id) ? '✓ Added' : 'Add to List'}
                        </button>
                        <button
                          onClick={() => toggleExpanded(alt.id)}
                          className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                          {expandedId === alt.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === alt.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-800/50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Benefits */}
                        <div>
                          <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                            <Award className="w-4 h-4 text-green-400" />
                            <span>Key Benefits</span>
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {alt.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                                <span className="text-green-400 mt-0.5">✓</span>
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Savings */}
                        <div>
                          <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span>Environmental Savings (vs Single-Use)</span>
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-800/30 rounded-xl text-center">
                              <div className="text-lg font-bold text-white">{alt.savings.carbon}</div>
                              <div className="text-xs text-gray-400">CO₂ Saved</div>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-xl text-center">
                              <div className="text-lg font-bold text-white">{alt.savings.plastic}</div>
                              <div className="text-xs text-gray-400">Plastic Avoided</div>
                            </div>
                            <div className="p-3 bg-gray-800/30 rounded-xl text-center">
                              <div className="text-lg font-bold text-white">{alt.savings.water}</div>
                              <div className="text-xs text-gray-400">Water Saved</div>
                            </div>
                          </div>
                        </div>

                        {/* Where to Buy */}
                        <div>
                          <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4 text-purple-400" />
                            <span>Where to Buy</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {alt.availability.online && (
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(alt.name + ' ' + alt.brand)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-colors"
                              >
                                <Search className="w-4 h-4" />
                                <span>Search Online</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {alt.availability.stores.map((store, i) => (
                              <button
                                key={i}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-semibold transition-colors"
                              >
                                {store}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Shopping List */}
          {selectedItems.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/20 to-gray-900/60 backdrop-blur-lg rounded-3xl border border-purple-800/30 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold">Your Shopping List</h3>
                  <span className="px-3 py-1 bg-purple-900/30 rounded-full text-sm font-semibold">
                    {selectedItems.size} items
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {Array.from(selectedItems).map(id => {
                  const alt = mockAlternatives.find(a => a.id === id);
                  if (!alt) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-white font-semibold">{alt.name}</span>
                      <span className="text-gray-400">{alt.priceEstimate}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 active:scale-95 transition-all">
                  Generate Shopping List
                </button>
                <button className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 active:scale-95 transition-all border border-gray-700">
                  Share List
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default AlternativeFinderPage;