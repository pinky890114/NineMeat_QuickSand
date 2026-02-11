import React, { useState, useEffect } from 'react';
import { Commission } from '../types';
import { X, Edit3 } from 'lucide-react';

interface EditCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Omit<Commission, 'id'>>) => void;
  commission: Commission | null;
}

export const EditCommissionModal: React.FC<EditCommissionModalProps> = ({ isOpen, onClose, onSave, commission }) => {
  const [formData, setFormData] = useState<{ price: number; description: string }>({ price: 0, description: '' });

  useEffect(() => {
    if (commission) {
      setFormData({
        price: commission.price,
        description: commission.description,
      });
    }
  }, [commission]);

  if (!isOpen || !commission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(commission.id, formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  }

  return (
    <div 
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-[#f0f3f0] rounded-3xl p-8 w-full max-w-xl animate-in fade-in zoom-in-95 duration-200 shadow-xl shadow-[#f0f3f0]/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-stone-100">
          <h3 className="text-xl font-bold text-[#6F8F72] flex items-center gap-3">
              <div className="bg-[#e8ede8] p-2 rounded-xl text-[#6F8F72]">
                  <Edit3 size={24} /> 
              </div>
              編輯訂單
          </h3>
          <button onClick={onClose} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors">
              <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <p className="text-xs text-stone-400 font-bold">委託人</p>
                <p className="font-bold text-stone-700">{commission.clientName}</p>
                <p className="text-xs text-stone-400 font-bold mt-2">項目</p>
                <p className="font-bold text-stone-700">{commission.title}</p>
            </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">價格 (NTD)</label>
            <input 
              name="price"
              type="number" 
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">製作細節 / 備註</label>
            <textarea 
              name="description"
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none h-40 resize-none font-medium transition-all"
              value={formData.description}
              onChange={handleChange}
              placeholder="請輸入配件、亮片、入油顏色等細節..."
            />
          </div>
          
          <div className="pt-4 flex justify-end border-t border-stone-100 mt-2">
              <button 
                  type="submit"
                  className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                  儲存變更
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};