import React, { useState, useMemo } from 'react';
import { Commission, CommissionStatus, ThemeMode } from './types';
import { useCommissionStore } from './hooks/useCommissionStore';
import { useProductStore } from './hooks/useProductStore'; // Import the new hook
import { AddCommissionModal } from './components/AddCommissionModal';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { LoginScreen } from './components/LoginScreen';
import { CommissionControls } from './components/CommissionControls';
import { CommissionList } from './components/CommissionList';
import { CommissionForm } from './components/CommissionForm';
import { ProductManagerModal } from './components/ProductManagerModal'; // Import the new component
import { EditCommissionModal } from './components/EditCommissionModal';
import { Lock, Unlock, ShoppingBag, Search, GalleryHorizontal, ArrowRight, Facebook } from 'lucide-react';
import { auth } from './firebase';
import { signInAnonymously } from 'firebase/auth';

// --- HomePage Component ---
interface HomePageProps {
  onNavigateToTracker: () => void;
  onNavigateToCommissionForm: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToTracker, onNavigateToCommissionForm }) => {
  const menuItems = [
    {
      icon: <ShoppingBag size={24} className="text-[#6F8F72]" />,
      title: '流麻委託',
      description: '查看委託須知與價格，開啟您的客製化之旅。',
      action: onNavigateToCommissionForm,
    },
    {
      icon: <Search size={24} className="text-sky-700" />,
      title: '委託進度查詢',
      description: '輸入您的暱稱或 ID，即時追蹤訂單狀態。',
      action: onNavigateToTracker,
    },
    {
      icon: <GalleryHorizontal size={24} className="text-purple-700" />,
      title: '作品集展示',
      description: '欣賞過往的流麻作品，尋找您的訂製靈感。',
      action: () => {
        window.open('https://www.notion.so/302e4b83246f80769a40d5c7c0c09655?source=copy_link', '_blank');
      },
    },
    {
      icon: <Facebook size={24} className="text-blue-700" />,
      title: '聯絡方式',
      description: '有任何問題嗎？點此透過 FB 聯繫我們。',
      action: () => {
        window.open('https://www.facebook.com/profile.php?id=100080679145821', '_blank');
      },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 sm:py-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-12">
        <div className="inline-block bg-[#e8ede8] text-[#6F8F72] rounded-full px-4 py-1 text-sm font-bold mb-4 tracking-wider">
            WELCOME TO
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#6F8F72] mb-4 tracking-tight">
          肉九子的流麻雜貨舖
        </h2>
        <p className="text-stone-500 max-w-lg font-medium text-lg">
          熬粥的魔法師(∩^o^)⊃━☆ﾟ.*･｡
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-5">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-white border-2 border-stone-100 rounded-3xl p-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 flex items-center gap-6"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              index === 0 ? 'bg-[#f0f3f0]' : 
              index === 1 ? 'bg-sky-50' : 
              index === 2 ? 'bg-purple-50' : 'bg-blue-50'
            }`}>
              {item.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-stone-700">{item.title}</h3>
              <p className="text-stone-500 text-sm mt-1">{item.description}</p>
            </div>
            <ArrowRight size={20} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0 -translate-x-2 group-hover:translate-x-0" />
          </button>
        ))}
      </div>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const { commissions, addCommission, updateCommissionStatus, updateCommission, deleteCommission } = useCommissionStore();
  const { productOptions, updateProductOptions, isLoaded: productsLoaded } = useProductStore();
  
  const [appView, setAppView] = useState<'home' | 'tracker' | 'commission_form'>('home');
  const [viewMode, setViewMode] = useState<ThemeMode>('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'All'>('All');
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false); // New state for product manager
  const [currentArtist, setCurrentArtist] = useState<string>('');
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (password: string) => {
    if (password === 'ajo14576') {
      setIsLoggingIn(true);
      try {
        // 執行 Firebase 匿名登入，取得上傳權限 (Modular SDK)
        await signInAnonymously(auth);
        setCurrentArtist('肉圓');
      } catch (error: any) {
        console.error("Login failed:", error);
        alert(`登入發生錯誤: ${error.message}。請確認您已在 Firebase Console 啟用匿名登入 (Anonymous Auth)。`);
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      alert('密碼錯誤！');
    }
  };

  const handleLogout = () => {
    // 登出時不需要真的登出 Firebase，只要切換 UI 狀態即可，避免下次還要重新匿名登入
    setCurrentArtist('');
  };
  
  const handleNavigateToHome = () => {
    setAppView('home');
    setViewMode('client');
    setSearchTerm('');
    setStatusFilter('All');
  };

  const handleNavigateToTracker = () => {
    setAppView('tracker');
  };
  
  const handleNavigateToCommissionForm = () => {
    setAppView('commission_form');
  };

  const handleAddCommission = (newCommissionData: Omit<Commission, 'id' | 'dateAdded' | 'lastUpdated' | 'artistId'>) => {
    addCommission({
      ...newCommissionData,
      artistId: '肉圓',
    });
    setIsAddingModalOpen(false);
  };
  
  const handleUpdateCommission = (id: string, data: Partial<Omit<Commission, 'id'>>) => {
    updateCommission(id, data);
    setEditingCommission(null);
  };

  const toggleViewMode = () => {
    if (viewMode === 'client') {
      setAppView('tracker');
      setViewMode('admin');
    } else {
      setViewMode('client');
    }
  };

  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = term === '' ||
        c.clientName.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term);
      
      const matchesFilter = statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [commissions, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const targetCommissions = commissions;
    return {
      queue: targetCommissions.filter(c => 
        c.status === CommissionStatus.DISCUSSION || 
        c.status === CommissionStatus.DEPOSIT_PAID || 
        c.status === CommissionStatus.QUEUED
      ).length,
      active: targetCommissions.filter(c => c.status === CommissionStatus.IN_PRODUCTION).length,
      done: targetCommissions.filter(c => c.status === CommissionStatus.COMPLETED || c.status === CommissionStatus.SHIPPED).length
    };
  }, [commissions]);
  
  const isAdminView = viewMode === 'admin';
  const isLoggedIn = !!currentArtist;
  
  const renderContent = () => {
    if (!productsLoaded) {
        return <div className="text-center py-20">讀取中...</div>;
    }

    if (appView === 'home') {
      return <HomePage onNavigateToTracker={handleNavigateToTracker} onNavigateToCommissionForm={handleNavigateToCommissionForm} />;
    }
    
    if (appView === 'commission_form') {
      return <CommissionForm onNavigateHome={handleNavigateToHome} productOptions={productOptions} onAddCommission={handleAddCommission} />;
    }

    if (appView === 'tracker') {
      if (isAdminView && !isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} isLoading={isLoggingIn} />;
      }
      return (
        <>
          <DashboardStats 
            stats={stats} 
            viewMode={viewMode}
            artistName={isAdminView ? currentArtist : ''}
          />
          <CommissionControls
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onAddClick={() => setIsAddingModalOpen(true)}
            onManageProductsClick={() => setIsProductManagerOpen(true)} // New handler
          />
          <CommissionList
            commissions={filteredCommissions}
            viewMode={viewMode}
            searchTerm={searchTerm}
            onUpdateStatus={updateCommissionStatus}
            onDelete={deleteCommission}
            onEdit={(commission) => setEditingCommission(commission)}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-700 selection:bg-[#dce2dc] flex flex-col">
      <main className="flex-grow pt-12 pb-10 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {appView === 'tracker' && (
          <Header 
            viewMode={viewMode}
            currentArtist={currentArtist}
            onLogout={handleLogout}
            onNavigateHome={handleNavigateToHome}
          />
        )}

        {renderContent()}

      </main>

      <footer className="py-8 border-t border-stone-200 text-center relative">
        <p className="text-stone-400 text-sm font-medium mb-4">
            ©NineMeat
        </p>
        <div className="flex justify-center">
            <button 
                onClick={toggleViewMode}
                className={`p-2 rounded-full transition-all duration-300 ${isAdminView ? 'bg-stone-200 text-stone-600' : 'text-stone-300 hover:text-stone-400'}`}
                title={viewMode === 'client' ? "繪師登入" : "返回查詢"}
            >
                {isAdminView ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
        </div>
      </footer>

      {isAdminView && appView === 'tracker' && (
        <>
            <AddCommissionModal
              isOpen={isAddingModalOpen}
              onClose={() => setIsAddingModalOpen(false)}
              onAdd={handleAddCommission}
              productOptions={productOptions}
            />
            <ProductManagerModal
              isOpen={isProductManagerOpen}
              onClose={() => setIsProductManagerOpen(false)}
              productOptions={productOptions}
              onSave={updateProductOptions}
            />
            <EditCommissionModal
              isOpen={!!editingCommission}
              onClose={() => setEditingCommission(null)}
              onSave={handleUpdateCommission}
              commission={editingCommission}
            />
        </>
      )}
    </div>
  );
};

export default App;
