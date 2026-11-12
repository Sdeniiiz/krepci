import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WeeklyMenu from './components/WeeklyMenu';
import SubscriptionPlanner from './components/SubscriptionPlanner';
import CustomerDashboard from './components/CustomerDashboard';
import PricingSection from './components/PricingSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import PosterModal from './components/PosterModal';
import AuthModal from './components/AuthModal';
import MobileSimulator from './components/MobileSimulator';
import AdminDashboard from './components/AdminDashboard';
import OpeningPosterSplash from './components/OpeningPosterSplash';
import { BRAND_INFO, PRICING_TIERS } from './data/menuData';
import { Phone, MessageCircle, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'subscribe' | 'pricing' | 'how-it-works' | 'specialties' | 'dashboard' | 'admin'
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [user, setUser] = useState(null);

  // URL Hash kontrolü (#admin ile doğrudan açabilme)
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setActiveTab('admin');
    }
  }, []);

  // Abonelik Tamamlandığında
  const handleCompleteSubscription = (subscriptionData) => {
    setActiveSubscription(subscriptionData);
    setUser({
      fullName: subscriptionData.deliveryInfo.fullName,
      phone: subscriptionData.deliveryInfo.phone
    });
    setActiveTab('dashboard');
  };

  // Hızlı Gün Siparişi
  const handleQuickOrderDay = (day) => {
    setActiveTab('subscribe');
  };

  // Menüden Güne Göre Planlama
  const handleSelectDayForPlan = (day) => {
    setActiveTab('subscribe');
  };

  // Fiyat kartından paket seçildiğinde
  const handleSelectTierFromPricing = (tier) => {
    setActiveTab('subscribe');
  };

  // Eğer Yönetici Modundaysa
  if (activeTab === 'admin') {
    return <AdminDashboard onExitAdmin={() => setActiveTab('menu')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#faf7f2]">
      
      {/* Üst Navigasyon */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleMobileMode={() => setIsMobileSimulatorOpen(true)}
        isMobileMode={isMobileSimulatorOpen}
        cartCount={activeSubscription ? 1 : 0}
        onOpenCart={() => setActiveTab(activeSubscription ? 'dashboard' : 'subscribe')}
      />

      {/* Ana İçerik */}
      <main className="flex-1">
        {activeTab === 'menu' && (
          <>
            <Hero
              onStartPlan={() => setActiveTab('subscribe')}
              onOpenMenu={() => {
                const el = document.getElementById('weekly-menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenPosterModal={() => setIsPosterOpen(true)}
            />
            <WeeklyMenu
              onSelectDayForPlan={handleSelectDayForPlan}
              onQuickOrderDay={handleQuickOrderDay}
            />
            <HowItWorks onStartPlan={() => setActiveTab('subscribe')} />
            <PricingSection onSelectTier={handleSelectTierFromPricing} />
          </>
        )}

        {activeTab === 'subscribe' && (
          <SubscriptionPlanner
            onCompleteSubscription={handleCompleteSubscription}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingSection onSelectTier={handleSelectTierFromPricing} />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks onStartPlan={() => setActiveTab('subscribe')} />
        )}

        {activeTab === 'specialties' && (
          <PricingSection onSelectTier={handleSelectTierFromPricing} />
        )}

        {activeTab === 'dashboard' && (
          <CustomerDashboard
            activeSubscription={activeSubscription}
            onNewPlan={() => setActiveTab('subscribe')}
          />
        )}
      </main>

      {/* Sabit Hızlı Sipariş ve WhatsApp Butonları (Floating Bar) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 items-end">
        {/* Yönetim Paneli Hızlı Geçiş Butonu */}
        <button
          onClick={() => setActiveTab('admin')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 text-[#e2991e] font-bold text-xs shadow-lg border border-[#e2991e]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          title="Mutfak & Dağıtım Yönetim Paneli"
        >
          <span>⚙️ Yönetim Paneli</span>
        </button>

        {/* Mobil Uygulama Canlı Deneyim Butonu */}
        <button
          onClick={() => setIsMobileSimulatorOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0e3d29] hover:bg-[#185a3e] text-[#e2991e] font-bold text-xs shadow-xl border border-[#e2991e]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Mobil Uygulama Simülasyonunu Aç"
        >
          <Smartphone size={17} />
          <span className="hidden sm:inline">📱 Mobil Uygulama Görünümü</span>
        </button>

        {/* WhatsApp Hızlı İletişim Butonu */}
        <a
          href={`https://wa.me/${BRAND_INFO.whatsapp}?text=Merhaba%2C%20Krepçi%20Ev%20Yemekleri%20menünüz%20ve%20abonelik%20hakkında%20bilgi%20almak%20istiyorum.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle size={18} />
          <span>WhatsApp Sipariş</span>
        </a>
      </div>

      {/* Modallar */}
      <OpeningPosterSplash
        onInspectPoster={() => setIsPosterOpen(true)}
      />

      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setActiveTab('dashboard');
        }}
      />

      <MobileSimulator
        isOpen={isMobileSimulatorOpen}
        onClose={() => setIsMobileSimulatorOpen(false)}
      />

      {/* Alt Bilgi */}
      <Footer
        onOpenMenu={() => setActiveTab('menu')}
        onStartPlan={() => setActiveTab('subscribe')}
        onOpenPoster={() => setIsPosterOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />
    </div>
  );
}
