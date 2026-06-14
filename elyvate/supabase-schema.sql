-- =============================================
-- ELYVATE — Supabase Database Schema
-- Run this in Supabase → SQL Editor → New Query
-- =============================================

-- 1. PRODUCTS TABLE
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  price         numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  images        text[] default '{}',
  category      text default '',
  stock_status  text not null default 'in_stock' check (stock_status in ('in_stock','out_of_stock')),
  is_featured   boolean default false,
  rating        numeric(3,1) default 0,
  review_count  int default 0,
  created_at    timestamptz default now()
);

-- 2. ORDERS TABLE
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  customer_address  text not null,
  customer_city     text not null,
  customer_country  text not null,
  customer_zip      text not null,
  product_id        text not null,
  product_name      text not null,
  quantity          int not null default 1,
  total_price       numeric(10,2) not null,
  payment_status    text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  order_status      text not null default 'processing' check (order_status in ('processing','fulfilled','shipped','delivered','cancelled')),
  twocheckout_ref   text,
  created_at        timestamptz default now()
);

-- 3. HERO SECTION TABLE
create table if not exists hero_section (
  id           uuid primary key default gen_random_uuid(),
  headline     text default 'Elevate Your Space',
  subheadline  text default 'Premium ambient lighting & projection gadgets for your home.',
  cta_text     text default 'Shop Now',
  cta_link     text default '/products',
  bg_image     text default ''
);

-- Insert default hero row
insert into hero_section (headline, subheadline, cta_text, cta_link)
values ('Elevate Your Space', 'Premium ambient lighting & projection gadgets that transform any room into an experience.', 'Shop Now', '/products')
on conflict do nothing;

-- 4. SITE SETTINGS TABLE
create table if not exists site_settings (
  id                   uuid primary key default gen_random_uuid(),
  store_name           text default 'Elyvate',
  logo_url             text,
  announcement_text    text,
  announcement_active  boolean default false,
  instagram_url        text,
  tiktok_url           text,
  facebook_url         text
);

-- Insert default settings row
insert into site_settings (store_name)
values ('Elyvate')
on conflict do nothing;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Products: public read, no public write
alter table products enable row level security;
create policy "Public can read products" on products for select using (true);

-- Orders: public insert (for checkout), no public read
alter table orders enable row level security;
create policy "Anyone can create orders" on orders for insert with check (true);

-- Hero section: public read
alter table hero_section enable row level security;
create policy "Public can read hero" on hero_section for select using (true);

-- Site settings: public read
alter table site_settings enable row level security;
create policy "Public can read settings" on site_settings for select using (true);

-- =============================================
-- STORAGE BUCKET for product images
-- =============================================
-- Go to Supabase → Storage → New Bucket
-- Name: product-images
-- Public: YES (toggle on)
-- =============================================
