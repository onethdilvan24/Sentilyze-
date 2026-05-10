-- Sentilyze: profiles, watchlist, analyses, analysis news, shared news cache
-- Apply in Supabase Dashboard → SQL Editor, or via Supabase CLI.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  display_name text,
  default_timeframe text not null default '7d',
  notifications_enabled boolean not null default true,
  notification_prefs jsonb not null default '{"priceAlerts":true,"sentiment":true,"news":true,"portfolio":true,"team":true}'::jsonb,
  theme text not null default 'dark',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  symbol text not null,
  name text not null default '',
  asset_type text not null check (asset_type in ('Stock','Crypto','Forex','Commodity')),
  group_name text not null default 'Default',
  alert_enabled boolean not null default false,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  unique (clerk_user_id, symbol)
);

create index if not exists watchlist_items_clerk_idx on public.watchlist_items (clerk_user_id);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  symbol text not null,
  overall_sentiment text not null,
  signal text not null,
  confidence int not null,
  ai_score int not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists analyses_clerk_created_idx on public.analyses (clerk_user_id, created_at desc);
create index if not exists analyses_symbol_idx on public.analyses (symbol);

create table if not exists public.analysis_news_items (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses (id) on delete cascade,
  title text not null,
  source text not null,
  sentiment text not null,
  impact_score int not null,
  url text not null,
  published_at timestamptz not null
);

create index if not exists analysis_news_items_analysis_idx on public.analysis_news_items (analysis_id);

create table if not exists public.news_cache (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  title text not null,
  description text,
  url text not null unique,
  source text not null,
  published_at timestamptz not null,
  cached_at timestamptz not null default now()
);

create index if not exists news_cache_symbol_idx on public.news_cache (symbol);
create index if not exists news_cache_published_idx on public.news_cache (published_at desc);

alter table public.profiles enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_news_items enable row level security;
alter table public.news_cache enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles
  for select using ((auth.jwt()->>'sub') = clerk_user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check ((auth.jwt()->>'sub') = clerk_user_id);
create policy "profiles_update_own" on public.profiles
  for update using ((auth.jwt()->>'sub') = clerk_user_id);

-- Watchlist
create policy "watchlist_select_own" on public.watchlist_items
  for select using ((auth.jwt()->>'sub') = clerk_user_id);
create policy "watchlist_insert_own" on public.watchlist_items
  for insert with check ((auth.jwt()->>'sub') = clerk_user_id);
create policy "watchlist_update_own" on public.watchlist_items
  for update using ((auth.jwt()->>'sub') = clerk_user_id);
create policy "watchlist_delete_own" on public.watchlist_items
  for delete using ((auth.jwt()->>'sub') = clerk_user_id);

-- Analyses
create policy "analyses_select_own" on public.analyses
  for select using ((auth.jwt()->>'sub') = clerk_user_id);
create policy "analyses_insert_own" on public.analyses
  for insert with check ((auth.jwt()->>'sub') = clerk_user_id);

-- Analysis news (via parent analysis)
create policy "analysis_news_select_own" on public.analysis_news_items
  for select using (
    exists (
      select 1 from public.analyses a
      where a.id = analysis_news_items.analysis_id
        and a.clerk_user_id = (auth.jwt()->>'sub')
    )
  );
create policy "analysis_news_insert_own" on public.analysis_news_items
  for insert with check (
    exists (
      select 1 from public.analyses a
      where a.id = analysis_news_items.analysis_id
        and a.clerk_user_id = (auth.jwt()->>'sub')
    )
  );

-- Shared cache: authenticated third-party JWT (Clerk)
create policy "news_cache_select_auth" on public.news_cache
  for select using ((auth.jwt()->>'sub') is not null);
