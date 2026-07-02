// ============================================================
// src/lib/events.js — collecte d'événements d'usage
// ============================================================
// Couche HORIZONTALE : chaque événement métier (connexion, devis créé,
// mission ouverte, facture émise…) est journalisé dans la table `events`,
// scopée par organisation. C'est la matière première pour :
//   - les statistiques d'usage réelles (qui utilise quoi, quand),
//   - les futurs modules analytics (Dashprod),
//   - l'audit (« qui a fait quoi »).
//
// Contrat volontairement minimal et stable :
//   logEvent("mission.opened", { dossierId: "d1" })
//
// Fire-and-forget : un échec de journalisation ne doit JAMAIS casser
// l'application. Pas d'await requis côté appelant.
//
// Types d'événements : minuscules, notation pointée `domaine.action`
// (voir docs/CONVENTIONS.md). Le payload est un objet JSON libre mais
// COURT — des identifiants et des montants, pas des blobs.
// ============================================================

import { supabase } from './storage.js';
import { FEATURES } from '../config/features.js';

export function logEvent(type, payload = {}) {
  if (!FEATURES.events) return;
  try {
    // Insertion asynchrone, jamais bloquante, erreurs avalées (console only).
    supabase
      .rpc('log_event', { p_type: String(type), p_payload: payload })
      .then(({ error }) => {
        if (error) console.warn('[events]', type, error.message);
      });
  } catch (e) {
    console.warn('[events]', type, e);
  }
}

// Exposé globalement pour que le module applicatif (RooversMobile) puisse
// journaliser sans import direct — couture volontaire : le cœur de l'app ne
// dépend pas de Supabase, seulement d'une fonction optionnelle.
if (typeof window !== 'undefined') {
  window.rooversEvents = { log: logEvent };
}
