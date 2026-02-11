import React from 'react';
import { ThemeMode } from '../types';
import { Home } from 'lucide-react';

interface HeaderProps {
  viewMode: ThemeMode;
  currentArtist: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  currentArtist,
  onLogout,
  onNavigateHome
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 text-[#6F8F72] opacity-90 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          title="返回首頁"
        >
          <Home size={18} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">
          肉九子的流麻雜貨舖
        </h1>
      </div>
      
      {viewMode === 'admin' && currentArtist && (
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-sm font-bold bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm text-stone-600">
            👨‍🎨 {currentArtist}
          </span>
          <button 
            onClick={onLogout}
            className="text-xs font-bold text-stone-400 hover:text-stone-600 underline"
          >
            登出
          </button>
        </div>
      )}
    </header>
  );
};