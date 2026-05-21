create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  situation text not null,
  decisions text[] not null,
  outcomes jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.simulations enable row level security;

drop policy if exists "Allow owner read simulations" on public.simulations;
drop policy if exists "Allow owner insert simulations" on public.simulations;

create policy "Allow owner read simulations"
  on public.simulations
  for select
  using (auth.uid() = user_id);

create policy "Allow owner insert simulations"
  on public.simulations
  for insert
  with check (auth.uid() = user_id);

create index if not exists simulations_created_at_idx
  on public.simulations (created_at desc);

create index if not exists simulations_user_id_idx
  on public.simulations (user_id);