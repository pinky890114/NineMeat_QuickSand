import React, { useState, useEffect } from 'react';
import { Commission, CommissionStatus, Product, ProductOptions } from '../types';
import { Plus, X, Shapes, Circle, Square, RectangleHorizontal } from 'lucide-react';
import { AddonSelectionModal } from './AddonSelectionModal';

interface AddCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (c: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated' | 'artistId'>) => void;
  productOptions: ProductOptions;
}

const initialFormData = {
    clientName: '',
    title: '',
    description: '',
    type: '流麻吊飾' as Commission['type'],
    price: 0,
    status: CommissionStatus.DISCUSSION,
};

const categoryIcons = {
    '長方形': <RectangleHorizontal size={16} />,
    '正方形': <Square size={16} />,
    '圓形': <Circle size={16} />,
    '異形': <Shapes size={16} />,
};


export const AddCommissionModal: React.FC<AddCommissionModalProps> = ({ isOpen, onClose, onAdd, productOptions }) => {
  const [formData, setFormData] = useState<Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated' | 'artistId' | 'thumbnailUrl'>>(initialFormData);
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(productOptions)[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [productForAddons, setProductForAddons] = useState<Product | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData); // Reset form when modal opens
      setSelectedProduct(null);
      setSelectedAddons([]);
      setActiveCategory(Object.keys(productOptions)[0]);
    }
  }, [isOpen, productOptions]);

  useEffect(() => {
    if (selectedProduct) {
        const addonsPrice = selectedAddons.reduce((total, addonName) => {
            const addon = selectedProduct.addons?.find(a => a.name === addonName);
            return total + (addon?.price || 0);
        }, 0);
        
        const totalPrice = selectedProduct.price + addonsPrice;
        
        let newType: Commission['type'] | undefined = undefined;
        if (selectedProduct.addons?.some(a => a.name === '立牌款式')) {
            newType = '流麻立牌';
        } else if (selectedProduct.addons?.some(a => a.name === '吊牌款式')) {
            newType = '流麻吊飾';
        }

        let description = `選擇規格: ${selectedProduct.name}\n`;
        if (selectedAddons.length > 0) {
            const addonsWithPrice = selectedAddons.map(addonName => {
                const addon = selectedProduct.addons?.find(a => a.name === addonName);
                return `${addonName} (+${addon?.price || 0}元)`;
            });
            description += `加價購: ${addonsWithPrice.join(', ')}\n`;
        }

        setFormData(prev => ({
            ...prev,
            price: totalPrice,
            description,
            ...(newType && { type: newType }),
        }));
    }
  }, [selectedProduct, selectedAddons]);
  
  const handleProductSelect = (product: Product) => {
    setProductForAddons(product);
    setIsAddonModalOpen(true);
  };
  
  const handleSaveAddons = (addons: string[]) => {
    setSelectedProduct(productForAddons);
    setSelectedAddons(addons);
    setIsAddonModalOpen(false);
    setProductForAddons(null);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      clientName: formData.clientName || '匿名委託人',
      title: formData.title || '未命名訂單',
    });
    onClose();
  };

  return (
    <>
    <div 
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-[#f0f3f0] rounded-3xl p-6 sm:p-8 w-full max-w-3xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 shadow-xl shadow-[#f0f3f0]/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-stone-100 shrink-0">
          <h3 className="text-xl font-bold text-[#6F8F72] flex items-center gap-3">
              <div className="bg-[#e8ede8] p-2 rounded-xl text-[#6F8F72]">
                  <Plus size={24} /> 
              </div>
              新增流麻訂單
          </h3>
          <button onClick={onClose} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors">
              <X size={20} />
          </button>
        </div>

        <form 
          id="add-commission-form"
          onSubmit={handleSubmit} 
          className="flex-grow overflow-y-auto pr-4 -mr-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
        >
          
          <div className="md:col-span-2 mb-4">
             <label className="block text-xs font-bold text-stone-500 mb-3 ml-1">快速選擇規格 (選填)</label>
             <div className="bg-stone-50 p-3 rounded-2xl border-2 border-stone-100">
                <div className="flex flex-wrap gap-2 mb-3">
                    {Object.keys(productOptions).map(category => (
                        <button 
                            type="button"
                            key={category} 
                            onClick={() => {
                                setActiveCategory(category);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${
                                activeCategory === category 
                                ? 'bg-[#6F8F72] text-white border-[#6F8F72] shadow-sm' 
                                : 'bg-white text-stone-500 border-stone-200 hover:border-[#6F8F72]/50 hover:text-[#6F8F72]'
                            }`}
                        >
                            {categoryIcons[category as keyof typeof categoryIcons]}
                            {category}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2">
                    {productOptions[activeCategory]?.map(p => (
                        <button 
                            type="button"
                            key={p.name} 
                            onClick={() => handleProductSelect(p)} 
                            className={`text-left p-2 rounded-lg border-2 text-xs transition-all duration-150 flex flex-col ${
                                selectedProduct?.name === p.name 
                                ? 'border-[#6F8F72] bg-white scale-105 shadow-lg' 
                                : 'border-transparent bg-white hover:border-stone-200'
                            }`}
                        >
                           <span className="font-bold text-stone-700">{p.name}</span>
                           <span className="text-stone-500">{p.price > 0 ? `${p.price}元` : '自帶價'}</span>
                        </button>
                    ))}
                </div>
             </div>
          </div>
          
          <div className="md:col-span-2"><hr className="my-4 border-stone-100" /></div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">委託人暱稱 (ID)</label>
            <input 
              required
              type="text" 
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
              placeholder="例如: ArtLover99"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">訂單項目標題</label>
            <input 
              required
              type="text" 
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="例如: OC雙人流麻吊飾"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">價格 (NTD)</label>
            <input 
              type="number" 
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">初始狀態</label>
            <div className="relative">
                <select 
                className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium appearance-none cursor-pointer transition-all"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                {Object.values(CommissionStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">製作細節 / 備註</label>
            <textarea 
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none h-40 resize-none font-medium transition-all"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="請輸入配件、亮片、入油顏色等細節..."
            />
          </div>
        </form>
        <div className="pt-6 flex justify-end border-t border-stone-100 mt-6 shrink-0">
            <button 
                type="submit"
                form="add-commission-form"
                className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 hover:-translate-y-0.5 active:scale-95 text-sm"
            >
                建立訂單
            </button>
        </div>
      </div>
    </div>
    <AddonSelectionModal 
        isOpen={isAddonModalOpen}
        product={productForAddons}
        onClose={() => setIsAddonModalOpen(false)}
        onSave={handleSaveAddons}
    />
    </>
  );
};