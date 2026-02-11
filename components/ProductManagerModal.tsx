import React, { useState, useEffect, useRef } from 'react';
import { ProductOptions, Product, Addon } from '../types';
import { Plus, X, Shapes, Circle, Square, RectangleHorizontal, UploadCloud, Trash2, Edit } from 'lucide-react';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productOptions: ProductOptions;
  onSave: (newOptions: ProductOptions) => void;
}

const categoryIcons = {
    '長方形': <RectangleHorizontal size={16} />,
    '正方形': <Square size={16} />,
    '圓形': <Circle size={16} />,
    '異形': <Shapes size={16} />,
};

const initialProduct: Product = { name: '', price: 0, img: '', addons: [] };

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({ isOpen, onClose, productOptions, onSave }) => {
  const [internalOptions, setInternalOptions] = useState<ProductOptions>(productOptions);
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(productOptions)[0]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditingNew, setIsEditingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalOptions(productOptions);
    if (!Object.keys(productOptions).includes(activeCategory)) {
        setActiveCategory(Object.keys(productOptions)[0] || '');
    }
  }, [productOptions, activeCategory]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(internalOptions);
    onClose();
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const handleAddonUpdate = (index: number, field: keyof Addon, value: string | number) => {
    if (editingProduct && editingProduct.addons) {
        const newAddons = [...editingProduct.addons];
        const updatedAddon = { ...newAddons[index], [field]: value };
        newAddons[index] = updatedAddon;
        handleProductChange('addons', newAddons);
    }
  };

  const handleAddAddon = () => {
      if (editingProduct) {
          const newAddons = [...(editingProduct.addons || []), { name: '', price: 0 }];
          handleProductChange('addons', newAddons);
      }
  };

  const handleRemoveAddon = (index: number) => {
      if (editingProduct && editingProduct.addons) {
          const newAddons = editingProduct.addons.filter((_, i) => i !== index);
          handleProductChange('addons', newAddons);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editingProduct) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 400;
                  const MAX_HEIGHT = 400;
                  let width = img.width;
                  let height = img.height;

                  if (width > height) {
                      if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                      }
                  } else {
                      if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                      }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const dataUrl = canvas.toDataURL(file.type, 0.8); // Compress to 80% quality
                  handleProductChange('img', dataUrl);
              };
              img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    const newOptions = { ...internalOptions };
    const categoryProducts = [...newOptions[activeCategory]];
    
    if (isEditingNew) {
        categoryProducts.push(editingProduct);
    } else {
        const index = categoryProducts.findIndex(p => p.name === editingProduct.name);
        if (index > -1) {
            categoryProducts[index] = editingProduct;
        }
    }
    
    newOptions[activeCategory] = categoryProducts;
    setInternalOptions(newOptions);
    setEditingProduct(null);
    setIsEditingNew(false);
  };
  
  const handleAddNewProduct = () => {
      setIsEditingNew(true);
      setEditingProduct({...initialProduct});
  };

  const handleDeleteProduct = (productName: string) => {
      if (window.confirm(`確定要刪除 "${productName}" 嗎？此操作無法復原。`)) {
          const newOptions = { ...internalOptions };
          newOptions[activeCategory] = newOptions[activeCategory].filter(p => p.name !== productName);
          setInternalOptions(newOptions);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white border-2 border-[#f0f3f0] rounded-3xl p-8 w-full max-w-4xl h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-stone-100 shrink-0">
            <h3 className="text-xl font-bold text-[#6F8F72] flex items-center gap-3">規格品項管理</h3>
            <button onClick={onClose} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600"><X size={20} /></button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 md:w-1/4 border-r border-stone-100 pr-4 space-y-2 overflow-y-auto">
                 {Object.keys(internalOptions).map(category => (
                    <button key={category} onClick={() => setActiveCategory(category)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === category ? 'bg-[#e8ede8] text-[#6F8F72]' : 'text-stone-500 hover:bg-stone-50'}`}>
                        {categoryIcons[category as keyof typeof categoryIcons]} {category}
                    </button>
                 ))}
            </div>

            {/* Main Content */}
            <div className="w-2/3 md:w-3/4 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h4 className="font-bold text-lg text-stone-700">{activeCategory}</h4>
                    <button onClick={handleAddNewProduct} className="flex items-center gap-2 bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] px-4 py-2 rounded-full font-bold text-xs"><Plus size={16} /> 新增品項</button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {internalOptions[activeCategory]?.map(p => (
                            <div key={p.name} className="bg-stone-50 rounded-2xl p-3 border-2 border-stone-100">
                                <img src={p.img || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                                <p className="font-bold text-sm text-stone-800">{p.name}</p>
                                <p className="text-xs text-[#6F8F72] font-bold">{p.price > 0 ? `${p.price}元` : '自帶價'}</p>
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => { setEditingProduct(p); setIsEditingNew(false); }} className="w-full flex justify-center items-center gap-1 bg-white text-stone-500 hover:text-[#6F8F72] hover:bg-[#f0f3f0] text-xs font-bold py-1.5 rounded-md border border-stone-200"><Edit size={12}/>編輯</button>
                                    <button onClick={() => handleDeleteProduct(p.name)} className="w-full flex justify-center items-center gap-1 bg-white text-stone-500 hover:text-red-500 hover:bg-red-50 text-xs font-bold py-1.5 rounded-md border border-stone-200"><Trash2 size={12}/>刪除</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end shrink-0">
            <button onClick={handleSave} className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full text-sm">儲存並關閉</button>
        </div>
      </div>
      
      {/* Editing Form Modal */}
      {editingProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="max-h-[80vh] overflow-y-auto pr-4">
                  <h4 className="font-bold text-lg mb-4">{isEditingNew ? '新增品項' : '編輯品項'}</h4>
                  <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-stone-500">品項名稱</label>
                      <input type="text" value={editingProduct.name} onChange={e => handleProductChange('name', e.target.value)} disabled={!isEditingNew} className="w-full mt-1 bg-stone-100 border-stone-200 rounded-lg px-3 py-2 text-sm disabled:opacity-50" />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-stone-500">價格 (元)</label>
                      <input type="number" value={editingProduct.price} onChange={e => handleProductChange('price', Number(e.target.value))} className="w-full mt-1 bg-stone-100 border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-stone-500 mb-2 block">附加項目</label>
                    <div className="space-y-2">
                        {(editingProduct.addons || []).map((addon, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="項目名稱" value={addon.name} onChange={e => handleAddonUpdate(index, 'name', e.target.value)} className="w-full bg-stone-100 border-stone-200 rounded-lg px-3 py-2 text-sm" />
                                <input type="number" placeholder="價格" value={addon.price} onChange={e => handleAddonUpdate(index, 'price', Number(e.target.value))} className="w-32 bg-stone-100 border-stone-200 rounded-lg px-3 py-2 text-sm" />
                                <button onClick={() => handleRemoveAddon(index)} className="p-2 text-stone-400 hover:text-red-500"><X size={16} /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddAddon} className="mt-2 text-xs font-bold text-[#6F8F72] hover:underline">+ 新增項目</button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-500">圖片</label>
                    <div className="mt-1 flex items-start gap-4">
                        <img src={editingProduct.img || 'https://via.placeholder.com/150'} alt="preview" className="w-20 h-20 object-cover rounded-md bg-stone-100 shrink-0" />
                        <div className="w-full">
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()} 
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-stone-600 border border-stone-200 rounded-lg text-sm font-bold hover:bg-stone-50"
                            >
                                <UploadCloud size={16} /> 上傳圖片
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                            
                            <div className="text-center text-xs text-stone-400 my-2 relative">
                                <span className="bg-white px-2 z-10 relative">或</span>
                                <hr className="absolute top-1/2 left-0 w-full -translate-y-1/2 border-stone-200 -z-0" />
                            </div>
                            
                            <input 
                                type="url" 
                                placeholder="貼上圖片網址..."
                                value={editingProduct.img && editingProduct.img.startsWith('http') ? editingProduct.img : ''}
                                onChange={e => handleProductChange('img', e.target.value)}
                                className="w-full bg-stone-100 border-stone-200 rounded-lg px-3 py-2 text-sm" 
                            />
                        </div>
                    </div>
                  </div>
                  </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-4">
                      <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-sm font-bold text-stone-500 bg-stone-100 rounded-lg hover:bg-stone-200">取消</button>
                      <button onClick={handleSaveProduct} className="px-4 py-2 text-sm font-bold text-white bg-[#bcc9bc] text-[#2d2d2d] rounded-lg hover:bg-[#aab5aa]">儲存</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};