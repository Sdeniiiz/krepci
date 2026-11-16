import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Clock, MapPin, Phone, 
  Calendar, CheckCircle2, AlertCircle, Plus, Search, 
  Filter, ChefHat, Truck, CreditCard, Banknote, 
  ChevronRight, ArrowUpRight, MessageCircle, RefreshCw, X, Edit, Eye,
  FileText, Upload, Sparkles, FileUp, Check, ArrowRight, Ban
} from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../data/adminMockData';
import { BRAND_INFO, DAYS_MENU } from '../data/menuData';
import confetti from 'canvas-confetti';

// Gelecek Haftanın Örnek Editoryal Menüsü (16 - 21 Kasım 2026)
const SAMPLE_NEXT_WEEK_MENU = [
  {
    id: "pazartesi",
    date: "16.11.2026",
    dayName: "Pazartesi",
    colorTheme: { bg: "bg-emerald-800", border: "border-emerald-600", accent: "text-emerald-700", pill: "bg-emerald-100 text-emerald-800" },
    corbalar: ["Süzme Mercimek Çorbası", "Geleneksel Tarhana Çorbası"],
    anaYemekler: ["Krepçi Yağlama", "Etli Hünkar Beğendi", "Fırında Sebzeli Tavuk", "Zeytinyağlı Taze Fasulye"],
    pilavMakarna: ["Tereyağlı Pirinç Pilavı", "Domatesli Bulgur Pilavı"],
    salataMeze: ["Mevsim Salata", "Havuç Tarator", "Cacık"],
    tatli: ["Fırın Sütlaç"]
  },
  {
    id: "sali",
    date: "17.11.2026",
    dayName: "Salı",
    colorTheme: { bg: "bg-orange-700", border: "border-orange-500", accent: "text-orange-700", pill: "bg-orange-100 text-orange-800" },
    corbalar: ["Kremalı Domates Çorbası", "Nohutlu Yayla Çorbası"],
    anaYemekler: ["Etli Kuru Fasulye", "Tavuklu Bezelye Yemeği", "Arnavut Ciğeri", "Fırın Tavuk Şiş"],
    pilavMakarna: ["Pirinç Pilavı", "Fırın Peynirli Makarna"],
    salataMeze: ["Yoğurtlu Semizotu", "Geleneksel Kısır", "Cacık"],
    tatli: ["Islak Kek"]
  },
  {
    id: "carsamba",
    date: "18.11.2026",
    dayName: "Çarşamba",
    colorTheme: { bg: "bg-teal-800", border: "border-teal-600", accent: "text-teal-700", pill: "bg-teal-100 text-teal-800" },
    corbalar: ["Ezogelin Çorbası", "Tavuk Suyu Şehriye Çorbası"],
    anaYemekler: ["Kayseri Mantısı", "Etli Nohut Yemeği", "Patates Püreli Tavuk Sote", "Karnabahar Graten"],
    pilavMakarna: ["Pirinç Pilavı", "Pesto Soslu Burgu Makarna"],
    salataMeze: ["Köz Patlıcan Yoğurtlusu", "Pancar Salatası", "Mevsim Salata"],
    tatli: ["Kemalpaşa Tatlısı"]
  },
  {
    id: "persembe",
    date: "19.11.2026",
    dayName: "Perşembe",
    colorTheme: { bg: "bg-rose-800", border: "border-rose-600", accent: "text-rose-700", pill: "bg-rose-100 text-rose-800" },
    corbalar: ["Kremalı Brokoli Çorbası", "Yayla Çorbası"],
    anaYemekler: ["Tereyağlı Etli Keşkek", "Kıymalı Karnıyarık", "Fırında Sebzeli Tavuk Baget"],
    pilavMakarna: ["Arpa Şehriyeli Bulgur Pilavı", "Kelebek Makarna"],
    salataMeze: ["Mor Lahana Yoğurtlusu", "Gavurdağı Salatası", "Cacık"],
    tatli: ["Ev Yapımı Cevizli Baklava"]
  },
  {
    id: "cuma",
    date: "20.11.2026",
    dayName: "Cuma",
    colorTheme: { bg: "bg-indigo-800", border: "border-indigo-600", accent: "text-indigo-700", pill: "bg-indigo-100 text-indigo-800" },
    corbalar: ["Kremalı Mantar Çorbası", "Süzme Kırmızı Mercimek"],
    anaYemekler: ["Etli Tepsi Kebabı", "Çıtır Tavuk Şiş", "Tavuklu Taze Bamya", "Zeytinyağlı Enginar"],
    pilavMakarna: ["Tereyağlı Pirinç Pilavı", "Geleneksel Ankara Tava"],
    salataMeze: ["Mercimek Köftesi", "Yoğurtlu Havuç Tarator", "Mevsim Salata"],
    tatli: ["Çikolatalı Mozaik Pasta"]
  },
  {
    id: "cumartesi",
    date: "21.11.2026",
    dayName: "Cumartesi",
    colorTheme: { bg: "bg-amber-800", border: "border-amber-600", accent: "text-amber-700", pill: "bg-amber-100 text-amber-800" },
    corbalar: ["Mantar Çorbası", "Ezogelin Çorbası"],
    anaYemekler: ["Kıymalı Krep", "Tavuklu Mantarlı Krep", "Fırında Orman Kebabı"],
    pilavMakarna: ["Şehriyeli Pirinç Pilavı", "Domates Soslu Kalem Makarna"],
    salataMeze: ["Karışık Ev Turşusu Kavurması", "Yoğurtlu Kuru Biber", "Cacık"],
    tatli: ["Karamelli Trileçe"]
  }
];

