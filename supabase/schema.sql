-- ============================================================
-- ARINAS — Products schema for Supabase
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text default '',
  price          numeric(10,2) not null default 0,
  original_price numeric(10,2),
  category       text not null default 'Uncategorized',
  collection     text,
  stock          integer not null default 0,
  image          text default '',
  images         text[] not null default '{}',
  sizes          text[] not null default '{}',
  colors         text[] not null default '{}',
  badge          text,
  material       text,
  brand          text,
  featured       boolean not null default false,
  -- status: draft | published | out_of_stock
  status         text not null default 'published',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists products_status_idx   on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);
create index if not exists products_created_idx  on public.products (created_at desc);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
--   Public (anon) may READ only published / out_of_stock products.
--   Writes happen only through the service-role key on the server,
--   which bypasses RLS — so no public write policy is needed.
-- ============================================================
alter table public.products enable row level security;

drop policy if exists "public can read live products" on public.products;
create policy "public can read live products"
  on public.products for select
  to anon, authenticated
  using (status in ('published', 'out_of_stock'));

-- ============================================================
-- Storage bucket for product images (public read)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- Push notification device tokens (written via service role only)
-- ============================================================
create table if not exists public.push_tokens (
  token       text primary key,
  platform    text not null default 'android',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.push_tokens enable row level security;
-- No public policies: only the service-role key (server) may read/write.
