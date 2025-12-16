import React from 'react';
import { Leaf } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack }) => {
  return (
    <header className="relative z-20 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900/70 hover:bg-slate-800/80 transition-colors border border-slate-700/60 text-slate-200"
            >
              <span className="text-lg">←</span>
            </button>
          )}
          <div className="w-11 h-11 rounded-xl bg-[#059669] flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-50">Verdix</h1>
        </div>
        
        {title && (
          <span className="text-slate-100 font-medium">{title}</span>
        )}
        
        {/* Spacer for balance */}
        {!title && <div className="w-8"></div>}
      </div>
    </header>
  );
};

export default Header;