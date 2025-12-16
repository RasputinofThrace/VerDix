import React, { useState, useEffect } from 'react';
import { NotepadTextIcon} from 'lucide-react';
import sustainabilityTipsData from '../data/SustainabilityTips.json';

const SustainabilityTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<typeof sustainabilityTipsData[0] | null>(null);

  // Get a random tip when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sustainabilityTipsData.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTip(sustainabilityTipsData[randomIndex]);
  }, []);

  // Function to get a new random tip
  const getNewRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * sustainabilityTipsData.length);
    setCurrentTip(sustainabilityTipsData[randomIndex]);
  };

  if (!currentTip) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4 mb-3"></div>
          <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <NotepadTextIcon className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className="text-white font-bold">Sustainability Tips</h3>
        </div>
        <button
          onClick={getNewRandomTip}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Get another tip"
        >
          <svg 
            className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            {currentTip.category}
          </span>
        </div>
        <h4 className="text-white font-medium text-sm capitalize">{currentTip.title}</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {currentTip.description}
        </p>
      </div>

      {/* Small indicator that user can refresh */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Tap the refresh button for more tips</span>
        <span>{sustainabilityTipsData.length} tips available</span>
      </div>
    </div>
  );
};

export default SustainabilityTips;