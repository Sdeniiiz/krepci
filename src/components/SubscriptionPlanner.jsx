import React, { useState } from 'react';
import { PRICING_TIERS, DAYS_MENU, BRAND_INFO } from '../data/menuData';
import { 
  Check, ArrowRight, ArrowLeft, Clock, MapPin, 
  CreditCard, Banknote, Sparkles, ChefHat, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriptionPlanner({ onCompleteSubscription }) {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[2]); // 3 Çeşit
  const [duration, setDuration] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [paymentMethod, setPaymentMethod] = useState('online-card'); // 'online-card' | 'cod-daily'

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    timeSlot: '11:30 - 13:00',
    notes: ''
  });

  // Kullanıcının kişisel yemek programı
  const initialSchedule = DAYS_MENU.reduce((acc, day) => {
    acc[day.id] = {
      dayName: day.dayName,
      date: day.date,
      corba: day.corbalar[0] || '',
      anaYemek: day.anaYemekler[0] || '',
      pilav: day.pilavMakarna[0] || '',
      salata: day.salataMeze[0] || '',
      tatli: (day.tatli && day.tatli[0]) || 'Islak Kek'
    };
    return acc;
  }, {});

  const [userSchedule, setUserSchedule] = useState(initialSchedule);
  const [activeDayKey, setActiveDayKey] = useState('pazartesi');

  // Fiyat Hesaplama
  const dailyBase = selectedTier.dailyPrice;
  let daysCount = 24;
  let discountRate = 0.15;

  if (duration === 'weekly') {
    daysCount = 6;
    discountRate = 0.08;
  } else if (duration === 'daily') {
    daysCount = 1;
    discountRate = 0;
  }

  const rawTotal = dailyBase * daysCount;
  const discountAmount = Math.round(rawTotal * discountRate);
  const finalTotal = rawTotal - discountAmount;
  const perDayEffective = Math.round(finalTotal / daysCount);

  const handleItemSelect = (dayId, category, itemName) => {
    setUserSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [category]: itemName
      }
    }));
  };

  const handleAutoFillBalanced = () => {
    const balanced = {};
    DAYS_MENU.forEach((day, i) => {
      balanced[day.id] = {
        dayName: day.dayName,
        date: day.date,
        corba: day.corbalar[i % day.corbalar.length] || day.corbalar[0],
        anaYemek: day.anaYemekler[i % day.anaYemekler.length] || day.anaYemekler[0],
        pilav: day.pilavMakarna[i % day.pilavMakarna.length] || day.pilavMakarna[0],
        salata: day.salataMeze[i % day.salataMeze.length] || day.salataMeze[0],
        tatli: (day.tatli && day.tatli[0]) || 'Islak Kek'
      };
    });
    setUserSchedule(balanced);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}

    const subscriptionData = {
      tier: selectedTier,
      duration,
      daysCount,
      paymentMethod,
      deliveryInfo,
      schedule: userSchedule,
      totalAmount: finalTotal,
      perDayPrice: perDayEffective,
      createdAt: new Date().toISOString()
    };
    onCompleteSubscription(subscriptionData);
  };

  const currentDayData = DAYS_MENU.find(d => d.id === activeDayKey) || DAYS_MENU[0];

  return (
    <div id="subscription-planner" className="py-16 bg-[#faf7f2] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Üst Bilgi (Editoryal & Temiz) */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0e3d29] uppercase">
            The Perfect Plate Konsepti
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0e3d29]">
            Kendi Yemek Programını Oluştur
          </h2>
          <p className="text-stone-600 text-sm">
            Menünüzü damak tadınıza göre belirleyin, her gün sıcacık kapınıza getirelim.
          </p>

          {/* Zarif İlerleme Metinleri (Kaba butonlar yok) */}
          <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs font-medium border-b border-stone-200 pb-4">
            {[
              { num: 1, title: '1. Porsiyon' },
              { num: 2, title: '2. Süre & Ödeme' },
              { num: 3, title: '3. Menü Tercihi' },
              { num: 4, title: '4. Teslimat' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => s.num < step && setStep(s.num)}
                className={`pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  step === s.num
                    ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                    : step > s.num
                    ? 'text-stone-800 font-semibold'
                    : 'text-stone-400'
                }`}
              >
                <span>{s.title}</span>
                {step > s.num && <Check size={12} className="text-emerald-700" />}
              </button>
            ))}
          </div>
        </div>

        {/* ===================== ADIM 1: PORSIYON SEÇIMI (Zarif Liste Düzeni) ===================== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#0e3d29]">
                Porsiyonunuzu Seçin
              </h3>
              <span className="text-xs text-stone-500">Günlük kaç çeşit tercih edersiniz?</span>
            </div>

            {/* Kutu yığını yerine: The Perfect Plate tarzı ferah yatay liste */}
            <div className="divide-y divide-stone-200">
              {PRICING_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors group ${
                      isSelected ? 'bg-amber-50/60' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Minimalist Radio */}
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-[#0e3d29] bg-[#0e3d29]' : 'border-stone-400 group-hover:border-[#0e3d29]'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#0e3d29]">
                            {tier.name}
                          </h4>
                          {tier.badge && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right pl-9 sm:pl-0 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center">
                      <span className="font-serif text-2xl font-bold text-[#0e3d29]">
                        {tier.dailyPrice} ₺
                      </span>
                      <span className="text-xs text-stone-500">
                        Aylık: ~{Math.round(tier.dailyPrice * 24 * 0.85)} ₺
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>İlerle: Süre ve Ödeme Tercihi</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 2: SÜRE & ÖDEME MODELİ (Akıcı & Sade) ===================== */}
        {step === 2 && (
          <div className="space-y-10">
            {/* Süre Tercihi */}
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">1. Abonelik Süreniz</h3>
                <p className="text-xs text-stone-500">Ne kadarlık bir program planlamak istersiniz?</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'monthly',
                    title: 'Aylık Abonelik (24 Gün)',
                    sub: 'Pazartesi - Cumartesi arası taze sıcak teslimat. %15 indirimli.',
                    price: `${Math.round(selectedTier.dailyPrice * 24 * 0.85)} ₺`,
                    badge: '%15 Avantajlı'
                  },
                  {
                    id: 'weekly',
                    title: 'Haftalık Paket (6 Gün)',
                    sub: 'Bir haftalık tam menü denemesi.',
                    price: `${Math.round(selectedTier.dailyPrice * 6 * 0.92)} ₺`,
                    badge: null
                  },
                  {
                    id: 'daily',
                    title: 'Günlük Sipariş (1 Gün)',
                    sub: 'Tek seferlik sıcak taze ev yemeği.',
                    price: `${selectedTier.dailyPrice} ₺`,
                    badge: null
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setDuration(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      duration === item.id
                        ? 'border-[#0e3d29] bg-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        duration === item.id ? 'border-[#0e3d29] bg-[#0e3d29]' : 'border-stone-400'
                      }`}>
                        {duration === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-stone-900">{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{item.sub}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-base text-[#0e3d29]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ödeme Modeli (Kararsız kullanıcı için net 2 seçenek) */}
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">2. Ödeme Tercihiniz</h3>
                <p className="text-xs text-stone-500">Aylık avantajlı online ödeme veya her gün kapıda ödeme.</p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('online-card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'online-card'
                      ? 'border-[#0e3d29] bg-white shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center ${
                    paymentMethod === 'online-card' ? 'border-[#0e3d29] bg-[#0e3d29]' : 'border-stone-400'
                  }`}>
                    {paymentMethod === 'online-card' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block">
                      Online Kredi / Banka Kartı (Aylık Sabit)
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Ödemeniz güvenli altyapıyla tek seferde çekilir; her gün kapıda nakit veya kart arama zahmetinden kurtulursunuz.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod-daily')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cod-daily'
                      ? 'border-[#0e3d29] bg-white shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center ${
                    paymentMethod === 'cod-daily' ? 'border-[#0e3d29] bg-[#0e3d29]' : 'border-stone-400'
                  }`}>
                    {paymentMethod === 'cod-daily' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block">
                      Günlük Kapıda Ödeme (Nakit veya POS Cihazı ile Kart)
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Herhangi bir ön ödeme yapmadan programınızı oluşturun; yemek her gün kapınıza geldiğinde teslimatta ödeyin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Gezinme */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Porsiyona Dön</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>İlerle: Menü Tercihini Belirle</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 3: MENÜ TERCIHI (The Perfect Plate Usulü Tabak Doldurma) ===================== */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">
                  Haftalık Yemek Tercihleriniz
                </h3>
                <p className="text-xs text-stone-500">
                  Her gün için istediğiniz çorba, ana yemek ve garnitürü seçin.
                </p>
              </div>

              <button
                onClick={handleAutoFillBalanced}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 underline underline-offset-4 self-start sm:self-auto cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Şefin Dengeli Ev Yemeği Menüsünü Otomatik Yükle</span>
              </button>
            </div>

            {/* Gün Seçici İnce Sekmeler */}
            <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2">
              {DAYS_MENU.map((d) => {
                const isActive = d.id === activeDayKey;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDayKey(d.id)}
                    className={`px-3 py-1.5 text-xs font-serif transition-all cursor-pointer ${
                      isActive
                        ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {d.dayName}
                  </button>
                );
              })}
            </div>

            {/* Seçili Günün Seçenekleri (Kare kutular yerine: Restaurant Menu listesi) */}
            <div className="space-y-6">
              
              {/* Çorba Seçimi */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  1. Çorba Seçimi
                </span>
                <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                  {currentDayData.corbalar.map((corba) => {
                    const isSelected = userSchedule[activeDayKey]?.corba === corba;
                    return (
                      <div
                        key={corba}
                        onClick={() => handleItemSelect(activeDayKey, 'corba', corba)}
                        className={`py-2 px-2 flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                          isSelected ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{corba}</span>
                        {isSelected ? <Check size={14} className="text-[#0e3d29]" /> : <span className="text-stone-300 text-xs">+ Seç</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ana Yemek Seçimi */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  2. Ana Yemek Seçimi
                </span>
                <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                  {currentDayData.anaYemekler.map((yemek) => {
                    const isSelected = userSchedule[activeDayKey]?.anaYemek === yemek;
                    return (
                      <div
                        key={yemek}
                        onClick={() => handleItemSelect(activeDayKey, 'anaYemek', yemek)}
                        className={`py-2 px-2 flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                          isSelected ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{yemek}</span>
                        {isSelected ? <Check size={14} className="text-[#0e3d29]" /> : <span className="text-stone-300 text-xs">+ Seç</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pilav & Garnitür */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  3. Pilav / Makarna & Meze Seçimi
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">Pilav & Makarna</span>
                    {currentDayData.pilavMakarna.map((pilav) => {
                      const isSelected = userSchedule[activeDayKey]?.pilav === pilav;
                      return (
                        <div
                          key={pilav}
                          onClick={() => handleItemSelect(activeDayKey, 'pilav', pilav)}
                          className={`py-1.5 px-2 flex items-center justify-between cursor-pointer rounded-lg text-xs ${
                            isSelected ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span>{pilav}</span>
                          {isSelected && <Check size={12} className="text-[#0e3d29]" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">Salata & Meze</span>
                    {currentDayData.salataMeze.slice(0, 4).map((meze) => {
                      const isSelected = userSchedule[activeDayKey]?.salata === meze;
                      return (
                        <div
                          key={meze}
                          onClick={() => handleItemSelect(activeDayKey, 'salata', meze)}
                          className={`py-1.5 px-2 flex items-center justify-between cursor-pointer rounded-lg text-xs ${
                            isSelected ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span>{meze}</span>
                          {isSelected && <Check size={12} className="text-[#0e3d29]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Seçili Gün Tabağı Özeti (Zarif İnce Şerit) */}
              <div className="p-4 bg-[#0e3d29] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[#e2991e] font-bold uppercase tracking-wider block text-[10px]">
                    {currentDayData.dayName} Tabağınız:
                  </span>
                  <span className="font-serif text-sm font-bold text-white">
                    {userSchedule[activeDayKey]?.corba} • {userSchedule[activeDayKey]?.anaYemek} • {userSchedule[activeDayKey]?.pilav} • {userSchedule[activeDayKey]?.salata}
                  </span>
                </div>
                <span className="text-[11px] text-stone-300">Her gün taze hazırlanır</span>
              </div>

            </div>

            {/* Alt Gezinme */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Ödemeye Dön</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>İlerle: Teslimat ve Onay</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 4: TESLIMAT VE ONAY ===================== */}
        {step === 4 && (
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="font-serif text-xl font-bold text-[#0e3d29]">Teslimat Bilgileriniz</h3>
              <p className="text-xs text-stone-500">Sıcak yemeklerinizin adresinize doğru zamanda ulaşması için bilgilerinizi girin.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={deliveryInfo.fullName}
                    onChange={e => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Telefon Numaranız *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={deliveryInfo.phone}
                    onChange={e => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Teslimat Saat Aralığı</label>
                <div className="flex gap-4 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="slot"
                      checked={deliveryInfo.timeSlot === '11:30 - 13:00'}
                      onChange={() => setDeliveryInfo({ ...deliveryInfo, timeSlot: '11:30 - 13:00' })}
                    />
                    <span>Öğle Servisi (11:30 - 13:00)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="slot"
                      checked={deliveryInfo.timeSlot === '17:30 - 19:30'}
                      onChange={() => setDeliveryInfo({ ...deliveryInfo, timeSlot: '17:30 - 19:30' })}
                    />
                    <span>Akşam Servisi (17:30 - 19:30)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Açık Adres (Ev veya Şirket) *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Mahalle, Cadde, Sokak, No, Daire, Varsa Şirket Kat Bilgisi..."
                  value={deliveryInfo.address}
                  onChange={e => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Aşçıya veya Kuryeye Not</label>
                <input
                  type="text"
                  placeholder="Örn: Az tuzlu rica ederim / Kapıda zile basmayın"
                  value={deliveryInfo.notes}
                  onChange={e => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-white"
                />
              </div>
            </div>

            {/* Sipariş Özeti & Onay Butonu */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 block">Toplam Tutar ({duration === 'monthly' ? 'Aylık 24 Gün' : 'Haftalık'}):</span>
                <span className="font-serif text-3xl font-bold text-[#0e3d29]">{finalTotal} ₺</span>
                <span className="text-xs text-stone-500 block">
                  {paymentMethod === 'online-card' ? 'Online Güvenli Ödeme' : 'Her gün kapıda nakit/POS ile'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Yemek Programımı Kaydet & Başlat</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
