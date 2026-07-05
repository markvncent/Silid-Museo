import { supabase } from '../lib/supabase';

/**
 * Fetches all artworks belonging to a given category.
 * Includes the average rating summary via a join with the
 * artwork_ratings_summary view, so CategoryPage/ArtworkCard
 * don't need a separate call just to show a star average.
 */
export async function getArtworksByCategory(categoryId) {
    const { data, error } = await supabase
        .from('artworks')
        .select(`
      *,
      artwork_ratings_summary (
        average_rating,
        rating_count
      )
    `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch artworks:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches a single artwork by id — used when opening the
 * expanded ArtworkModal view.
 */
export async function getArtworkById(artworkId) {
    const { data, error } = await supabase
        .from('artworks')
        .select(`
      *,
      artwork_ratings_summary (
        average_rating,
        rating_count
      )
    `)
        .eq('id', artworkId)
        .single();

    if (error) {
        console.error('Failed to fetch artwork:', error.message);
        throw error;
    }

    return data;
}

/**
 * Adds a new artwork row. Called after uploadMedia() from
 * storage.js has already returned a public URL.
 *
 * NOTE: like updateCategory(), this will fail under current RLS
 * when called with the anon key — expected until Phase 7 routes
 * this through an Edge Function with the service role key.
 */
export async function addArtwork({ categoryId, title, description, mediaUrl, mediaType, thumbnailUrl }) {
    const { data, error } = await supabase
        .from('artworks')
        .insert({
            category_id: categoryId,
            title,
            description,
            media_url: mediaUrl,
            media_type: mediaType,
            thumbnail_url: thumbnailUrl ?? null,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add artwork:', error.message);
        throw error;
    }

    return data;
}

/**
 * Updates an existing artwork's editable fields.
 * Same admin-only caveat as addArtwork().
 */
export async function updateArtwork(artworkId, updates) {
    const { data, error } = await supabase
        .from('artworks')
        .update(updates)
        .eq('id', artworkId)
        .select()
        .single();

    if (error) {
        console.error('Failed to update artwork:', error.message);
        throw error;
    }

    return data;
}

/**
 * Deletes an artwork row. Remember: this does NOT delete the
 * underlying media file from storage — call deleteMedia() from
 * storage.js separately with the file's storage path.
 * Same admin-only caveat as addArtwork().
 */
export async function deleteArtwork(artworkId) {
    const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId);

    if (error) {
        console.error('Failed to delete artwork:', error.message);
        throw error;
    }

    return true;
}