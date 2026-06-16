-- =============================================
-- ELYVATE — Features Migration
-- Run in Supabase → SQL Editor → New Query
-- =============================================

-- 1. Add tracking + fulfillment fields to orders
alter table orders
  add column if not exists tracking_number   text default null,
  add column if not exists tracking_carrier  text default null,
  add column if not exists supplier_order_id text default null,
  add column if not exists fulfilled_at      timestamptz default null,
  add column if not exists notes             text default null;

-- 2. Reviews table
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  author_name text not null,
  rating      int  not null check (rating between 1 and 5),
  body        text not null,
  is_approved boolean not null default false,
  created_at  timestamptz default now()
);

alter table reviews enable row level security;

create policy "Public can read approved reviews"
  on reviews for select using (is_approved = true);

create policy "Anyone can submit a review"
  on reviews for insert with check (true);

-- 3. Bullet points on products
alter table products
  add column if not exists bullet_points text[] default array[]::text[];

-- =============================================
