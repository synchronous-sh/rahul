alter table public.users
  add column if not exists phone text,
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists current_level text check (current_level in ('Beginner', 'Intermediate', 'Advanced')),
  add column if not exists detailed_interests jsonb not null default '{}'::jsonb,
  add column if not exists goals text[] not null default '{}',
  add column if not exists learning_styles text[] not null default '{}',
  add column if not exists bio text,
  add column if not exists account_visibility text not null default 'private' check (account_visibility in ('private', 'public'));

create table public.custom_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  category text not null check (char_length(category) between 2 and 80),
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  learning_style text not null,
  lesson_length text not null,
  goal text not null,
  status text not null default 'ready' check (status in ('generating', 'ready', 'failed')),
  outline jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null check (kind in ('course', 'ask', 'semantic_search', 'transcription', 'speech')),
  input_units integer not null default 0 check (input_units >= 0),
  created_at timestamptz not null default now()
);

create index custom_courses_user_created_idx on public.custom_courses (user_id, created_at desc);
create index ai_requests_user_created_idx on public.ai_requests (user_id, created_at desc);

alter table public.custom_courses enable row level security;
alter table public.ai_requests enable row level security;

create policy "own custom courses" on public.custom_courses for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "own ai requests select" on public.ai_requests for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own ai requests insert" on public.ai_requests for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.custom_courses to authenticated;
grant select, insert on public.ai_requests to authenticated;
grant usage, select on sequence public.ai_requests_id_seq to authenticated;
