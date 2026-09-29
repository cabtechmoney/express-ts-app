-- ============================================================
-- Caleb CRM — Supabase Schema
-- Run this SQL in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- to create all required tables and enable API access.
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CLIENTS
-- ------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  company text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'Todo',
  budget double precision,
  deadline timestamptz,
  "clientId" uuid references public.clients(id) on delete set null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PAYMENTS
-- ------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  amount double precision not null,
  status text not null default 'Pending',
  method text,
  "paidAt" timestamptz,
  "clientId" uuid references public.clients(id) on delete set null,
  "projectId" uuid references public.projects(id) on delete set null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Indexes for foreign keys / common lookups
-- ------------------------------------------------------------
create index if not exists idx_projects_client on public.projects ("clientId");
create index if not exists idx_payments_client on public.payments ("clientId");
create index if not exists idx_payments_project on public.payments ("projectId");

-- ------------------------------------------------------------
-- Row Level Security (RLS) — allow anon/service role access
-- ------------------------------------------------------------
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.payments enable row level security;

create policy "Users select" on public.users for select using (true);
create policy "Users insert" on public.users for insert with check (true);
create policy "Users update" on public.users for update using (true);
create policy "Users delete" on public.users for delete using (true);

create policy "Clients select" on public.clients for select using (true);
create policy "Clients insert" on public.clients for insert with check (true);
create policy "Clients update" on public.clients for update using (true);
create policy "Clients delete" on public.clients for delete using (true);

create policy "Projects select" on public.projects for select using (true);
create policy "Projects insert" on public.projects for insert with check (true);
create policy "Projects update" on public.projects for update using (true);
create policy "Projects delete" on public.projects for delete using (true);

create policy "Payments select" on public.payments for select using (true);
create policy "Payments insert" on public.payments for insert with check (true);
create policy "Payments update" on public.payments for update using (true);
create policy "Payments delete" on public.payments for delete using (true);
