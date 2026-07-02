// ============================================================
// src/main.jsx — coquille d'application
// ============================================================
// Rôle : gérer la connexion (lien magique), vérifier le rattachement à
// l'organisation, brancher window.storage sur Supabase, puis monter l'app.
// Le composant RooversMobile n'est pas modifié : il utilise window.storage
// tel quel, qu'on remplace ici par l'adaptateur Supabase.
// ============================================================

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase, supabaseStorage, resetOrgCache } from './lib/storage';
import App from './app/RooversMobile.jsx';
import { logEvent } from './lib/events.js';

// Brancher l'app existante sur Supabase AVANT tout rendu.
window.storage = supabaseStorage;

function Root() {
  const [session, setSession] = useState(undefined); // undefined = chargement
  const [org, setOrg] = useState(undefined);         // undefined=?, null=non membre, uuid=ok

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      resetOrgCache();
      setOrg(undefined);
      setSession(s);
      if (_e === 'SIGNED_IN') logEvent('auth.login', {});
      if (_e === 'SIGNED_OUT') logEvent('auth.logout', {});
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Dès qu'une session existe, on vérifie le rattachement à une organisation.
  useEffect(() => {
    if (!session) { setOrg(undefined); return; }
    supabase.rpc('my_org').then(({ data }) => setOrg(data ?? null));
  }, [session]);

  if (session === undefined) return <Center>Chargement…</Center>;
  if (!session) return <Login />;
  if (org === undefined) return <Center>Vérification du compte…</Center>;
  if (org === null)
    return (
      <Center>
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <p style={{ fontWeight: 700 }}>Compte non rattaché</p>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Ton compte existe mais n'est lié à aucune organisation. Contacte
            l'administrateur pour être ajouté.
          </p>
          <button onClick={() => supabase.auth.signOut()} style={btnStyle}>
            Se déconnecter
          </button>
        </div>
      </Center>
    );

  return <App />;
}

function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!email.trim() || busy) return;
    setErr(''); setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    error ? setErr(error.message) : setSent(true);
  };

  if (sent)
    return (
      <Center>
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <p style={{ fontWeight: 700 }}>Lien envoyé</p>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Ouvre le lien reçu à <b>{email}</b> sur ce téléphone pour te connecter.
          </p>
        </div>
      </Center>
    );

  return (
    <div style={{ maxWidth: 340, margin: '16vh auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>Roovers</div>
      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 18 }}>Déménagements — accès équipe</div>
      <input
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder="ton@email.be"
        style={{ width: '100%', padding: 12, boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14 }}
      />
      <button onClick={send} disabled={busy} style={{ ...btnStyle, width: '100%', marginTop: 12, opacity: busy ? 0.6 : 1 }}>
        {busy ? 'Envoi…' : 'Recevoir le lien de connexion'}
      </button>
      {err && <p style={{ color: '#DC2626', fontSize: 13 }}>{err}</p>}
    </div>
  );
}

const btnStyle = {
  padding: '11px 16px', border: 'none', borderRadius: 10, background: '#2563EB',
  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 14,
};

const Center = ({ children }) => (
  <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
    {children}
  </div>
);

createRoot(document.getElementById('root')).render(<Root />);
