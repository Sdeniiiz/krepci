// Krepçi Ev Yemekleri Veri Modeli
export const BRAND_INFO = {
  name: "KREPCİ Ev Yemekleri",
  phone: "0542 142 7555",
  phoneFormatted: "0542 142 7555",
  whatsapp: "905421427555",
  slogans: {
    pillars: ["Hijyen", "Lezzet", "Sağlıklı", "Mide Dostu"],
    bannerTop: "Hijyenimiz İlkemiz, Lezzetimiz İmzamız, Sağlıklı ve Mide Dostu Yemeklerimizle Yanınızdayız! Beğeniniz Gururumuz!",
    delivery: "PAKET SERVİSİMİZLE Lezzet Kapınızda!",
    bottomNote: "Her gün taze, her gün lezzetli, her gün KREPCİ farkı! ♥"
  },
  hours: "Pazartesi - Cumartesi: 10:30 - 20:30 (Pazar Günleri Kapalı)",
  address: "Merkez Mutfak & Paket Servis Noktası",
  socials: {
    instagram: "@krepcievyemekleri"
  }
};

export const PRICING_TIERS = [
  {
    id: "1-cesit",
    name: "1 Çeşit Menü",
    itemsCount: 1,
    dailyPrice: 180,
    monthlyPrice: 3800, // 24 gün için avantajlı
    description: "Hafif atıştırmak veya tek bir lezzeti doyasıya tatmak isteyenler için.",
    badge: null,
    popular: false
  },
  {
    id: "2-cesit",
    name: "2 Çeşit Menü",
    itemsCount: 2,
    dailyPrice: 260,
    monthlyPrice: 5600,
    description: "Ana Yemek + Pilav veya Çorba + Ana Yemek dengesi.",
    badge: null,
    popular: false
  },
  {
    id: "3-cesit",
    name: "3 Çeşit Standart Menü",
    itemsCount: 3,
    dailyPrice: 290,
    monthlyPrice: 6250,
    description: "Çorba + Ana Yemek + Pilav/Makarna veya Meze. En çok tercih edilen ev yemeği ziyafeti.",
    badge: "EN ÇOK TERCİH EDİLEN",
    popular: true
  },
  {
    id: "4-cesit",
    name: "4 Çeşit Doyurucu Menü",
    itemsCount: 4,
    dailyPrice: 320,
    monthlyPrice: 6900,
    description: "Çorba + Ana Yemek + Pilav/Makarna + Salata/Meze veya Tatlı. Tam teşekküllü sofra.",
    badge: "EN İYİ FİYAT / PERFORMANS",
    popular: false
  },
  {
    id: "gun-tabagi",
    name: "Gün Tabağı",
    itemsCount: 3,
    dailyPrice: 400,
    monthlyPrice: 8600,
    description: "Günün en beğenilen seçkilerinden oluşan özel karma lezzet tabağı.",
    badge: "ÖZEL KONSEPT",
    popular: false
  },
  {
    id: "asci-tabagi",
    name: "Aşçı Tabağı",
    itemsCount: 4,
    dailyPrice: 450,
    monthlyPrice: 9700,
    description: "Şefin bizzat hazırladığı zengin porsiyonlu ve özel etli spesiyaller.",
    badge: "ŞEFİN İMZASI",
    popular: false
  }
];

export const SPECIAL_SPECIALTIES = [
  { id: "keskek-etli", name: "Etli Keşkek", price: 250, desc: "Ağır ateşte dövülmüş tereyağlı geleneksel etli keşkek" },
  { id: "keskek-tavuklu", name: "Tavuklu Keşkek", price: 200, desc: "Tiftiklenmiş köy tavuğuyla harmanlanmış nefis keşkek" },
  { id: "manti", name: "Kayseri Mantısı", price: 250, desc: "Ev yapımı yoğurt ve tereyağlı sumaklı sos eşliğinde" },
  { id: "tatli", name: "Günün Ev Tatlısı (Islak Kek / Sütlü)", price: 150, desc: "Taze kakaolu ıslak kek veya geleneksel ev tatlısı" }
];

