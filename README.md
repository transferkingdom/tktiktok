# TikTok Shop Price Updater

TikTok Shop Partner API kullanarak ürün fiyatlarını variant title'lara göre otomatik olarak güncelleyen Next.js uygulaması.

## Özellikler

- 🔐 TikTok Shop OAuth entegrasyonu
- 📝 Variant title'a göre fiyat kuralları tanımlama
- 💰 Toplu fiyat güncelleme
- 🚀 Vercel'de kolay deployment
- 🎨 Modern ve responsive UI
- 🔄 Otomatik token yenileme

## Kurulum

### 1. Repository'yi klonlayın

```bash
git clone https://github.com/yourusername/tiktok-shop-price-updater.git
cd tiktok-shop-price-updater
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Environment değişkenlerini ayarlayın

`env.example` dosyasını `.env.local` olarak kopyalayın ve değerleri doldurun:

```bash
cp env.example .env.local
```

Gerekli değişkenler:
- `TIKTOK_CLIENT_KEY`: TikTok Partner hesabınızdan alacağınız client key
- `TIKTOK_CLIENT_SECRET`: TikTok Partner hesabınızdan alacağınız client secret
- `TIKTOK_REDIRECT_URI`: OAuth callback URL'i (örn: https://your-app.vercel.app/api/auth/callback)

### 4. TikTok Partner Uygulaması Kurulumu

1. [TikTok Shop Partner Center](https://partner.tiktokshop.com/)'a gidin
2. Yeni bir uygulama oluşturun
3. OAuth ayarlarını yapılandırın:
   - Redirect URI: `https://your-app.vercel.app/api/auth/callback`
   - Scope: `user.info.basic,video.list`
4. Client Key ve Client Secret'ı alın

### 5. Development sunucusunu başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Vercel'de Deployment

### 1. GitHub'a push edin

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel'e deploy edin

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Environment variables'ları ekleyin:
   - `TIKTOK_CLIENT_KEY`
   - `TIKTOK_CLIENT_SECRET`
   - `TIKTOK_REDIRECT_URI`
5. Deploy butonuna tıklayın

### 3. TikTok uygulamanızda redirect URI'yi güncelleyin

Deploy edildikten sonra TikTok Partner Center'da redirect URI'yi güncelleyin:
```
https://your-app.vercel.app/api/auth/callback
```

## Kullanım

### 1. TikTok Shop'a Bağlanma

1. Uygulamayı açın
2. "Connect TikTok Shop" butonuna tıklayın
3. TikTok hesabınızla giriş yapın ve izinleri onaylayın

### 2. Fiyat Kuralları Oluşturma

1. "Add Price Rule" butonuna tıklayın
2. Variant title (örn: "Small", "Large", "XL") girin
3. Yeni fiyatı girin
4. İstediğiniz kadar kural ekleyin

### 3. Fiyatları Güncelleme

1. "Update Prices" butonuna tıklayın
2. Sistem tüm ürünleri tarayacak ve eşleşen variant'ları güncelleyecek

## API Endpoints

### `GET /api/auth/callback`
TikTok OAuth callback handler. Authorization code'u access token ile değiştirir.

### `POST /api/update-prices`
Fiyat kurallarını uygular ve eşleşen ürün variant'larını günceller.

**Request Body:**
```json
{
  "priceRules": [
    {
      "variant": "Small",
      "price": "19.99"
    },
    {
      "variant": "Large",
      "price": "29.99"
    }
  ]
}
```

## Proje Yapısı

```
├── app/
│   ├── api/
│   │   ├── auth/callback/      # OAuth callback handler
│   │   └── update-prices/      # Fiyat güncelleme endpoint'i
│   ├── globals.css            # Global CSS
│   ├── layout.tsx             # Ana layout
│   └── page.tsx               # Ana sayfa
├── lib/
│   └── tiktok-api.ts          # TikTok API helper sınıfı
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Güvenlik

- Access token'lar secure HTTP-only cookie'lerde saklanır
- Environment değişkenleri kullanarak API credentials korunur
- CSRF koruması için state parameter kullanılır

## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyın (`git commit -m 'Add amazing feature'`)
4. Branch'i push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Destek

Sorunlar için GitHub Issues kullanın veya [email@example.com](mailto:email@example.com) adresinden iletişime geçin.

## Önemli Notlar

- Bu uygulama TikTok Shop Partner API kullanır ve resmi TikTok onayı gerektirir
- Production'da bir veritabanı kullanarak token'ları saklamanız önerilir
- Rate limiting'e dikkat edin ve API çağrılarını optimize edin
- Fiyat güncellemeleri geri alınamaz, test etmeyi unutmayın 