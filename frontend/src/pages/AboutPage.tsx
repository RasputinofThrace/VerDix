import React from 'react';
import { Brain, Shield, Zap, Heart, Target, Users, Sparkles } from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, currentPage }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning analyzes product sustainability using Google Gemini API'
    },
    {
      icon: Shield,
      title: 'Data Privacy First',
      description: 'Your images and data are processed securely and never stored'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get detailed sustainability reports in seconds, not hours'
    },
    {
      icon: Heart,
      title: 'Eco-Conscious',
      description: 'Designed to promote sustainable consumer choices'
    }
  ];

  return (
    <div className="min-h-screen relative text-white overflow-hidden bg-black">
      <StarsBackground />
      
      <div className="relative z-10 pb-20">
        <Header />
        
        <div className="max-w-md mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-0.5 uppercase">About Us</h1>
            {/* Line Animation */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/40 to-white/20 rounded-full" />
              <span className="text-lg text-white font-light">✦</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/20 to-white/40 rounded-full" />
            </div>
          {/* App Introduction */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6 mb-6">
            
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
            Verdix exists to make sustainable choices simple, transparent, and accessible.
            Every product we buy leaves a footprint on the planet through materials, energy, waste, and ethics. 
            We believe sustainability should not be confusing, overwhelming, or hidden behind greenwashed labels.
           
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
            We imagine a world where caring for the planet is not an extra effort 
            it’s a natural part of everyday life.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</div>
                <p className="text-gray-300 text-sm">Scan products with your camera or upload images</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</div>
                <p className="text-gray-300 text-sm">AI analyzes materials, packaging, and brand practices</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</div>
                <p className="text-gray-300 text-sm">Receive instant sustainability scores and alternatives</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">What Makes Verdix Unique</h2>
            </div>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default AboutPage;