import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import ecoFactsData from '../data/EcoFacts.json';

const EcoFacts: React.FC = () => {
  const [randomFacts, setRandomFacts] = useState<typeof ecoFactsData>([]);

  // Function to get 3 unique random facts
  const getRandomFacts = () => {
    const shuffled = [...ecoFactsData].sort(() => 0.5 - Math.random());
    setRandomFacts(shuffled.slice(0, 3));
  };

  // Get 3 random facts when component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getRandomFacts();
  }, []);

  if (randomFacts.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-gray-700 rounded mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 mb-4 last:mb-0">
              <div className="w-6 h-6 bg-gray-700 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className="text-white font-bold">Did You Know?</h3>
        </div>
        <button
          onClick={getRandomFacts}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Get new facts"
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
      
      <div className="space-y-4">
        {randomFacts.map((fact, index) => (
          <div key={fact.id} className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm leading-relaxed">
                {fact.fact}
              </p>
              {fact.source && (
                <p className="text-gray-500 text-xs mt-1">- {fact.source}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Small indicator */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Tap refresh for more facts</span>
        <span>{ecoFactsData.length} facts available</span>
      </div>
    </div>
  );
};

export default EcoFacts;