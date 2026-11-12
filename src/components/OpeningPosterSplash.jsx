import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ArrowRight, Sparkles } from 'lucide-react';

export default function OpeningPosterSplash({ onInspectPoster }) {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(6);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    if (countdown <= 0) {
      setIsVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isVisible, isPaused]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Kart Konteyner */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative max-w-lg w-full bg-[#faf7f2] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#e2991e]/60 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        
        {/* Üst Başlık & Kapatma */}
        <div className="bg-[#0e3d29] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍲</span>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#f7e7ce]">
                Haftalık Menümüz Yayında!
              </h3>
              <span className="text-[10px] text-amber-200 block">
                09 - 14 Kasım 2026 Orijinal Krepçi Afişi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Geri sayım / Sayaç */}
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
              {countdown}s {isPaused ? '(Duraklatıldı)' : ''}
            </span>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Kapat ve Siteye Geç"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full h-1 bg-stone-200">
          <div 
            className="h-full bg-[#e2991e] transition-all duration-1000"
            style={{ width: `${(countdown / 6) * 100}%` }}
          ></div>
        </div>

        {/* Tıklanabilir Afiş Görseli */}
        <div 
          onClick={() => {
            setIsVisible(false);
            onInspectPoster();
          }}
          className="relative group cursor-pointer overflow-hidden bg-stone-900 flex items-center justify-center p-2"
        >
          <img
            src="/krepci-menu-poster.png"
            alt="Krepçi Ev Yemekleri Haftalık Menü Afişi"
            className="w-full max-h-[62vh] object-contain rounded-xl group-hover:scale-102 transition-transform duration-300"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#e2991e] text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <ZoomIn size={24} />
            </div>
            <span className="font-serif font-bold text-base drop-shadow-md">
              Detaylı & Tam Boy İncelemek İçin Tıklayın
            </span>
            <span className="text-xs text-amber-200 drop-shadow-sm">
              Fiyatlar, çorbalar, ana yemekler ve mezeleri büyütün
            </span>
          </div>

          {/* Sol Altta Tıklama Rozeti */}
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 group-hover:hidden">
            <ZoomIn size={13} className="text-[#e2991e]" />
            <span>Detay için Afişe Tıkla 🔍</span>
          </div>
        </div>

        {/* Alt Bilgi & Siteye Devam Butonu */}
        <div className="px-5 py-3 bg-[#faf7f2] border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Hijyen • Lezzet • Sağlıklı • Mide Dostu
          </span>

          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Siteye Geç</span>
            <ArrowRight size={13} className="text-[#e2991e]" />
          </button>
        </div>

      </div>
    </div>
  );
}
