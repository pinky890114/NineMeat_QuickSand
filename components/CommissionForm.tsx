import React, { useState, useMemo } from 'react';
import { Check, ArrowLeft, Send, Shapes, Circle, Square, RectangleHorizontal, Edit } from 'lucide-react';
import { Product, ProductOptions, Commission, CommissionStatus } from '../types';
import { AddonSelectionModal } from './AddonSelectionModal';

interface CommissionFormProps {
  onNavigateHome: () => void;
  productOptions: ProductOptions;
  onAddCommission: (commissionData: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated' | 'artistId'>) => void;
}

const steps = [
  { id: 1, name: '委託須知' },
  { id: 2, name: '訂做流程' },
  { id: 3, name: '規格選擇' },
  { id: 4, name: '資料填寫' },
];

const categoryIcons = {
    '長方形': <RectangleHorizontal size={16} />,
    '正方形': <Square size={16} />,
    '圓形': <Circle size={16} />,
    '異形': <Shapes size={16} />,
};

const addonColors: { [key: string]: string } = {
    '特殊亮片': 'bg-emerald-50 text-emerald-700',
    'PET膠帶': 'bg-sky-50 text-sky-700',
    '流沙油速': 'bg-indigo-50 text-indigo-700',
    '立牌款式': 'bg-purple-50 text-purple-700',
    '吊牌款式': 'bg-amber-50 text-amber-700',
    '多層流沙層': 'bg-rose-50 text-rose-700',
    '閃粉數量': 'bg-teal-50 text-teal-700',
    '磁吸款': 'bg-pink-50 text-pink-700',
    '雙色款': 'bg-yellow-50 text-yellow-700',
};

export const CommissionForm: React.FC<CommissionFormProps> = ({ onNavigateHome, productOptions, onAddCommission }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(productOptions)[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [productForAddons, setProductForAddons] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', notes: '' });

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Do not reset selection here to allow users to browse other categories without losing their choice
  };
  
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const addonsPrice = selectedAddons.reduce((total, addonName) => {
        const addon = selectedProduct.addons?.find(a => a.name === addonName);
        return total + (addon?.price || 0);
    }, 0);
    return selectedProduct.price + addonsPrice;
  }, [selectedProduct, selectedAddons]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
        alert("請先選擇您想訂製的規格。");
        return;
    }

    let commissionType: Commission['type'] = '其他客製';
    if (selectedAddons.includes('立牌款式')) {
        commissionType = '流麻立牌';
    } else if (selectedAddons.includes('吊牌款式')) {
        commissionType = '流麻吊飾';
    } else if (selectedProduct.name.toLowerCase().includes('磚')) {
        commissionType = '流麻磚';
    }

    let description = `[客戶委託單]\n規格: ${selectedProduct.name}\n`;
    if (selectedAddons.length > 0) {
        const addonsWithPrice = selectedAddons.map(addonName => {
            const addon = selectedProduct.addons?.find(a => a.name === addonName);
            return `${addonName} (+${addon?.price || 0}元)`;
        });
        description += `加價項目: ${addonsWithPrice.join(', ')}\n`;
    }
    description += `\n---客戶備註---\n${formData.notes || '無'}`;

    const newCommissionData: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated' | 'artistId'> = {
        clientName: formData.name,
        contact: formData.contact,
        title: `${selectedProduct.name} - ${formData.name}`,
        description: description,
        type: commissionType,
        price: totalPrice,
        // FIX: Corrected typo from QUEUE to QUEUED.
        status: CommissionStatus.QUEUED,
        notes: formData.notes,
    };

    onAddCommission(newCommissionData);

    alert('委託已送出！\n感謝您的訂製，我們會盡快與您聯繫確認細節。');
    onNavigateHome();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Progress Bar */}
      <div className="mb-12">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''}`}>
                {currentStep > step.id ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-[#6F8F72]" />
                    </div>
                    <span className="relative flex h-8 w-8 items-center justify-center bg-[#6F8F72] rounded-full">
                       <Check className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </>
                ) : currentStep === step.id ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-stone-200" />
                    </div>
                    <span className="relative flex h-8 w-8 items-center justify-center bg-white border-4 border-[#6F8F72] rounded-full" aria-current="step">
                       <span className="h-2 w-2 bg-[#6F8F72] rounded-full" aria-hidden="true" />
                    </span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-stone-200" />
                    </div>
                    <span className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-stone-300 rounded-full">
                       <span className="h-2 w-2 bg-stone-300 rounded-full" />
                    </span>
                  </>
                )}
                 <span className={`absolute top-10 text-xs font-bold whitespace-nowrap ${currentStep >= step.id ? 'text-[#6F8F72]' : 'text-stone-400'}`}>{step.name}</span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-stone-100 shadow-lg shadow-stone-200/50">
        {currentStep === 1 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold text-[#6F8F72] mb-6">委託須知</h2>
            <div className="prose prose-sm max-w-none text-stone-600 space-y-6 mb-8 font-medium">
                <div>
                    <h3 className="font-bold text-stone-800 text-base mb-2">※免責聲明</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>不接任何非授權圖片、官圖，我方僅代工，不負任何法律責任。（自帶紙片周邊不列入本項）</li>
                        <li>手作品默認有瑕，不接受完美主義評論。</li>
                        <li>開始製作後若中途取消委託，則訂金不予退還。</li>
                        <li>
                            收到實體品拆封請全程錄影，以保障雙方權益。
                            <ul className="list-circle pl-5 mt-1">
                                <li>若拆封當下有不可控的損壞(Ex.摔傷裂痕、折損、漏油)，請立即知會並提供開箱錄影，我方可無條件賠償一塊與委託內容相同之成品。</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-bold text-stone-800 text-base mb-2">※訂做須知</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            依照訂金/全款匯款順序排單，工期為3~4週。
                             <ul className="list-circle pl-5 mt-1">
                                <li>若有需加急可進行討論，需支付一定比例的加急費用。</li>
                            </ul>
                        </li>
                        <li>
                            請提供高清圖檔，若可以提供人物、背景分開的圖檔會更好作業。方便提供原檔我會超大感謝！！
                             <ul className="list-circle pl-5 mt-1">
                                <li>我方會針對畫面進行補圖、改圖，若不能接受請事先知會。</li>
                            </ul>
                        </li>
                        <li>素材皆為訂製不乾膠水晶貼，成品皆會進行四面封邊。可帶紙片讓我加工（會做切割,有需要殘塊請事先告知）</li>
                        <li>運費皆由買方負擔。（若自帶紙片也是由買方自出）</li>
                    </ul>
                </div>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  className="h-5 w-5 rounded border-stone-300 text-[#6F8F72] focus:ring-[#6F8F72]/50"
                />
                <span className="text-sm font-bold text-stone-700">我已閱讀並同意以上委託須知</span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
            <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold text-[#6F8F72] mb-6">訂做流程</h2>
                <div className="bg-stone-50 p-4 rounded-2xl border-2 border-stone-100">
                    <img 
                        src="https://img.notionusercontent.com/s3/prod-files-secure%2Fa9089d23-eab9-4f6a-a726-f94ee050d419%2F07c8f72a-9ecd-4a15-b206-4a8075531a1e%2F%E5%B7%A5%E4%BD%9C%E5%8D%80%E5%9F%9F_24x.png/size/w=960?exp=1770864125&sig=eZdOxH4qvWImzAPolELDaDJPHVpcmV4a4j-mk6hHXPY&id=302e4b83-246f-8015-b19b-fa79f2df7909&table=block&userId=f75e662a-7c83-4d90-acd1-5029177eca6c" 
                        alt="訂做流程圖"
                        className="w-full h-auto rounded-lg object-contain"
                    />
                </div>
                <p className="text-center text-xs text-stone-400 mt-4 font-medium">請詳閱上方流程圖，了解我們的訂製步驟。</p>
            </div>
        )}

        {currentStep === 3 && (
            <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold text-[#6F8F72] mb-2">規格選擇與價格</h2>
                <p className="text-stone-500 mb-6 text-sm font-medium">請先選擇形狀分類，再點選您想訂製的詳細規格。</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.keys(productOptions).map(category => (
                        <button 
                            key={category} 
                            onClick={() => handleCategoryClick(category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                                activeCategory === category 
                                ? 'bg-[#6F8F72] text-white border-[#6F8F72] shadow-md shadow-[#6F8F72]/20' 
                                : 'bg-white text-stone-500 border-stone-200 hover:border-[#6F8F72]/50 hover:text-[#6F8F72]'
                            }`}
                        >
                            {categoryIcons[category as keyof typeof categoryIcons]}
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productOptions[activeCategory]?.map(p => (
                        <button 
                            key={p.name} 
                            onClick={() => handleProductSelect(p)} 
                            className={`text-left p-3 rounded-2xl border-4 transition-all duration-200 flex flex-col ${
                                selectedProduct?.name === p.name 
                                ? 'border-[#6F8F72] bg-[#f0f3f0]' 
                                : 'border-transparent bg-white hover:border-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            <div className="aspect-square bg-stone-100 rounded-lg mb-3 overflow-hidden">
                               <img src={p.img || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-stone-800 text-sm">{p.name}</h3>
                                <p className="text-xs font-bold text-[#6F8F72] mb-2">{p.price > 0 ? `${p.price}元` : '自帶價'}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedProduct && (
                    <div className="mt-8 bg-[#f0f3f0]/50 p-5 rounded-3xl border-2 border-[#e8ede8] animate-in fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-[#6F8F72]">您的選擇：</h3>
                             <button onClick={() => handleProductSelect(selectedProduct)} className="text-xs font-bold text-[#6F8F72] hover:underline flex items-center gap-1"><Edit size={12}/> 修改選項</button>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                           <div className="flex justify-between items-center text-sm">
                                <span className="text-stone-600 font-medium">基礎規格: <span className="font-bold text-stone-800">{selectedProduct.name}</span></span>
                                <span className="font-bold text-stone-700">{selectedProduct.price}元</span>
                           </div>
                           {selectedAddons.length > 0 && (
                                <>
                                 <hr className="border-stone-100"/>
                                 <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-stone-500">加價項目:</h5>
                                    {selectedAddons.map(addonName => {
                                        const addon = selectedProduct.addons?.find(a => a.name === addonName);
                                        return (
                                            <div key={addonName} className="flex justify-between items-center text-sm">
                                                <span className="text-stone-600 font-medium">{addonName}</span>
                                                <span className="font-bold text-stone-700">+{addon?.price || 0}元</span>
                                            </div>
                                        )
                                    })}
                                 </div>
                                </>
                           )}
                           <hr className="border-stone-200 border-dashed"/>
                           <div className="flex justify-between items-center text-lg">
                               <span className="font-bold text-[#6F8F72]">總金額</span>
                               <span className="font-extrabold text-[#6F8F72]">{totalPrice}元</span>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        )}
        
        {currentStep === 4 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold text-[#6F8F72] mb-2">基本資料與備註</h2>
            <p className="text-stone-500 mb-6 text-sm font-medium">請填寫您的聯絡資訊與詳細需求。</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">您的暱稱 (ID)</label>
                    <input name="name" type="text" required value={formData.name} onChange={handleFormChange} placeholder="您的稱呼，將顯示於進度表中" className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">聯絡方式 (FB/line/Email / Discord)</label>
                    <input name="contact" type="text" required value={formData.contact} onChange={handleFormChange} placeholder="line:123456" className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2 ml-1">備註 (詳細需求)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleFormChange} placeholder="請詳細描述您的需求，例如角色外觀、配件、亮片顏色、入油種類等..." className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:ring-4 focus:ring-[#6F8F72]/10 focus:border-[#6F8F72] focus:outline-none font-medium transition-all h-32 resize-none"></textarea>
                </div>
            </form>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex justify-between items-center">
            <div>
              {currentStep > 1 ? (
                <button onClick={handleBack} className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all">
                  <ArrowLeft size={16} /> 上一步
                </button>
              ) : (
                <button onClick={onNavigateHome} className="px-5 py-2 text-xs font-bold text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-all">
                  返回首頁
                </button>
              )}
            </div>
            
            {currentStep === 1 && (
                <button onClick={handleNext} disabled={!agreedToTerms} className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95 text-sm">下一步</button>
            )}
            {currentStep === 2 && (
                 <button onClick={handleNext} className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 hover:-translate-y-0.5 active:scale-95 text-sm">下一步</button>
            )}
            {currentStep === 3 && (
                 <button onClick={handleNext} disabled={!selectedProduct} className="bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95 text-sm">下一步</button>
            )}
            {currentStep === 4 && (
                 <button onClick={handleSubmit} disabled={!formData.name || !formData.contact} className="flex items-center gap-2 bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#bcc9bc]/40 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95 text-sm">
                    <Send size={14} /> 送出委託
                 </button>
            )}
        </div>
      </div>
       <AddonSelectionModal 
            isOpen={isAddonModalOpen}
            product={productForAddons}
            onClose={() => setIsAddonModalOpen(false)}
            onSave={handleSaveAddons}
       />
    </div>
  );
};