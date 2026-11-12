# KREPCİ Ev Yemekleri - Akıllı Abonelik & Menü Platformu 🍲

KREPCİ Ev Yemekleri için geliştirilmiş, The Perfect Plate ve Adile Sultan tasarım standartlarına sahip, kişiselleştirilmiş ev yemeği aboneliği ve günlük sipariş platformu.

## 🌟 Özellikler
- **Haftalık Restoran Menüsü:** 09 - 14 Kasım 2026 orijinal menüsü, çorbalar, ana yemekler, pilav/makarna, salata ve mezeler.
- **Kişiselleştirilmiş Yemek Programı (Build Your Meal):** Kullanıcıların kendi haftalık veya aylık beslenme programını oluşturup yüklemesi.
- **Esnek Ödeme Modeli:**
  - 💵 **Günlük Kapıda Ödeme:** Her gün teslimatta nakit veya kurye POS cihazıyla ödeme.
  - 💳 **Avantajlı Aylık / Haftalık Abonelik:** İndirimli online kartla güvenli ödeme.
- **Canlı Sipariş & Mutfak Takibi:** Hazırlanıyor ➔ Kuryede ➔ Kapıda aşamaları.
- **Mobil Uygulama Simülatörü:** Hem mobil uyumlu responsive web tasarımı hem de telefon mockup'ı ile canlı mobil deneyim.
- **Flutter Mobil Mimari:** `mobile/` klasöründe hazır iOS / Android şablon kodları.

---

## 🚀 Render.com'da Canlıya Alma (Deployment Rehberi)

Bu proje Render'da **Static Site** olarak saniyeler içinde ücretsiz canlıya alınabilir:

1. [Render.com](https://render.com) adresine giriş yapın.
2. **New +** butonuna basıp **Static Site** seçeneğini seçin (veya **Blueprint** seçip bu repoyu gösterin).
3. `https://github.com/Sdeniiiz/krepci.git` reposunu bağlayın.
4. Ayarları şu şekilde doldurun:
   - **Name:** `krepci-ev-yemekleri`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. **Create Static Site** butonuna tıklayın. Render otomatik olarak derleyecek ve size `https://krepci-ev-yemekleri.onrender.com` gibi canlı bir adres verecektir.

---

## 💻 Yerel Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Canlı derleme (Production build)
npm run build
```
