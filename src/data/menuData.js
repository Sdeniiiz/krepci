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


// İstenmeyen / Sevilmeyen Malzemeler Listesi (Kara Liste / Alerjen / Tercih)
export const DISLIKED_INGREDIENTS = [
  { id: "bamya", label: "Bamya", icon: "🌱", keywords: ["bamya"] },
  { id: "kereviz", label: "Kereviz", icon: "🌿", keywords: ["kereviz"] },
  { id: "pirasa", label: "Pırasa", icon: "🥬", keywords: ["pırasa", "pirasa"] },
  { id: "ciger", label: "Arnavut Ciğeri / Sakatat", icon: "🥩", keywords: ["ciğer", "ciger"] },
  { id: "mantar", label: "Mantar", icon: "🍄", keywords: ["mantar"] },
  { id: "patlican", label: "Patlıcan", icon: "🍆", keywords: ["patlıcan", "patlican", "musakka", "karnıyarık"] },
  { id: "ispanak", label: "Ispanak", icon: "🥗", keywords: ["ıspanak", "ispanak", "borani"] },
  { id: "brokoli", label: "Brokoli", icon: "🥦", keywords: ["brokoli"] },
  { id: "bakliyat", label: "Kuru Fasulye / Nohut", icon: "🫘", keywords: ["kurufasulye", "nohut", "börülce", "borulce"] },
  { id: "keskek", label: "Keşkek", icon: "🍲", keywords: ["keşkek", "keskek"] }
];

// Damak Zevki Profilleri (Soft Onboarding İçin)
export const TASTE_PROFILES = [
  {
    id: "dengeli",
    title: "Dengeli Anne Eli Sofrası",
    desc: "Her gün et, tavuk ve taze sebzenin en uyumlu dengesi",
    emoji: "🍲",
    badge: "En Popüler"
  },
  {
    id: "et-sever",
    title: "Et & Kıymalı Sever",
    desc: "Kavurma, köfte, kıymalı tencere ve kebap ağırlıklı menü",
    emoji: "🥩",
    badge: "Doyurucu"
  },
  {
    id: "tavuk-sever",
    title: "Tavuk & Protein Ağırlıklı",
    desc: "Fırında tavuk tandır, tavuk şiş, çıtır tavuk ve tas kebabı",
    emoji: "🍗",
    badge: "Yüksek Protein"
  },
  {
    id: "hafif-sebze",
    title: "Hafif & Zeytinyağlı Seven",
    desc: "Mideyi yormayan taze zeytinyağlılar ve hafif mezeler",
    emoji: "🌿",
    badge: "Mide Dostu"
  }
];

// Kişiselleştirilmiş Menü Üretim Motoru (Paket Porsiyon Sayısına Göre Kısıtlamalı)
export function generatePersonalizedPlan(profileId = "dengeli", dislikedList = [], itemsCount = 3) {
  const plan = {};

  const isDishExcluded = (dishName) => {
    if (!dishName) return false;
    const lower = dishName.toLowerCase();
    return dislikedList.some(dislikedId => {
      const item = DISLIKED_INGREDIENTS.find(i => i.id === dislikedId);
      if (!item) return false;
      return item.keywords.some(kw => lower.includes(kw));
    });
  };

  DAYS_MENU.forEach((day) => {
    // 1. Çorba seçimi
    const availableCorbalar = day.corbalar.filter(c => !isDishExcluded(c));
    const chosenCorba = availableCorbalar.length > 0 ? availableCorbalar[0] : day.corbalar[0];

    // 2. Ana yemek seçimi (Profil ve istenmeyen filtreli)
    let availableAnaYemekler = day.anaYemekler.filter(m => !isDishExcluded(m));

    if (profileId === "et-sever") {
      const etli = availableAnaYemekler.filter(m => 
        m.toLowerCase().includes("etli") || 
        m.toLowerCase().includes("kıymalı") || 
        m.toLowerCase().includes("yağlama") || 
        m.toLowerCase().includes("kebap") ||
        m.toLowerCase().includes("musakka")
      );
      if (etli.length > 0) availableAnaYemekler = etli;
    } else if (profileId === "tavuk-sever") {
      const tavuklu = availableAnaYemekler.filter(m => 
        m.toLowerCase().includes("tavuk") || 
        m.toLowerCase().includes("baget")
      );
      if (tavuklu.length > 0) availableAnaYemekler = tavuklu;
    } else if (profileId === "hafif-sebze") {
      const sebzeli = availableAnaYemekler.filter(m => 
        m.toLowerCase().includes("zeytinyağlı") || 
        m.toLowerCase().includes("fasulye") || 
        m.toLowerCase().includes("türlü") ||
        m.toLowerCase().includes("krep")
      );
      if (sebzeli.length > 0) availableAnaYemekler = sebzeli;
    }

    const chosenAnaYemek = availableAnaYemekler.length > 0 ? availableAnaYemekler[0] : day.anaYemekler.find(m => !isDishExcluded(m)) || day.anaYemekler[0];

    // 3. Pilav / Makarna seçimi
    const availablePilav = day.pilavMakarna.filter(p => !isDishExcluded(p));
    const chosenPilav = availablePilav.length > 0 ? availablePilav[0] : day.pilavMakarna[0];

    // 4. Salata / Meze seçimi
    const availableSalata = day.salataMeze.filter(s => !isDishExcluded(s));
    const chosenSalata = availableSalata.length > 0 ? availableSalata[0] : day.salataMeze[0];

    // PAKET KURALI VE PORSIYON SINIRI:
    // 1 Çeşit: Sadece Ana Yemek
    // 2 Çeşit: Ana Yemek + (Çorba VEYA Pilav/Makarna)
    // 3 Çeşit: Çorba + Ana Yemek + Pilav
    // 4 Çeşit: Çorba + Ana Yemek + Pilav + Salata/Meze
    let finalCorba = chosenCorba;
    let finalPilav = chosenPilav;
    let finalSalata = chosenSalata;

    if (itemsCount === 1) {
      finalCorba = "";
      finalPilav = "";
      finalSalata = "";
    } else if (itemsCount === 2) {
      // 2 çeşit kuralı: Ana yemek garanti + 1 yan lezzet (öncelik Çorba)
      finalCorba = chosenCorba;
      finalPilav = "";
      finalSalata = "";
    } else if (itemsCount === 3) {
      // 3 çeşit: Çorba + Ana Yemek + Pilav (Salata yok)
      finalCorba = chosenCorba;
      finalPilav = chosenPilav;
      finalSalata = "";
    } else {
      // 4 çeşit veya üstü: Hepsi dolu
      finalCorba = chosenCorba;
      finalPilav = chosenPilav;
      finalSalata = chosenSalata;
    }

    plan[day.id] = {
      dayName: day.dayName,
      date: day.date,
      corba: finalCorba,
      anaYemek: chosenAnaYemek,
      pilav: finalPilav,
      salata: finalSalata,
      tatli: itemsCount >= 4 ? ((day.tatli && day.tatli[0]) || "Islak Kek") : "",
      excludedCount: day.anaYemekler.length - day.anaYemekler.filter(m => !isDishExcluded(m)).length
    };
  });

  return plan;
}

// Bir tabağın seçili ürün sayısını hesaplar
export function countPlateItems(plate) {
  if (!plate) return 0;
  let count = 0;
  if (plate.corba && plate.corba.trim() !== "") count++;
  if (plate.anaYemek && plate.anaYemek.trim() !== "") count++;
  if (plate.pilav && plate.pilav.trim() !== "") count++;
  if (plate.salata && plate.salata.trim() !== "") count++;
  return count;
}