export const DAYS_MENU = [
  {
    id: "pazartesi",
    date: "09.11.2026",
    dayName: "Pazartesi",
    colorTheme: {
      bg: "bg-emerald-800",
      border: "border-emerald-600",
      accent: "text-emerald-700",
      pill: "bg-emerald-100 text-emerald-800"
    },
    corbalar: ["Mercimek Çorbası", "Yayla Çorbası"],
    anaYemekler: [
      "Krepçi Yağlama",
      "Tavuklu Tas Kebabı",
      "Kıymalı Patlıcan Musakka",
      "Fırında Tavuk Şiş",
      "Zeytinyağlı Taze Fasulye",
      "Zeytinyağlı Biber Dolma"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Domatesli Bulgur Pilavı", "Domatesli Çubuk Makarna"],
    salataMeze: [
      "Patates Salatası",
      "Hardallı Erişte Salatası",
      "Yoğurtlu Kelebek Makarna",
      "Havuçlu Tavuklu Kuskus Yoğurtlusu",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Islak Kek"],
    featuredImg: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sali",
    date: "10.11.2026",
    dayName: "Salı",
    colorTheme: {
      bg: "bg-orange-700",
      border: "border-orange-500",
      accent: "text-orange-700",
      pill: "bg-orange-100 text-orange-800"
    },
    corbalar: ["Domates Çorbası", "Yayla Çorbası", "Erişteli Yeşil Mercimek Çorbası"],
    anaYemekler: [
      "Etli Taze Fasulye Yemeği",
      "Tavuklu Bezelye Yemeği",
      "Arnavut Ciğeri",
      "Fırında Tavuk Tandır",
      "Mantar Sote",
      "Zeytinyağlı Barbunya Pilaki"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Sebzeli Bulgur Pilavı", "Domatesli Çubuk Makarna"],
    salataMeze: [
      "Brokoli Salatası",
      "Garnitürlü Sebzeli Erişte Yoğurtlusu",
      "Havuç Tarator",
      "Yoğurtlu Biber Kızartması",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Islak Kek / Fırın Sütlaç"],
    featuredImg: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "carsamba",
    date: "11.11.2026",
    dayName: "Çarşamba",
    colorTheme: {
      bg: "bg-teal-800",
      border: "border-teal-600",
      accent: "text-teal-700",
      pill: "bg-teal-100 text-teal-800"
    },
    corbalar: ["Ezogelin Çorbası", "Domates Çorbası", "Yayla Çorbası"],
    anaYemekler: [
      "Etli Kurufasulye",
      "Etli Nohut Yemeği",
      "Patates Püreli Tavuk Sote",
      "Kıymalı Ispanak Yemeği",
      "Mantı",
      "Zeytinyağlı Kereviz",
      "Zeytinyağlı Pırasa"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Pesto Soslu Makarna", "Zerdeçallı Bulgur Pilavı"],
    salataMeze: [
      "Buğdaylı Köz Patlıcan Yoğurtlusu",
      "Kısır",
      "Kuru Börülce Salatası",
      "Nohutlu Marul Yoğurtlusu",
      "Ispanak Borani",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Revani / Islak Kek"],
    featuredImg: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "persembe",
    date: "12.11.2026",
    dayName: "Perşembe",
    colorTheme: {
      bg: "bg-purple-900",
      border: "border-purple-600",
      accent: "text-purple-800",
      pill: "bg-purple-100 text-purple-900"
    },
    corbalar: ["Brokoli Çorbası", "Ezogelin Çorbası", "Yayla Çorbası"],
    anaYemekler: [
      "Etli Keşkek",
      "Tavuklu Keşkek",
      "Kıymalı Patates Oturtma",
      "Karnıyarık",
      "Fırında Sebzeli Tavuk Baget",
      "Zeytinyağlı Patlıcan"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Fırında Makarna", "Domatesli Bulgur Pilavı"],
    salataMeze: [
      "Karışık Turşu Kavurması",
      "Yoğurtlu Kabak Kızartması",
      "Mor Lahana Yoğurtlusu",
      "Sebzeli Erişte Yoğurtlusu",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Trileçe / Islak Kek"],
    featuredImg: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cuma",
    date: "13.11.2026",
    dayName: "Cuma",
    colorTheme: {
      bg: "bg-sky-900",
      border: "border-sky-600",
      accent: "text-sky-800",
      pill: "bg-sky-100 text-sky-900"
    },
    corbalar: ["Mantar Çorbası", "Mercimek Çorbası"],
    anaYemekler: [
      "Etli Tepsi Kebabı",
      "Etli Bezelye Yemeği",
      "Çıtır Tavuk & Patates Kızartması",
      "Tavuklu Bamya Yemeği",
      "Zeytinyağlı Kuru Patlıcan Dolması",
      "Nohut Tava"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Kekikli Makarna", "Ankara Tava"],
    salataMeze: [
      "Mercimek Köftesi",
      "Patates Salatası",
      "Yoğurtlu Patates Topları",
      "Garnitürlü Kuskus Yoğurtlusu",
      "Köz Biber Yoğurtlusu",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Kemalpaşa / Islak Kek"],
    featuredImg: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cumartesi",
    date: "14.11.2026",
    dayName: "Cumartesi",
    colorTheme: {
      bg: "bg-rose-900",
      border: "border-rose-600",
      accent: "text-rose-800",
      pill: "bg-rose-100 text-rose-900"
    },
    corbalar: ["Mantar Çorbası", "Brokoli Çorbası", "Mercimek Çorbası"],
    anaYemekler: [
      "Fırında Patlıcan Oturtma",
      "Fırında Tavuklu Orman Kebabı",
      "Etli Bezelye Yemeği",
      "Tavuklu Bamya Yemeği",
      "Kıymalı Krep",
      "Tavuklu Krep",
      "Zeytinyağlı Türlü"
    ],
    pilavMakarna: ["Pirinç Pilavı", "Domatesli Bulgur Pilavı"],
    salataMeze: [
      "Karışık Turşu Kavurması",
      "Yeşil Mercimekli Şehriye Yoğurtlusu",
      "Buğdaylı Köz Patlıcan Yoğurtlusu",
      "Mor Lahana Yoğurtlusu",
      "Mevsim Salata",
      "Cacık"
    ],
    tatli: ["Havuç Dilim Baklava / Islak Kek"],
    featuredImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  }
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Planını veya Menünü Seç",
    desc: "İster aylık avantajlı abonelik paketi seçip haftalık menünü oluştur, ister tek günlük kapıda ödemeli sipariş ver."
  },
  {
    step: "02",
    title: "Programını Yükle veya Kişiselleştir",
    desc: "Her gün için damak zevkine uygun çorba, ana yemek, meze ve tatlını belirle; teslimat saatini seç."
  },
  {
    step: "03",
    title: "Taze & Sıcak Kapında",
    desc: "Her sabah usta aşçılarımızın katkısız hazırladığı anne eli değmiş sıcak ev yemekleri adresine teslim edilir."
  },
  {
    step: "04",
    title: "Esnek Yönetim & Erteleme",
    desc: "Toplantın mı var, şehir dışına mı çıkıyorsun? Mobil uygulamadan tek tıkla teslimatını dondur veya gününü kaydır."
  }
];
