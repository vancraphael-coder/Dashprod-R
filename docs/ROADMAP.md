# Roadmap

## v1 — périmètre verrouillé (ce dépôt)

Bureau (dossiers, clients/CRM, agenda, équipe, matériel, facture belge OGM+QR
SEPA) + Terrain (chantiers assignés, récap mission avec relevé/cartons/montant
à encaisser, heures j/s/m/a, agenda filtré, devis signable).
Modules coupés : `messaging`, `peppol`.

## v1.x — avant ouverture à toute l'équipe

1. **Verrou de rôle** (priorité) : la coquille lit `members.role` et masque le
   mode Bureau (salaires, marges) aux comptes `terrain`.
2. Journalisation des événements métier clés depuis le cœur via
   `window.rooversEvents.log` : `devis.created`, `devis.signed`,
   `mission.opened`, `facture.issued`, `facture.paid`.
3. Écran « Activité » (bureau) : lecture simple de `events` — qui fait quoi.

## v2 — modules

- `peppol` : réactivation du drapeau + intégration d'un Access Point
  (Storecove / Billit / Codabox) pour l'envoi réel B2B.
- `messaging` : réactivation + portage du transport sur Supabase
  (tables `device_keys` + `messages` chiffrées, le cœur crypto est prêt).

## Horizontal (pont Dashprod)

La table `events` (org_id, type, payload, temps) est le contrat de données
horizontal : tout futur module analytics/Dashprod lit ce flux sans toucher au
cœur. Ne jamais casser la notation `domaine.action`.