export default function AdminDashboard({ onExitAdmin, onMenuUpdated, currentWeeklyMenu }) {
  const [activeTab, setActiveTab] = useState('deliveries'); // 'deliveries' | 'kitchen' | 'customers' | 'sales' | 'menu-updater'
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  
  // Filtreler
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | '11:30 - 13:00' | '17:30 - 19:30'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'hazirlaniyor' | 'kuryede' | 'teslim_edildi'

  // ================= HAFTALIK MENÜ YÜKLEYİCİ & DÜZENLEYİCİ STATE =================
  const [draftMenu, setDraftMenu] = useState(() => {
    return JSON.parse(JSON.stringify(currentWeeklyMenu || DAYS_MENU));
  });
  const [weekRange, setWeekRange] = useState(() => {
    try {
      return localStorage.getItem('krepci_menu_week_range') || '16 - 21 Kasım 2026';
    } catch (e) {
      return '16 - 21 Kasım 2026';
    }
  });
  const [menuLayoutMode, setMenuLayoutMode] = useState('editorial-cards'); // 'editorial-cards' | 'matrix-table'
  const [selectedDayFilter, setSelectedDayFilter] = useState('all'); // 'all' or day.id
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [showPosterSplit, setShowPosterSplit] = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawText, setRawText] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [newDishModal, setNewDishModal] = useState({ open: false, dayIdx: 0, category: 'anaYemekler', dishName: '' });

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

  // ================= MENÜ DÜZENLEME & YÜKLEME FONKSİYONLARI =================
  // Tekil yemek silme
  const handleRemoveDish = (dayIdx, category, dishIdx) => {
    setDraftMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[dayIdx] && next[dayIdx][category]) {
        next[dayIdx][category].splice(dishIdx, 1);
      }
      return next;
    });
  };

  // Tekil yemek ekleme
  const handleAddDish = (dayIdx, category, dishName) => {
    if (!dishName || !dishName.trim()) return;
    setDraftMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[dayIdx][category]) next[dayIdx][category] = [];
      next[dayIdx][category].push(dishName.trim());
      return next;
    });
    setNewDishModal({ open: false, dayIdx: 0, category: 'anaYemekler', dishName: '' });
  };

  // Örnek 2. Hafta Menüsünü Otomatik Yükleme
  const handleLoadSampleNextWeek = () => {
    setIsAnalyzing(true);
    setPublishSuccess(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDraftMenu(JSON.parse(JSON.stringify(SAMPLE_NEXT_WEEK_MENU)));
      setWeekRange('16 - 21 Kasım 2026');
      setUploadedFile({ name: 'Krepci_Haftalik_Menu_16_21_Kasim.pdf' });
    }, 400);
  };

  // Orijinal Afişe Sıfırlama
  const handleResetToOriginal = () => {
    setDraftMenu(JSON.parse(JSON.stringify(DAYS_MENU)));
    setWeekRange('09 - 14 Kasım 2026');
    setUploadedFile(null);
  };

  // Dosya Yükleme (PDF, Görsel veya Metin)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);
    setPublishSuccess(false);

    // Eğer görsel ise hemen ekranda afiş önizlemesini aç
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setShowPosterSplit(true);
    }

    // Eğer düz metin dosyası ise FileReader ile oku
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setRawText(content);
        parseMenuText(content);
        setIsAnalyzing(false);
      };
      reader.readAsText(file);
      return;
    }

    // PDF veya Görsel ise
    setTimeout(() => {
      setIsAnalyzing(false);
      const fname = file.name.toLowerCase();
      // Eğer dosya adı orijinal afişi andırıyorsa (09, kasım, poster, krepci)
      if (fname.includes('09') || fname.includes('poster') || fname.includes('orijinal') || fname.includes('1.')) {
        setDraftMenu(JSON.parse(JSON.stringify(DAYS_MENU)));
        setWeekRange('09 - 14 Kasım 2026');
      } else {
        setDraftMenu(JSON.parse(JSON.stringify(SAMPLE_NEXT_WEEK_MENU)));
        setWeekRange('16 - 21 Kasım 2026');
      }
    }, 600);
  };

  // Metin Ayrıştırıcı
  const parseMenuText = (text) => {
    if (!text || !text.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const dayKeywords = [
        { key: 'pazartesi', idx: 0 },
        { key: 'salı', idx: 1 },
        { key: 'sali', idx: 1 },
        { key: 'çarşamba', idx: 2 },
        { key: 'carsamba', idx: 2 },
        { key: 'perşembe', idx: 3 },
        { key: 'persembe', idx: 3 },
        { key: 'cuma', idx: 4 },
        { key: 'cumartesi', idx: 5 }
      ];

      setDraftMenu(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        let curIdx = 0;

        lines.forEach(line => {
          const lower = line.toLowerCase();
          const match = dayKeywords.find(d => lower.startsWith(d.key));
          if (match) {
            curIdx = match.idx;
            const parts = line.split(':');
            if (parts.length > 1 && parts[1].trim()) {
              const dishes = parts[1].split(',').map(s => s.trim()).filter(Boolean);
              if (dishes.length > 0) next[curIdx].anaYemekler = dishes;
            }
          } else if (line.length > 2 && !line.includes(':')) {
            const clean = line.replace(/^[-*•0-9.]\s*/, '').trim();
            if (clean && !next[curIdx].anaYemekler.includes(clean)) {
              next[curIdx].anaYemekler.push(clean);
            }
          }
        });
        return next;
      });
    }, 500);
  };

  // Metin / WhatsApp Ayrıştırma Butonu
  const handleParseRawText = () => {
    parseMenuText(rawText);
  };

  // Menüyü Canlıya Yayınlama
  const handlePublishMenu = () => {
    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    // LocalStorage ve parent component güncellemesi
    if (typeof onMenuUpdated === 'function') {
      onMenuUpdated(draftMenu, weekRange);
    }
    try {
      localStorage.setItem('krepci_custom_weekly_menu', JSON.stringify(draftMenu));
      localStorage.setItem('krepci_menu_week_range', weekRange);
    } catch (e) {}

    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 5000);
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

  // Mutfak Aşçı Porsiyon Sayacı
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
                  Sevkiyat Planlayıcı & Haftalık Menü Yönetimi
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

        {/* 2. PANEL SEKME GEZİNTİSİ */}
        <div className="flex border-b border-stone-300 gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'deliveries', label: '🛵 Günün Dağıtım Listesi', count: orders.length },
            { id: 'kitchen', label: '🍳 Mutfak Aşçı Porsiyon Planı' },
            { id: 'menu-updater', label: '📄 Haftalık Menü Yükle (PDF / Dosya)', highlight: true },
            { id: 'customers', label: '👥 Kayıtlı Müşteriler & Aboneler', count: customers.length },
            { id: 'sales', label: '📊 Finans & Kasa Özeti' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-serif tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-[#0e3d29] font-bold border-b-2 border-[#0e3d29]'
                  : tab.highlight
                  ? 'text-amber-900 font-bold hover:text-[#0e3d29]'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-sans font-bold">
                  Pratik
                </span>
              )}
              {tab.count !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-sans font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===================== SEKME: HAFTALIK MENÜ YÜKLE (PDF / DOSYA / EDİTORYAL TABLO) ===================== */}
        {activeTab === 'menu-updater' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* ÜST BİLGİ & HIZLI İŞLEM PANELİ */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Sparkles size={14} />
                    <span>Haftalık Menü Otomasyonu & Editoryal Kontrol Masası</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0e3d29]">
                    Haftalık Menü Düzenleme & Yayınlama
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                    PDF/Afiş dosyasını yükleyin veya aşağıdaki editoryal tabloda gün gün yemekleri kontrol edip tek tıkla canlıya yayınlayın.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Hafta Tarih Aralığı */}
                  <div className="flex items-center gap-2 bg-[#faf7f2] px-3.5 py-2 rounded-xl border border-stone-200">
                    <Calendar size={14} className="text-[#0e3d29]" />
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Hafta:</span>
                    <input
                      type="text"
                      value={weekRange}
                      onChange={e => setWeekRange(e.target.value)}
                      className="text-xs font-bold text-[#0e3d29] bg-transparent focus:outline-hidden w-36"
                      placeholder="16 - 21 Kasım 2026"
                    />
                  </div>

                  {/* Canlıya Yayınla Ana Buton */}
                  <button
                    type="button"
                    onClick={handlePublishMenu}
                    className="px-5 py-2.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Check size={16} className="text-[#e2991e]" />
                    <span>Değişiklikleri Canlıya Al</span>
                  </button>
                </div>
              </div>

              {/* 3 HIZLI AKSİYON KARTI (Yükleme & Örnek Seçenekleri) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Gelecek Haftayı Tek Tıkla Yükle */}
                <div 
                  onClick={handleLoadSampleNextWeek}
                  className="p-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-all group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block group-hover:text-amber-900">
                      Gelecek Haftayı Otomatik Yükle
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">
                      16 - 21 Kasım yeni menüsünü (Keşkek, Musakka, vb.) anında tabloya aktarır.
                    </span>
                  </div>
                </div>

                {/* 2. PDF / Görsel Dosyası Yükle */}
                <div className="relative p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#0e3d29] bg-[#faf7f2]/60 hover:bg-[#faf7f2] cursor-pointer transition-all group flex items-start gap-3.5">
                  <input
                    type="file"
                    accept=".pdf,image/*,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0e3d29] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileUp size={18} />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block group-hover:text-[#0e3d29]">
                      PDF veya Afiş Dosyası Yükle
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">
                      Matbaadan gelen haftalık menü dosyasını sürükleyin veya seçin.
                    </span>
                  </div>
                </div>

                {/* 3. Orijinal Afişe Sıfırla */}
                <div 
                  onClick={handleResetToOriginal}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50 cursor-pointer transition-all group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:rotate-180 transition-transform">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block">
                      İlk Menüye Sıfırla
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      09 - 14 Kasım orijinal poster menüsünü geri getirir.
                    </span>
                  </div>
                </div>

              </div>

              {/* Hızlı WhatsApp / Metin Yapıştırma Aç/Kapa Butonu */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPasteBox(!showPasteBox)}
                  className="text-stone-700 hover:text-[#0e3d29] font-bold flex items-center gap-1.5 cursor-pointer underline decoration-stone-300 hover:decoration-[#0e3d29]"
                >
                  <FileText size={14} className="text-amber-800" />
                  <span>{showPasteBox ? 'Metin Yapıştırma Kutusunu Kapat' : 'WhatsApp / Notlar Yemek Listesini Yapıştırarak Ayrıştır (+)'}</span>
                </button>

                {uploadedImagePreview && (
                  <button
                    type="button"
                    onClick={() => setShowPosterSplit(!showPosterSplit)}
                    className="text-[#0e3d29] font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                  >
                    <Eye size={13} />
                    <span>{showPosterSplit ? 'Yüklenen Afiş Görselini Gizle' : 'Yüklenen Afiş Görselini Göster'}</span>
                  </button>
                )}
              </div>

              {/* WhatsApp / Liste Yapıştırma Kutusu */}
              {showPasteBox && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="font-serif font-bold text-xs text-stone-900 block">
                      WhatsApp Menü Metnini Yapıştır:
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Örn: Pazartesi: Mercimek Çorbası, Krepçi Yağlama, Pirinç Pilavı... şeklinde yapıştırıp ayrıştır butonuna basın.
                    </p>
                  </div>
                  <textarea
                    rows="3"
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder="Pazartesi: Mercimek Çorbası, Krepçi Yağlama, Pilav&#10;Salı: Domates Çorbası, Kuru Fasulye..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-hidden focus:border-[#0e3d29]"
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleParseRawText}
                    className="px-4 py-2 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={14} className="text-[#e2991e]" />
                    <span>Metni Günlere Dağıt & Tabloyu Doldur</span>
                  </button>
                </div>
              )}

              {/* Yüklenen Afiş Görseli Önizlemesi (Yan Yana / Bölünmüş Görünüm) */}
              {showPosterSplit && uploadedImagePreview && (
                <div className="p-5 rounded-2xl bg-[#0e3d29]/5 border-2 border-[#0e3d29]/20 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0e3d29] text-amber-300 flex items-center justify-center font-bold text-xs">
                        K
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-[#0e3d29] block">
                          Yüklediğiniz Afiş Görseli ({uploadedFile?.name})
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Afiş resim formatında olduğu için yanınıza aldık; afişe baka baka aşağıdaki tablodan tek tıkla düzenleyebilirsiniz.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPosterSplit(false)}
                      className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Yüklenen Afiş" 
                      className="max-h-64 max-w-full rounded-lg shadow-sm border border-stone-200 object-contain"
                    />
                    <div className="text-xs text-stone-600 space-y-2">
                      <div className="font-serif font-bold text-stone-900 text-sm">
                        Afişiniz Başarıyla Yüklendi!
                      </div>
                      <p>
                        Afişteki yemekleri aşağıdaki <strong>Editoryal Tablo</strong> üzerinde görebilir, eksik veya farklı bir yemek varsa ilgili günün <strong>+ Ekle</strong> butonuna basarak 2 saniyede ekleyebilirsiniz.
                      </p>
                      <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80">
                        💡 <strong>İpucu:</strong> Eğer yüklediğiniz görsel orijinal afiş ise yukarıdaki <strong>"İlk Menüye Sıfırla"</strong> butonuna basarak orijinal afişteki tüm yemekleri eksiksiz tabloya doldurabilirsiniz.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dosya Durum Bildirimi & Analiz */}
              {isAnalyzing && (
                <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Dosya inceleniyor ve 6 günlük yemekler editoryal tabloya aktarılıyor...</span>
                </div>
              )}

              {uploadedFile && !isAnalyzing && (
                <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>Yüklendi ve Ayrıştırıldı: <strong>{uploadedFile.name}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    6 Gün Hazır
                  </span>
                </div>
              )}

              {publishSuccess && (
                <div className="p-4 bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2.5">
                    <Check size={18} className="text-[#e2991e]" />
                    <span>Haftalık menü başarıyla güncellendi! Ana sayfa ve mobil uygulama anında yeni menüyü yayına aldı.</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-sans">Canlıda</span>
                </div>
              )}

            </div>

            {/* EDİTORYAL TABLO & KONTROL MASASI BAŞLIĞI */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-xl text-[#0e3d29]">
                      Haftalık Menü Editoryal Çizelgesi
                    </h4>
                    <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      {weekRange}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Yemekleri tek tek rozetler halinde görebilir, dilediğinizi silebilir veya <strong>+ Ekle</strong> butonuyla hemen yeni yemek ekleyebilirsiniz.
                  </p>
                </div>

                {/* Görünüm Seçimi & Filtre */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex bg-stone-100 p-1 rounded-xl text-xs font-serif">
                    <button
                      type="button"
                      onClick={() => setMenuLayoutMode('editorial-cards')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        menuLayoutMode === 'editorial-cards'
                          ? 'bg-white text-[#0e3d29] font-bold shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      🏷️ Editoryal Gün Kartları
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuLayoutMode('matrix-table')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        menuLayoutMode === 'matrix-table'
                          ? 'bg-white text-[#0e3d29] font-bold shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      📊 Haftalık Çizelge Tablosu
                    </button>
                  </div>
                </div>
              </div>

              {/* GÖRÜNÜM 1: EDİTORYAL GÜN KARTLARI (THE PERFECT PLATE & ADİLE SULTAN USULÜ) */}
              {menuLayoutMode === 'editorial-cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {draftMenu.map((day, dayIdx) => (
                    <div 
                      key={day.id} 
                      className="p-4 rounded-2xl border border-stone-200 bg-[#faf7f2]/70 hover:bg-[#faf7f2] transition-colors flex flex-col justify-between space-y-4 shadow-2xs"
                    >
                      <div>
                        {/* Gün Başlığı */}
                        <div className="border-b border-stone-200 pb-2 flex justify-between items-baseline">
                          <div>
                            <span className="font-serif font-bold text-base text-[#0e3d29] block">
                              {day.dayName}
                            </span>
                            <span className="text-[10px] text-stone-500 font-sans">
                              {day.date}
                            </span>
                          </div>
                          <span className="text-[10px] bg-[#0e3d29]/10 text-[#0e3d29] font-bold px-1.5 py-0.5 rounded-md">
                            Gün {dayIdx + 1}
                          </span>
                        </div>

                        {/* Kategori 1: Çorbalar */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                              <span>🍵</span> Çorbalar
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewDishModal({ open: true, dayIdx, category: 'corbalar', dishName: '' })}
                              className="text-[10px] text-amber-900 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                            >
                              + Ekle
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.corbalar.map((dish, dIdx) => (
                              <span 
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-amber-50 text-amber-950 border border-amber-200/70"
                              >
                                <span>{dish}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(dayIdx, 'corbalar', dIdx)}
                                  className="text-amber-700 hover:text-rose-600 cursor-pointer ml-0.5"
                                  title="Yemeği Çıkar"
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Kategori 2: Ana Yemekler */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e3d29] flex items-center gap-1">
                              <span>🥘</span> Ana Yemekler
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewDishModal({ open: true, dayIdx, category: 'anaYemekler', dishName: '' })}
                              className="text-[10px] text-[#0e3d29] hover:text-[#185a3e] font-bold hover:underline cursor-pointer"
                            >
                              + Ekle
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.anaYemekler.map((dish, dIdx) => (
                              <span 
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-emerald-50 text-emerald-950 border border-emerald-200 font-medium"
                              >
                                <span>{dish}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(dayIdx, 'anaYemekler', dIdx)}
                                  className="text-emerald-700 hover:text-rose-600 cursor-pointer ml-0.5"
                                  title="Yemeği Çıkar"
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Kategori 3: Pilav & Makarna */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                              <span>🍚</span> Pilav / Makarna
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewDishModal({ open: true, dayIdx, category: 'pilavMakarna', dishName: '' })}
                              className="text-[10px] text-stone-700 hover:text-stone-900 font-bold hover:underline cursor-pointer"
                            >
                              + Ekle
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.pilavMakarna.map((dish, dIdx) => (
                              <span 
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-white text-stone-800 border border-stone-200"
                              >
                                <span>{dish}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(dayIdx, 'pilavMakarna', dIdx)}
                                  className="text-stone-400 hover:text-rose-600 cursor-pointer ml-0.5"
                                  title="Yemeği Çıkar"
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Kategori 4: Meze / Salata */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 flex items-center gap-1">
                              <span>🥗</span> Salata & Meze
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewDishModal({ open: true, dayIdx, category: 'salataMeze', dishName: '' })}
                              className="text-[10px] text-orange-900 hover:text-orange-950 font-bold hover:underline cursor-pointer"
                            >
                              + Ekle
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.salataMeze.map((dish, dIdx) => (
                              <span 
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-orange-50 text-orange-950 border border-orange-200/70"
                              >
                                <span>{dish}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(dayIdx, 'salataMeze', dIdx)}
                                  className="text-orange-600 hover:text-rose-600 cursor-pointer ml-0.5"
                                  title="Yemeği Çıkar"
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Hızlı Yemek Ekleme Kısayolu */}
                      <button
                        type="button"
                        onClick={() => setNewDishModal({ open: true, dayIdx, category: 'anaYemekler', dishName: '' })}
                        className="w-full py-1.5 rounded-xl border border-dashed border-stone-300 hover:border-[#0e3d29] text-[11px] text-stone-600 hover:text-[#0e3d29] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer bg-white"
                      >
                        <Plus size={12} />
                        <span>Yemek Ekle</span>
                      </button>

                    </div>
                  ))}
                </div>
              )}

              {/* GÖRÜNÜM 2: HAFTALIK ÇİZELGE TABLOSU (MATRİS TABLO) */}
              {menuLayoutMode === 'matrix-table' && (
                <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                  <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                    <thead>
                      <tr className="bg-[#0e3d29] text-[#f7e7ce] font-serif">
                        <th className="p-3.5 border-b border-[#0e3d29] font-bold w-28">Kategori</th>
                        {draftMenu.map((day, idx) => (
                          <th key={day.id} className="p-3.5 border-b border-[#0e3d29] font-bold text-center">
                            <div>{day.dayName}</div>
                            <span className="text-[10px] font-sans font-normal opacity-75">{day.date}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {/* Çorbalar Satırı */}
                      <tr className="hover:bg-stone-50/50">
                        <td className="p-3 font-serif font-bold text-amber-900 bg-amber-50/50 border-r border-stone-200">
                          🍵 Çorbalar
                        </td>
                        {draftMenu.map((day, dayIdx) => (
                          <td key={day.id} className="p-2.5 border-r border-stone-200 align-top">
                            <div className="flex flex-col gap-1">
                              {day.corbalar.map((dish, dIdx) => (
                                <span key={dIdx} className="inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-950 text-[11px] border border-amber-200">
                                  <span>{dish}</span>
                                  <button onClick={() => handleRemoveDish(dayIdx, 'corbalar', dIdx)} className="text-stone-400 hover:text-rose-600 cursor-pointer">
                                    <X size={10} />
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => setNewDishModal({ open: true, dayIdx, category: 'corbalar', dishName: '' })}
                                className="text-[10px] text-amber-800 hover:underline text-left mt-0.5 cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Ana Yemekler Satırı */}
                      <tr className="hover:bg-stone-50/50">
                        <td className="p-3 font-serif font-bold text-[#0e3d29] bg-emerald-50/50 border-r border-stone-200">
                          🥘 Ana Yemekler
                        </td>
                        {draftMenu.map((day, dayIdx) => (
                          <td key={day.id} className="p-2.5 border-r border-stone-200 align-top">
                            <div className="flex flex-col gap-1">
                              {day.anaYemekler.map((dish, dIdx) => (
                                <span key={dIdx} className="inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-950 text-[11px] border border-emerald-200 font-medium">
                                  <span>{dish}</span>
                                  <button onClick={() => handleRemoveDish(dayIdx, 'anaYemekler', dIdx)} className="text-stone-400 hover:text-rose-600 cursor-pointer">
                                    <X size={10} />
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => setNewDishModal({ open: true, dayIdx, category: 'anaYemekler', dishName: '' })}
                                className="text-[10px] text-[#0e3d29] hover:underline text-left mt-0.5 cursor-pointer font-bold"
                              >
                                + Ekle
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Pilav & Makarna Satırı */}
                      <tr className="hover:bg-stone-50/50">
                        <td className="p-3 font-serif font-bold text-stone-700 bg-stone-100/60 border-r border-stone-200">
                          🍚 Pilav & Makarna
                        </td>
                        {draftMenu.map((day, dayIdx) => (
                          <td key={day.id} className="p-2.5 border-r border-stone-200 align-top">
                            <div className="flex flex-col gap-1">
                              {day.pilavMakarna.map((dish, dIdx) => (
                                <span key={dIdx} className="inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded bg-white text-stone-800 text-[11px] border border-stone-200">
                                  <span>{dish}</span>
                                  <button onClick={() => handleRemoveDish(dayIdx, 'pilavMakarna', dIdx)} className="text-stone-400 hover:text-rose-600 cursor-pointer">
                                    <X size={10} />
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => setNewDishModal({ open: true, dayIdx, category: 'pilavMakarna', dishName: '' })}
                                className="text-[10px] text-stone-600 hover:underline text-left mt-0.5 cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Salata & Meze Satırı */}
                      <tr className="hover:bg-stone-50/50">
                        <td className="p-3 font-serif font-bold text-orange-950 bg-orange-50/40 border-r border-stone-200">
                          🥗 Salata & Meze
                        </td>
                        {draftMenu.map((day, dayIdx) => (
                          <td key={day.id} className="p-2.5 border-r border-stone-200 align-top">
                            <div className="flex flex-col gap-1">
                              {day.salataMeze.map((dish, dIdx) => (
                                <span key={dIdx} className="inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded bg-orange-50 text-orange-950 text-[11px] border border-orange-200">
                                  <span>{dish}</span>
                                  <button onClick={() => handleRemoveDish(dayIdx, 'salataMeze', dIdx)} className="text-stone-400 hover:text-rose-600 cursor-pointer">
                                    <X size={10} />
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => setNewDishModal({ open: true, dayIdx, category: 'salataMeze', dishName: '' })}
                                className="text-[10px] text-orange-850 hover:underline text-left mt-0.5 cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Alt Yayınlama ve Bilgi Çubuğu */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500">
                  💡 Bu menüyü onayladığınızda haftalık afiş, abone menü planlayıcısı ve mobil uygulama derhal bu yeni haftanın yemeklerine geçer.
                </span>

                <button
                  type="button"
                  onClick={handlePublishMenu}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Check size={16} className="text-[#e2991e]" />
                  <span>Değişiklikleri Onayla & Canlıya Al</span>
                </button>
              </div>

            </div>

            {/* YENİ YEMEK EKLEME MODALI */}
            {newDishModal.open && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                        {draftMenu[newDishModal.dayIdx]?.dayName} Günü
                      </span>
                      <h4 className="font-serif font-bold text-lg text-[#0e3d29]">
                        Yeni {newDishModal.category === 'corbalar' ? 'Çorba' : newDishModal.category === 'anaYemekler' ? 'Ana Yemek' : newDishModal.category === 'pilavMakarna' ? 'Pilav / Makarna' : 'Salata / Meze'} Ekle
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewDishModal({ open: false, dayIdx: 0, category: 'anaYemekler', dishName: '' })}
                      className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form 
                    onSubmit={e => {
                      e.preventDefault();
                      handleAddDish(newDishModal.dayIdx, newDishModal.category, newDishModal.dishName);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Yemek Adı:
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Örn: Hünkar Beğendi, Fırın Tavuk..."
                        value={newDishModal.dishName}
                        onChange={e => setNewDishModal(prev => ({ ...prev, dishName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#0e3d29] bg-stone-50"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setNewDishModal({ open: false, dayIdx: 0, category: 'anaYemekler', dishName: '' })}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0e3d29] hover:bg-[#185a3e] text-[#f7e7ce] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Listeye Ekle
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

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
                    {/* Üst Satır */}
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

                    {/* Orta Satır */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
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

                      <div className="md:col-span-4 space-y-1 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block flex items-center gap-1">
                          <MapPin size={12} className="text-rose-600" />
                          <span>Teslimat Adresi ({order.district})</span>
                        </span>
                        <p className="text-stone-700 leading-snug font-medium">
                          {order.address}
                        </p>
                      </div>

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

                    {/* Alt Durum Butonları */}
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
