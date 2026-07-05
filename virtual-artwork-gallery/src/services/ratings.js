import { supabase } from '../lib/supabase';

/**
 * Submits a rating for an artwork.
 * voterToken is a per-browser random id (see useLocalVote hook)
 * used to softly prevent the same visitor from rating twice —
 * enforced by the unique index in schema.sql when present.
 */
export async function submitRating(artworkId, score, voterToken = null) {
    const { data, error } = await supabase
        .from('ratings')
        .insert({
            artwork_id: artworkId,
            score,
            voter_token: voterToken,
        })
        .select()
        .single();

    if (error) {
        // A unique constraint violation here means this browser
        // already rated this artwork — handle that case gracefully
        // in the UI rather than showing a raw error.
        console.error('Failed to submit rating:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches the average rating + count for a single artwork,
 * using the artwork_ratings_summary view from schema.sql.
 */
export async function getAverageRating(artworkId) {
    const { data, error } = await supabase
        .from('artwork_ratings_summary')
        .select('average_rating, rating_count')
        .eq('artwork_id', artworkId)
        .maybeSingle(); // returns null instead of erroring if no ratings yet

    if (error) {
        console.error('Failed to fetch rating summary:', error.message);
        throw error;
    }

    // No ratings yet — return sensible defaults instead of null
    return data ?? { average_rating: 0, rating_count: 0 };
}