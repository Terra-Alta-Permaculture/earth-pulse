-- World Pulse: weekly readings of the nine geopolitical forces.
create table if not exists public.world_readings (
  id              uuid primary key default gen_random_uuid(),
  week_start      date        not null,              -- Monday of the ISO week (UTC)
  force_key       text        not null check (force_key in (
                    'us_power','us_china','chokepoints_energy','russia_europe',
                    'institutions','living_planet','identity_religion','ai','money_trade')),
  tension         numeric(3,1) not null check (tension between 0 and 10),
  direction       text        not null check (direction in ('up','down','flat')),
  headline        text        not null,              -- one line, plain English
  what_changed    text        not null,              -- 2–4 sentences
  counterpoint    text        not null,              -- regeneration counterpoint
  indicators      jsonb       not null default '[]', -- [{label,value,unit,as_of,source_url}]
  sources         jsonb       not null default '[]', -- [{title,url}]
  created_by      text        not null default 'weekly-job',
  created_at      timestamptz not null default now(),
  unique (week_start, force_key)
);

create table if not exists public.world_weekly (
  week_start      date primary key,
  summary         text        not null,              -- 3–5 sentence weekly brief
  scenario_lean   jsonb       not null,              -- {"A":45,"B":25,"C":20,"D":10}
  lean_rationale  text        not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.world_signposts (
  id              uuid primary key default gen_random_uuid(),
  event_date      date,                              -- null if only a month/season is known
  date_label      text        not null,              -- e.g. "15–16 Oct 2026", "Winter 2026–27"
  title           text        not null,
  force_keys      text[]      not null default '{}',
  what_it_means   text        not null,              -- e.g. "Deal → A; strike → B"
  status          text        not null default 'upcoming'
                    check (status in ('upcoming','happened','cancelled')),
  outcome         text,                              -- filled once it happens
  updated_at      timestamptz not null default now()
);

create index if not exists world_readings_force_week_idx
  on public.world_readings (force_key, week_start desc);

alter table public.world_readings  enable row level security;
alter table public.world_weekly    enable row level security;
alter table public.world_signposts enable row level security;

-- Public read; writes only via service role (edge function / scheduled job).
drop policy if exists "public read world_readings"  on public.world_readings;
drop policy if exists "public read world_weekly"    on public.world_weekly;
drop policy if exists "public read world_signposts" on public.world_signposts;
create policy "public read world_readings"  on public.world_readings  for select using (true);
create policy "public read world_weekly"    on public.world_weekly    for select using (true);
create policy "public read world_signposts" on public.world_signposts for select using (true);
