import React, { useState } from 'react';
import { Phone, Utensils, Smartphone, User, ShoppingBag, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
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

  const marqueeItems = [
    "🍲 Hijyenimiz İlkemiz, Lezzetimiz İmzamız",
    "✨ Sağlıklı ve Mide Dostu Yemeklerimizle Yanınızdayız",
    "💛 Beğeniniz Gururumuz!",
    "🛵 PAKET SERVİSİMİZLE Lezzet Kapınızda!",
    `📞 Hızlı Sipariş: ${BRAND_INFO.phone}`,
    "🥗 İstemediğiniz yemekleri çıkarın, size özel menü gelsin!",
    "📅 09 - 14 Kasım 2026 Menümüz Yayında",
    "🥘 Her gün taze, her gün lezzetli, her gün KREPCİ farkı!"
  ];

  return (
    <>
      {/* 1. Kayan Yazı Şeridi (Marquee Ticker - Mobilde ve Masaüstünde Taşmaları Önler) */}
      <div className="bg-[#0e3d29] text-[#f7e7ce] text-[11px] sm:text-xs py-1.5 overflow-hidden border-b border-[#e2991e]/20 select-none relative">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {/* 1. Kopya */}
          <div className="flex items-center gap-8 shrink-0 pr-8">
            {marqueeItems.map((item, idx) => (
              <span key={`m1-${idx}`} className="flex items-center gap-2">
                <span>{item}</span>
                <span className="text-[#e2991e] opacity-60">•</span>
              </span>
            ))}
          </div>
          {/* 2. Kesintisiz Döngü Kopyası */}
          <div className="flex items-center gap-8 shrink-0 pr-8">
            {marqueeItems.map((item, idx) => (
              <span key={`m2-${idx}`} className="flex items-center gap-2">
                <span>{item}</span>
                <span className="text-[#e2991e] opacity-60">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. İnce Üst Bilgi & Hızlı Aksiyon Satırı */}
      <div className="bg-[#0b3322] text-[#f7e7ce] text-[11px] py-1.5 px-4 hidden sm:block border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e] animate-pulse"></span>
            <span>Öğle & Akşam Servisi • Özel Termo Çantalarla Sıcak Teslimat</span>
          </div>

          <div className="flex items-center gap-5">
            <a 
              href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
              className="text-stone-200 hover:text-[#e2991e] transition-colors flex items-center gap-1.5"
            >
              <Phone size={11} className="text-[#e2991e]" />
              <span>Sipariş: {BRAND_INFO.phone}</span>
            </a>
            <span className="text-white/20">•</span>
            <button
              onClick={onToggleMobileMode}
              className="flex items-center gap-1.5 text-stone-200 hover:text-[#e2991e] transition-colors cursor-pointer"
            >
              <Smartphone size={12} className="text-[#e2991e]" />
              <span>📱 Mobil Görünüm</span>
            </button>
            <span className="text-white/20">•</span>
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

      {/* 3. Ana Navigasyon (The Perfect Plate Zarafeti - Responsive) */}
      <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('menu')}
              className="cursor-pointer flex items-baseline gap-1.5 sm:gap-2 group"
            >
              <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#0e3d29]">
                KREPCİ
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#e2991e] font-semibold">
                Ev Yemekleri
              </span>
            </div>

            {/* Masaüstü Menü Linkleri (Zarif Alt Çizgili) */}
            <nav className="hidden lg:flex items-center gap-8">
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

            {/* Sağ Taraf: Eylemler */}
            <div className="hidden sm:flex items-center gap-4">
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
                <span className="hidden md:inline">Programım</span>
                {cartCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#e2991e]"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('subscribe')}
                className="text-xs font-bold text-[#f7e7ce] bg-[#0e3d29] hover:bg-[#185a3e] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Abone Ol</span>
                <ArrowRight size={13} className="text-[#e2991e]" />
              </button>
            </div>

            {/* Mobil Butonlar (Hızlı & Responsive) */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={onToggleMobileMode}
                className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 flex items-center gap-1 text-xs font-bold"
                title="Mobil Simülatör"
              >
                <Smartphone size={17} className="text-[#0e3d29]" />
                <span>App</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-800"
                aria-label="Menü"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#faf7f2] border-t border-stone-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
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

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onToggleMobileMode();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#e2991e]/15 text-[#0e3d29] rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <Smartphone size={15} />
                <span>İnteraktif Mobil Uygulama Deneyimi</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs text-center"
              >
                ⚙️ Yönetim Paneli (Mutfak & Dağıtım)
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-stone-600">
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="font-bold text-[#0e3d29]"
                >
                  Giriş Yap / Kayıt
                </button>
                <a
                  href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-amber-900"
                >
                  📞 {BRAND_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
