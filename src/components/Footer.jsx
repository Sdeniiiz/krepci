import React from 'react';
import { BRAND_INFO } from '../data/menuData';
import { Phone, MapPin, Clock, Heart, ShieldCheck, MessageCircle } from 'lucide-react';

export default function Footer({ onOpenMenu, onStartPlan, onOpenPoster }) {
  return (
    <footer className="bg-[#072316] text-white pt-16 pb-12 border-t-4 border-[#e2991e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Kısım: Marka ve Slogan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Kolon 1: Logo & Marka */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#e2991e] text-stone-950 flex items-center justify-center font-serif font-black text-xl shadow-md">
                K
              </div>
              <div>
                <span className="font-serif font-black text-2xl tracking-tight text-white block">KREPCİ</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#e2991e]">Ev Yemekleri</span>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {BRAND_INFO.slogans.bannerTop}
            </p>
            <div className="pt-2 text-xs font-semibold text-[#e2991e] flex items-center gap-1.5">
              <Heart size={14} fill="#e2991e" />
              <span>{BRAND_INFO.slogans.bottomNote}</span>
            </div>
          </div>

          {/* Kolon 2: Hızlı Bağlantılar */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#e2991e] tracking-wide">
              Menü & Abonelik
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button onClick={onOpenMenu} className="hover:text-amber-300 transition-colors">
                  • Haftalık Menü (09 - 14 Kasım)
                </button>
              </li>
              <li>
                <button onClick={onStartPlan} className="hover:text-amber-300 transition-colors font-bold text-white">
                  • Kişisel Yemek Programı Oluştur
                </button>
              </li>
              <li>
                <button onClick={onOpenPoster} className="hover:text-amber-300 transition-colors">
                  • Orijinal Haftalık Poster Afişi
                </button>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-300 transition-colors">
                  • 1, 2, 3, 4 Çeşit Fiyat Tarifesi
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-300 transition-colors">
                  • Günlük Kapıda Ödeme Seçenekleri
                </a>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Çalışma & Teslimat Saatleri */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#e2991e] tracking-wide">
              Teslimat & Servis
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-[#e2991e] mt-0.5 shrink-0" />
                <span>
                  <strong>Haftalık Servis:</strong><br />
                  Pazartesi - Cumartesi (10:30 - 20:30)<br />
                  Pazar günleri dinlenme günümüzdür.
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <ShieldCheck size={15} className="text-[#e2991e] mt-0.5 shrink-0" />
                <span>Özel ısı yalıtımlı termos çantalarla taptaze ve sıcacık teslimat garantisi.</span>
              </div>
            </div>
          </div>

          {/* Kolon 4: Sipariş Hattı & İletişim */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#e2991e] tracking-wide">
              Sipariş Hattı
            </h4>
            <p className="text-xs text-stone-300">
              Paket servis ve kurumsal şirket aboneliği için dilediğiniz an bizi arayabilirsiniz:
            </p>
            <a 
              href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#e2991e] hover:bg-[#d97706] text-stone-950 font-black text-base shadow-lg transition-colors w-full justify-center"
            >
              <Phone size={18} />
              <span>{BRAND_INFO.phone}</span>
            </a>
            <a
              href={`https://wa.me/${BRAND_INFO.whatsapp}?text=Merhaba%2C%20Krepçi%20Ev%20Yemekleri%20Aboneliği%20hakkında%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors w-full justify-center"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Hızlı Sipariş</span>
            </a>
          </div>

        </div>

        {/* Alt Telif & Bildirim */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} {BRAND_INFO.name}. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span>Hijyen • Lezzet • Sağlıklı • Mide Dostu</span>
            <span>•</span>
            <span className="text-[#e2991e]">Web & Mobil Entegre Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
