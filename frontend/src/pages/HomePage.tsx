import React, { useEffect, useState } from 'react';
import {
  Scan,
  Upload,
  Map,
  Sparkles,
  Workflow,
  Calculator,
  Leaf,
  Sparkle
} from 'lucide-react';
import StarsBackground from '../components/StarsBackground';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import SustainabilityTips from '../components/SustainabilityTips';
import EcoFacts from '../components/EcoFacts';

interface HomePageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const HERO_PHRASES = [
  'Instant sustainability scores',
  'Eco-friendly alternatives',
  'Real-world impact insights'
];

const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentPage }) => {

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const phrase = HERO_PHRASES[phraseIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      // setTypedText(phrase.slice(0, charIndex + 1));
      charIndex += 1;
      if (charIndex === phrase.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        }, 2000);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [phraseIndex]);

  const features = [
    {
      icon: Scan,
      title: 'Quick Scan',
      description: 'Instant camera analysis',
      onClick: () => onNavigate('scan'),
      gradient: 'from-white to-gray-200'
    },
    {
      icon: Upload,
      title: 'Upload & Analyze',
      description: 'Use existing photos',
      onClick: () => onNavigate('upload'),
      gradient: 'from-white to-gray-200'
    },
    {
      icon: Map,
      title: 'Recyling Centers',
      description: 'Find Recycle Locations',
      onClick: () => onNavigate('recycle'),
      gradient: 'from-white to-gray-200'
    },
    {
      icon: Calculator,
      title: 'Carbon Calculator',
      description: 'Caluclate Carbon',
      onClick: () => onNavigate('carbon'),
      gradient: 'from-white to-gray-200'
    },
    {
      icon: Leaf,
      title: 'Alternative Finder',
      description: 'Find Smart Alternative',
      onClick: () => onNavigate('alternative'),
      gradient: 'from-white to-gray-200'
    }
  ];

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      <StarsBackground />
      
      {/* Main Content */}
      <div className="relative z-10 pb-24">
        <Header />

        <main className="max-w-4xl mx-auto px-6 pt-8 space-y-12">
          {/* Hero */}
          <section className="space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 border border-slate-700/60 shadow-lg shadow-emerald-500/10 backdrop-blur">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-slate-200">AI-Powered Sustainability Analysis</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-50">
                Make <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sustainable</span> Choices, Instantly
              </h1>

              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Scan any product to get instant sustainability scores, eco-friendly alternatives, and real-world impact calculations. Your conscious shopping companion.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button className="cta-primary magnetic" onClick={() => onNavigate('scan')}>
                  <Scan className="w-5 h-5" />
                  Scan a Product
                </button>
                <button className="cta-ghost magnetic" onClick={() => onNavigate('about')}>
                  <Workflow className="w-5 h-5" />
                  Learn How It Works
                </button>
              </div>
            </div>

            {/* Sustainability Insight Box - Centered Lower */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-0 blur-3xl bg-emerald-500/20" />
              <div className="relative glass-card neon-border p-6 overflow-hidden">
                <div className="glow" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-300 text-sm">Live Scanner</p>
                    <h3 className="text-xl font-semibold">Sustainability Insight</h3>
                  </div>
                  <div className="px-3 py-2 rounded-full bg-emerald-500/15 text-emerald-200 text-xs border border-emerald-500/30">
                    AI Active
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/70 via-slate-800/70 to-slate-900/70 border border-slate-700/60 p-5 shadow-inner shadow-emerald-500/10 floating">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                        <Scan className="w-6 h-6 text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Score</p>
                        <h4 className="text-2xl font-bold text-emerald-200">8.6 / 10</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Grade</p>
                      <p className="text-lg font-semibold text-emerald-300">A</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-slate-400">Packaging</p>
                      <p className="text-emerald-200 font-semibold">Low impact</p>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-slate-400">Production</p>
                      <p className="text-emerald-200 font-semibold">Ethical supply</p>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-slate-400">Lifecycle</p>
                      <p className="text-emerald-200 font-semibold">Recyclable</p>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-slate-400">Alternatives</p>
                      <p className="text-emerald-200 font-semibold">+3.2 better</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-emerald-300" />
              <h2 className="text-xl font-semibold text-slate-100">Get Started</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={index}
                    onClick={feature.onClick}
                    className="group relative glass-card p-5 text-left hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-sky-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-sky-500/10 rounded-2xl transition-colors" />
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-slate-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sustainability Tips Carousel */}
          <section className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card neon-border p-4">
              <SustainabilityTips />
            </div>
            <div className="glass-card neon-border p-4">
              <EcoFacts />
            </div>
          </section>

          {/* How It Works */}
          <section className="glass-card neon-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Workflow className="w-5 h-5 text-emerald-300" />
              <h3 className="text-lg font-semibold text-slate-100">How It Works</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                'Scan or upload product image',
                'AI analyzes sustainability factors',
                'Get instant eco-friendly insights'
              ].map((step, idx) => (
                <div key={idx} className="relative rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm font-semibold text-emerald-100">
                    {idx + 1}
                  </div>
                  <p className="text-slate-200 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;