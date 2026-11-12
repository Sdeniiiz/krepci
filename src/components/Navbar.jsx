import React, { useState } from 'react';
import { Phone, Utensils, Smartphone, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/menuData';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onToggleMobileMode, isMobileMode, cartCount, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'menu', label: 'Haftalık Menü' },
    { id: 'subscribe', label: 'Abonelik Planla' },
    { id: 'pricing', label: 'Porsiyon Fiyatları' },
    { id: 'how-it-works', label: 'Nasıl Çalışır?' },
    { id: 'dashboard', label: 'Yemek Takvimim' }
  ];

  return (
    <>
      {/* İnce & Zarif Üst Bilgi Satırı */}
      <div className="bg-[#0e3d29] text-[#f7e7ce] text-xs py-2 px-4 border-b border-[#e2991e]/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e]"></span>
            <span>{BRAND_INFO.slogans.bannerTop}</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
              className="text-stone-200 hover:text-[#e2991e] transition-colors flex items-center gap-1.5"
            >
              <Phone size={12} className="text-[#e2991e]" />
              <span>Sipariş: {BRAND_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-white/30">•</span>
            <button
              onClick={onToggleMobileMode}
              className="hidden sm:flex items-center gap-1.5 text-stone-200 hover:text-[#e2991e] transition-colors cursor-pointer"
            >
              <Smartphone size={13} className="text-[#e2991e]" />
              <span>Mobil Görünüm</span>
            </button>
            <span className="hidden sm:inline text-white/30">•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white font-bold transition-colors cursor-pointer"
              title="Mutfak & Sevkiyat Yönetim Paneli"
            >
              <span>⚙️ Yönetim Paneli</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon (The Perfect Plate Zarafeti - Butonsuz, Minimalist) */}
      <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('menu')}
              className="cursor-pointer flex items-baseline gap-2 group"
            >
              <span className="font-serif font-black text-2xl tracking-tight text-[#0e3d29]">
                KREPCİ
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#e2991e] font-semibold">
                Ev Yemekleri
              </span>
            </div>

            {/* Masaüstü Menü Linkleri (Kutu ve buton YOK - Zarif Alt Çizgili Metin) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`text-sm tracking-wide transition-all relative py-2 cursor-pointer ${
                      isActive
                        ? 'text-[#0e3d29] font-bold'
                        : 'text-stone-600 hover:text-[#0e3d29] font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e3d29]"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sağ Taraf: Zarif İkonlar & Minimalist Eylem */}
            <div className="hidden sm:flex items-center gap-5">
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-stone-600 hover:text-[#0e3d29] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <User size={15} />
                <span>Giriş</span>
              </button>

              <span className="w-px h-4 bg-stone-300"></span>

              <button
                onClick={onOpenCart}
                className="text-xs font-bold text-[#0e3d29] hover:text-[#185a3e] transition-colors flex items-center gap-1.5 cursor-pointer relative"
              >
                <ShoppingBag size={16} className="text-[#0e3d29]" />
                <span>Programım</span>
                {cartCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#e2991e]"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('subscribe')}
                className="ml-2 text-xs font-bold text-[#f7e7ce] bg-[#0e3d29] hover:bg-[#185a3e] px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Abone Ol</span>
                <ArrowRight size={13} className="text-[#e2991e]" />
              </button>
            </div>

            {/* Mobil Menü Butonu */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onToggleMobileMode}
                className="p-2 text-stone-700"
                title="Mobil Simülatör"
              >
                <Smartphone size={20} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-800"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobil Açılır Menü (Kutu butonlar yerine editoryal liste) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#faf7f2] border-t border-stone-200 px-6 py-6 space-y-4">
            <div className="divide-y divide-stone-200">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 font-serif text-base cursor-pointer ${
                    activeTab === link.id ? 'font-bold text-[#0e3d29]' : 'text-stone-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-stone-600">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="font-bold text-[#0e3d29]"
              >
                Giriş Yap / Kayıt
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="font-bold text-amber-900 underline"
              >
                ⚙️ Yönetim Paneli
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
