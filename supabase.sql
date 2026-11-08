-- GUESS THE FACTS — online room storage
-- Run this script in Supabase SQL Editor for a NEW dedicated project.
-- This starter uses anonymous room-code access for a casual friend game.
-- Do not store sensitive personal details in facts. For a production public launch,
-- replace the permissive room policies with authenticated membership/RPC authorization.

create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.game_rooms enable row level security;

drop policy if exists "Room code users can read rooms" on public.game_rooms;
create policy "Room code users can read rooms"
on public.game_rooms for select to anon, authenticated
using (true);

drop policy if exists "Room code users can create rooms" on public.game_rooms;
create policy "Room code users can create rooms"
on public.game_rooms for insert to anon, authenticated
with check (true);

drop policy if exists "Room code users can update rooms" on public.game_rooms;
create policy "Room code users can update rooms"
on public.game_rooms for update to anon, authenticated
using (true) with check (true);

grant select, insert, update on public.game_rooms to anon, authenticated;

-- Enable realtime updates for room state.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'game_rooms'
  ) then
    alter publication supabase_realtime add table public.game_rooms;
  end if;
end $$;

create index if not exists game_rooms_code_idx on public.game_rooms (code);
create index if not exists game_rooms_updated_at_idx on public.game_rooms (updated_at desc);
