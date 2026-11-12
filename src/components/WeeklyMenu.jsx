import React, { useState } from 'react';
import { DAYS_MENU } from '../data/menuData';
import { Calendar, Plus, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';

export default function WeeklyMenu({ onSelectDayForPlan, onQuickOrderDay }) {
  const [selectedDayId, setSelectedDayId] = useState('pazartesi');
  const activeDay = DAYS_MENU.find(d => d.id === selectedDayId) || DAYS_MENU[0];

  return (
    <section id="weekly-menu" className="py-20 bg-[#faf7f2] border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı (Editoryal & Zarif) */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] text-[#0e3d29] uppercase">
            <span className="w-6 h-px bg-[#0e3d29]"></span>
            <span>09 - 14 Kasım 2026</span>
            <span className="w-6 h-px bg-[#0e3d29]"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0e3d29]">
            Haftalık Ev Yemeği Menüsü
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-normal">
            Her gün taze pişen anne yemekleri. Günü seçin, menünüzü inceleyin ve dilediğiniz gibi abone olun.
          </p>
        </div>

        {/* Gün Seçici (Kutu değil, The Perfect Plate usulü zarif editoryal çizgi) */}
        <div className="flex justify-center border-b border-stone-300 mb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 sm:gap-8 min-w-max pb-px">
            {DAYS_MENU.map((day) => {
              const isActive = day.id === selectedDayId;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`pb-4 px-2 text-sm sm:text-base font-serif transition-all relative flex flex-col items-center cursor-pointer ${
                    isActive
                      ? 'text-[#0e3d29] font-bold'
                      : 'text-stone-400 hover:text-stone-700 font-medium'
                  }`}
                >
                  <span className="text-[11px] font-sans uppercase tracking-widest opacity-70 mb-0.5">
                    {day.date.slice(0, 5)}
                  </span>
                  <span>{day.dayName}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e3d29]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menü İçeriği: Restoran & Dergi Menüsü Düzeni (Kare kutular YOK!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sol Kolon: Çorbalar & Ana Yemekler */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Çorbalar */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0e3d29] tracking-wide flex items-center gap-2">
                  <span>🍵</span> Çorbalar
                </h3>
                <span className="text-xs text-stone-600 italic">Günün başlangıcı</span>
              </div>
              <div className="divide-y divide-stone-100">
                {activeDay.corbalar.map((corba, i) => (
                  <div key={i} className="py-2.5 flex items-baseline justify-between group">
                    <span className="text-stone-800 text-sm sm:text-base font-medium group-hover:text-[#0e3d29] transition-colors">
                      {corba}
                    </span>
                    <span className="text-xs text-stone-600">Mide Dostu & Taze</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ana Yemekler */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0e3d29] tracking-wide flex items-center gap-2">
                  <span>🥘</span> Ana Yemekler
                </h3>
                <span className="text-xs text-stone-600 italic">Özenle Pişirilmiş Sıcak Yemekler</span>
              </div>
              <div className="divide-y divide-stone-100">
                {activeDay.anaYemekler.map((yemek, i) => (
                  <div key={i} className="py-3 flex items-start justify-between gap-4 group">
                    <div>
                      <h4 className="text-stone-900 text-sm sm:text-base font-bold group-hover:text-[#0e3d29] transition-colors">
                        {yemek}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Hakiki tereyağı ve sızma zeytinyağı ile tencere usulü
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Günün Yemeği
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sağ Kolon: Pilav, Meze, Tatlı ve Aksiyon Alanı */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Pilav & Makarna */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0e3d29] tracking-wide flex items-center gap-2">
                  <span>🍚</span> Pilav & Makarna
                </h3>
                <span className="text-xs text-stone-600 italic">Tamamlayıcı Lezzetler</span>
              </div>
              <div className="divide-y divide-stone-100">
                {activeDay.pilavMakarna.map((pilav, i) => (
                  <div key={i} className="py-2.5 flex items-baseline justify-between">
                    <span className="text-stone-800 text-sm sm:text-base font-medium">{pilav}</span>
                    <span className="text-xs text-stone-600">Tane Tane</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Salata & Mezeler */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0e3d29] tracking-wide flex items-center gap-2">
                  <span>🥗</span> Salata & Yoğurtlu Mezeler
                </h3>
                <span className="text-xs text-stone-600 italic">Taze & Ferah</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-700">
                {activeDay.salataMeze.map((meze, i) => (
                  <div key={i} className="py-1.5 flex items-center gap-2">
                    <span className="text-amber-600">•</span>
                    <span>{meze}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tatlı Bilgisi */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm">
              <span className="font-serif font-bold text-[#0e3d29]">🍰 Günün Tatlısı:</span>
              <span className="text-stone-700 font-medium">{activeDay.tatli ? activeDay.tatli.join(', ') : 'Islak Kek'}</span>
            </div>

            {/* Bu Günü Seçme Butonu (Zarif & Akıcı) */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => onSelectDayForPlan(activeDay)}
                className="w-full py-4 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{activeDay.dayName} Menüsüyle Program Oluştur</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>

              <button
                onClick={() => onQuickOrderDay(activeDay)}
                className="w-full py-2.5 text-xs text-stone-600 hover:text-[#0e3d29] font-bold text-center block"
              >
                Veya bugün için tek seferlik kapıda ödemeli sipariş ver →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
