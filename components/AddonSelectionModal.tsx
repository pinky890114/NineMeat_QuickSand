import React, { useState, useEffect, useMemo } from 'react';
import { Product, Addon } from '../types';
import { X, CheckSquare, Square } from 'lucide-react';

interface AddonSelectionModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (selectedAddons: string[]) => void;
}

const addonColors: { [key: string]: string } = {
    '特殊亮片': 'border-[#dce2dc] bg-[#f0f3f0] text-[#6F8F72]',
    'PET膠帶': 'border-sky-200 bg-sky-50 text-sky-700',
    '流沙油速': 'border-indigo-200 bg-indigo-50 text-indigo-700',
    '立牌款式': 'border-purple-200 bg-purple-50 text-purple-700',
    '吊牌款式': 'border-amber-200 bg-amber-50 text-amber-700',
    '多層流沙層': 'border-rose-200 bg-rose-50 text-rose-700',
    '閃粉數量': 'border-teal-200 bg-teal-50 text-teal-700',
    '磁吸款': 'border-pink-200 bg-pink-50 text-pink-700',
    '雙色款': 'border-yellow-200 bg-yellow-50 text-yellow-700',
};

export const AddonSelectionModal: React.FC<AddonSelectionModalProps> = ({ isOpen, product, onClose, onSave }) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedAddons([]); // Reset when modal opens
    }
  }, [isOpen]);

  const totalAddonPrice = useMemo(() => {
    if (!product || !product.addons) return 0;
    return selectedAddons.reduce((total, addonName) => {
        const addon = product.addons?.find(a => a.name === addonName);
        return total + (addon?.price || 0);
    }, 0);
  }, [selectedAddons, product]);

  if (!isOpen || !product) return null;

  const handleToggleAddon = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  const handleSave = () => {
    onSave(selectedAddons);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#6F8F72]">選擇加價項目</h3>
          <button onClick={onClose} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-stone-500 mb-6">您正在為「<span className="font-bold text-stone-700">{product.name}</span>」選擇附加項目。</p>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {(product.addons && product.addons.length > 0) ? (
                product.addons.map(addon => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                        <div
                            key={addon.name}
                            onClick={() => handleToggleAddon(addon.name)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                isSelected 
                                ? 'bg-[#f0f3f0] border-[#cdd6cd] ring-2 ring-[#dce2dc]' 
                                : 'bg-stone-50 border-stone-100 hover:border-stone-200'
                            }`}
                        >
                            {isSelected ? <CheckSquare className="text-[#6F8F72]" size={20} /> : <Square className="text-stone-300" size={20} />}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${addonColors[addon.name] || 'bg-stone-100 text-stone-600'}`}>
                                {addon.name}
                            </span>
                            <span className="text-sm font-bold text-stone-500 ml-auto">+{addon.price}元</span>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-10 text-stone-400">
                    <p className="font-medium">此品項沒有可用的加價項目。</p>
                </div>
            )}
        </div>

        <div className="mt-8">
            <button
                onClick={handleSave}
                className="w-full bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full text-sm"
            >
                確認選擇 (加價總計: {totalAddonPrice}元)
            </button>
        </div>
      </div>
    </div>
  );
};