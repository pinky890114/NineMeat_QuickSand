import React from 'react';
import { Commission, CommissionStatus, ThemeMode } from '../types';
import { CommissionCard } from './CommissionCard';
import { Search } from 'lucide-react';

interface CommissionListProps {
  commissions: Commission[];
  viewMode: ThemeMode;
  searchTerm: string;
  onUpdateStatus: (id: string, newStatus: CommissionStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (commission: Commission) => void;
}

export const CommissionList: React.FC<CommissionListProps> = ({
  commissions,
  viewMode,
  searchTerm,
  onUpdateStatus,
  onDelete,
  onEdit,
}) => {
  const shouldShowList = viewMode === 'admin' || searchTerm.trim().length > 0;

  if (!shouldShowList) {
    return (
      <div className="text-center py-20 opacity-70">
        <div className="mx-auto w-20 h-20 bg-stone-100/50 rounded-full flex items-center justify-center mb-5 animate-[pulse_3s_ease-in-out_infinite]">
          <Search className="text-stone-300" size={36} />
        </div>
        <h3 className="text-xl font-bold text-stone-500">輸入委託人暱稱開始查詢</h3>
        <p className="text-stone-400 mt-2 font-medium text-sm">請在上方搜尋欄輸入您的 ID 以查看進度</p>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-stone-200">
        <div className="mx-auto w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          <Search className="text-stone-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-stone-600">找不到相關訂單捏...</h3>
        <p className="text-stone-400 mt-2 font-medium">
          {viewMode === 'admin' ? "目前沒有符合條件的訂單" : "試試看別的關鍵字？"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {commissions.map(commission => (
        <CommissionCard 
          key={commission.id}
          commission={commission}
          isAdmin={viewMode === 'admin'}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};