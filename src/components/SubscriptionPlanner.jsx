import React, { useState } from 'react';
import { 
  PRICING_TIERS, DAYS_MENU, BRAND_INFO, 
  DISLIKED_INGREDIENTS, TASTE_PROFILES, generatePersonalizedPlan 
} from '../data/menuData';
import { 
  Check, ArrowRight, ArrowLeft, Clock, MapPin, 
  CreditCard, Banknote, Sparkles, ChefHat, ShieldCheck, 
  Ban, ThumbsUp, RefreshCw, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriptionPlanner({ onCompleteSubscription, initialDayKey = 'pazartesi', initialDuration = 'daily' }) {
  const [step, setStep] = useState(1); // 1: Porsiyon, 2: Süre & Ödeme, 3: Damak & Kara Liste, 4: Menü İnceleme, 5: Teslimat
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[2]); // 3 Çeşit
  const [duration, setDuration] = useState(initialDuration || 'daily'); // 'daily' | 'weekly' | 'monthly'
  const [paymentMethod, setPaymentMethod] = useState('cod-daily'); // 'cod-daily' | 'online-card'
  
  // Damak Zevki ve İstemediğim Yiyecekler (Aylık abonelik konforu)
  const [selectedProfile, setSelectedProfile] = useState('dengeli');
  const [dislikedList, setDislikedList] = useState([]);
  const [customExcludedText, setCustomExcludedText] = useState('');

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    timeSlot: '11:30 - 13:00',
    notes: ''
  });

  // İstenmeyen yiyecekleri toggle etme
  const toggleDisliked = (id) => {
    setDislikedList(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const newPlan = generatePersonalizedPlan(selectedProfile, next);
      setUserSchedule(newPlan);
      return next;
    });
  };

  // Profil değiştiğinde
  const handleProfileChange = (profId) => {
    setSelectedProfile(profId);
    const newPlan = generatePersonalizedPlan(profId, dislikedList);
    setUserSchedule(newPlan);
  };

  // Kullanıcının kişisel yemek programı (başlangıçta akıllı motor ile üretilir)
  const [userSchedule, setUserSchedule] = useState(() => generatePersonalizedPlan('dengeli', []));
  const [activeDayKey, setActiveDayKey] = useState(initialDayKey || 'pazartesi');

  // Prop güncellendiğinde senkronize et
  React.useEffect(() => {
    if (initialDayKey) setActiveDayKey(initialDayKey);
  }, [initialDayKey]);

  React.useEffect(() => {
    if (initialDuration) setDuration(initialDuration);
  }, [initialDuration]);

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
    setUserSchedule(prev => {
      const currentDay = { ...prev[dayId] };
      const maxSlots = selectedTier.itemsCount;

      if (category === 'anaYemek') {
        currentDay.anaYemek = itemName;
      } else if (maxSlots === 1) {
        // 1 Çeşit menü: Sadece Ana Yemek seçilebilir
        return prev;
      } else if (maxSlots === 2) {
        // 2 Çeşit Kuralı: 1 Ana Yemek + SADECE 1 Yan Lezzet (Çorba VEYA Pilav/Makarna VEYA Meze)
        if (currentDay[category] === itemName) {
          currentDay[category] = '';
        } else {
          currentDay.corba = category === 'corba' ? itemName : '';
          currentDay.pilav = category === 'pilav' ? itemName : '';
          currentDay.salata = category === 'salata' ? itemName : '';
        }
      } else if (maxSlots === 3) {
        // 3 Çeşit Kuralı: 1 Ana Yemek + En Fazla 2 Yan Lezzet
        if (currentDay[category] === itemName) {
          currentDay[category] = '';
        } else {
          currentDay[category] = itemName;
          const sideCount = (currentDay.corba ? 1 : 0) + (currentDay.pilav ? 1 : 0) + (currentDay.salata ? 1 : 0);
          if (sideCount > 2) {
            if (category === 'corba') currentDay.salata = '';
            else if (category === 'pilav') currentDay.salata = '';
            else if (category === 'salata') currentDay.pilav = '';
          }
        }
      } else {
        // 4 Çeşit: Serbestçe 4 lezzet seçilebilir
        currentDay[category] = currentDay[category] === itemName ? '' : itemName;
      }

      return {
        ...prev,
        [dayId]: currentDay
      };
    });
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
      deliveryInfo: {
        ...deliveryInfo,
        notes: `${deliveryInfo.notes}${dislikedList.length > 0 ? ` (İstenmeyenler: ${dislikedList.join(', ')})` : ''}${customExcludedText ? ` (Özel Not: ${customExcludedText})` : ''}`
      },
      dislikedIngredients: dislikedList,
      schedule: userSchedule,
      totalAmount: finalTotal,
      perDayPrice: perDayEffective,
      createdAt: new Date().toISOString()
    };
    onCompleteSubscription(subscriptionData);
  };

  const currentDayData = DAYS_MENU.find(d => d.id === activeDayKey) || DAYS_MENU[0];

  // Bir yemeğin elenip elenmediğini kontrol
  const isDishExcluded = (dishName) => {
    if (!dishName) return false;
    const lower = dishName.toLowerCase();
    return dislikedList.some(dislikedId => {
      const item = DISLIKED_INGREDIENTS.find(i => i.id === dislikedId);
      if (!item) return false;
      return item.keywords.some(kw => lower.includes(kw));
    });
  };

  return (
    <div id="subscription-planner" className="py-12 sm:py-16 bg-[#faf7f2] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Üst Bilgi (Editoryal & Temiz) */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0e3d29] uppercase">
            The Perfect Plate & Krepçi Sistemi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0e3d29]">
            Kendi Yemek Programını Oluştur
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            İstemediğiniz yemekleri çıkarın, sevdiğiniz lezzetlerle dolu aylık veya günlük menünüzü hazırlayalım.
          </p>

          {/* Zarif İlerleme Metinleri (Dinamik Süreye Göre) */}
          <div className="pt-6 flex items-center justify-between sm:justify-center gap-2 sm:gap-8 text-[11px] sm:text-xs font-medium border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
            {(duration === 'daily'
              ? [
                  { num: 1, title: '1. Süre & Porsiyon' },
                  { num: 4, title: `2. ${currentDayData.dayName} Menüsü` },
                  { num: 5, title: '3. Teslimat & Onay' }
                ]
              : [
                  { num: 1, title: '1. Süre & Porsiyon' },
                  { num: 2, title: '2. Ödeme Tercihi' },
                  { num: 3, title: '3. İstenmeyenler' },
                  { num: 4, title: '4. Menü Takvimi' },
                  { num: 5, title: '5. Teslimat & Onay' }
                ]
            ).map((s) => {
              const isCurrent = step === s.num;
              const isPassed = duration === 'daily' 
                ? (step === 5 && s.num < 5) || (step === 4 && s.num === 1)
                : step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => isPassed && setStep(s.num)}
                  className={`pb-1 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                      : isPassed
                      ? 'text-stone-800 font-semibold'
                      : 'text-stone-400'
                  }`}
                >
                  <span>{s.title}</span>
                  {isPassed && <Check size={12} className="text-emerald-700" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== ADIM 1: SÜRE & PORSİYON SEÇİMİ ===================== */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 1. SÜRE SEÇİMİ (EN TEPEDE) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  1. Ne Kadar Süreli Yemek İstersiniz?
                </span>
                <span className="text-[11px] text-stone-500">
                  {duration === 'monthly' ? 'Aylık %15 İndirimli' : duration === 'weekly' ? 'Haftalık %8 Avantajlı' : 'Tek Günlük Deneme'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-stone-200/60 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setDuration('daily')}
                  className={`py-3 px-2 rounded-xl text-xs font-serif font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    duration === 'daily'
                      ? 'bg-white text-[#0e3d29] shadow-sm ring-1 ring-[#0e3d29]'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-1">⚡ <span>Tek Günlük</span></span>
                  <span className="text-[10px] font-sans font-normal opacity-75">Hızlı Sipariş</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDuration('weekly')}
                  className={`py-3 px-2 rounded-xl text-xs font-serif font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    duration === 'weekly'
                      ? 'bg-white text-[#0e3d29] shadow-sm ring-1 ring-[#0e3d29]'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-1">📅 <span>1 Haftalık</span></span>
                  <span className="text-[10px] font-sans font-bold text-amber-800">%8 Avantajlı</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDuration('monthly')}
                  className={`py-3 px-2 rounded-xl text-xs font-serif font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    duration === 'monthly'
                      ? 'bg-white text-[#0e3d29] shadow-sm ring-1 ring-[#0e3d29]'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-1">🏆 <span>1 Aylık Abone</span></span>
                  <span className="text-[10px] font-sans font-bold text-emerald-800">%15 İndirimli</span>
                </button>
              </div>

              {/* AKILLI FIRSAT / NUDGE ROZETLERİ (FOMO & UPSELL) */}
              {duration === 'daily' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">💡</span>
                    <div>
                      <strong className="text-amber-950 font-serif">Haftalık Fırsatı Kaçırmayın!</strong>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        Haftalık pakete geçerseniz günlüğü <strong>{Math.round(selectedTier.dailyPrice * 0.92)} ₺</strong>'ye gelir ve her gün kapınıza ücretsiz sıcak teslim edilir.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDuration('weekly')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#e2991e] hover:bg-[#d97706] text-stone-950 font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Haftalığa Geç (%8 İndirim) ➜
                  </button>
                </div>
              )}

              {duration === 'weekly' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">🌟</span>
                    <div>
                      <strong className="text-emerald-950 font-serif">Aylık Abonelikte Büyük Avantaj!</strong>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        Aylık abonelikte porsiyon <strong>{Math.round(selectedTier.dailyPrice * 0.85)} ₺</strong>'ye düşer, ayda tam <strong>{Math.round(selectedTier.dailyPrice * 24 * 0.15)} ₺</strong> cebinizde kalır!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDuration('monthly')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Aylık Avantajı Seç (%15 İndirim) ➜
                  </button>
                </div>
              )}

              {duration === 'monthly' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🏆</span>
                    <div>
                      <strong className="text-amber-950 font-serif">En Popüler VIP Abonelik Seçildi!</strong>
                      <p className="text-stone-600 text-[11px]">
                        %15 indirimli porsiyon + İstemediğiniz yemekleri otomatik filtreleme + Öncelikli mutfak servisi aktiftir.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                    En Çok Satan
                  </span>
                </div>
              )}

            </div>

            {/* EĞER TEK GÜNLÜK SEÇİLDİYSE: GÜN SEÇİCİ */}
            {duration === 'daily' && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                    2. Yemeğiniz Hangi Gün Teslim Edilsin?
                  </label>
                  <span className="text-[11px] text-amber-800 font-bold">
                    Seçili Gün: {DAYS_MENU.find(d => d.id === activeDayKey)?.dayName} ({DAYS_MENU.find(d => d.id === activeDayKey)?.date})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {DAYS_MENU.map(day => {
                    const isDaySel = activeDayKey === day.id;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setActiveDayKey(day.id)}
                        className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isDaySel
                            ? 'bg-[#0e3d29] text-[#f7e7ce] border-[#0e3d29] font-bold shadow-xs ring-1 ring-[#e2991e]'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="block font-serif text-xs">{day.dayName}</span>
                        <span className={`block text-[10px] ${isDaySel ? 'text-amber-300' : 'text-stone-400'}`}>
                          {day.date.slice(0, 5)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. PORSİYON PAKETİ SEÇİMİ (1, 2, 3, 4 Çeşit) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg font-bold text-[#0e3d29]">
                  {duration === 'daily' ? '3. Porsiyonunuzu Seçin' : '2. Günlük Porsiyonunuzu Seçin'}
                </h3>
                <span className="text-xs text-stone-500">
                  {duration === 'daily' ? 'Bugünlük kaç çeşit lezzet istersiniz?' : 'Günde kaç çeşit sıcak yemek gelsin?'}
                </span>
              </div>

              <div className="divide-y divide-stone-200 bg-white/60 rounded-2xl border border-stone-200 px-3">
                {PRICING_TIERS.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  const tierPrice = duration === 'daily'
                    ? tier.dailyPrice
                    : duration === 'weekly'
                    ? Math.round(tier.dailyPrice * 6 * 0.92)
                    : Math.round(tier.dailyPrice * 24 * 0.85);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier);
                        setUserSchedule(generatePersonalizedPlan(selectedProfile, dislikedList, tier.itemsCount));
                      }}
                      className={`py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors group ${
                        isSelected ? 'bg-amber-50/70 rounded-xl' : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#0e3d29] bg-[#0e3d29]' : 'border-stone-400 group-hover:border-[#0e3d29]'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>

                        <div className="space-y-0.5">
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

                      <div className="sm:text-right pl-8 sm:pl-0 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center">
                        <span className="font-serif text-2xl font-bold text-[#0e3d29]">
                          {tierPrice} ₺
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {duration === 'daily'
                            ? 'Tek Günlük Sıcak Teslimat'
                            : duration === 'weekly'
                            ? `Günde ~${Math.round(tier.dailyPrice * 0.92)} ₺ (6 Gün)`
                            : `Günde ~${Math.round(tier.dailyPrice * 0.85)} ₺ (${Math.round(tier.dailyPrice * 24 * 0.15)} ₺ Tasarruf)`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (duration === 'daily') {
                    setStep(4); // Doğrudan o günün menüsünü seçmeye geç
                  } else {
                    setStep(2); // Ödeme ve filtrelere geç
                  }
                }}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>
                  {duration === 'daily' 
                    ? `İlerle: ${currentDayData.dayName} Menünü Belirle` 
                    : 'İlerle: Ödeme ve Filtrelere Geç'}
                </span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 2: ÖDEME MODELİ (HAFTALIK / AYLIK İÇİN) ===================== */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">Ödeme Tercihiniz</h3>
                <p className="text-xs text-stone-500">
                  {duration === 'monthly' ? 'Aylık aboneliğiniz için ödeme şeklini seçin.' : 'Haftalık siparişiniz için ödeme şeklini seçin.'}
                </p>
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

            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Porsiyona Dön</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>İlerle: İstemediğin Yiyecekleri Belirle</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 3: İSTEMEDİĞİM YİYECEKLER & DAMAK PROFİLİ ===================== */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                <Ban size={14} />
                <span>Kişiselleştirilmiş Menü Filtresi</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">
                Tabağınızda Asla Görmek İstemediğiniz Yiyecekler
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Aylık paketiniz boyunca burada seçtiğiniz malzemeler menünüzden otomatik çıkarılacak ve yerlerine günün alternatif lezzetli tencere yemekleri atanacaktır.
              </p>
            </div>

            {/* 1. Damak Tercihi (Soft Seçim) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                1. Genel Damak Zevkiniz
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TASTE_PROFILES.map(prof => {
                  const isSel = selectedProfile === prof.id;
                  return (
                    <div
                      key={prof.id}
                      onClick={() => handleProfileChange(prof.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSel
                          ? 'border-[#0e3d29] bg-white shadow-xs ring-1 ring-[#0e3d29]'
                          : 'border-stone-200 hover:bg-white/60 bg-[#fbf9f4]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{prof.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs sm:text-sm text-stone-900">{prof.title}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-snug">{prof.desc}</p>
                        </div>
                      </div>
                      {isSel && <Check size={16} className="text-[#0e3d29] shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. İstenmeyen Yiyecekler / Kara Liste (Chip Seçiciler) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  2. Çıkarmak İstediğiniz Malzemeler (Dokunarak Seçin)
                </label>
                <span className="text-[11px] text-stone-400">
                  {dislikedList.length > 0 ? `${dislikedList.length} malzeme elendi` : 'Tüm yemekleri yerim'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {DISLIKED_INGREDIENTS.map(item => {
                  const isExcluded = dislikedList.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleDisliked(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isExcluded
                          ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {isExcluded ? (
                        <span className="text-rose-600 font-bold ml-1">✕</span>
                      ) : (
                        <span className="text-stone-300 text-[10px] ml-0.5">+</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Özel İstenmeyen Notu */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Başka istemediğiniz bir malzeme var mı? (Örn: dereotu, acı biber, sarımsak...)"
                  value={customExcludedText}
                  onChange={e => setCustomExcludedText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-hidden focus:border-[#0e3d29]"
                />
              </div>

              {/* Akıllı Bilgilendirme Kutusu */}
              {dislikedList.length > 0 && (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Mükemmel! Menünüz filtrelendi.</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Seçtiğiniz <strong>{dislikedList.map(id => DISLIKED_INGREDIENTS.find(i => i.id === id)?.label).join(', ')}</strong> menünüzden çıkarıldı. O günlerde size özel alternatif lezzetler servis edilecektir.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Alt Gezinme */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Ödemeye Dön</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Filtrelenmiş Menümü İncele</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 4: FİLTRELENMİŞ MENÜ TAKVİMİ ===================== */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Üst Başlık (Günlük vs Abonelik) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                  <span>{duration === 'daily' ? '⚡ Tek Günlük Menü' : '🛡️ Kişiselleştirilmiş Menü'}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">
                  {duration === 'daily' 
                    ? `${currentDayData.dayName} Günü Menünüzü Seçin (${currentDayData.date})`
                    : 'Haftalık Kişiselleştirilmiş Menünüz'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {duration === 'daily'
                    ? `Yalnızca ${currentDayData.dayName} günü adresinize teslim edilecek ${selectedTier.name} (${selectedTier.itemsCount} Çeşit) menünüzü belirleyin.`
                    : 'İstemediğiniz yemekler çıkarılarak size özel oluşturulmuş 6 günlük sofra.'}
                </p>
              </div>

              {duration !== 'daily' && dislikedList.length > 0 && (
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shrink-0">
                  🛡️ {dislikedList.length} malzeme filtrelendi
                </div>
              )}
            </div>

            {/* Gün Seçici Sekmeler (Sadece Haftalık ve Aylıkta tüm günler görünür; Günlükte seçilen gün sabit görünür) */}
            {duration !== 'daily' ? (
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
            ) : (
              <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-xl border border-amber-200/80 text-xs">
                <span className="text-[#0e3d29] font-serif font-bold">
                  📅 Seçilen Sipariş Günü: <strong>{currentDayData.dayName} ({currentDayData.date})</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-amber-900 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                >
                  Farklı Gün Seç ↺
                </button>
              </div>
            )}

            {/* Seçili Günün Yemek Seçenekleri */}
            <div className="space-y-6">
              
              {/* Çorba */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  1. Çorba Seçimi
                </span>
                <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                  {currentDayData.corbalar.map((corba) => {
                    const isSelected = userSchedule[activeDayKey]?.corba === corba;
                    const excluded = isDishExcluded(corba);
                    return (
                      <div
                        key={corba}
                        onClick={() => !excluded && handleItemSelect(activeDayKey, 'corba', corba)}
                        className={`py-2 px-2 flex items-center justify-between rounded-lg transition-colors ${
                          excluded 
                            ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-50' 
                            : isSelected 
                            ? 'bg-amber-50 text-[#0e3d29] font-bold cursor-pointer' 
                            : 'hover:bg-stone-50 text-stone-700 cursor-pointer'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">
                          {corba} {excluded && '(Tercihiniz: Elendi)'}
                        </span>
                        {isSelected && !excluded && <Check size={14} className="text-[#0e3d29]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ana Yemek */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e3d29] block">
                  2. Ana Yemek Seçimi
                </span>
                <div className="divide-y divide-stone-100 bg-white/70 rounded-2xl p-3 border border-stone-200">
                  {currentDayData.anaYemekler.map((yemek) => {
                    const isSelected = userSchedule[activeDayKey]?.anaYemek === yemek;
                    const excluded = isDishExcluded(yemek);
                    return (
                      <div
                        key={yemek}
                        onClick={() => !excluded && handleItemSelect(activeDayKey, 'anaYemek', yemek)}
                        className={`py-2 px-2 flex items-center justify-between rounded-lg transition-colors ${
                          excluded 
                            ? 'opacity-35 cursor-not-allowed text-stone-400 bg-stone-50' 
                            : isSelected 
                            ? 'bg-amber-50 text-[#0e3d29] font-bold cursor-pointer' 
                            : 'hover:bg-stone-50 text-stone-700 cursor-pointer'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">
                          {yemek} {excluded && '(İstemediğiniz Malzeme İçeriyor)'}
                        </span>
                        {isSelected && !excluded && <Check size={14} className="text-[#0e3d29]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pilav & Salata */}
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

              {/* Seçili Gün Tabağı Özeti */}
              <div className="p-4 bg-[#0e3d29] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#e2991e] font-bold uppercase tracking-wider text-[10px]">
                      {currentDayData.dayName} Tabağınız ({selectedTier.name}):
                    </span>
                    <span className="text-[10px] bg-white/20 text-amber-200 px-2 py-0.5 rounded-full font-bold">
                      {selectedTier.itemsCount === 2 && '1 Ana Yemek + 1 Yan Lezzet'}
                      {selectedTier.itemsCount === 1 && 'Sadece Ana Yemek'}
                      {selectedTier.itemsCount === 3 && '3 Çeşit Lezzet'}
                      {selectedTier.itemsCount >= 4 && '4 Çeşit Tam Menü'}
                    </span>
                  </div>
                  <div className="font-serif text-sm font-bold text-white mt-1">
                    {[
                      userSchedule[activeDayKey]?.anaYemek,
                      userSchedule[activeDayKey]?.corba,
                      userSchedule[activeDayKey]?.pilav,
                      userSchedule[activeDayKey]?.salata
                    ].filter(Boolean).join(' • ')}
                  </div>
                </div>
                <span className="text-[11px] text-emerald-300 font-semibold shrink-0">
                  {selectedTier.itemsCount} Çeşit Tamamlandı ✓
                </span>
              </div>

            </div>

            {/* Alt Gezinme */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(duration === 'daily' ? 1 : 3)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{duration === 'daily' ? 'Porsiyona Dön' : 'Filtrelere Dön'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>İlerle: Teslimat ve Onay</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 5: TESLİMAT VE NET SİPARİŞ ONAYI ===================== */}
        {step === 5 && (
          <form onSubmit={handleFinish} className="space-y-6 animate-in fade-in duration-200">
            
            {/* KOCAMAN VE NET SİPARİŞ ÖZETİ KARTI (ŞÜPHEYİ TAMAMEN YOK EDEN ALAN) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0e3d29] text-[#f7e7ce] space-y-4 shadow-lg border-2 border-[#e2991e]/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e2991e] block">
                    {duration === 'daily' ? '⚡ TEK GÜNLÜK SİPARİŞ ÖZETİ' : duration === 'weekly' ? '📅 1 HAFTALIK PAKET ÖZETİ' : '🏆 1 AYLIK ABONELİK ÖZETİ'}
                  </span>
                  <h4 className="font-serif font-bold text-xl text-white">
                    {duration === 'daily' 
                      ? `${currentDayData.dayName} Günü Menünüz (${currentDayData.date})`
                      : duration === 'weekly' 
                      ? '6 Günlük Haftalık Yemek Paketi' 
                      : '24 Günlük Düzenli Ev Yemeği Aboneliği'}
                  </h4>
                </div>
                <span className="text-xs bg-[#e2991e] text-stone-950 px-3 py-1 rounded-full font-bold self-start sm:self-auto shadow-sm">
                  {selectedTier.name} ({selectedTier.itemsCount} Çeşit)
                </span>
              </div>

              {/* Günlük Sipariş İçeriği */}
              {duration === 'daily' ? (
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] text-stone-300 font-bold uppercase tracking-wider text-amber-200">
                    Seçtiğiniz Menü Detayı:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/10 p-3 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-[#e2991e] font-bold block text-[10px] uppercase">🍵 Çorba:</span>
                      <strong className="text-white text-xs">{userSchedule[activeDayKey]?.corba || 'Seçilmedi'}</strong>
                    </div>
                    <div>
                      <span className="text-[#e2991e] font-bold block text-[10px] uppercase">🥘 Ana Yemek:</span>
                      <strong className="text-white text-xs">{userSchedule[activeDayKey]?.anaYemek || 'Seçilmedi'}</strong>
                    </div>
                    <div>
                      <span className="text-[#e2991e] font-bold block text-[10px] uppercase">🍚 Pilav/Makarna:</span>
                      <strong className="text-white text-xs">{userSchedule[activeDayKey]?.pilav || 'Seçilmedi'}</strong>
                    </div>
                    {userSchedule[activeDayKey]?.salata && (
                      <div className="sm:col-span-3 pt-1 border-t border-white/10">
                        <span className="text-[#e2991e] font-bold block text-[10px] uppercase">🥗 Salata/Meze:</span>
                        <strong className="text-white text-xs">{userSchedule[activeDayKey]?.salata}</strong>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-300 pt-1 flex items-center gap-1.5">
                    <span>📅 <strong>Teslim Edilecek Gün:</strong> {currentDayData.dayName}, {currentDayData.date}</span>
                  </div>
                </div>
              ) : (
                /* Haftalık / Aylık Sipariş İçeriği */
                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">🚚</span>
                    <span><strong>Dağıtım Günleri:</strong> Pazartesi'den Cumartesi'ye her gün taze sıcak servis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">🍲</span>
                    <span><strong>İlk Gün Dağıtımı:</strong> {DAYS_MENU[0]?.dayName} ({userSchedule['pazartesi']?.anaYemek || 'Günün Menüsü'})</span>
                  </div>
                  {dislikedList.length > 0 && (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <span>🛡️</span>
                      <span><strong>Filtrelenen Malzemeler:</strong> {dislikedList.join(', ')} otomatik elendi</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-stone-300">
                  Ödeme Tercihi: <strong className="text-white">{paymentMethod === 'online-card' ? 'Online Kart (Güvenli)' : 'Kapıda Nakit / Kredi Kartı POS'}</strong>
                </span>
                <div className="text-right">
                  <span className="text-xs text-stone-300 block">Ödenecek Toplam Tutar:</span>
                  <span className="text-[#e2991e] font-serif text-3xl font-bold">{finalTotal} ₺</span>
                </div>
              </div>
            </div>

            {/* TESLİMAT BİLGİLERİ FORMU */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg font-bold text-[#0e3d29]">Teslimat Adresiniz ve Saatiniz</h3>
                <p className="text-xs text-stone-500">Sıcak yemeklerinizin kapınıza tam vaktinde ulaşması için bilgileri doldurun.</p>
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
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-stone-50"
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
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-stone-50"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-stone-50"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Aşçıya veya Kuryeye Özel Not</label>
                  <input
                    type="text"
                    placeholder="Örn: Az tuzlu rica ederim / Kapıda zile basmayın"
                    value={deliveryInfo.notes}
                    onChange={e => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#0e3d29] focus:outline-hidden bg-stone-50"
                  />
                </div>
              </div>
            </div>

            {/* Alt Butonlar */}
            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 px-4 py-2 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Menüye Dön</span>
              </button>
              <button
                type="submit"
                className="px-10 py-4 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Check size={18} className="text-[#e2991e]" />
                <span>
                  {duration === 'daily' 
                    ? `${currentDayData.dayName} Günlük Siparişimi Onayla (${finalTotal} ₺)` 
                    : `Yemek Programımı Onayla & Başlat (${finalTotal} ₺)`}
                </span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
