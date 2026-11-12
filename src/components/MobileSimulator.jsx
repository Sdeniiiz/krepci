import React, { useState } from 'react';
import { 
  X, Utensils, Calendar, Clock, ShoppingBag, 
  User, Check, ChevronRight, Bell, Sparkles, MapPin, 
  ArrowRight, ArrowLeft, CreditCard, Banknote, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { DAYS_MENU, BRAND_INFO, PRICING_TIERS } from '../data/menuData';
import confetti from 'canvas-confetti';

export default function MobileSimulator({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Mobil navigasyon durumu
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'schedule' | 'track' | 'profile'
  const [mobileFlow, setMobileFlow] = useState('browse'); // 'browse' | 'customize' | 'checkout' | 'success'

  const [selectedDay, setSelectedDay] = useState(DAYS_MENU[0]);
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[2]); // 3 Çeşit (290 ₺)
  const [duration, setDuration] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [paymentMethod, setPaymentMethod] = useState('online-card'); // 'online-card' | 'cod-daily'
  
  // Mobil seçimler (Günlük yemek tercihi)
  const [mobilePlate, setMobilePlate] = useState({
    corba: DAYS_MENU[0].corbalar[0],
    anaYemek: DAYS_MENU[0].anaYemekler[0],
    pilav: DAYS_MENU[0].pilavMakarna[0],
    salata: DAYS_MENU[0].salataMeze[0]
  });

  // Mobil teslimat formu
  const [delivery, setDelivery] = useState({
    fullName: '',
    phone: '',
    address: '',
    timeSlot: '11:30 - 13:00'
  });

  // Fiyat hesabı
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Üst Kapatma */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="hidden sm:inline text-white/80 text-xs tracking-wider">
          KREPCİ Mobil Uygulaması (Seçim & Ödeme Akışı)
        </span>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Telefon Gövdesi */}
      <div className="relative w-[385px] h-[810px] max-h-[95vh] bg-stone-900 rounded-[50px] p-3 shadow-2xl border-4 border-stone-800 ring-4 ring-black/40 flex flex-col overflow-hidden">
        
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30"></div>

        {/* Ekran */}
        <div className="w-full h-full bg-[#faf7f2] rounded-[40px] overflow-hidden flex flex-col relative pt-7 text-stone-800">
          
          {/* Mobil Üst Bar */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-stone-200/80 bg-[#faf7f2]/95 backdrop-blur-xs">
            {mobileFlow !== 'browse' ? (
              <button
                onClick={() => {
                  if (mobileFlow === 'checkout') setMobileFlow('customize');
                  else if (mobileFlow === 'customize') setMobileFlow('browse');
                  else setMobileFlow('browse');
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
              {mobileFlow === 'customize' && 'Tabağını Oluştur'}
              {mobileFlow === 'checkout' && 'Ödeme & Teslimat'}
              {mobileFlow === 'success' && 'Sipariş Onaylandı'}
              {mobileFlow === 'browse' && (activeTab === 'home' ? 'Günün Menüsü' : activeTab === 'schedule' ? 'Programım' : activeTab === 'track' ? 'Kurye Takip' : 'Hesabım')}
            </span>

            <button className="text-stone-600 hover:text-stone-900">
              <Bell size={16} />
            </button>
          </div>

          {/* İçerik Alanı */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-6">

            {/* ================= 1. FLOW: BROWSE (ANA MENÜ KEŞFİ) ================= */}
            {mobileFlow === 'browse' && activeTab === 'home' && (
              <div className="space-y-6">
                {/* Hero Görseli */}
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
                    alt="Ev Yemeği"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#e2991e] font-bold">
                      Haftalık & Aylık Abonelik
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug">
                      Kendi menünüzü oluşturun, her gün sıcacık kapınıza gelsin.
                    </h3>
                  </div>
                </div>

                {/* Gün Seçici (Zarif Çizgili Metin Sekmesi) */}
                <div className="px-5">
                  <div className="flex justify-between items-baseline border-b border-stone-200 pb-2 mb-3">
                    <span className="font-serif font-bold text-sm text-[#0e3d29]">Haftalık Menü</span>
                    <span className="text-[10px] text-stone-500">09 - 14 Kasım</span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 text-xs">
                    {DAYS_MENU.map((d) => {
                      const isActive = selectedDay.id === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            setSelectedDay(d);
                            setMobilePlate({
                              corba: d.corbalar[0],
                              anaYemek: d.anaYemekler[0],
                              pilav: d.pilavMakarna[0],
                              salata: d.salataMeze[0]
                            });
                          }}
                          className={`pb-1 font-serif transition-colors shrink-0 cursor-pointer ${
                            isActive
                              ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                              : 'text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          {d.dayName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Günün Menüsü: Restoran Listesi */}
                <div className="px-5 space-y-4">
                  <div className="border-b border-stone-200 pb-1 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-xs text-[#0e3d29] uppercase tracking-wider">
                      {selectedDay.dayName} Lezzetleri
                    </span>
                    <span className="text-[10px] text-stone-500">3 Çeşit • 290 ₺</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Çorba</span>
                      <span className="font-medium text-stone-800">{selectedDay.corbalar.join(' veya ')}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Ana Yemek</span>
                      <span className="font-bold text-[#0e3d29]">{selectedDay.anaYemekler.slice(0, 3).join(', ')}</span>
                      <span className="text-[10px] text-stone-500 block">+{selectedDay.anaYemekler.length - 3} çeşit daha</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Garnitür</span>
                      <span className="font-medium text-stone-700">{selectedDay.pilavMakarna.join(', ')}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Salata & Meze</span>
                      <span className="text-stone-600">{selectedDay.salataMeze.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  {/* Seçim Ekranına Geçiş Butonu */}
                  <div className="pt-2">
                    <button
                      onClick={() => setMobileFlow('customize')}
                      className="w-full py-3 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Kendi Tabağını & Menünü Seç</span>
                      <ArrowRight size={13} className="text-[#e2991e]" />
                    </button>
                    <span className="block text-[10px] text-stone-400 text-center mt-1.5">
                      Günlük kapıda ödeme veya indirimli aylık paket
                    </span>
                  </div>
                </div>

                {/* Porsiyon Fiyat Tarifesi */}
                <div className="px-5 pt-3 border-t border-stone-200">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block mb-2">
                    Porsiyon Fiyatları
                  </span>
                  <div className="divide-y divide-stone-100 text-xs">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-stone-700">1 Çeşit Menü</span>
                      <span className="font-bold text-[#0e3d29]">180 ₺</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-stone-700">2 Çeşit Menü</span>
                      <span className="font-bold text-[#0e3d29]">260 ₺</span>
                    </div>
                    <div className="py-1.5 flex justify-between font-bold text-[#0e3d29]">
                      <span>3 Çeşit Standart Menü</span>
                      <span>290 ₺</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-stone-700">4 Çeşit Doyurucu Menü</span>
                      <span className="font-bold text-[#0e3d29]">320 ₺</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. FLOW: CUSTOMIZE (MOBİL YEMEK SEÇİM EKRANI) ================= */}
            {mobileFlow === 'customize' && (
              <div className="p-5 space-y-6 text-xs">
                {/* Porsiyon Boyutu Tercihi */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    1. Porsiyon Türü
                  </span>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl bg-white p-2">
                    {PRICING_TIERS.slice(0, 4).map((tier) => {
                      const isSel = selectedTier.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`py-2 px-2 flex justify-between items-center cursor-pointer rounded-lg transition-colors ${
                            isSel ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <span className="block">{tier.name}</span>
                            <span className="text-[10px] text-stone-400 font-normal">{tier.itemsCount} Çeşit Öğün</span>
                          </div>
                          <span className="font-serif text-sm font-bold text-[#0e3d29]">{tier.dailyPrice} ₺</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Çorba Seçimi */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    2. Çorbanızı Seçin
                  </span>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl bg-white p-2">
                    {selectedDay.corbalar.map((corba) => {
                      const isSel = mobilePlate.corba === corba;
                      return (
                        <div
                          key={corba}
                          onClick={() => setMobilePlate({ ...mobilePlate, corba })}
                          className={`py-2 px-2 flex justify-between items-center cursor-pointer rounded-lg ${
                            isSel ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span>{corba}</span>
                          {isSel && <Check size={14} className="text-[#0e3d29]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ana Yemek Seçimi */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    3. Ana Yemeğinizi Seçin
                  </span>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl bg-white p-2 max-h-48 overflow-y-auto pr-1">
                    {selectedDay.anaYemekler.map((yemek) => {
                      const isSel = mobilePlate.anaYemek === yemek;
                      return (
                        <div
                          key={yemek}
                          onClick={() => setMobilePlate({ ...mobilePlate, anaYemek: yemek })}
                          className={`py-2 px-2 flex justify-between items-center cursor-pointer rounded-lg ${
                            isSel ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span>{yemek}</span>
                          {isSel && <Check size={14} className="text-[#0e3d29]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Garnitür / Meze Seçimi */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    4. Pilav & Meze Seçimi
                  </span>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl bg-white p-2">
                    {selectedDay.pilavMakarna.concat(selectedDay.salataMeze.slice(0, 2)).map((item) => {
                      const isSel = mobilePlate.pilav === item || mobilePlate.salata === item;
                      return (
                        <div
                          key={item}
                          onClick={() => {
                            if (selectedDay.pilavMakarna.includes(item)) {
                              setMobilePlate({ ...mobilePlate, pilav: item });
                            } else {
                              setMobilePlate({ ...mobilePlate, salata: item });
                            }
                          }}
                          className={`py-2 px-2 flex justify-between items-center cursor-pointer rounded-lg ${
                            isSel ? 'bg-amber-50 text-[#0e3d29] font-bold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span>{item}</span>
                          {isSel && <Check size={14} className="text-[#0e3d29]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seçilen Tabak Özeti & İlerleme */}
                <div className="pt-2">
                  <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1 mb-3">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">Seçilen Tabağınız:</span>
                    <p className="text-stone-800 font-medium">
                      {mobilePlate.corba} • {mobilePlate.anaYemek} • {mobilePlate.pilav}
                    </p>
                  </div>

                  <button
                    onClick={() => setMobileFlow('checkout')}
                    className="w-full py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Ödeme & Teslimata İlerle</span>
                    <ArrowRight size={14} className="text-[#e2991e]" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= 3. FLOW: CHECKOUT (MOBİL ÖDEME VE TESLİMAT EKRANI) ================= */}
            {mobileFlow === 'checkout' && (
              <form onSubmit={handleCompleteOrder} className="p-5 space-y-6 text-xs">
                
                {/* 1. Süre Seçimi */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    Abonelik Süresi
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: 'monthly', title: 'Aylık Abonelik (24 Gün)', desc: '%15 İndirimli & Öncelikli Teslimat', price: `${Math.round(basePrice * 24 * 0.85)} ₺` },
                      { id: 'weekly', title: 'Haftalık Paket (6 Gün)', desc: '1 Haftalık Taze Deneme', price: `${Math.round(basePrice * 6 * 0.92)} ₺` },
                      { id: 'daily', title: 'Günlük Sipariş (1 Gün)', desc: 'Bugün için Tek Seferlik', price: `${basePrice} ₺` }
                    ].map(d => (
                      <div
                        key={d.id}
                        onClick={() => setDuration(d.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          duration === d.id ? 'border-[#0e3d29] bg-white shadow-2xs' : 'border-stone-200'
                        }`}
                      >
                        <div>
                          <span className="font-serif font-bold text-stone-900 block">{d.title}</span>
                          <span className="text-[10px] text-stone-500">{d.desc}</span>
                        </div>
                        <span className="font-serif font-bold text-[#0e3d29]">{d.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Ödeme Yöntemi Tercihi (Kararsız kullanıcı için net 2 seçenek) */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    Ödeme Tercihiniz
                  </span>
                  <div className="space-y-2">
                    {/* Kapıda Ödeme */}
                    <div
                      onClick={() => setPaymentMethod('cod-daily')}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        paymentMethod === 'cod-daily' ? 'border-[#0e3d29] bg-white shadow-2xs' : 'border-stone-200'
                      }`}
                    >
                      <Banknote size={18} className="text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">Günlük Kapıda Ödeme</span>
                        <p className="text-[10px] text-stone-500">Yemek kapınıza geldiğinde nakit veya kurye POS cihazıyla kartla ödeyin.</p>
                      </div>
                    </div>

                    {/* Online Kart */}
                    <div
                      onClick={() => setPaymentMethod('online-card')}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        paymentMethod === 'online-card' ? 'border-[#0e3d29] bg-white shadow-2xs' : 'border-stone-200'
                      }`}
                    >
                      <CreditCard size={18} className="text-[#0e3d29] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">Online Kredi / Banka Kartı</span>
                        <p className="text-[10px] text-stone-500">Tek çekimle güvenli ödeme. Her gün ödeme yapma zahmetinden kurtulun.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Teslimat Bilgileri */}
                <div className="space-y-3">
                  <span className="font-serif font-bold text-xs text-[#0e3d29] block">
                    Teslimat Bilgileri
                  </span>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Adınız Soyadınız *"
                      value={delivery.fullName}
                      onChange={e => setDelivery({ ...delivery, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Telefon Numaranız *"
                      value={delivery.phone}
                      onChange={e => setDelivery({ ...delivery, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows="2"
                      placeholder="Açık Adres (Ev veya Şirket Adresi) *"
                      value={delivery.address}
                      onChange={e => setDelivery({ ...delivery, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                    ></textarea>
                  </div>
                  <div className="flex gap-4 text-[11px] text-stone-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mob-slot"
                        checked={delivery.timeSlot === '11:30 - 13:00'}
                        onChange={() => setDelivery({ ...delivery, timeSlot: '11:30 - 13:00' })}
                      />
                      <span>Öğle (11:30-13:00)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mob-slot"
                        checked={delivery.timeSlot === '17:30 - 19:30'}
                        onChange={() => setDelivery({ ...delivery, timeSlot: '17:30 - 19:30' })}
                      />
                      <span>Akşam (17:30-19:30)</span>
                    </label>
                  </div>
                </div>

                {/* Sipariş Özeti & Onay */}
                <div className="pt-2 border-t border-stone-200 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500">Ödenecek Tutar:</span>
                    <span className="font-serif text-2xl font-bold text-[#0e3d29]">{finalPrice} ₺</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Siparişi Onayla & Programı Başlat</span>
                    <ArrowRight size={14} className="text-[#e2991e]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= 4. FLOW: SUCCESS (ONAY EKRANI) ================= */}
            {mobileFlow === 'success' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h4 className="font-serif text-xl font-bold text-[#0e3d29]">Aboneliğiniz Başlatıldı!</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Yemek programınız usta aşçılarımızın ekranına iletildi. Her sabah taze pişirilip kapınıza sıcak ulaştırılacaktır.
                </p>
                
                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 text-stone-700">
                  <div className="font-serif font-bold text-stone-900 border-b pb-1">Sipariş Detayı</div>
                  <div>Paket: <strong>{selectedTier.name}</strong></div>
                  <div>Süre: <strong>{duration === 'monthly' ? 'Aylık Plan' : 'Haftalık Plan'}</strong></div>
                  <div>Ödeme: <strong>{paymentMethod === 'cod-daily' ? 'Kapıda Ödeme' : 'Online Kart'}</strong></div>
                  <div>Teslimat: <strong>{delivery.timeSlot}</strong></div>
                </div>

                <button
                  onClick={() => {
                    setMobileFlow('browse');
                    setActiveTab('track');
                  }}
                  className="w-full py-3 bg-[#0e3d29] text-[#f7e7ce] rounded-full text-xs font-bold transition-all"
                >
                  Canlı Kurye Takibine Git →
                </button>
              </div>
            )}

            {/* ================= DİĞER SEKMELER (Programım, Kurye, Profil) ================= */}
            {mobileFlow === 'browse' && activeTab === 'schedule' && (
              <div className="p-5 space-y-4 text-xs">
                <div className="border-b border-stone-200 pb-2">
                  <h4 className="font-serif font-bold text-base text-[#0e3d29]">Haftalık Programınız</h4>
                  <p className="text-[11px] text-stone-500">Krepçi her gün sizin için taze hazırlayacak.</p>
                </div>
                <div className="divide-y divide-stone-200">
                  {DAYS_MENU.map((d) => (
                    <div key={d.id} className="py-3 flex justify-between items-start">
                      <div>
                        <span className="font-serif font-bold text-stone-900 block">{d.dayName}</span>
                        <span className="text-[11px] text-stone-600">{d.anaYemekler[0]}</span>
                        <span className="text-[10px] text-stone-400 block">{d.corbalar[0]} • {d.pilavMakarna[0]}</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Planlandı
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileFlow === 'browse' && activeTab === 'track' && (
              <div className="p-6 text-center space-y-4">
                <span className="text-3xl block">🛵</span>
                <h4 className="font-serif font-bold text-base text-[#0e3d29]">Bugünkü Yemeğiniz Yolda</h4>
                <p className="text-xs text-stone-500">Tahmini Teslimat: 12:15 - 12:30</p>
                <div className="text-left text-xs text-stone-700 border-t border-b border-stone-200 py-3 space-y-1">
                  <div className="font-serif font-bold text-stone-900">Pazartesi Menüsü:</div>
                  <div>Krepçi Yağlama, Mercimek Çorbası, Pirinç Pilavı</div>
                  <div className="text-[11px] text-amber-800 font-semibold pt-1">
                    Ödeme: {paymentMethod === 'cod-daily' ? 'Kapıda POS/Nakit (290 ₺)' : 'Online Kartla Ödendi'}
                  </div>
                </div>
              </div>
            )}

            {mobileFlow === 'browse' && activeTab === 'profile' && (
              <div className="p-5 space-y-4 text-xs">
                <div className="border-b border-stone-200 pb-3">
                  <h4 className="font-serif font-bold text-base text-[#0e3d29]">Abonelik Hesabım</h4>
                  <span className="text-[11px] text-stone-500">Kişisel Tercihler & Adres</span>
                </div>
                <div className="divide-y divide-stone-100 text-stone-700">
                  <div className="py-2.5 flex justify-between items-center cursor-pointer">
                    <span>Teslimat Adresim</span>
                    <ChevronRight size={14} className="text-stone-400" />
                  </div>
                  <div className="py-2.5 flex justify-between items-center cursor-pointer">
                    <span>Ödeme Tercihim (Kapıda / Online)</span>
                    <ChevronRight size={14} className="text-stone-400" />
                  </div>
                  <div className="py-2.5 flex justify-between items-center cursor-pointer">
                    <span>Teslimatı Dondur / Ertele</span>
                    <ChevronRight size={14} className="text-stone-400" />
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span>Sipariş Hattı</span>
                    <span className="text-amber-800 font-bold">{BRAND_INFO.phone}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Alt Mobil Sekmeler (Minimalist İkon & Metin) */}
          <div className="border-t border-stone-200 bg-white/95 px-6 py-2.5 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setMobileFlow('browse');
                setActiveTab('home');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' && mobileFlow === 'browse' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <Utensils size={17} />
              <span className="text-[10px]">Menü</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('browse');
                setActiveTab('schedule');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'schedule' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <Calendar size={17} />
              <span className="text-[10px]">Programım</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('browse');
                setActiveTab('track');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'track' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <ShoppingBag size={17} />
              <span className="text-[10px]">Kurye</span>
            </button>
            <button
              onClick={() => {
                setMobileFlow('browse');
                setActiveTab('profile');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-[#0e3d29] font-bold' : 'text-stone-400'}`}
            >
              <User size={17} />
              <span className="text-[10px]">Hesabım</span>
            </button>
          </div>

          {/* Home Gösterge Çizgisi */}
          <div className="w-28 h-1 bg-stone-300 rounded-full mx-auto my-1.5"></div>
        </div>

      </div>
    </div>
  );
}
