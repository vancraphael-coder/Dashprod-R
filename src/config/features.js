// ============================================================
// src/config/features.js — drapeaux de modules (source unique)
// ============================================================
// Chaque module optionnel de l'application est activé/désactivé ICI et
// uniquement ici. Le code des modules reste dans le dépôt, inerte quand
// le drapeau est à false. Règle : on n'efface pas un module, on le coupe.
//
// v1 verrouillée : messagerie et peppol désactivés.
// ============================================================

export const FEATURES = {
  messaging: false, // messagerie d'équipe chiffrée de bout en bout (E2EE)
  peppol: false,    // facture électronique Peppol / UBL (BIS Billing 3.0)
  events: true,     // collecte d'événements d'usage (couche horizontale)
};
