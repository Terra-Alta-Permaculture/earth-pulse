-- EarthPulse — core snapshot store
-- One row per (indicator, region, fetch). Builds historical depth over time.

create table if not exists public.earth_snapshots (
  id             uuid primary key default gen_random_uuid(),
  indicator_name text        not null,
  value          double precision not null,
  unit           text        not null,
  source         text        not null,
  stream         text        not null check (stream in ('crisis', 'regeneration')),
  region         text        not null default 'Global',
  fetched_at     timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

comment on table public.earth_snapshots is
  'Daily fetched values per planetary indicator, split into crisis / regeneration streams.';

-- Fast "latest per indicator" and "last 30 days" queries.
create index if not exists earth_snapshots_indicator_time_idx
  on public.earth_snapshots (indicator_name, fetched_at desc);

create index if not exists earth_snapshots_stream_time_idx
  on public.earth_snapshots (stream, fetched_at desc);

-- Prevent duplicate rows if the cron accidentally runs twice in a day.
-- one row per indicator/region/day; the UTC-date cast keeps the expression
-- IMMUTABLE (date_trunc on a timestamptz is only STABLE and can't be indexed).
create unique index if not exists earth_snapshots_daily_unique
  on public.earth_snapshots (
    indicator_name,
    region,
    ((fetched_at at time zone 'UTC')::date)
  );

-- Row Level Security: public read (dashboard is anon), writes only via
-- service-role key (used by the edge function). No anon insert/update/delete.
alter table public.earth_snapshots enable row level security;

drop policy if exists "public read snapshots" on public.earth_snapshots;
create policy "public read snapshots"
  on public.earth_snapshots
  for select
  using (true);

-- A convenience view: the most recent reading for each indicator.
create or replace view public.latest_snapshots as
select distinct on (indicator_name, region)
  indicator_name, value, unit, source, stream, region, fetched_at
from public.earth_snapshots
order by indicator_name, region, fetched_at desc;
