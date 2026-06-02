# ELYVATE Store — Full Setup & Deployment Guide

> Stack: React 19 + TypeScript + Tailwind CSS v4 + Supabase + Resend + Vercel

---

## 1. Fork & Clone to GitHub

1. Go to **github.com** → click **New repository**
2. Name it `elyvate-store`, set to **Private**, click **Create**
3. Upload this ZIP's contents (or drag-drop the folder in GitHub's web UI)

---

## 2. Set Up Supabase

### Create project
1. Go to **supabase.com** → New Project
2. Name it `elyvate`, choose a region close to Bangladesh (Singapore works well)
3. Copy your **Project URL** and **anon public key** from:
   `Settings → API → Project URL & anon key`

### Run the database schema
1. Go to **SQL Editor** in Supabase dashboard
2. Open the file `supabase/schema.sql` from this project
3. Paste the entire contents and click **Run** ✓

---

## 3. Set Up Resend (Order Email Notifications)

1. Go to **resend.com** → Sign up → Create API Key
2. Add your domain (or use the free `resend.dev` domain to start)
3. Copy your API key

### Add secrets to Supabase Edge Functions
In Supabase Dashboard → **Edge Functions** → **Secrets**, add:
```
RESEND_API_KEY    = re_your_resend_key_here
ADMIN_EMAIL       = your@email.com         ← where order emails go
FROM_EMAIL        = orders@yourdomain.com  ← sender address
```

### Deploy the Edge Function
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy send-order-email
```

---

## 4. Deploy to Vercel

1. Go to **vercel.com** → New Project → Import from GitHub
2. Select your `elyvate-store` repo
3. Under **Environment Variables**, add:
   ```
   VITE_SUPABASE_URL        = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY   = your-anon-key-here
   ```
4. Click **Deploy** ✓

---

## 5. Edit Code on Your Phone (GitHub Codespaces)

1. Open your repo on github.com
2. Press the `.` key → opens **VS Code in browser** (free)
   OR go to: `github.dev/your-username/elyvate-store`
3. Edit files directly, commit changes
4. Vercel auto-deploys every push to `main` ✓

---

## 6. Admin Panel Access

Visit your site URL and type the secret URL path:
```
yoursite.vercel.app → click the logo 5 times fast
```
Default admin password is set in `AdminPanel.tsx` → search for `ADMIN_PASSWORD`.
Change it before going live!

---

## 7. How Order Emails Work

```
Customer places order
      ↓
AppContext.placeOrder() → saves to Supabase orders table
      ↓
sendOrderEmail() → calls Supabase Edge Function
      ↓
Edge Function → Resend API → Email to ADMIN_EMAIL
      ↓
You get a beautiful HTML email with full order details ✓
```

---

## 8. Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run dev server
npm run dev
# → Opens at http://localhost:3000
```

> **No Supabase yet?** The app works fully in local mode (localStorage) until you add the env vars. Nothing breaks.

---

## Project Structure

```
elyvate-store/
├── src/
│   ├── lib/
│   │   ├── supabase.ts        ← Supabase client
│   │   └── db.ts              ← All database operations
│   ├── components/
│   │   ├── CustomerHome.tsx   ← Homepage
│   │   ├── CustomerShop.tsx   ← Shop/catalog
│   │   ├── CustomerProductDetail.tsx
│   │   ├── CustomerCart.tsx
│   │   ├── CustomerCheckout.tsx ← Places order + triggers email
│   │   ├── AdminPanel.tsx     ← Your admin dashboard
│   │   └── ...
│   ├── AppContext.tsx          ← Global state + Supabase sync
│   ├── data.ts                ← Default products (Projectors + Home Decor + Electronics)
│   └── types.ts               ← TypeScript types
├── supabase/
│   ├── schema.sql             ← Run this in Supabase SQL Editor
│   └── functions/
│       └── send-order-email/  ← Resend email Edge Function
├── .env.example               ← Copy to .env.local
└── README.md                  ← This file
```

---

## Categories

| Category | Products |
|---|---|
| **Galaxy Projectors** | Nova, Astro, Cube, Dome + more (hero products) |
| **Home Decor** | Aurora Wall Clock, Zen Diffuser Lamp, Velvet Throw Bundle |
| **Electronics** | NovaPad Wireless Charger, SoundSphere Speaker, SmartView LED Strip |
| **Accessories** | Stands, mounts, remotes |
| **Bundles** | Multi-product discount packs |

---

Built with ♥ for Elyvate
