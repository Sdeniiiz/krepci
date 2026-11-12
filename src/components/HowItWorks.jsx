import React from 'react';
import { HOW_IT_WORKS, BRAND_INFO } from '../data/menuData';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HowItWorks({ onStartPlan }) {
  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0e3d29] uppercase">
            Kolay & Güvenilir
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0e3d29]">
            Abonelik Nasıl İşler?
          </h2>
          <p className="text-stone-600 text-sm">
            Tencere kaynatma, market alışverişi ve bulaşık derdine son. 4 adımda evinize ve ofisinize düzenli sıcak ev yemeği.
          </p>
        </div>

        {/* Akıcı Süreç Adımları (Kare kutular yerine ferah zaman çizgisi) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, idx) => (
            <div key={idx} className="space-y-3">
              <span className="font-serif text-3xl font-bold text-amber-700/60 block">
                {step.step}
              </span>
              <h3 className="font-serif font-bold text-base text-[#0e3d29]">
                {step.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Hijyen & Mide Dostu Güvencesi - Editoryal Metin */}
        <div className="mt-16 pt-12 border-t border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="font-serif font-bold text-lg text-[#0e3d29]">
              Mide Dostu ve Katkısız Mutfak İlkemiz
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Yemeklerimizde bulyon, yapay koruyucular ve kalitesiz kızartma yağları kullanılmaz. 
              Anne eli lezzetinde, hafif ve sindirimi rahat gerçek ev yemekleri sunuyoruz.
            </p>
          </div>

          <button
            onClick={onStartPlan}
            className="px-7 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Programınızı Başlatın</span>
            <ArrowRight size={14} className="text-[#e2991e]" />
          </button>
        </div>

      </div>
    </section>
  );
}
