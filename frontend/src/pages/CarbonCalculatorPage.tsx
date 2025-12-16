import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingDown, 
  TreePine, 
  Car, 
  Zap,
  Droplet,
  Flame,
  Info,
  ArrowRight
} from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Mock product data - replace with actual product from scan
const mockProduct = {
  name: "Single-Use Plastic Water Bottle",
  carbonPerUnit: 0.5, // kg CO2e
  waterPerUnit: 50, // liters
  energyPerUnit: 5, // MJ
};

const CarbonCalculatorPage: React.FC<Props> = ({ onNavigate, currentPage }) => {
  const [people, setPeople] = useState(1000);
  const [householdSize, setHouseholdSize] = useState(3);
  const [frequency, setFrequency] = useState(7); // times per week
  const [timeframe, setTimeframe] = useState(365); // days

  // Calculate impact
  const calculateImpact = () => {
    const totalUnits = (people * householdSize * frequency * timeframe) / 7;
    
    return {
      carbon: totalUnits * mockProduct.carbonPerUnit,
      water: totalUnits * mockProduct.waterPerUnit,
      energy: totalUnits * mockProduct.energyPerUnit,
      units: totalUnits
    };
  };

  const impact = calculateImpact();

  // Visual comparisons
  const comparisons = {
    trees: Math.round(impact.carbon / 20), // ~20kg CO2 per tree per year
    carMiles: Math.round(impact.carbon * 2.5), // ~0.4kg CO2 per mile
    homes: Math.round(impact.energy / 10800), // ~10,800 MJ per home per year
    showers: Math.round(impact.water / 100), // ~100L per shower
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />
      
      <div className="relative z-10 pb-20">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-0.5 uppercase">Carbon Calculator</h1>
            {/* Line Animation */}
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/40 to-white/20 rounded-full" />
              <span className="text-lg text-white font-light">✦</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/20 to-white/40 rounded-full" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto capitalize">
              See the real environmental impact if people switch from{' '}
              <span className="text-white font-semibold">{mockProduct.name}</span>
            </p>
          </motion.div>

          {/* Calculator Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/60 backdrop-blur-lg rounded-3xl border border-gray-800 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Impact Calculator</span>
            </h2>

            <div className="space-y-6">
              {/* Number of People */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Number of People</span>
                  </label>
                  <span className="text-2xl font-bold">{people.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>

              {/* Household Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Average Household Size</span>
                  </label>
                  <span className="text-2xl font-bold">{householdSize}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 person</span>
                  <span>8 people</span>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Uses per Week</span>
                  </label>
                  <span className="text-2xl font-bold">{frequency}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="21"
                  step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1x/week</span>
                  <span>21x/week</span>
                </div>
              </div>

              {/* Timeframe */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Timeframe</span>
                  </label>
                  <span className="text-2xl font-bold">
                    {timeframe === 365 ? '1 Year' : timeframe === 730 ? '2 Years' : `${timeframe} Days`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 90, 365, 730].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeframe(days)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                        timeframe === days
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {days === 730 ? '2Y' : days === 365 ? '1Y' : `${days}D`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Impact Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <TrendingDown className="w-6 h-6 text-green-400" />
              <span>Environmental Impact Saved</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Carbon */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-900/40 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-green-800/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-900/30 rounded-xl">
                    <Flame className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Carbon Emissions</div>
                    <div className="text-3xl font-bold text-white">
                      {(impact.carbon / 1000).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">metric tons CO₂e</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-green-600 to-green-400"
                  />
                </div>
              </motion.div>

              {/* Water */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-900/40 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-blue-800/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-900/30 rounded-xl">
                    <Droplet className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Water Saved</div>
                    <div className="text-3xl font-bold text-white">
                      {(impact.water / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-gray-500">liters</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  />
                </div>
              </motion.div>

              {/* Energy */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-yellow-900/40 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-yellow-800/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-yellow-900/30 rounded-xl">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Energy Saved</div>
                    <div className="text-3xl font-bold text-white">
                      {(impact.energy / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-gray-500">megajoules</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Visual Comparisons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/60 backdrop-blur-lg rounded-3xl border border-gray-800 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Info className="w-5 h-5 text-purple-400" />
              <span>That's Equivalent To...</span>
            </h2>

            <div className="space-y-4">
              {/* Trees */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-900/30 rounded-xl">
                    <TreePine className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {comparisons.trees.toLocaleString()} Trees Planted
                    </div>
                    <div className="text-sm text-gray-400">
                      Absorbing CO₂ for a full year
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>

              {/* Car Miles */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-900/30 rounded-xl">
                    <Car className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {comparisons.carMiles.toLocaleString()} Miles Not Driven
                    </div>
                    <div className="text-sm text-gray-400">
                      In an average gasoline car
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>

              {/* Homes */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-900/30 rounded-xl">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {comparisons.homes.toLocaleString()} Homes Powered
                    </div>
                    <div className="text-sm text-gray-400">
                      For one year with renewable energy
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>

              {/* Showers */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-900/30 rounded-xl">
                    <Droplet className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {comparisons.showers.toLocaleString()} Showers
                    </div>
                    <div className="text-sm text-gray-400">
                      Worth of water conserved
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-900/20 to-gray-900/60 backdrop-blur-lg rounded-3xl border border-green-800/30 p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-3">Every Choice Matters</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Small changes multiplied by many people create massive environmental impact. 
              Start making sustainable choices today.
            </p>
            <button
              onClick={() => onNavigate('scan')}
              className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
            >
              Scan Another Product
            </button>
          </motion.div>
        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default CarbonCalculatorPage;