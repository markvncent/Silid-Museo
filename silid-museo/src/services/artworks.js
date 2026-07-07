import { supabase } from '../lib/supabase.js';
import { adminFetch } from './adminApi.js';

export async function getArtworksByCategory(categoryId) {
  // unchanged — public reads still go straight through supabase, that's fine
  const { data, error } = await supabase
    .from('artworks')
    .select(`*, artwork_ratings_summary (average_rating, rating_count)`)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getArtworkById(artworkId) {
  const { data, error } = await supabase
    .from('artworks')
    .select(`*, artwork_ratings_summary (average_rating, rating_count)`)
    .eq('id', artworkId)
    .single();
  if (error) throw error;
  return data;
}

export function addArtwork({ categoryId, title, description, mediaUrl, mediaType, thumbnailUrl }) {
  return adminFetch('/artworks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryId, title, description, mediaUrl, mediaType, thumbnailUrl }),
  });
}

export function updateArtwork(artworkId, updates) {
  return adminFetch('/artworks', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artworkId, updates }),
  });
}

export async function deleteArtwork(artworkId) {
  await adminFetch('/artworks', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artworkId }),
  });
  return true;
}