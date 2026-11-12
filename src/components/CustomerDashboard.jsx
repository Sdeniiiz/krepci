import React, { useState } from 'react';
import { Clock, MapPin, Edit3, RotateCcw, PauseCircle, PlayCircle, Check } from 'lucide-react';
import { DAYS_MENU } from '../data/menuData';

export default function CustomerDashboard({ activeSubscription, onNewPlan }) {
  const [isPaused, setIsPaused] = useState(false);
  const [schedule] = useState(
    activeSubscription?.schedule || {
      pazartesi: { corba: 'Mercimek Çorbası', anaYemek: 'Krepçi Yağlama', pilav: 'Pirinç Pilavı', salata: 'Mevsim Salata' },
      sali: { corba: 'Domates Çorbası', anaYemek: 'Etli Taze Fasulye Yemeği', pilav: 'Sebzeli Bulgur Pilavı', salata: 'Havuç Tarator' },
      carsamba: { corba: 'Ezogelin Çorbası', anaYemek: 'Etli Kurufasulye', pilav: 'Pirinç Pilavı', salata: 'Kısır' },
      persembe: { corba: 'Brokoli Çorbası', anaYemek: 'Etli Keşkek', pilav: 'Fırında Makarna', salata: 'Mor Lahana Yoğurtlusu' },
      cuma: { corba: 'Mantar Çorbası', anaYemek: 'Etli Tepsi Kebabı', pilav: 'Ankara Tava', salata: 'Mercimek Köftesi' },
      cumartesi: { corba: 'Brokoli Çorbası', anaYemek: 'Kıymalı Krep', pilav: 'Domatesli Bulgur Pilavı', salata: 'Cacık' }
    }
  );

  return (
    <div className="py-16 bg-[#faf7f2] min-h-screen border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Karşılama ve Abonelik Durumu (Ferah Editoryal Başlık) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-300 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e3d29]">
              {isPaused ? '⏸️ Abonelik Donduruldu' : '🟢 Aktif Ev Yemeği Aboneliği'}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0e3d29]">
              Hoş Geldiniz, {activeSubscription?.deliveryInfo?.fullName || 'Değerli Misafirimiz'}
            </h2>
            <p className="text-xs text-stone-500 flex items-center gap-2">
              <MapPin size={13} className="text-amber-700" />
              <span>Teslimat: {activeSubscription?.deliveryInfo?.address || 'Ofis / Ev Adresiniz'} ({activeSubscription?.deliveryInfo?.timeSlot || '11:30 - 13:00'})</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs font-bold text-stone-700 hover:text-[#0e3d29] px-4 py-2 border border-stone-300 rounded-full transition-colors cursor-pointer"
            >
              {isPaused ? 'Aboneliği Devam Ettir' : 'Bu Haftayı Dondur'}
            </button>
            <button
              onClick={onNewPlan}
              className="text-xs font-bold text-[#f7e7ce] bg-[#0e3d29] hover:bg-[#185a3e] px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Programı Güncelle
            </button>
          </div>
        </div>

        {/* Bugünün Sıcak Yemeği - Akıcı Şerit */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Bugünkü Menünüz (Pazartesi)</span>
              <h3 className="font-serif text-xl font-bold text-[#0e3d29]">Mutfakta Taze Pişiriliyor</h3>
            </div>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold">
              Kurye Çıkış Saati: ~11:45
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-800 font-medium">
            <span className="py-1 px-3 bg-stone-50 rounded-full">🍵 {schedule.pazartesi.corba}</span>
            <span className="py-1 px-3 bg-stone-50 rounded-full font-bold text-[#0e3d29]">🥘 {schedule.pazartesi.anaYemek}</span>
            <span className="py-1 px-3 bg-stone-50 rounded-full">🍚 {schedule.pazartesi.pilav}</span>
            <span className="py-1 px-3 bg-stone-50 rounded-full">🥗 {schedule.pazartesi.salata}</span>
          </div>

          <div className="text-xs text-stone-500 pt-2 flex items-center justify-between">
            <span>Ödeme: <strong>{activeSubscription?.paymentMethod === 'cod-daily' ? 'Kapıda Ödeme (290 ₺)' : 'Online Kartla Ödendi'}</strong></span>
            <span className="text-stone-400">Özel termo çantada sıcacık teslimat</span>
          </div>
        </div>

        {/* Haftalık Yemek Takviminiz (Restoran Editoryal Tablosu) */}
        <div className="space-y-4">
          <div className="border-b border-stone-200 pb-2">
            <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">
              Kişiselleştirilmiş Haftalık Yemek Takviminiz
            </h3>
            <p className="text-xs text-stone-500">Krepçi'nin her gün sizin için taze hazırlayacağı menü programı.</p>
          </div>

          <div className="divide-y divide-stone-200">
            {DAYS_MENU.map((d) => {
              const dayMeal = schedule[d.id] || {
                corba: d.corbalar[0],
                anaYemek: d.anaYemekler[0],
                pilav: d.pilavMakarna[0],
                salata: d.salataMeze[0]
              };

              return (
                <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="sm:w-36">
                    <span className="font-serif font-bold text-base text-stone-900 block">{d.dayName}</span>
                    <span className="text-[11px] text-stone-400">{d.date}</span>
                  </div>

                  <div className="flex-1 text-xs text-stone-700 space-y-0.5">
                    <div className="font-bold text-stone-900">{dayMeal.anaYemek}</div>
                    <div className="text-stone-500">
                      {dayMeal.corba} • {dayMeal.pilav} • {dayMeal.salata}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => alert(`${d.dayName} günü menü değiştirme talebiniz kaydedildi.`)}
                      className="text-stone-600 hover:text-[#0e3d29] font-semibold underline underline-offset-2 cursor-pointer"
                    >
                      Yemeği Değiştir
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      onClick={() => alert(`${d.dayName} günkü teslimatınız bir sonraki haftaya aktarıldı.`)}
                      className="text-stone-400 hover:text-rose-700 cursor-pointer"
                    >
                      Ertele
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
