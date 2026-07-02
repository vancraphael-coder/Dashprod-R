-- ============================================================
-- Roovers Mobile — schéma v1 (Supabase / Postgres)
-- ============================================================
-- Principe : UNE organisation (Roovers) partagée par PLUSIEURS membres
-- (bureau + terrain). Les données métier sont stockées en clé/valeur PAR
-- ORGANISATION, ce qui reproduit exactement l'interface window.storage de
-- l'app. Conséquence : le composant React (2224 lignes) tourne SANS aucune
-- réécriture — on remplace juste la couche de stockage.
--
-- Correction importante vs le prototype : dans claude.ai, window.storage est
-- "par utilisateur". En production, Roovers est une ÉQUIPE qui partage UN seul
-- jeu de données. La portée doit donc être l'organisation, pas la personne —
-- sinon le bureau et les équipiers ne verraient pas les mêmes dossiers.
--
-- À exécuter une fois dans : Supabase → SQL Editor.
-- ============================================================

-- 1. Organisations -------------------------------------------------
create table public.orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- 2. Membres : relie un compte Auth à une organisation + un rôle ----
create type public.member_role as enum ('bureau','terrain');

create table public.members (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  org_id     uuid not null references public.orgs(id) on delete cascade,
  role       public.member_role not null default 'terrain',
  name       text,
  created_at timestamptz not null default now()
);
create index members_org_idx on public.members(org_id);

-- 3. Données métier partagées (miroir de window.storage) -----------
--    v = chaîne JSON : l'app sérialise déjà avec JSON.stringify,
--    on stocke donc la chaîne telle quelle (fidélité 1:1).
create table public.app_kv (
  org_id     uuid not null references public.orgs(id) on delete cascade,
  k          text not null,
  v          text,
  updated_at timestamptz not null default now(),
  primary key (org_id, k)
);

-- 4. Organisation du compte courant --------------------------------
--    SECURITY DEFINER => la fonction lit "members" sans repasser par RLS,
--    ce qui évite la récursion de politique.
create or replace function public.my_org()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.members where user_id = auth.uid()
$$;

grant execute on function public.my_org() to authenticated;

-- 5. Row Level Security --------------------------------------------
alter table public.orgs    enable row level security;
alter table public.members enable row level security;
alter table public.app_kv  enable row level security;

-- orgs : un membre voit sa propre organisation
create policy "orgs_select_own" on public.orgs
  for select using (id = public.my_org());

-- members : on voit les membres de sa propre organisation (annuaire d'équipe)
create policy "members_select_own_org" on public.members
  for select using (org_id = public.my_org());

-- app_kv : lecture / écriture réservées aux membres de l'organisation
create policy "appkv_select" on public.app_kv
  for select using (org_id = public.my_org());
create policy "appkv_insert" on public.app_kv
  for insert with check (org_id = public.my_org());
create policy "appkv_update" on public.app_kv
  for update using (org_id = public.my_org())
              with check (org_id = public.my_org());
create policy "appkv_delete" on public.app_kv
  for delete using (org_id = public.my_org());

-- 6. Amorçage de l'organisation Roovers (une seule fois) -----------
insert into public.orgs (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Déménagements Roovers')
on conflict do nothing;

-- ============================================================
-- RATTACHER LES PERSONNES (à faire pour chaque compte)
-- ------------------------------------------------------------
-- Après qu'une personne s'est connectée une première fois (son compte
-- existe alors dans auth.users), récupère son UID dans
-- Supabase → Authentication → Users, puis :
--
--   insert into public.members (user_id, org_id, role, name) values
--     ('<UID>', '00000000-0000-0000-0000-000000000001', 'bureau',  'Raphaël');
--   insert into public.members (user_id, org_id, role, name) values
--     ('<UID>', '00000000-0000-0000-0000-000000000001', 'terrain', 'Cédric H.');
--
-- Sécurité v1 recommandée : dans Supabase → Authentication → Providers,
-- désactive l'inscription publique ("Allow new users to sign up") pour rester
-- en invitation seule — c'est un outil interne, pas un SaaS ouvert (ça, c'est
-- Dashprod). Tu invites les comptes depuis le dashboard, puis tu les rattaches
-- ci-dessus.
-- ============================================================
