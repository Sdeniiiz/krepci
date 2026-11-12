import React from 'react';
import { ChefHat, ArrowRight, ShieldCheck, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BRAND_INFO } from '../data/menuData';

export default function Hero({ onStartPlan, onOpenMenu, onOpenPosterModal }) {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2] pt-12 pb-20 border-b border-stone-200">
      {/* Doğal Arka Plan Dokusu */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#e2991e]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Sol Kolon: Editoryal Tipografi & Hikaye */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#e2991e]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0e3d29]">
                Kişiye Özel Ev Yemeği Aboneliği
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0e3d29] leading-[1.15] tracking-tight">
              Her gün taze, <br />
              <span className="italic font-normal text-amber-700">anne eli lezzetiyle</span> <br />
              kapınıza gelsin.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Katkısız, mide dostu ve hakiki zeytinyağlı tencere yemekleri. Kendi haftalık yemek programınızı belirleyin; 
              her sabah usta aşçılarımız sizin için pişirsin, sıcak teslimatla kapınıza ulaştıralım.
            </p>

            {/* İnce Satır İçi İlkeler (Kutu yerine zarif metinler) */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e]"></span>
                Hijyen İlkemiz
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e]"></span>
                Lezzet İmzamız
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e]"></span>
                Sağlıklı & Mide Dostu
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2991e]"></span>
                Günlük Sıcak Teslimat
              </span>
            </div>

            {/* Eylemler */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartPlan}
                className="px-8 py-4 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                <span>Yemek Programını Oluştur</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#e2991e]" />
              </button>

              <button
                onClick={onOpenMenu}
                className="px-7 py-4 text-stone-800 hover:text-[#0e3d29] font-bold text-sm transition-colors flex items-center justify-center gap-2 border-b-2 border-transparent hover:border-[#0e3d29]"
              >
                <span>Haftalık Menüyü Keşfet</span>
              </button>

              <button
                onClick={onOpenPosterModal}
                className="text-xs text-stone-500 hover:text-amber-800 font-semibold underline underline-offset-4 flex items-center justify-center gap-1"
              >
                <ImageIcon size={14} />
                <span>Orijinal Afiş</span>
              </button>
            </div>

            {/* Sipariş Notu */}
            <div className="pt-2 text-xs text-stone-500">
              Aylık avantajlı abonelik veya <strong className="text-stone-800">günlük kapıda nakit/POS ödeme</strong> seçeneğiyle.
            </div>
          </div>

          {/* Sağ Kolon: The Perfect Plate Tarzı İştah Kabartan Tabak & Kompozisyon */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Ana Görsel / Tabak */}
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
                  alt="Krepçi Taze Ev Yemeği"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Görsel Üzeri Bilgi */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#e2991e]">
                    Günün Özel Seçkisi
                  </span>
                  <h3 className="font-serif text-xl font-bold">Krepçi Yağlama & Fırın Tavuk Şiş</h3>
                  <p className="text-xs text-white/80">Mercimek Çorbası, Pirinç Pilavı ve Mevsim Salatası ile</p>
                </div>
              </div>

              {/* Fiyat Rozeti (Zarif Yuvarlak Mühür) */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#0e3d29] text-white p-2 flex flex-col items-center justify-center text-center shadow-xl border-2 border-[#e2991e]">
                <span className="text-[9px] uppercase tracking-wider text-[#e2991e] font-bold">Menü</span>
                <span className="text-xl font-black leading-none mt-0.5">290₺</span>
                <span className="text-[9px] text-white/70">3 Çeşit</span>
              </div>

              {/* Sol Altta Zarif Şef Notu */}
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-200 max-w-[220px]">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
                  <Sparkles size={14} />
                  <span>Anne Eli Mutfak</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Her gün 40'tan fazla taze yemek seçeneğiyle kendi menünüzü oluşturun.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
