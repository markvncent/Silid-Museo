import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminGate from './AdminGate';
import CategoryForm from './CategoryForm';
import ArtworkForm from './ArtworkForm';
import ModerationList from './ModerationList';

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('categories');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <AdminGate onUnlock={() => {}} />;

  return (
    <div>
      <button onClick={() => supabase.auth.signOut()}>Log out</button>
      <nav>
        <button onClick={() => setTab('categories')}>Categories</button>
        <button onClick={() => setTab('artworks')}>Artworks</button>
        <button onClick={() => setTab('moderation')}>Moderation</button>
      </nav>
      {tab === 'categories' && <CategoryForm />}
      {tab === 'artworks' && <ArtworkForm />}
      {tab === 'moderation' && <ModerationList />}
    </div>
  );
}