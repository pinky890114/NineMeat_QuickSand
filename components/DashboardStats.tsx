import React from 'react';
import { ThemeMode, CommissionStatus } from '../types';

interface Stats {
  queue: number;
  active: number;
  done: number;
}

interface DashboardStatsProps {
  stats: Stats;
  viewMode: ThemeMode;
  artistName: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, viewMode, artistName }) => {
  const getTitle = () => {
    if (viewMode === 'admin' && artistName) {
      return `歡迎回來，肉圓！🎨`;
    }
    return '委託進度查詢 ✨';
  };

  const getDescription = () => {
    if (viewMode === 'admin') {
      return '今天也要元氣滿滿的加工！這裡可以管理訂單和進度喔。';
    }
    return '在下方搜尋或篩選，以尋找您的委託。';
  };

  return (
    <div className="mb-10 text-center sm:text-left sm:flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="mb-8 sm:mb-0">
        <h2 className="text-3xl font-bold text-[#6F8F72] mb-3 tracking-tight">
          {getTitle()}
        </h2>
        <p className="text-stone-500 max-w-lg font-medium leading-relaxed">
          {getDescription()}
        </p>
      </div>
      <div className="flex gap-3 justify-center sm:justify-end text-sm">
        <div className="bg-white border-2 border-stone-200 px-4 py-3 rounded-2xl text-center min-w-[80px] shadow-sm transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold text-stone-600">{stats.queue}</div>
          <div className="text-xs text-stone-400 font-bold">排單中</div>
        </div>
        <div className="bg-white border-2 border-[#e8ede8] px-4 py-3 rounded-2xl text-center min-w-[80px] shadow-sm transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold text-[#6F8F72]">{stats.active}</div>
          <div className="text-xs text-[#6F8F72]/70 font-bold">製作中</div>
        </div>
        <div className="bg-white border-2 border-[#6F8F72]/20 px-4 py-3 rounded-2xl text-center min-w-[80px] shadow-sm transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold text-[#6F8F72]">{stats.done}</div>
          <div className="text-xs text-[#6F8F72]/70 font-bold">已完成</div>
        </div>
      </div>
    </div>
  );
};