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

export default function SubscriptionPlanner({ onCompleteSubscription }) {
  const [step, setStep] = useState(1); // 1: Porsiyon, 2: Süre & Ödeme, 3: Damak & Kara Liste, 4: Menü İnceleme, 5: Teslimat
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[2]); // 3 Çeşit
  const [duration, setDuration] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [paymentMethod, setPaymentMethod] = useState('online-card'); // 'online-card' | 'cod-daily'
  
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
      // Otomatik yeni plan oluştur
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

          {/* Zarif İlerleme Metinleri (Responsive) */}
          <div className="pt-6 flex items-center justify-between sm:justify-center gap-2 sm:gap-8 text-[11px] sm:text-xs font-medium border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
            {[
              { num: 1, title: '1. Porsiyon' },
              { num: 2, title: '2. Süre & Ödeme' },
              { num: 3, title: '3. İstenmeyenler' },
              { num: 4, title: '4. Menü Takvimi' },
              { num: 5, title: '5. Teslimat' }
            ].map(s => (
              <button
                key={s.num}
                onClick={() => s.num < step && setStep(s.num)}
                className={`pb-1 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
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

        {/* ===================== ADIM 1: PORSİYON SEÇİMİ ===================== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#0e3d29]">
                Porsiyonunuzu Seçin
              </h3>
              <span className="text-xs text-stone-500">Günlük kaç çeşit tercih edersiniz?</span>
            </div>

            <div className="divide-y divide-stone-200">
              {PRICING_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      setUserSchedule(generatePersonalizedPlan(selectedProfile, dislikedList, tier.itemsCount));
                    }}
                    className={`py-5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors group ${
                      isSelected ? 'bg-amber-50/60' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
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

        {/* ===================== ADIM 2: SÜRE & ÖDEME MODELİ ===================== */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">1. Abonelik Süreniz</h3>
                <p className="text-xs text-stone-500">Aylık programlarda sevmediğiniz yemekler elenir, bütçe tasarrufu sağlanır.</p>
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

            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Porsiyona Dön</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
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
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0e3d29]">
                  Kişiselleştirilmiş Haftalık Menünüz
                </h3>
                <p className="text-xs text-stone-500">
                  İstemediğiniz yemekler çıkarılarak size özel oluşturulmuş haftalık sofra.
                </p>
              </div>

              {dislikedList.length > 0 && (
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  🛡️ {dislikedList.length} malzeme filtrelendi
                </div>
              )}
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

            {/* Seçili Günün Seçenekleri */}
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
              <div className="p-4 bg-[#0e3d29] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
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
                onClick={() => setStep(3)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Filtrelere Dön</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>İlerle: Teslimat ve Onay</span>
                <ArrowRight size={16} className="text-[#e2991e]" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADIM 5: TESLİMAT VE ONAY ===================== */}
        {step === 5 && (
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
                <label className="block text-xs font-bold text-stone-700 mb-1">Aşçıya veya Kuryeye Özel Not</label>
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
                {dislikedList.length > 0 && (
                  <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                    ✓ {dislikedList.length} adet istemediğiniz malzeme paketten çıkarıldı
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 px-4 py-2"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-10 py-4 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Yemek Programımı Kaydet & Başlat</span>
                  <ArrowRight size={16} className="text-[#e2991e]" />
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
