import React, { useState } from 'react';
import { 
  X, Utensils, Calendar, Clock, ShoppingBag, 
  User, Check, ChevronRight, Bell, Sparkles, MapPin, 
  ArrowRight, ArrowLeft, CreditCard, Banknote, ShieldCheck, 
  CheckCircle2, Ban, Heart, ThumbsUp, RefreshCw
} from 'lucide-react';
import { 
  DAYS_MENU, BRAND_INFO, PRICING_TIERS, 
  DISLIKED_INGREDIENTS, TASTE_PROFILES, generatePersonalizedPlan 
} from '../data/menuData';
import confetti from 'canvas-confetti';

export default function MobileSimulator({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Mobil Akış Durumu:
  // 'quiz-taste' -> 'quiz-dislike' -> 'plan-preview' -> 'checkout' -> 'success' -> 'dashboard'
  const [mobileFlow, setMobileFlow] = useState('quiz-taste');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'schedule' | 'track' | 'profile'

  // Kullanıcı Tercihleri (Soft Anket)
  const [tasteProfile, setTasteProfile] = useState('dengeli');
  const [dislikedList, setDislikedList] = useState([]);
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[2]); // 3 Çeşit (290 ₺)
  const [duration, setDuration] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [paymentMethod, setPaymentMethod] = useState('cod-daily'); // 'cod-daily' | 'online-card'

  // Kişisel Menü Planı
  const [personalizedPlan, setPersonalizedPlan] = useState(() => generatePersonalizedPlan('dengeli', []));
  const [selectedDayKey, setSelectedDayKey] = useState('pazartesi');

  // Teslimat Formu
  const [delivery, setDelivery] = useState({
    fullName: '',
    phone: '',
    address: '',
    timeSlot: '11:30 - 13:00'
  });

  // İstenmeyen yiyecek toggle
  const toggleDisliked = (id) => {
    setDislikedList(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const newPlan = generatePersonalizedPlan(tasteProfile, next);
      setPersonalizedPlan(newPlan);
      return next;
    });
  };

  // Profil değiştiğinde
  const handleProfileSelect = (profId) => {
    setTasteProfile(profId);
    const newPlan = generatePersonalizedPlan(profId, dislikedList);
    setPersonalizedPlan(newPlan);
    setMobileFlow('quiz-dislike');
  };

  // Fiyat Hesabı
  const basePrice = selectedTier.dailyPrice;
  const days = duration === 'monthly' ? 24 : duration === 'weekly' ? 6 : 1;
  const discountRate = duration === 'monthly' ? 0.15 : duration === 'weekly' ? 0.08 : 0;
  const rawTotal = basePrice * days;
  const finalPrice = Math.round(rawTotal * (1 - discountRate));

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    } catch (err) {}
    setMobileFlow('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Kapat Butonu (Masaüstünde Sağ Üstte) */}
      <div className="hidden sm:flex absolute top-4 right-4 z-50 items-center gap-3">
        <span className="text-white/80 text-xs tracking-wider">
          KREPCİ İnteraktif Mobil Deneyimi
        </span>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Telefon Gövdesi (Mobilde %100 Ekran, Masaüstünde iPhone Çerçevesi - Tam Responsive) */}
      <div className="relative w-full h-full sm:w-[390px] sm:h-[820px] sm:max-h-[95vh] bg-[#faf7f2] sm:bg-stone-900 sm:rounded-[50px] sm:p-3 sm:shadow-2xl sm:border-4 sm:border-stone-800 sm:ring-4 sm:ring-black/40 flex flex-col overflow-hidden">
        
        {/* Dynamic Island (Yalnızca Masaüstü Mockup'ta) */}
        <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30"></div>

        {/* Ekran Konteyneri */}
        <div className="w-full h-full bg-[#faf7f2] sm:rounded-[40px] overflow-hidden flex flex-col relative pt-2 sm:pt-7 text-stone-800">
          
          {/* Mobil Üst Bar */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-stone-200/80 bg-[#faf7f2]/95 backdrop-blur-xs">
            {mobileFlow !== 'dashboard' && mobileFlow !== 'quiz-taste' ? (
              <button
                onClick={() => {
                  if (mobileFlow === 'quiz-dislike') setMobileFlow('quiz-taste');
                  else if (mobileFlow === 'plan-preview') setMobileFlow('quiz-dislike');
                  else if (mobileFlow === 'checkout') setMobileFlow('plan-preview');
                  else if (mobileFlow === 'success') setMobileFlow('plan-preview');
                  else setMobileFlow('plan-preview');
                }}
                className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Geri</span>
              </button>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-lg text-[#0e3d29]">KREPCİ</span>
                <span className="text-[9px] uppercase tracking-widest text-[#e2991e] font-semibold">Ev Yemekleri</span>
              </div>
            )}

            <span className="text-[11px] font-serif font-bold text-[#0e3d29]">
              {mobileFlow === 'quiz-taste' && '1/3 Damak Tercihi'}
              {mobileFlow === 'quiz-dislike' && '2/3 İstemediğin Yemekler'}
              {mobileFlow === 'plan-preview' && 'Sana Özel Menü'}
              {mobileFlow === 'checkout' && 'Ödeme & Teslimat'}
              {mobileFlow === 'success' && 'Abonelik Onaylandı'}
              {mobileFlow === 'dashboard' && 'Yemek Takvimim'}
            </span>

            {/* Mobilde Kapat Butonu */}
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 sm:hidden p-1"
            >
              <X size={20} />
            </button>
            <div className="hidden sm:block">
              <Bell size={16} className="text-stone-400" />
            </div>
          </div>

          {/* ===================== KAYDIRILABİLİR İÇERİK ===================== */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5">

            {/* ADIM 1: DAMAK ZEVKİ ANKETİ (SOFT & SICAK KARŞILAMA) */}
            {mobileFlow === 'quiz-taste' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center space-y-1 pt-2">
                  <span className="text-3xl block">🍲</span>
                  <h3 className="font-serif font-bold text-xl text-[#0e3d29]">
                    Hoş Geldin!
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    Krepçi her gün taze pişen sıcak ev yemeklerini kapına getirir. Damak zevkin nasıl?
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {TASTE_PROFILES.map(prof => (
                    <button
                      key={prof.id}
                      onClick={() => handleProfileSelect(prof.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        tasteProfile === prof.id
                          ? 'border-[#0e3d29] bg-white shadow-xs ring-1 ring-[#0e3d29]'
                          : 'border-stone-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{prof.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-stone-900">{prof.title}</span>
                            {prof.badge && (
                              <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                                {prof.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{prof.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-stone-300 group-hover:text-[#0e3d29] shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={() => setMobileFlow('plan-preview')}
                    className="text-xs text-stone-400 hover:text-stone-600 underline"
                  >
                    Anketi atla, doğrudan haftalık menüyü gör →
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 2: İSTEMEDİĞİN YİYECEKLER (SOFT, HAFİF & YORMAYAN) */}
            {mobileFlow === 'quiz-dislike' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center space-y-1 pt-2">
                  <span className="text-3xl block">🥦</span>
                  <h3 className="font-serif font-bold text-xl text-[#0e3d29]">
                    Sevmediğin Lezzetler Var mı?
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    Tabağında asla görmek istemediğin yemekleri seç. Biz onları menünden çıkarıp yerine alternatifler koyalım!
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2 text-center">
                    Dokunarak çıkarabilirsin:
                  </span>

                  <div className="flex flex-wrap justify-center gap-2">
                    {DISLIKED_INGREDIENTS.map(item => {
                      const isExcluded = dislikedList.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleDisliked(item.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isExcluded
                              ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs scale-98'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
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
                </div>

                {dislikedList.length > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-900">
                    ✓ <strong>{dislikedList.length} malzeme elendi!</strong> Aylık menünde bu yemekler asla kapına gelmeyecek.
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => setMobileFlow('plan-preview')}
                    className="w-full py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{dislikedList.length > 0 ? 'Filtrelenmiş Menümü Hazırla' : 'Hepsini Severim, Menümü Göster'}</span>
                    <ArrowRight size={14} className="text-[#e2991e]" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 3: KİŞİSELLEŞTİRİLMİŞ MENÜ ÖNERİSİ (PLAN PREVIEW) */}
            {mobileFlow === 'plan-preview' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block">Sana Özel Menü</span>
                    <h3 className="font-serif font-bold text-lg text-[#0e3d29]">Haftalık Programın</h3>
                  </div>

                  <button
                    onClick={() => setMobileFlow('quiz-taste')}
                    className="text-[11px] text-stone-500 hover:text-[#0e3d29] underline flex items-center gap-1"
                  >
                    <RefreshCw size={11} />
                    <span>Filtreleri Değiştir</span>
                  </button>
                </div>

                {/* Gün Seçici Tablar */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                  {DAYS_MENU.map(d => {
                    const isSel = selectedDayKey === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDayKey(d.id)}
                        className={`px-3 py-1.5 font-serif rounded-xl transition-colors shrink-0 ${
                          isSel
                            ? 'bg-[#0e3d29] text-[#f7e7ce] font-bold shadow-2xs'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        {d.dayName}
                      </button>
                    );
                  })}
                </div>

                {/* Seçili Günün Kişisel Tabağı */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 text-xs shadow-2xs">
                  <div className="flex justify-between items-baseline border-b border-stone-100 pb-2">
                    <span className="font-serif font-bold text-sm text-[#0e3d29]">
                      {personalizedPlan[selectedDayKey]?.dayName} Menün
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Damak Tadına Uygun
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400">🍵</span>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Çorba</span>
                        <span className="font-medium text-stone-800">{personalizedPlan[selectedDayKey]?.corba}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-stone-400">🥘</span>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Ana Yemek</span>
                        <span className="font-bold text-[#0e3d29]">{personalizedPlan[selectedDayKey]?.anaYemek}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-stone-400">🍚</span>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Pilav / Makarna</span>
                        <span className="font-medium text-stone-800">{personalizedPlan[selectedDayKey]?.pilav}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-stone-400">🥗</span>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Salata & Meze</span>
                        <span className="font-medium text-stone-800">{personalizedPlan[selectedDayKey]?.salata}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Porsiyon Seçimi (Yormayan Mini Seçici) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-stone-600 block">Öğünün Kaç Çeşit Olsun?</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {PRICING_TIERS.slice(0, 4).map(tier => {
                      const isSel = selectedTier.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            isSel
                              ? 'border-[#0e3d29] bg-amber-50/70 text-[#0e3d29] font-bold'
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          <span className="block text-[11px]">{tier.itemsCount} Çeşit Menü</span>
                          <span className="font-serif font-bold text-sm">{tier.dailyPrice} ₺</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Buton: Siparişe / Ödemeye Geç */}
                <div className="pt-2">
                  <button
                    onClick={() => setMobileFlow('checkout')}
                    className="w-full py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Bu Menüyle Başla (Adres & Ödeme)</span>
                    <ArrowRight size={14} className="text-[#e2991e]" />
                  </button>
                  <span className="block text-[10px] text-stone-400 text-center mt-1">
                    Günlük kapıda ödeme veya %15 indirimli aylık paket
                  </span>
                </div>
              </div>
            )}

            {/* ADIM 4: ÖDEME VE TESLİMAT (CHECKOUT) */}
            {mobileFlow === 'checkout' && (
              <form onSubmit={handleCompleteOrder} className="space-y-5 text-xs animate-in fade-in duration-300">
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="font-serif font-bold text-base text-[#0e3d29]">Teslimat & Ödeme</h3>
                  <p className="text-[11px] text-stone-500">Yemeklerinin nereye ve ne zaman gelmesini istersin?</p>
                </div>

                {/* Plan Süresi */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 block">Paket Tercihi:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setDuration('monthly')}
                      className={`p-2.5 rounded-xl border cursor-pointer ${
                        duration === 'monthly' ? 'border-[#0e3d29] bg-white shadow-2xs font-bold' : 'border-stone-200 bg-white/60 text-stone-600'
                      }`}
                    >
                      <div className="text-[10px] text-amber-800">%15 İndirimli</div>
                      <span className="block font-serif text-xs">Aylık (24 Gün)</span>
                      <span className="font-serif text-[#0e3d29]">{Math.round(basePrice * 24 * 0.85)} ₺</span>
                    </div>

                    <div
                      onClick={() => setDuration('daily')}
                      className={`p-2.5 rounded-xl border cursor-pointer ${
                        duration === 'daily' ? 'border-[#0e3d29] bg-white shadow-2xs font-bold' : 'border-stone-200 bg-white/60 text-stone-600'
                      }`}
                    >
                      <div className="text-[10px] text-stone-400">Tek Günlük</div>
                      <span className="block font-serif text-xs">Günlük Sipariş</span>
                      <span className="font-serif text-[#0e3d29]">{basePrice} ₺</span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Modeli */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 block">Ödeme Şekli:</span>
                  <div className="space-y-2">
                    <div
                      onClick={() => setPaymentMethod('cod-daily')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'cod-daily' ? 'border-[#0e3d29] bg-white shadow-2xs font-bold' : 'border-stone-200 bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-amber-700" />
                        <div>
                          <span>Günlük Kapıda Ödeme</span>
                          <span className="text-[10px] text-stone-400 block font-normal">Nakit veya Kurye POS Kart</span>
                        </div>
                      </div>
                      {paymentMethod === 'cod-daily' && <Check size={14} className="text-[#0e3d29]" />}
                    </div>

                    <div
                      onClick={() => setPaymentMethod('online-card')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'online-card' ? 'border-[#0e3d29] bg-white shadow-2xs font-bold' : 'border-stone-200 bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-[#0e3d29]" />
                        <div>
                          <span>Online Kredi / Banka Kartı</span>
                          <span className="text-[10px] text-stone-400 block font-normal">Güvenli Aylık Tek Çekim</span>
                        </div>
                      </div>
                      {paymentMethod === 'online-card' && <Check size={14} className="text-[#0e3d29]" />}
                    </div>
                  </div>
                </div>

                {/* İletişim & Adres */}
                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız *"
                    value={delivery.fullName}
                    onChange={e => setDelivery({ ...delivery, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Telefon Numaranız *"
                    value={delivery.phone}
                    onChange={e => setDelivery({ ...delivery, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  />
                  <textarea
                    required
                    rows="2"
                    placeholder="Teslimat Adresiniz (Ev veya Şirket) *"
                    value={delivery.address}
                    onChange={e => setDelivery({ ...delivery, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  ></textarea>

                  <div className="flex gap-4 text-[11px] text-stone-700 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="m-slot"
                        checked={delivery.timeSlot === '11:30 - 13:00'}
                        onChange={() => setDelivery({ ...delivery, timeSlot: '11:30 - 13:00' })}
                      />
                      <span>Öğle (11:30-13:00)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="m-slot"
                        checked={delivery.timeSlot === '17:30 - 19:30'}
                        onChange={() => setDelivery({ ...delivery, timeSlot: '17:30 - 19:30' })}
                      />
                      <span>Akşam (17:30-19:30)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500">Toplam Tutar:</span>
                    <span className="font-serif text-2xl font-bold text-[#0e3d29]">{finalPrice} ₺</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Yemek Programımı Onayla</span>
                    <ArrowRight size={14} className="text-[#e2991e]" />
                  </button>
                </div>
              </form>
            )}

            {/* ADIM 5: ONLAY EKRANI */}
            {mobileFlow === 'success' && (
              <div className="p-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h4 className="font-serif text-xl font-bold text-[#0e3d29]">Yemek Programın Başlatıldı!</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Damak tercihlerine uygun olarak usta aşçılarımız her sabah senin için pişirecek.
                </p>

                <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-left text-xs space-y-1 text-stone-700">
                  <div>Paket: <strong>{selectedTier.name} ({duration === 'monthly' ? 'Aylık' : 'Günlük'})</strong></div>
                  <div>Ödeme: <strong>{paymentMethod === 'cod-daily' ? 'Kapıda Ödeme' : 'Online Kart'}</strong></div>
                  <div>Teslimat: <strong>{delivery.timeSlot}</strong></div>
                  {dislikedList.length > 0 && (
                    <div className="text-emerald-800 text-[11px] pt-1 border-t">
                      ✓ {dislikedList.length} adet istemediğin malzeme menünden çıkarıldı.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setMobileFlow('dashboard');
                    setActiveTab('track');
                  }}
                  className="w-full py-3 bg-[#0e3d29] text-[#f7e7ce] rounded-full text-xs font-bold transition-all"
                >
                  Canlı Mutfak & Kurye Takibine Geç →
                </button>
              </div>
            )}

            {/* GENEL SEKMELER (Programım, Kurye, Profil) */}
            {mobileFlow === 'dashboard' && activeTab === 'track' && (
              <div className="p-5 text-center space-y-4">
                <span className="text-3xl block">🛵</span>
                <h4 className="font-serif font-bold text-base text-[#0e3d29]">Bugünkü Yemeğin Hazırlanıyor</h4>
                <p className="text-xs text-stone-500">Tahmini Teslimat: 12:15 - 12:30</p>
                <div className="text-left text-xs text-stone-700 border-t border-b border-stone-200 py-3 space-y-1 bg-white p-3 rounded-xl">
                  <div className="font-serif font-bold text-stone-900">Pazartesi Menün:</div>
                  <div>{personalizedPlan.pazartesi.corba} • {personalizedPlan.pazartesi.anaYemek} • {personalizedPlan.pazartesi.pilav}</div>
                  <div className="text-[11px] text-amber-800 font-semibold pt-1">
                    Ödeme: {paymentMethod === 'cod-daily' ? 'Kapıda Ödeme' : 'Online Kartla Ödendi'}
                  </div>
                </div>
              </div>
            )}

            {mobileFlow === 'dashboard' && activeTab === 'schedule' && (
              <div className="space-y-3 text-xs">
                <div className="border-b border-stone-200 pb-2">
                  <h4 className="font-serif font-bold text-base text-[#0e3d29]">Haftalık Yemek Takvimin</h4>
                  <p className="text-[11px] text-stone-500">Sevmediğin yemekler çıkarılmış temiz takvim.</p>
                </div>
                <div className="divide-y divide-stone-200">
                  {DAYS_MENU.map(d => (
                    <div key={d.id} className="py-2.5 flex justify-between items-start">
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">{d.dayName}</span>
                        <span className="text-[11px] text-[#0e3d29] font-medium">{personalizedPlan[d.id]?.anaYemek}</span>
                        <span className="text-[10px] text-stone-400 block">{personalizedPlan[d.id]?.corba} • {personalizedPlan[d.id]?.pilav}</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Planlandı
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileFlow === 'dashboard' && activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-stone-200 pb-3">
                  <h4 className="font-serif font-bold text-base text-[#0e3d29]">Abonelik Hesabım</h4>
                  <span className="text-[11px] text-stone-500">{delivery.fullName || 'Değerli Misafirimiz'}</span>
                </div>
                <div className="divide-y divide-stone-100 text-stone-700 bg-white rounded-2xl p-3 border border-stone-200">
                  <div className="py-2 flex justify-between">
                    <span>Damak Tercihi</span>
                    <strong className="text-[#0e3d29]">{tasteProfile}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Filtrelenen Malzeme</span>
                    <strong className="text-rose-700">{dislikedList.length} adet</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Müşteri Hizmetleri</span>
                    <span className="text-amber-800 font-bold">{BRAND_INFO.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileFlow('quiz-taste')}
                  className="w-full py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs"
                >
                  Tercihleri Yeniden Belirle
                </button>
              </div>
            )}

          </div>

          {/* Alt Mobil Sekmeler (Minimalist) */}
          <div className="border-t border-stone-200 bg-white/95 px-6 py-2.5 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setMobileFlow('plan-preview');
                setActiveTab('home');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileFlow === 'plan-preview' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <Utensils size={17} />
              <span className="text-[10px]">Menüm</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('dashboard');
                setActiveTab('schedule');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileFlow === 'dashboard' && activeTab === 'schedule' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <Calendar size={17} />
              <span className="text-[10px]">Takvim</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('dashboard');
                setActiveTab('track');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileFlow === 'dashboard' && activeTab === 'track' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <ShoppingBag size={17} />
              <span className="text-[10px]">Kurye</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('dashboard');
                setActiveTab('profile');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileFlow === 'dashboard' && activeTab === 'profile' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <User size={17} />
              <span className="text-[10px]">Profil</span>
            </button>
          </div>

          {/* Home Gösterge Çizgisi */}
          <div className="w-28 h-1 bg-stone-300 rounded-full mx-auto my-1.5 shrink-0"></div>
        </div>

      </div>
    </div>
  );
}
