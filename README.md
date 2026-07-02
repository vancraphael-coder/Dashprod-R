# Roovers Mobile

Application terrain + bureau pour Déménagements Roovers. Un seul composant React
(devis, clients/CRM, agenda, équipe, matériel, facture) monté derrière une
couche Supabase (Auth + données partagées par organisation).

## Stack

- **React 18 + Vite** — SPA client, build statique.
- **Supabase** — Auth (lien magique) + Postgres avec RLS. Les données métier
  sont stockées en clé/valeur *par organisation* (`app_kv`), ce qui reproduit
  l'interface `window.storage` d'origine : le composant tourne sans réécriture.
- **Vercel** — hébergement.

## Périmètre v1 (verrouillé)

Deux modules sont volontairement **désactivés** via le drapeau `FEATURES` dans
`src/config/features.js` :

```js
const FEATURES = { messaging: false, peppol: false };
```

- `messaging` — messagerie d'équipe chiffrée de bout en bout.
- `peppol` — facture électronique Peppol / UBL (BIS Billing 3.0).

Le code est conservé, inerte. Repasser un booléen à `true` réactive le module.
La facturation belge courante reste active en v1 : n° de facture, acompte, net à
payer, communication structurée (OGM), QR SEPA (EPC).

## Mise en route

1. **Supabase** — nouveau projet (Frankfurt). Dans SQL Editor, exécute les migrations
   `supabase/migrations/*.sql` dans l'ordre (crée orgs, membres, `app_kv`, RLS, et l'organisation
   Roovers).
2. **Auth** — active le provider Email ; désactive l'inscription publique
   (invitation seule).
3. **Membres** — invite chaque compte, connecte-le une fois, récupère son UID
   dans Authentication → Users, puis rattache-le (bloc en bas de `0001_init.sql`,
   rôle `bureau` ou `terrain`).
4. **Env** — copie `.env.example` en `.env.local` et remplis
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
5. **Local** — `npm install` puis `npm run dev`.
6. **Déploiement** — pousse sur GitHub, importe le repo dans Vercel
   (framework : Vite), ajoute les deux variables d'environnement, déploie.

## À ajouter avant un déploiement large (non bloquant pour un lancement contrôlé)

**Verrou de rôle.** Aujourd'hui tout compte rattaché peut ouvrir le mode Bureau
(qui affiche salaires et marges). Tant que l'accès reste sur invitation, c'est
gérable. Pour ouvrir à toute l'équipe terrain, il faudra que la coquille lise le
rôle (`members.role`) et masque le mode Bureau aux comptes `terrain`. Le rôle est
déjà disponible côté serveur (`my_org()` + table `members`) — il reste à le
brancher dans l'interface.

## Structure

```
src/
  main.jsx                 coquille : connexion + rattachement + montage
  app/RooversMobile.jsx    module cœur (bureau + terrain)
  config/features.js       drapeaux de modules (source unique)
  lib/storage.js           adaptateur Supabase (interface window.storage)
  lib/events.js            journal d'usage (couche horizontale)
  modules/                 futurs modules extraits (voir README dedans)
supabase/
  migrations/0001_init.sql    schéma + RLS + amorçage
  migrations/0002_events.sql  journal d'événements
docs/
  ARCHITECTURE.md · CONVENTIONS.md · ROADMAP.md
```

Docs : `docs/ARCHITECTURE.md` (comment c'est construit),
`docs/CONVENTIONS.md` (comment on y contribue), `docs/ROADMAP.md` (la suite).
