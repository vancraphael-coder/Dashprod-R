# Modules

Chaque module optionnel vit dans son dossier ici, derrière un drapeau de
`src/config/features.js`. Un module :

1. exporte un point d'entrée unique (`index.js`),
2. ne s'importe JAMAIS directement depuis le cœur — le cœur teste le drapeau,
3. peut lire/écrire ses données via `window.storage` (préfixe qui lui est
   propre, ex. `rmsg-…`) et journaliser via `window.rooversEvents.log()`.

Candidats déjà écrits (code conservé dans src/app/RooversMobile.jsx, inertes) :
- **messaging** — messagerie d'équipe E2EE (ECDH P-256 · AES-256-GCM · ECDSA).
- **peppol** — facture électronique UBL BIS Billing 3.0.

Leur extraction dans ce dossier se fera au moment de leur réactivation,
pas avant (on ne déplace pas du code mort par principe d'ordre apparent).
