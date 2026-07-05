import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ModerationList() {
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const fetchAll = async () => {
    const { data: r } = await supabase.from('ratings').select('*, artworks(title)');
    const { data: f } = await supabase.from('artwork_feedback').select('*, artworks(title)');
    setRatings(r || []);
    setFeedback(f || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteRating = async (id) => { await supabase.from('ratings').delete().eq('id', id); fetchAll(); };
  const deleteFeedback = async (id) => { await supabase.from('artwork_feedback').delete().eq('id', id); fetchAll(); };

  return (
    <div>
      <h3>Ratings</h3>
      {ratings.map(r => (
        <div key={r.id}>{r.artworks?.title}: {r.score} <button onClick={() => deleteRating(r.id)}>Delete</button></div>
      ))}
      <h3>Feedback</h3>
      {feedback.map(f => (
        <div key={f.id}>{f.artworks?.title}: {f.comment_text} <button onClick={() => deleteFeedback(f.id)}>Delete</button></div>
      ))}
    </div>
  );
}