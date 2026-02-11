import React, { useState, useEffect, useRef } from 'react';
import { ProductOptions, Product, Addon } from '../types';
import { uploadImage } from '../services/imageUploadService';
import { Plus, X, Shapes, Circle, Square, RectangleHorizontal, UploadCloud, Trash2, Edit, LoaderCircle, AlertCircle, ImageOff } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalOptions(productOptions);
    if (!Object.keys(productOptions).includes(activeCategory)) {
        setActiveCategory(Object.keys(productOptions)[0] || '');
    }
  }, [productOptions, isOpen]);

  // 重置錯誤訊息當切換產品時
  useEffect(() => {
    setUploadError(null);
  }, [editingProduct]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0] && editingProduct) {
        const file = e.target.files[0];
        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            handleProductChange('img', imageUrl);
        } catch (error: any) {
            console.error("Image upload failed:", error);
            setUploadError(error.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    const newOptions = { ...internalOptions };
    const categoryProducts = [...(newOptions[activeCategory] || [])];
    
    if (isEditingNew) {
        if (categoryProducts.some(p => p.name === editingProduct.name)) {
            alert(`品項名稱 "${editingProduct.name}" 已存在，請使用不同名稱。`);
            return;
        }
        categoryProducts.push(editingProduct);
    } else {
        const index = categoryProducts.findIndex(p => p.name === editingProduct.name);
        if (index > -1) {
            categoryProducts[index] = editingProduct;
        }
    }
    
    newOptions[activeCategory] = categoryProducts;
    setInternalOptions(newOptions);
    onSave(newOptions); 
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
          onSave(newOptions);
      }
  };
  
  // 檢查是否為看起來像網頁連結而非圖片連結 (簡易判斷)
  const isSuspiciousLink = (url: string) => {
      if (!url) return false;
      // 如果是 ibb.co 且不包含圖片副檔名，通常是網頁連結
      if (url.includes('ibb.co') && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return true;
      }
      return false;
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
                                <div className="w-full h-24 rounded-lg mb-2 bg-white overflow-hidden flex items-center justify-center border border-stone-100">
                                    {p.img ? (
                                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement?.classList.add('bg-stone-200');
                                        }} />
                                    ) : (
                                        <ImageOff size={24} className="text-stone-300" />
                                    )}
                                </div>
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
                        <div className="w-20 h-20 bg-stone-100 rounded-md shrink-0 border border-stone-200 overflow-hidden flex items-center justify-center relative">
                            {editingProduct.img ? (
                                <img 
                                    src={editingProduct.img} 
                                    alt="preview" 
                                    className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : ''}`} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        // 顯示錯誤圖示
                                    }}
                                />
                            ) : (
                                <ImageOff size={24} className="text-stone-300" />
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <LoaderCircle className="animate-spin text-white" size={20} />
                                </div>
                            )}
                        </div>
                        
                        <div className="w-full">
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()} 
                                disabled={isUploading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-stone-600 border border-stone-200 rounded-lg text-sm font-bold hover:bg-stone-50 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isUploading ? "處理中..." : <><UploadCloud size={16} /> 上傳圖片</>}
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                            
                            {uploadError && (
                                <p className="text-xs text-red-500 mt-1 font-bold flex items-center gap-1">
                                    <AlertCircle size={12} /> {uploadError}
                                </p>
                            )}
                            
                            <div className="text-center text-xs text-stone-400 my-2 relative">
                                <span className="bg-white px-2 z-10 relative">或 貼上圖片網址</span>
                                <hr className="absolute top-1/2 left-0 w-full -translate-y-1/2 border-stone-200 -z-0" />
                            </div>
                            
                            <input 
                                type="text" 
                                placeholder="例如: https://i.ibb.co/..."
                                value={editingProduct.img || ''}
                                onChange={e => handleProductChange('img', e.target.value)}
                                className={`w-full bg-stone-100 border rounded-lg px-3 py-2 text-sm transition-colors ${
                                    isSuspiciousLink(editingProduct.img || '') 
                                    ? 'border-amber-400 focus:border-amber-500 bg-amber-50' 
                                    : 'border-stone-200 focus:border-[#6F8F72]'
                                }`}
                            />
                            {isSuspiciousLink(editingProduct.img || '') && (
                                <p className="text-xs text-amber-600 mt-1 font-bold flex items-center gap-1">
                                    <AlertCircle size={12} /> 這看起來是網頁連結，圖片可能無法顯示。請使用右鍵「複製圖片位址」的連結 (通常結尾是 .jpg/.png)。
                                </p>
                            )}
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
