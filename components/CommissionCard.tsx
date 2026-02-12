import React, { useState } from 'react';
import { Commission, CommissionStatus } from '../types';
import { ProgressBar } from './ProgressBar';
import { STATUS_STEPS } from '../constants';
import { AdminTools } from './AdminTools';
import { 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  DollarSign, 
  Sparkles,
  Edit
} from 'lucide-react';

interface CommissionCardProps {
  commission: Commission;
  isAdmin: boolean;
  onUpdateStatus: (id: string, newStatus: CommissionStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (commission: Commission) => void;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({ 
  commission, 
  isAdmin, 
  onUpdateStatus,
  onDelete,
  onEdit
}) => {
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: CommissionStatus) => {
    switch(status) {
      case CommissionStatus.APPLYING: return 'bg-purple-50 text-purple-600 border-purple-200';
      case CommissionStatus.DISCUSSION: return 'bg-stone-100 text-stone-600 border-stone-200';
      case CommissionStatus.DEPOSIT_PAID: return 'bg-amber-50 text-amber-600 border-amber-200';
      case CommissionStatus.QUEUED: return 'bg-slate-100 text-slate-600 border-slate-200';
      case CommissionStatus.IN_PRODUCTION: return 'bg-sky-50 text-sky-600 border-sky-200';
      case CommissionStatus.COMPLETED: return 'bg-[#e8ede8] text-[#6F8F72] border-[#dce2dc]';
      case CommissionStatus.SHIPPED: return 'bg-[#bcc9bc] text-[#2d2d2d] border-[#bcc9bc]';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const handleNextStep = () => {
    const currentIndex = STATUS_STEPS.indexOf(commission.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      onUpdateStatus(commission.id, STATUS_STEPS[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = STATUS_STEPS.indexOf(commission.status);
    if (currentIndex > 0) {
      onUpdateStatus(commission.id, STATUS_STEPS[currentIndex - 1]);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDeleting) {
          onDelete(commission.id);
      } else {
          setIsDeleting(true);
          setTimeout(() => setIsDeleting(false), 3000); // Auto-revert after 3 seconds
      }
  };

  return (
    <div className="bg-white border-2 border-stone-100 rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(commission.status)}`}>
                    {commission.status}
                  </span>
                  <div className="flex flex-col">
                    <p className="text-[#6F8F72] text-sm font-bold tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6F8F72]"></span>
                        {commission.clientName}
                    </p>
                    {isAdmin && commission.contact && (
                        <p className="text-[10px] text-stone-400 font-bold ml-2.5">
                            {commission.contact}
                        </p>
                    )}
                  </div>
              </div>
              <h3 className="text-xl font-bold text-stone-700">{commission.title}</h3>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2 shrink-0 ml-2">
                  <button 
                    type="button"
                    onClick={() => setShowAdminTools(!showAdminTools)}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 ${showAdminTools ? 'bg-[#e8ede8] text-[#6F8F72] rotate-12 scale-110' : 'bg-stone-50 text-stone-400 hover:text-[#6F8F72] hover:bg-[#f0f3f0] hover:scale-110'}`}
                    title="AI 小幫手"
                  >
                    <Sparkles size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(commission)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 bg-stone-50 text-stone-400 hover:text-sky-600 hover:bg-sky-50 hover:scale-110"
                    title="編輯訂單"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className={`h-10 rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-bold whitespace-nowrap ${
                        isDeleting
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 w-28'
                        : 'bg-stone-50 text-stone-400 hover:text-red-500 hover:bg-red-50 w-10'
                    }`}
                    title="刪除"
                  >
                    {isDeleting ? '確定刪除？' : <Trash2 size={20} />}
                  </button>
              </div>
            )}
          </div>

          <div className="bg-stone-50/70 border-2 border-stone-100 rounded-2xl p-4 mb-5">
            <p className="text-stone-600 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                {commission.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-stone-500 font-bold mb-5">
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              <Calendar size={14} className="text-stone-400" /> {commission.dateAdded}
            </span>
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              <DollarSign size={14} className="text-stone-400" /> {commission.price}
            </span>
          </div>
        </div>

        <div className="mt-2 bg-stone-50/50 rounded-2xl p-4 border border-stone-100">
          <ProgressBar currentStatus={commission.status} />
          
          {isAdmin && (
            <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  disabled={commission.status === CommissionStatus.APPLYING}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 disabled:opacity-30 hover:bg-stone-100 rounded-full transition-all"
                >
                  <ChevronLeft size={16} /> 上一步
                </button>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  disabled={commission.status === CommissionStatus.SHIPPED}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#bcc9bc]/40 hover:-translate-y-0.5"
                >
                  下一步 <ChevronRight size={16} />
                </button>
            </div>
          )}
        </div>
      </div>
      
      {isAdmin && showAdminTools && (
         <AdminTools commission={commission} onClose={() => setShowAdminTools(false)} />
      )}
    </div>
  );
};