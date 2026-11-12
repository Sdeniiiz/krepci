import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Clock, MapPin, Phone, 
  Calendar, CheckCircle2, AlertCircle, Plus, Search, 
  Filter, ChefHat, Truck, CreditCard, Banknote, 
  ChevronRight, ArrowUpRight, MessageCircle, RefreshCw, X, Edit, Eye
} from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../data/adminMockData';
import { BRAND_INFO, DAYS_MENU } from '../data/menuData';

export default function AdminDashboard({ onExitAdmin }) {
  const [activeTab, setActiveTab] = useState('deliveries'); // 'deliveries' | 'kitchen' | 'customers' | 'sales'
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  
  // Filtreler
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | '11:30 - 13:00' | '17:30 - 19:30'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'hazirlaniyor' | 'kuryede' | 'teslim_edildi'

  // Yeni Sipariş Modalı
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    address: '',
    district: '',
    timeSlot: '11:30 - 13:00',
    tierName: '3 Çeşit Standart Menü',
    corba: 'Mercimek Çorbası',
    anaYemek: 'Krepçi Yağlama',
    pilav: 'Pirinç Pilavı',
    salata: 'Mevsim Salata',
    paymentMethod: 'cod-daily',
    amount: 290,
    notes: ''
  });

  // Durum Değiştirme (Hazırlanıyor -> Kuryede -> Teslim Edildi)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          paymentStatus: newStatus === 'teslim_edildi' ? 'Tahsil Edildi' : o.paymentStatus
        };
      }
      return o;
    }));
  };

  // Yeni Sipariş Kaydetme
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const created = {
      id: `KRP-${1000 + orders.length + 1}`,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      address: newOrder.address,
      district: newOrder.district || 'Merkez',
      timeSlot: newOrder.timeSlot,
      tierName: newOrder.tierName,
      itemsCount: 3,
      planType: 'daily',
      remainingDays: 1,
      totalDays: 1,
      todayMeal: {
        corba: newOrder.corba,
        anaYemek: newOrder.anaYemek,
        pilav: newOrder.pilav,
        salata: newOrder.salata
      },
      paymentMethod: newOrder.paymentMethod,
      paymentStatus: newOrder.paymentMethod === 'online-card' ? 'Tahsil Edildi' : 'Bekliyor',
      amount: Number(newOrder.amount) || 290,
      status: 'hazirlaniyor',
      notes: newOrder.notes,
      date: 'Bugün'
    };

    setOrders([created, ...orders]);
    setIsAddModalOpen(false);
    setNewOrder({
      customerName: '',
      phone: '',
      address: '',
      district: '',
      timeSlot: '11:30 - 13:00',
      tierName: '3 Çeşit Standart Menü',
      corba: 'Mercimek Çorbası',
      anaYemek: 'Krepçi Yağlama',
      pilav: 'Pirinç Pilavı',
      salata: 'Mevsim Salata',
      paymentMethod: 'cod-daily',
      amount: 290,
      notes: ''
    });
  };

  // Filtrelenmiş Siparişler
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.phone.includes(searchQuery) ||
                        o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTime = timeFilter === 'all' || o.timeSlot === timeFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchTime && matchStatus;
  });

  // Mutfak Aşçı Porsiyon Sayacı (Chef Production Calculator)
  const kitchenBatch = orders.reduce((acc, order) => {
    if (order.status !== 'iptal') {
      const { corba, anaYemek, pilav, salata } = order.todayMeal;
      if (corba && corba !== '-') acc.corbalar[corba] = (acc.corbalar[corba] || 0) + 1;
      if (anaYemek && anaYemek !== '-') acc.anaYemekler[anaYemek] = (acc.anaYemekler[anaYemek] || 0) + 1;
      if (pilav && pilav !== '-') acc.pilavlar[pilav] = (acc.pilavlar[pilav] || 0) + 1;
      if (salata && salata !== '-') acc.mezeler[salata] = (acc.mezeler[salata] || 0) + 1;
    }
    return acc;
  }, { corbalar: {}, anaYemekler: {}, pilavlar: {}, mezeler: {} });

  // Finans Özeti
  const totalDailyRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingCashRevenue = orders
    .filter(o => o.paymentMethod === 'cod-daily' && o.paymentStatus !== 'Tahsil Edildi')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const collectedRevenue = orders
    .filter(o => o.paymentStatus === 'Tahsil Edildi')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-stone-800 font-sans pb-16">
      
      {/* Yönetim Paneli Üst Barı */}
      <header className="bg-[#0e3d29] text-white border-b-2 border-[#e2991e]/50 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Marka & Panel Başlığı */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e2991e] text-stone-950 flex items-center justify-center font-serif font-black text-lg shadow-sm">
                K
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-white">KREPCİ</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-amber-200 px-2 py-0.5 rounded-full">
                    Operasyon & Mutfak Portalı
                  </span>
                </div>
                <span className="text-[11px] text-stone-300 block">
                  Kime, Ne Zaman, Hangi Yemek Gönderilecek? (Sevkiyat Planlayıcı)
                </span>
              </div>
            </div>

            {/* Sağ Hızlı Eylemler */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#e2991e] hover:bg-[#d97706] text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                <span>Yeni Sipariş / Abone Gir</span>
              </button>

              <button
                onClick={onExitAdmin}
                className="text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Müşteri Görünümüne Dön
              </button>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* 1. OPERASYONEL CANLI METRİKLER (KPIs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Bugünkü Dağıtım</span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#0e3d29] mt-1">
              {orders.length} <span className="text-xs font-sans font-normal text-stone-500">Porsiyon Paket</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Öğle: {orders.filter(o => o.timeSlot.includes('11:30')).length}</span>
              <span>•</span>
              <span className="text-amber-800 font-bold">Akşam: {orders.filter(o => o.timeSlot.includes('17:30')).length}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Kurye / Sevkiyat Durumu</span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-amber-700 mt-1">
              {orders.filter(o => o.status === 'kuryede').length} <span className="text-xs font-sans font-normal text-stone-500">Yolda</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
              <span className="text-stone-700">{orders.filter(o => o.status === 'hazirlaniyor').length} Mutfakta</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{orders.filter(o => o.status === 'teslim_edildi').length} Teslim</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Günlük Ciro</span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#0e3d29] mt-1">
              {totalDailyRevenue} ₺
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Tahsil Edilen: <strong className="text-emerald-700">{collectedRevenue} ₺</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Kapıda Tahsilat Bekleyen</span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-rose-700 mt-1">
              {pendingCashRevenue} ₺
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Kuryelerin teslimatta alacağı tutar
            </div>
          </div>
        </div>

        {/* 2. PANEL SEKME GEZİNTİSİ (Zarif Editoryal Sekmeler) */}
        <div className="flex border-b border-stone-300 gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'deliveries', label: '🛵 Günün Sevkiyat & Dağıtım Listesi', count: orders.length },
            { id: 'kitchen', label: '🍳 Mutfak Aşçı Porsiyon Planı' },
            { id: 'customers', label: '👥 Kayıtlı Müşteriler & Aboneler', count: customers.length },
            { id: 'sales', label: '📊 Finans & Kasa Özeti' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-serif tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-sans font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===================== SEKME 1: SEVKİYAT & GÜNLÜK DAĞITIM LİSTESİ ===================== */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            
            {/* Arama & Filtreleme Çubuğu */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              
              {/* Arama Inputu */}
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Müşteri adı, telefon, adres veya kod ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#0e3d29] bg-stone-50/50"
                />
              </div>

              {/* Filtre Seçimleri */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Clock size={13} />
                  <span>Saat:</span>
                </div>
                <select
                  value={timeFilter}
                  onChange={e => setTimeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium focus:outline-hidden"
                >
                  <option value="all">Tüm Saatler</option>
                  <option value="11:30 - 13:00">Öğle (11:30 - 13:00)</option>
                  <option value="17:30 - 19:30">Akşam (17:30 - 19:30)</option>
                </select>

                <div className="flex items-center gap-1.5 text-stone-500 ml-2">
                  <Filter size={13} />
                  <span>Durum:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium focus:outline-hidden"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="hazirlaniyor">Mutfakta Hazırlanıyor</option>
                  <option value="kuryede">Kuryede (Yolda)</option>
                  <option value="teslim_edildi">Teslim Edildi</option>
                </select>
              </div>

            </div>

            {/* Dağıtım Sipariş Kartları / Tablo */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-500 border border-stone-200">
                  Aramanıza uygun teslimat bulunamadı.
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#0e3d29] transition-all shadow-2xs space-y-4"
                  >
                    {/* Üst Satır: Müşteri & Saat & Durum */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {order.id}
                        </span>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          {order.customerName}
                        </h3>
                        <a 
                          href={`tel:${order.phone.replace(/\s+/g, '')}`} 
                          className="text-xs text-stone-500 hover:text-[#0e3d29] flex items-center gap-1"
                        >
                          <Phone size={12} className="text-[#0e3d29]" />
                          <span>{order.phone}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0e3d29] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <Clock size={13} />
                          <span>{order.timeSlot}</span>
                        </div>

                        {/* Durum Seçici Pill */}
                        <div className="flex items-center gap-1">
                          {order.status === 'hazirlaniyor' && (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                              🍳 Mutfakta Pişiyor
                            </span>
                          )}
                          {order.status === 'kuryede' && (
                            <span className="text-[11px] font-bold text-sky-900 bg-sky-100 px-2.5 py-1 rounded-full animate-pulse">
                              🛵 Kuryede / Yolda
                            </span>
                          )}
                          {order.status === 'teslim_edildi' && (
                            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                              ✓ Teslim Edildi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Orta Satır: Ne Gönderilecek? (Günün Menüsü) & Nereye Gidecek? (Adres) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      
                      {/* Yemek İçeriği (Aşçının / Kuryenin Pakete Koyacağı Menü) */}
                      <div className="md:col-span-6 space-y-1 bg-[#faf7f2] p-3 rounded-xl border border-stone-200/80">
                        <span className="text-[10px] font-bold text-[#0e3d29] uppercase tracking-wider block">
                          Paket İçeriği ({order.tierName}):
                        </span>
                        <div className="text-stone-800 font-medium leading-relaxed">
                          <span className="font-semibold text-stone-900">🍵 {order.todayMeal.corba}</span> •{' '}
                          <span className="font-bold text-[#0e3d29]">🥘 {order.todayMeal.anaYemek}</span> •{' '}
                          <span>🍚 {order.todayMeal.pilav}</span>
                          {order.todayMeal.salata && order.todayMeal.salata !== '-' && (
                            <span> • 🥗 {order.todayMeal.salata}</span>
                          )}
                        </div>
                        {order.notes && (
                          <div className="text-[11px] text-amber-900 italic pt-1 border-t border-stone-200/60">
                            <strong>Aşçı/Kurye Notu:</strong> {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Teslimat Adresi & Bölge */}
                      <div className="md:col-span-4 space-y-1 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block flex items-center gap-1">
                          <MapPin size={12} className="text-rose-600" />
                          <span>Teslimat Adresi ({order.district})</span>
                        </span>
                        <p className="text-stone-700 leading-snug font-medium">
                          {order.address}
                        </p>
                      </div>

                      {/* Ödeme Durumu & Tutar */}
                      <div className="md:col-span-2 space-y-1 flex flex-col justify-center text-left md:text-right">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                          Ödeme / Tutar
                        </span>
                        <div className="font-serif text-lg font-bold text-[#0e3d29]">
                          {order.amount} ₺
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          order.paymentMethod === 'online-card'
                            ? 'text-emerald-800 bg-emerald-50'
                            : order.paymentStatus === 'Tahsil Edildi'
                            ? 'text-emerald-800 bg-emerald-50'
                            : 'text-amber-900 bg-amber-100'
                        }`}>
                          {order.paymentMethod === 'online-card'
                            ? 'Online Ödendi'
                            : order.paymentStatus === 'Tahsil Edildi'
                            ? 'Kapıda Alındı'
                            : 'Kapıda Bekliyor'}
                        </span>
                      </div>

                    </div>

                    {/* Alt Hızlı Durum Butonları */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 text-[11px]">Durumu Güncelle:</span>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'hazirlaniyor')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            order.status === 'hazirlaniyor'
                              ? 'bg-amber-800 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          Hazırlanıyor
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'kuryede')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            order.status === 'kuryede'
                              ? 'bg-sky-800 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          Kuryeye Ver
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'teslim_edildi')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            order.status === 'teslim_edildi'
                              ? 'bg-emerald-800 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          Teslim Edildi
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/90${order.phone.replace(/\D/g, '').slice(-10)}?text=Merhaba%20${encodeURIComponent(order.customerName)}%2C%20Krepçi%20Ev%20Yemekleri%20siparişiniz%20kuryemizdedir%2C%20afiyet%20olsun!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp Bilgi</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ===================== SEKME 2: AŞÇI MUTFAK ÜRETİM PLANI ===================== */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <ChefHat size={16} />
                <span>Mutfak Şefi Hazırlık Özeti</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">
                Bugün Toplam Kaç Porsiyon Pişecek?
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Sistem tüm aktif abonelerin ve günlük siparişlerin tercihlerini birleştirerek aşçı için kesin porsiyon adetlerini hesaplar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Çorbalar Porsiyon */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#0e3d29]">🍵 Çorbalar</h4>
                  <span className="text-xs text-stone-400">Porsiyon</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(kitchenBatch.corbalar).map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="text-stone-800 font-medium">{name}</span>
                      <span className="font-bold text-base text-[#0e3d29] bg-stone-100 px-2.5 py-0.5 rounded-lg">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ana Yemekler Porsiyon */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#0e3d29]">🥘 Ana Yemekler</h4>
                  <span className="text-xs text-stone-400">Porsiyon</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(kitchenBatch.anaYemekler).map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="text-stone-800 font-bold">{name}</span>
                      <span className="font-bold text-base text-[#0e3d29] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilav & Makarna Porsiyon */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#0e3d29]">🍚 Pilav & Makarna</h4>
                  <span className="text-xs text-stone-400">Porsiyon</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(kitchenBatch.pilavlar).map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="text-stone-800 font-medium">{name}</span>
                      <span className="font-bold text-base text-[#0e3d29] bg-stone-100 px-2.5 py-0.5 rounded-lg">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salata & Mezeler */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#0e3d29]">🥗 Salata & Meze</h4>
                  <span className="text-xs text-stone-400">Porsiyon</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(kitchenBatch.mezeler).map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="text-stone-800 font-medium">{name}</span>
                      <span className="font-bold text-base text-[#0e3d29] bg-stone-100 px-2.5 py-0.5 rounded-lg">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================== SEKME 3: MÜŞTERİLER & ABONELER ===================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0e3d29]">Kayıtlı Müşteri & Abone Havuzu</h3>
                <p className="text-xs text-stone-500">Müşterilerin iletişim, adres, kalan teslimat günü ve beslenme hassasiyetleri.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#0e3d29] hover:bg-[#185a3e] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Yeni Abone Ekle</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf7f2] border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Müşteri</th>
                      <th className="p-4">İletişim & Bölge</th>
                      <th className="p-4">Abonelik Paketi</th>
                      <th className="p-4">Kalan Teslimat</th>
                      <th className="p-4">Hassasiyet / Not</th>
                      <th className="p-4">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customers.map(cust => (
                      <tr key={cust.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-serif font-bold text-stone-900 block">{cust.fullName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{cust.id}</span>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <div className="text-stone-800 font-medium">{cust.phone}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">{cust.address}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-[#0e3d29] block">{cust.tier}</span>
                          <span className="text-[11px] text-stone-500">{cust.plan}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-serif font-bold text-sm text-[#0e3d29]">
                            {cust.remainingDays} Gün
                          </span>
                          <span className="text-[10px] text-stone-400 block">Kalan</span>
                        </td>
                        <td className="p-4 text-stone-600 italic text-[11px]">
                          {cust.allergies}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            cust.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}>
                            {cust.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEKME 4: SATIŞLAR & KASA ÖZETİ ===================== */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">Kasa & Tahsilat Dökümü</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Kapıda nakit, kapıda kredi kartı POS ve online kartla yapılan işlemlerin günlük akışı.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200 space-y-1">
                  <span className="text-stone-500 text-xs font-semibold">Kapıda Nakit / POS Tahsilatı</span>
                  <div className="text-2xl font-black text-amber-800">
                    {orders.filter(o => o.paymentMethod === 'cod-daily').reduce((s, o) => s + o.amount, 0)} ₺
                  </div>
                  <span className="text-[11px] text-stone-400">Teslimat anında alınan</span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200 space-y-1">
                  <span className="text-stone-500 text-xs font-semibold">Online Kart Tahsilatı</span>
                  <div className="text-2xl font-black text-[#0e3d29]">
                    {orders.filter(o => o.paymentMethod === 'online-card').reduce((s, o) => s + o.amount, 0)} ₺
                  </div>
                  <span className="text-[11px] text-stone-400">Aylık/Haftalık peşin ödenen</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-emerald-800 text-xs font-semibold">Toplam Günlük Ciro</span>
                  <div className="text-2xl font-black text-emerald-950">{totalDailyRevenue} ₺</div>
                  <span className="text-[11px] text-emerald-700">Tüm paketler dahil</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= YENİ SİPARİŞ / MANUEL ABONE EKLEME MODALI ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Hızlı Sipariş Girişi</span>
              <h3 className="font-serif text-2xl font-bold text-[#0e3d29]">Yeni Müşteri / Gönderi Ekle</h3>
              <p className="text-xs text-stone-500 mt-0.5">Telefonla gelen siparişi veya yeni aboneyi sisteme kaydedin.</p>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Müşteri Adı Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={newOrder.customerName}
                  onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={newOrder.phone}
                    onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Bölge / İlçe</label>
                  <input
                    type="text"
                    placeholder="Maslak / Beşiktaş"
                    value={newOrder.district}
                    onChange={e => setNewOrder({ ...newOrder, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Açık Adres (Ev / Ofis) *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Mahalle, Cadde, Sokak, No, Kat, Daire..."
                  value={newOrder.address}
                  onChange={e => setNewOrder({ ...newOrder, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Teslimat Saati</label>
                  <select
                    value={newOrder.timeSlot}
                    onChange={e => setNewOrder({ ...newOrder, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="11:30 - 13:00">Öğle (11:30 - 13:00)</option>
                    <option value="17:30 - 19:30">Akşam (17:30 - 19:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Porsiyon Menüsü</label>
                  <select
                    value={newOrder.tierName}
                    onChange={e => {
                      const tier = e.target.value;
                      let amt = 290;
                      if (tier.includes('1 Çeşit')) amt = 180;
                      else if (tier.includes('2 Çeşit')) amt = 260;
                      else if (tier.includes('3 Çeşit')) amt = 290;
                      else if (tier.includes('4 Çeşit')) amt = 320;
                      else if (tier.includes('Aşçı')) amt = 450;
                      else if (tier.includes('Gün')) amt = 400;
                      setNewOrder({ ...newOrder, tierName: tier, amount: amt });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="1 Çeşit Menü">1 Çeşit (180 ₺)</option>
                    <option value="2 Çeşit Menü">2 Çeşit (260 ₺)</option>
                    <option value="3 Çeşit Standart Menü">3 Çeşit (290 ₺)</option>
                    <option value="4 Çeşit Doyurucu Menü">4 Çeşit (320 ₺)</option>
                    <option value="Gün Tabağı">Gün Tabağı (400 ₺)</option>
                    <option value="Aşçı Tabağı">Aşçı Tabağı (450 ₺)</option>
                  </select>
                </div>
              </div>

              {/* Yemek Tercihleri */}
              <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
                <span className="font-bold text-[#0e3d29] block">Gönderilecek Yemekler:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Çorba (Örn: Mercimek)"
                    value={newOrder.corba}
                    onChange={e => setNewOrder({ ...newOrder, corba: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Ana Yemek (Örn: Yağlama)"
                    value={newOrder.anaYemek}
                    onChange={e => setNewOrder({ ...newOrder, anaYemek: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Pilav / Makarna"
                    value={newOrder.pilav}
                    onChange={e => setNewOrder({ ...newOrder, pilav: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Salata / Meze"
                    value={newOrder.salata}
                    onChange={e => setNewOrder({ ...newOrder, salata: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ödeme Yöntemi</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={e => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="cod-daily">Kapıda Nakit / POS</option>
                    <option value="online-card">Online Kart / Havale</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tutar (₺)</label>
                  <input
                    type="number"
                    value={newOrder.amount}
                    onChange={e => setNewOrder({ ...newOrder, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Aşçı / Kurye Notu</label>
                <input
                  type="text"
                  placeholder="Örn: Zile basmayın, acısız olsun..."
                  value={newOrder.notes}
                  onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-xl font-bold text-sm transition-colors shadow-md mt-2 cursor-pointer"
              >
                Siparişi Kaydet & Dağıtım Listesine Ekle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
