-- ============================================================
-- 0002_events.sql — collecte d'événements d'usage (couche horizontale)
-- ============================================================
-- Journal append-only des événements métier, scopé par organisation.
-- Alimenté par la fonction log_event() (jamais par insert direct depuis le
-- client : le user_id et l'org_id sont fixés côté serveur, infalsifiables).
-- ============================================================

create table public.events (
  id         bigint generated always as identity primary key,
  org_id     uuid not null references public.orgs(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  type       text not null,              -- ex: 'auth.login', 'devis.created'
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index events_org_time_idx on public.events(org_id, created_at desc);
create index events_org_type_idx on public.events(org_id, type);

alter table public.events enable row level security;

-- Lecture : membres de l'organisation (pour les futurs écrans analytics).
create policy "events_select_own_org" on public.events
  for select using (org_id = public.my_org());

-- Pas de policy insert/update/delete : le journal est append-only,
-- exclusivement via la fonction ci-dessous.

create or replace function public.log_event(p_type text, p_payload jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.events (org_id, user_id, type, payload)
  select public.my_org(), auth.uid(), p_type, coalesce(p_payload, '{}'::jsonb)
  where public.my_org() is not null;
$$;

grant execute on function public.log_event(text, jsonb) to authenticated;
