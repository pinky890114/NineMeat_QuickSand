import React from 'react';
import { CommissionStatus, ThemeMode } from '../types';
import { Search, PackagePlus, Settings } from 'lucide-react';

interface CommissionControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: CommissionStatus | 'All';
  onStatusFilterChange: (status: CommissionStatus | 'All') => void;
  viewMode: ThemeMode;
  onAddClick: () => void;
  onManageProductsClick: () => void; // New prop
}

export const CommissionControls: React.FC<CommissionControlsProps> = ({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onAddClick,
  onManageProductsClick, // New prop
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-4 z-40 bg-[#fbfaf8]/80 p-3 -mx-3 md:mx-0 rounded-3xl border-2 border-white shadow-lg shadow-stone-200/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder={viewMode === 'client' ? "輸入您的委託人暱稱 (ID) 查詢進度..." : "在您的訂單中搜尋..."}
          className="w-full bg-white border-2 border-stone-200 text-stone-700 pl-12 pr-6 py-3 rounded-full focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none transition-all placeholder:text-stone-400 font-medium"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar px-1">
        <select 
            className="bg-white border-2 border-stone-200 text-stone-600 px-6 py-3 rounded-full focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-bold cursor-pointer hover:border-stone-300 appearance-none"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
        >
            <option value="All">所有狀態</option>
            {Object.values(CommissionStatus).map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
        </select>
        
        {viewMode === 'admin' && (
          <>
            <button 
                onClick={onManageProductsClick}
                className="flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-600 px-6 py-3 rounded-full font-bold transition-all border-2 border-stone-200 whitespace-nowrap"
                title="管理規格品項"
            >
                <Settings size={20} /> 管理規格
            </button>
            <button 
                onClick={onAddClick}
                className="flex items-center gap-2 bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#bcc9bc]/40 hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap active:scale-95"
            >
                <PackagePlus size={20} /> 新增訂單
            </button>
          </>
        )}
      </div>
    </div>
  );
};