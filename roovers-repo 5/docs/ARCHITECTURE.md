# Architecture

## Vue d'ensemble

```
Navigateur (SPA Vite/React)
   │
   ├─ src/main.jsx ──────── coquille : auth (lien magique) + rattachement org
   │        │                + branchement window.storage + montage
   │        ▼
   ├─ src/app/RooversMobile.jsx ── module cœur (bureau + terrain)
   │        │  lit/écrit UNIQUEMENT via window.storage
   │        ▼
   ├─ src/lib/storage.js ── adaptateur Supabase (interface window.storage)
   ├─ src/lib/events.js ─── journal d'usage (couche horizontale)
   └─ src/config/features.js ── drapeaux de modules (source unique)

Supabase (Frankfurt)
   ├─ auth.users            comptes (invitation seule)
   ├─ public.orgs           organisations
   ├─ public.members        rattachement compte→org + rôle bureau/terrain
   ├─ public.app_kv         données métier clé/valeur, scopées org (RLS)
   └─ public.events         journal append-only, scopé org (RLS)
```

## Décisions structurantes

1. **Le cœur ne connaît pas Supabase.** RooversMobile parle à `window.storage`
   (get/set/delete/list) et, en option, à `window.rooversEvents.log`. On peut
   changer de backend en remplaçant un seul fichier (`lib/storage.js`).
2. **Portée organisation, pas utilisateur.** Toute l'équipe partage un jeu de
   données ; l'isolation est garantie par RLS + `my_org()` côté serveur.
3. **Modules par drapeaux, pas par suppression.** `features.js` est la seule
   source. Code coupé = code conservé, inerte, réactivable d'un booléen.
4. **Journal d'événements dès le jour 1.** `events` est la matière première de
   l'horizontalité (analytics, audit, futurs modules Dashprod). Append-only,
   alimentée par fonction SECURITY DEFINER — infalsifiable côté client.
5. **KV assumé pour la v1.** Les données sont petites et chargées en bloc. La
   normalisation relationnelle fine appartient à Dashprod, pas à cet outil
   interne. Si un besoin analytique dépasse le KV : lire `events`, pas app_kv.

## Chemin d'une donnée (exemple : un devis)

saisie terrain → state React → `window.storage.set("roovers-dossiers", json)`
→ upsert `app_kv (org_id, 'roovers-dossiers')` → visible par tout le bureau
au prochain chargement. Événement associé : `devis.created` dans `events`.

## Sécurité

- Auth par lien magique, inscription publique désactivée (invitation seule).
- RLS sur toutes les tables ; `my_org()` SECURITY DEFINER évite la récursion.
- Clé `anon` publique par conception — la protection EST la RLS.
- Verrou de rôle bureau/terrain : en place dans l'interface (coquille → prop
  `role` → garde de routage). Le cloisonnement au niveau données reste v2
  (voir ROADMAP).
