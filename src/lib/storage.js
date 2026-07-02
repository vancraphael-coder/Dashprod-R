// ============================================================
// src/lib/storage.js
// ============================================================
// Adaptateur Supabase exposant EXACTEMENT la même interface que le
// window.storage de claude.ai : get / set / delete / list.
//
// On l'assigne à window.storage avant de monter l'app (voir main.jsx).
// Le composant Roovers (2224 lignes) référence window.storage tel quel :
// il fonctionne donc SANS aucune modification. C'est tout l'intérêt de porter
// par la couche de stockage plutôt que de réécrire l'application.
//
// La portée (organisation) est gérée par la RLS + la fonction my_org() :
// chaque appel ne voit / n'écrit que les données de l'organisation du compte
// connecté. Le paramètre "shared" de window.storage n'a plus de sens en v1
// (tout est partagé au sein de l'organisation) : il est ignoré.
//
// NB Next.js : si tu pars sur Next plutôt que Vite, remplace les
// import.meta.env.VITE_* par process.env.NEXT_PUBLIC_* — rien d'autre à changer.
// ============================================================

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// --- org_id du compte courant, mis en cache -------------------------
// La RLS filtre déjà les lectures, mais l'upsert a besoin de la valeur
// explicite pour cibler la bonne ligne (clé primaire org_id + k).
let _orgPromise = null;

async function orgId() {
  if (!_orgPromise) {
    _orgPromise = supabase.rpc('my_org').then(({ data, error }) => {
      if (error) throw error;
      return data; // uuid, ou null si le compte n'est rattaché à aucune org
    });
  }
  return _orgPromise;
}

// À appeler à chaque changement de session (connexion / déconnexion).
export function resetOrgCache() { _orgPromise = null; }

// --- Interface window.storage ---------------------------------------
export const supabaseStorage = {
  async get(key) {
    const { data, error } = await supabase
      .from('app_kv')
      .select('v')
      .eq('k', key)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;                         // clé absente → null
    return { key, value: data.v, shared: false };   // value = chaîne JSON
  },

  async set(key, value /* , shared ignoré en v1 */) {
    const org = await orgId();
    if (!org) throw new Error('Compte non rattaché à une organisation');
    const { error } = await supabase
      .from('app_kv')
      .upsert(
        { org_id: org, k: key, v: value, updated_at: new Date().toISOString() },
        { onConflict: 'org_id,k' },
      );
    if (error) throw error;
    return { key, value, shared: false };
  },

  async delete(key) {
    const { error } = await supabase.from('app_kv').delete().eq('k', key);
    if (error) throw error;
    return { key, deleted: true, shared: false };
  },

  async list(prefix = '') {
    let q = supabase.from('app_kv').select('k');
    if (prefix) q = q.like('k', prefix + '%');
    const { data, error } = await q;
    if (error) throw error;
    return { keys: (data || []).map((r) => r.k), prefix, shared: false };
  },
};
