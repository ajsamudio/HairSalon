-- 0001_init.sql — Hair Salon Template schema
-- Run with: supabase db push

-- Required for the GIST exclusion constraint on bookings
create extension if not exists btree_gist;

-- ─────────────────────────────────────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────────────────────────────────────

create table services (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  description      text,
  category         text not null check (category in (
                     'cuts','color','treatments','styling','extensions','add-ons'
                   )),
  duration_min     integer not null,
  price_cents      integer not null,
  deposit_cents    integer not null default 0,
  requires_consult boolean not null default false,
  is_active        boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- AVAILABILITY RULES  (weekly recurring)
-- ─────────────────────────────────────────────────────────────────────────────

create table availability_rules (
  id          uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time  time not null,
  end_time    time not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- AVAILABILITY OVERRIDES  (vacation, special hours, closed days)
-- ─────────────────────────────────────────────────────────────────────────────

create table availability_overrides (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  start_time time,   -- null = closed all day
  end_time   time,
  reason     text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────────────────────────────

create table bookings (
  id                    uuid primary key default gen_random_uuid(),
  service_id            uuid not null references services(id),
  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text,
  starts_at             timestamptz not null,
  ends_at               timestamptz not null,
  status                text not null default 'pending'
                          check (status in (
                            'pending','confirmed','cancelled','completed','no_show'
                          )),
  stripe_session_id     text,
  stripe_payment_intent text,
  deposit_paid_cents    integer not null default 0,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_bookings_starts_at on bookings(starts_at);
create index idx_bookings_status    on bookings(status);

-- Prevent double-booking at the DB level
alter table bookings
  add constraint no_overlapping_bookings
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending','confirmed'));

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute procedure update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────

alter table services enable row level security;
create policy "public read active services" on services
  for select using (is_active = true);
create policy "admin all services" on services
  for all using (auth.role() = 'authenticated');

alter table availability_rules enable row level security;
create policy "public read active availability" on availability_rules
  for select using (is_active = true);
create policy "admin all availability_rules" on availability_rules
  for all using (auth.role() = 'authenticated');

alter table availability_overrides enable row level security;
create policy "public read overrides" on availability_overrides
  for select using (true);
create policy "admin all availability_overrides" on availability_overrides
  for all using (auth.role() = 'authenticated');

alter table bookings enable row level security;
create policy "admin all bookings" on bookings
  for all using (auth.role() = 'authenticated');
-- Public booking creation goes through service-role key via Server Action
