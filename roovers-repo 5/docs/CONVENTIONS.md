# Conventions

## Git

- Branche stable : `main` (CI verte obligatoire). Travail en branches courtes
  `feat/…`, `fix/…`, `chore/…`, fusionnées vite — pas de branches longues.
- Messages de commit : `type: résumé à l'impératif` en français.
  Types : `feat`, `fix`, `chore`, `docs`, `refactor`, `db`.
  Exemples : `feat: récap mission terrain (relevé, cartons, à encaisser)`,
  `db: migration 0003 — table X`.
- Un commit = un sujet. Pas de commits fourre-tout.

## Base de données

- Toute évolution du schéma = un fichier `supabase/migrations/NNNN_nom.sql`,
  numéroté, append-only (on n'édite jamais une migration déjà appliquée).
- Toute table : RLS activée + policies explicites, scopées `my_org()`.

## Données applicatives (app_kv)

- Une clé par domaine : `roovers-dossiers`, `roovers-team`, `roovers-trucks`,
  `roovers-clients`, `roovers-settings`. Nouveau domaine = nouvelle clé
  préfixée `roovers-`, documentée ici.
- Valeur = JSON.stringify d'une structure stable ; champs additionnels
  toujours optionnels (compatibilité ascendante des anciens enregistrements).

## Événements (events)

- Type en minuscules, notation `domaine.action` :
  `auth.login`, `devis.created`, `devis.signed`, `mission.opened`,
  `facture.issued`, `facture.paid`, `client.created`.
- Payload : identifiants et montants (centimes), jamais de données
  personnelles inutiles, jamais de blobs.

## Modules

- Drapeau dans `src/config/features.js` — seule source d'activation.
- Le cœur teste `FEATURES.x` ; il n'importe jamais un module directement.
- Extraction d'un module dans `src/modules/<nom>/` uniquement à sa
  réactivation.

## Code

- Français pour l'interface, les commentaires et la doc.
- Montants en **centimes** (entiers) dès qu'une donnée est persistée.
- Dates ISO `YYYY-MM-DD`, fuseau Europe/Brussels.
