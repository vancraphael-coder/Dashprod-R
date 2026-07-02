# Problèmes connus — à consulter avant toute décision structurante

## 1. Prisma × RLS (multi-tenant Supabase)
- **Erreur** : envisager Prisma comme ORM par défaut.
- **Cause** : Prisma n'injecte pas nativement le contexte de session
  (`auth.uid()`) requis par les policies RLS ; il faut des contournements
  fragiles (transactions + `set_config`).
- **Règle** : pas de Prisma dans ce setup sans ADR dédié. Le client
  supabase-js respecte la RLS nativement.

## 2. Verrou de rôle = interface seulement (v1)
- **Fait** : un compte `terrain` ne peut pas atteindre le mode Bureau via
  l'UI, mais les données (`app_kv`, clé `roovers-team`, taux horaires)
  restent lisibles par tout membre de l'org via l'API Supabase.
- **Règle** : ne pas présenter le verrou comme un cloisonnement de données.
  v2 : table dédiée aux champs sensibles, policy `role='bureau'`.

## 3. CI `npm ci` sans lockfile
- **Erreur** : workflow CI utilisant `npm ci` alors que package-lock.json
  n'était pas committé → échec garanti du build.
- **Règle** : le lockfile est committé et le reste.

## 4. Push OAuth sans scope `workflow`
- **Fait** : GitHub refuse tout push contenant `.github/workflows/*` si le
  jeton OAuth n'a que le scope `repo`.
- **Règle** : jeton avec scopes `repo` + `workflow`, ou push via
  credentials git locaux (Claude Code).
