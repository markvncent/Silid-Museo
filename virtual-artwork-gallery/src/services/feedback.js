import { supabase } from '../lib/supabase';

/**
 * Submits feedback tied to a specific artwork
 * (shown in the ArtworkModal, alongside the rating).
 */
export async function submitArtworkFeedback(artworkId, commentText) {
    const { data, error } = await supabase
        .from('artwork_feedback')
        .insert({
            artwork_id: artworkId,
            comment_text: commentText,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to submit artwork feedback:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches all feedback comments for a specific artwork.
 */
export async function getArtworkFeedback(artworkId) {
    const { data, error } = await supabase
        .from('artwork_feedback')
        .select('*')
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch artwork feedback:', error.message);
        throw error;
    }

    return data;
}

/**
 * Submits general feedback on a category page as a whole
 * (not tied to any single artwork).
 */
export async function submitCategoryFeedback(categoryId, commentText) {
    const { data, error } = await supabase
        .from('category_feedback')
        .insert({
            category_id: categoryId,
            comment_text: commentText,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to submit category feedback:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches all feedback comments for a specific category.
 */
export async function getCategoryFeedback(categoryId) {
    const { data, error } = await supabase
        .from('category_feedback')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch category feedback:', error.message);
        throw error;
    }

    return data;
}