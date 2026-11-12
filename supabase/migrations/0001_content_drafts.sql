-- Step 2: draft storage for the admin content editor.
--
-- Run this once in the Supabase SQL editor (or with the Supabase CLI).
-- It creates the draft table, locks it down with row-level security, and
-- allows only users whose app_metadata.role is "editor" or "admin" to use it.

-- Who counts as an editor? The role lives in the user's app_metadata, which
-- only the service role can change (not the user themselves).
create or replace function public.is_editor()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('editor', 'admin'),
    false
  );
$$;

create table if not exists public.content_drafts (
  key text primary key,
  bn text not null default '',
  en text not null default '',
  href text,
  new_tab boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.content_drafts enable row level security;

revoke all on public.content_drafts from anon;
grant select, insert, update, delete on public.content_drafts to authenticated;

drop policy if exists "editors can read drafts" on public.content_drafts;
create policy "editors can read drafts"
  on public.content_drafts for select
  to authenticated
  using (public.is_editor());

drop policy if exists "editors can insert drafts" on public.content_drafts;
create policy "editors can insert drafts"
  on public.content_drafts for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists "editors can update drafts" on public.content_drafts;
create policy "editors can update drafts"
  on public.content_drafts for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "editors can delete drafts" on public.content_drafts;
create policy "editors can delete drafts"
  on public.content_drafts for delete
  to authenticated
  using (public.is_editor());

-- Keep updated_at honest even if a client forgets to send it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_drafts_touch_updated_at on public.content_drafts;
create trigger content_drafts_touch_updated_at
  before update on public.content_drafts
  for each row execute function public.touch_updated_at();
