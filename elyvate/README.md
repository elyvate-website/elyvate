# Elyvate — Setup Guide

## 1. Clone & Install
```bash
npm install
```

## 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in all values:
```bash
cp .env.local.example .env.local
```

## 3. Supabase Setup
1. Go to your Supabase project → SQL Editor → New Query
2. Paste the entire contents of `supabase-schema.sql` and run it
3. Go to Storage → New Bucket → Name: `product-images` → Public: ON

## 4. Get Your Supabase Keys
- Project URL → Settings → API → Project URL
- Anon Key → Settings → API → anon public
- Service Role Key → Settings → API → service_role secret

## 5. Resend Setup
1. Sign up at resend.com (free)
2. Add your domain or use their test email
3. Get your API key from dashboard
4. Set RESEND_FROM_EMAIL and ADMIN_EMAIL

## 6. 2Checkout Setup
1. Sign up at 2checkout.com
2. Get Seller ID and Secret Key from dashboard
3. Set webhook URL to: `https://yourdomain.com/api/checkout/webhook`

## 7. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

## 8. Admin Panel
Visit http://localhost:3000/admin

## 9. Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

## Pages
| URL | Description |
|-----|-------------|
| / | Homepage |
| /products | All products |
| /products/[slug] | Product detail |
| /cart | Shopping cart |
| /checkout | Checkout |
| /order-success | Order confirmation |
| /admin | Admin dashboard |
| /admin/products | Manage products |
| /admin/orders | View & update orders |
| /admin/hero | Edit hero section |
| /admin/settings | Store settings |
