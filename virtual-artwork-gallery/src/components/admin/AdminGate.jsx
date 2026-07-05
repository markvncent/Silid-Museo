import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminGate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@yourapp.com',
      password: code,
    });
    if (error) setError('Invalid access code');
    else onUnlock();
  };

  return (
    <div>
      <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Access code" />
      <button onClick={handleUnlock}>Unlock</button>
      {error && <p>{error}</p>}
    </div>
  );
}