import React from 'react';
import { PRICING_TIERS, SPECIAL_SPECIALTIES, BRAND_INFO } from '../data/menuData';
import { ArrowRight, Phone } from 'lucide-react';

export default function PricingSection({ onSelectTier }) {
  return (
    <section id="pricing" className="py-20 bg-[#faf7f2] border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Başlık */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0e3d29] uppercase">
            Net & Şeffaf
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0e3d29]">
            Porsiyon & Menü Fiyatları
          </h2>
          <p className="text-stone-600 text-sm">
            İster tek gün sipariş verin, ister aylık avantajlı abone olun. Günlük kapıda ödeme veya online kart seçeneği.
          </p>
        </div>

        {/* The Perfect Plate Tarzı Editoryal Menü Fiyat Listesi (Kare kutular yerine ferah satırlar) */}
        <div className="divide-y divide-stone-200">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/50 px-3 rounded-2xl transition-colors"
            >
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#0e3d29] transition-colors">
                    {tier.name}
                  </h3>
                  {tier.badge && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-left sm:text-right">
                  <span className="font-serif text-2xl font-bold text-[#0e3d29] block">
                    {tier.dailyPrice} ₺
                  </span>
                  <span className="text-xs text-stone-400">
                    Aylık: ~{Math.round(tier.dailyPrice * 24 * 0.85)} ₺
                  </span>
                </div>

                <button
                  onClick={() => onSelectTier(tier)}
                  className="px-5 py-2.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Abone Ol</span>
                  <ArrowRight size={14} className="text-[#e2991e]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özel Spesiyaller (Keşkek, Mantı, Tatlı) - Gurme Liste */}
        <div className="mt-16 pt-10 border-t border-stone-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-stone-200">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">Şefin Özel Spesiyalleri</h3>
              <p className="text-xs text-stone-500">Geleneksel lezzetlerimizi menünüze ek olarak veya tek başına isteyebilirsiniz.</p>
            </div>
            <a
              href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <Phone size={13} />
              <span>Sipariş Hattı: {BRAND_INFO.phone}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            {SPECIAL_SPECIALTIES.map((spec) => (
              <div key={spec.id} className="py-2 flex items-baseline justify-between border-b border-stone-100">
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">{spec.name}</h4>
                  <p className="text-xs text-stone-500">{spec.desc}</p>
                </div>
                <span className="font-serif font-bold text-base text-[#0e3d29] shrink-0 ml-4">
                  {spec.price} ₺
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
