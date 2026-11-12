// Krepçi Ev Yemekleri Yönetim Paneli - Örnek Operasyonel Veri Modeli
// (İleride gerçek veritabanına bağlanacak altyapı standartlarında hazırlanmıştır)

export const INITIAL_ORDERS = [
  {
    id: "KRP-1001",
    customerName: "Ahmet Yılmaz",
    phone: "0532 123 4567",
    address: "Maslak Mah. Büyükdere Cad. No:12 Plazalar Kat:8, Sarıyer",
    district: "Maslak",
    timeSlot: "11:30 - 13:00",
    tierName: "3 Çeşit Standart Menü",
    itemsCount: 3,
    planType: "monthly", // monthly | weekly | daily
    remainingDays: 19,
    totalDays: 24,
    todayMeal: {
      corba: "Mercimek Çorbası",
      anaYemek: "Krepçi Yağlama",
      pilav: "Pirinç Pilavı",
      salata: "Mevsim Salata"
    },
    paymentMethod: "cod-daily", // cod-daily | online-card
    paymentStatus: "Bekliyor", // Bekliyor | Tahsil Edildi
    amount: 290,
    status: "hazirlaniyor", // hazirlaniyor | kuryede | teslim_edildi | iptal
    notes: "Zile basmayın, ofis danışmasına bırakın.",
    date: "13.11.2026"
  },
  {
    id: "KRP-1002",
    customerName: "Zeynep Kaya",
    phone: "0544 987 6543",
    address: "Levent Mah. Çalıkuşu Sok. No:4 Daire:6, Beşiktaş",
    district: "Levent",
    timeSlot: "11:30 - 13:00",
    tierName: "4 Çeşit Doyurucu Menü",
    itemsCount: 4,
    planType: "monthly",
    remainingDays: 14,
    totalDays: 24,
    todayMeal: {
      corba: "Yayla Çorbası",
      anaYemek: "Fırında Tavuk Şiş",
      pilav: "Domatesli Bulgur Pilavı",
      salata: "Yoğurtlu Havuç Tarator"
    },
    paymentMethod: "online-card",
    paymentStatus: "Tahsil Edildi",
    amount: 320,
    status: "kuryede",
    notes: "Çorba ekstra sıcak olsun lütfen.",
    date: "13.11.2026"
  },
  {
    id: "KRP-1003",
    customerName: "Mustafa Demir (Demir Hukuk)",
    phone: "0555 456 7890",
    address: "Gayrettepe Mah. Yıldız Posta Cad. No:28 Kat:3, Şişli",
    district: "Gayrettepe",
    timeSlot: "11:30 - 13:00",
    tierName: "Aşçı Tabağı (Özel)",
    itemsCount: 4,
    planType: "weekly",
    remainingDays: 4,
    totalDays: 6,
    todayMeal: {
      corba: "Mercimek Çorbası",
      anaYemek: "Etli Tepsi Kebabı",
      pilav: "Ankara Tava",
      salata: "Köz Biber Yoğurtlusu"
    },
    paymentMethod: "cod-daily",
    paymentStatus: "Bekliyor",
    amount: 450,
    status: "hazirlaniyor",
    notes: "Kapıda temassız kredi kartı POS rica ediyorum.",
    date: "13.11.2026"
  },
  {
    id: "KRP-1004",
    customerName: "Ece Korkmaz",
    phone: "0533 222 3344",
    address: "Etiler Mah. Nispetiye Cad. No:45 Daire:12, Beşiktaş",
    district: "Etiler",
    timeSlot: "17:30 - 19:30",
    tierName: "3 Çeşit Standart Menü",
    itemsCount: 3,
    planType: "monthly",
    remainingDays: 22,
    totalDays: 24,
    todayMeal: {
      corba: "Brokoli Çorbası",
      anaYemek: "Kıymalı Patlıcan Musakka",
      pilav: "Pirinç Pilavı",
      salata: "Cacık"
    },
    paymentMethod: "online-card",
    paymentStatus: "Tahsil Edildi",
    amount: 290,
    status: "hazirlaniyor",
    notes: "Akşam servisi, kapı şifresi: 1923.",
    date: "13.11.2026"
  },
  {
    id: "KRP-1005",
    customerName: "Caner Aydın",
    phone: "0530 888 7766",
    address: "Mecidiyeköy Mah. Ortaklar Cad. No:14 Daire:2, Şişli",
    district: "Mecidiyeköy",
    timeSlot: "11:30 - 13:00",
    tierName: "2 Çeşit Menü",
    itemsCount: 2,
    planType: "daily",
    remainingDays: 1,
    totalDays: 1,
    todayMeal: {
      corba: "Mercimek Çorbası",
      anaYemek: "Krepçi Yağlama",
      pilav: "Pirinç Pilavı",
      salata: "-"
    },
    paymentMethod: "cod-daily",
    paymentStatus: "Tahsil Edildi",
    amount: 260,
    status: "teslim_edildi",
    notes: "Nakit ödenecek.",
    date: "13.11.2026"
  },
  {
    id: "KRP-1006",
    customerName: "Selin & Burak Teknoloji A.Ş.",
    phone: "0542 333 4455",
    address: "Kağıthane Cendere Cad. Vadi İstanbul Ofisleri Blok B Kat:4",
    district: "Kağıthane",
    timeSlot: "11:30 - 13:00",
    tierName: "Gün Tabağı (Kurumsal)",
    itemsCount: 3,
    planType: "monthly",
    remainingDays: 12,
    totalDays: 24,
    todayMeal: {
      corba: "Ezogelin Çorbası",
      anaYemek: "Etli Kurufasulye",
      pilav: "Pirinç Pilavı",
      salata: "Turşu & Cacık"
    },
    paymentMethod: "online-card",
    paymentStatus: "Tahsil Edildi",
    amount: 400,
    status: "kuryede",
    notes: "Şirket mutfağına teslim edilecek.",
    date: "13.11.2026"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-01",
    fullName: "Ahmet Yılmaz",
    phone: "0532 123 4567",
    email: "ahmet.yilmaz@email.com",
    address: "Maslak Mah. Büyükdere Cad. No:12 Plazalar Kat:8, Sarıyer",
    district: "Maslak",
    tier: "3 Çeşit Standart Menü",
    plan: "Aylık (24 Gün)",
    remainingDays: 19,
    startDate: "01.11.2026",
    status: "Aktif",
    totalSpent: 6250,
    preferredTime: "11:30 - 13:00 (Öğle)",
    allergies: "Alerjen yok, az tuzlu"
  },
  {
    id: "CUST-02",
    fullName: "Zeynep Kaya",
    phone: "0544 987 6543",
    email: "zeynep.kaya@email.com",
    address: "Levent Mah. Çalıkuşu Sok. No:4 Daire:6, Beşiktaş",
    district: "Levent",
    tier: "4 Çeşit Doyurucu Menü",
    plan: "Aylık (24 Gün)",
    remainingDays: 14,
    startDate: "28.10.2026",
    status: "Aktif",
    totalSpent: 6900,
    preferredTime: "11:30 - 13:00 (Öğle)",
    allergies: "Mide hassasiyeti var, acısız"
  },
  {
    id: "CUST-03",
    fullName: "Mustafa Demir",
    phone: "0555 456 7890",
    email: "mustafa@demirlaw.com",
    address: "Gayrettepe Mah. Yıldız Posta Cad. No:28 Kat:3, Şişli",
    district: "Gayrettepe",
    tier: "Aşçı Tabağı",
    plan: "Haftalık (6 Gün)",
    remainingDays: 4,
    startDate: "09.11.2026",
    status: "Aktif",
    totalSpent: 2700,
    preferredTime: "11:30 - 13:00 (Öğle)",
    allergies: "Yok"
  },
  {
    id: "CUST-04",
    fullName: "Ece Korkmaz",
    phone: "0533 222 3344",
    email: "ece.korkmaz@email.com",
    address: "Etiler Mah. Nispetiye Cad. No:45 Daire:12, Beşiktaş",
    district: "Etiler",
    tier: "3 Çeşit Standart Menü",
    plan: "Aylık (24 Gün)",
    remainingDays: 22,
    startDate: "05.11.2026",
    status: "Aktif",
    totalSpent: 6250,
    preferredTime: "17:30 - 19:30 (Akşam)",
    allergies: "Gluten hassasiyeti"
  },
  {
    id: "CUST-05",
    fullName: "Kemal Öztürk",
    phone: "0535 111 2233",
    email: "kemal.ozturk@email.com",
    address: "Akatlar Mah. Zeytinoğlu Cad. No:18, Beşiktaş",
    district: "Akatlar",
    tier: "3 Çeşit Standart Menü",
    plan: "Aylık (24 Gün)",
    remainingDays: 8,
    startDate: "20.10.2026",
    status: "Donduruldu (İzinli)",
    totalSpent: 6250,
    preferredTime: "11:30 - 13:00 (Öğle)",
    allergies: "Yok"
  }
];
