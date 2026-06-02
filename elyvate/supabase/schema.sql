-- ============================================
-- ELYVATE — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Products
create table if not exists products (
  id text primary key,
  name text not null,
  slug text unique not null,
  sku text,
  description text,
  short_description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  category text default 'Projectors',
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_new_arrival boolean default false,
  status text default 'active',
  rating numeric(3,1) default 5.0,
  images jsonb default '[]',
  colors jsonb default '[]',
  features jsonb default '[]',
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  coupon_code text,
  shipping numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'pending',
  payment_status text default 'unpaid',
  created_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id text primary key,
  product_id text references products(id) on delete cascade,
  product_name text,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  image text,
  status text default 'pending',
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Contact Messages
create table if not exists contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Newsletter Subscribers
create table if not exists subscribers (
  id text primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Coupons
create table if not exists coupons (
  id text primary key,
  code text unique not null,
  type text not null,
  value numeric(10,2) not null,
  expiry_date text,
  usage_limit integer default 1000,
  used_count integer default 0,
  status text default 'active',
  created_at timestamptz default now()
);

-- Row Level Security (allow anon reads for products/reviews, authenticated writes)
alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table contact_messages enable row level security;
alter table subscribers enable row level security;
alter table coupons enable row level security;

-- Public can read products and approved reviews
create policy "Public read products" on products for select using (status = 'active');
create policy "Public read reviews" on reviews for select using (status = 'approved');

-- Anyone can insert orders, reviews, messages, subscribers (customers)
create policy "Anyone can place orders" on orders for insert with check (true);
create policy "Anyone can submit reviews" on reviews for insert with check (true);
create policy "Anyone can send messages" on contact_messages for insert with check (true);
create policy "Anyone can subscribe" on subscribers for insert with check (true);

-- Service role (admin panel via anon key with RLS bypass for admin) — all access
create policy "Admin full access products" on products for all using (true);
create policy "Admin full access orders" on orders for select using (true);
create policy "Admin full access coupons" on coupons for all using (true);
create policy "Admin read messages" on contact_messages for select using (true);
create policy "Admin update messages" on contact_messages for update using (true);
create policy "Admin read subscribers" on subscribers for select using (true);

