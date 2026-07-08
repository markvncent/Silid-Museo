import { supabase } from '../lib/supabase.js';
import { adminFetch } from './adminApi.js';

/* ─── Public: visitors reading/writing their own comments ─── */

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

/* ─── Admin: moderation panel (reads stay direct, writes go through the Edge Function) ─── */

/**
 * Fetches ALL artwork feedback across all artworks (for admin moderation).
 * Joins with the artworks table to include the artwork title.
 */
export async function getAllArtworkFeedback() {
    const { data, error } = await supabase
        .from('artwork_feedback')
        .select('*, artworks(title, category_id)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch all artwork feedback:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches ALL category feedback across all categories (for admin moderation).
 * Joins with the categories table to include the category name.
 */
export async function getAllCategoryFeedback() {
    const { data, error } = await supabase
        .from('category_feedback')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch all category feedback:', error.message);
        throw error;
    }

    return data;
}

/**
 * Creates an artwork comment from the admin panel (goes through the Edge Function).
 */
export function createArtworkFeedbackAdmin(artworkId, commentText) {
    return adminFetch('/artwork-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId, commentText }),
    });
}

/**
 * Updates an artwork feedback comment (admin moderation).
 */
export function updateArtworkFeedback(feedbackId, updates) {
    return adminFetch('/artwork-feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId, updates }),
    });
}

/**
 * Deletes a single artwork feedback comment (admin moderation).
 */
export function deleteArtworkFeedback(feedbackId) {
    return adminFetch('/artwork-feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId }),
    });
}

/**
 * Creates a category comment from the admin panel (goes through the Edge Function).
 */
export function createCategoryFeedbackAdmin(categoryId, commentText) {
    return adminFetch('/category-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, commentText }),
    });
}

/**
 * Updates a category feedback comment (admin moderation).
 */
export function updateCategoryFeedback(feedbackId, updates) {
    return adminFetch('/category-feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId, updates }),
    });
}

/**
 * Deletes a single category feedback comment (admin moderation).
 */
export function deleteCategoryFeedback(feedbackId) {
    return adminFetch('/category-feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId }),
    });
}