import React, { useState } from 'react';
import { Palette, ArrowRight, LoaderCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (password: string) => void;
  isLoading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading = false }) => {
  const [loginInput, setLoginInput] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginInput);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200 border-2 border-stone-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#e8ede8] text-[#6F8F72] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <Palette size={32} />
        </div>
        <h3 className="text-2xl font-bold text-stone-700 mb-2">管理者登入</h3>
        <p className="text-stone-400 mb-8 font-medium">請輸入密碼以進入管理後台</p>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="請輸入密碼" 
            className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 text-center font-bold text-stone-700 focus:outline-none focus:border-[#6F8F72] focus:ring-4 focus:ring-[#6F8F72]/10 transition-all placeholder:font-normal disabled:opacity-50"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button 
            type="submit"
            disabled={!loginInput.trim() || isLoading}
            className="w-full bg-[#bcc9bc] hover:bg-[#aab5aa] text-[#2d2d2d] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#bcc9bc]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <><LoaderCircle size={18} className="animate-spin" /> 驗證中...</>
            ) : (
                <>進入管理後台 <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
