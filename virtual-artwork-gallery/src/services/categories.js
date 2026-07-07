import { supabase } from '../lib/supabase.js';
import { adminFetch } from './adminApi.js';

/**
 * Fetches all 8 categories, ordered for landing page display.
 */
export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Failed to fetch categories:', error.message);
        throw error;
    }

    return data;
}

/**
 * Fetches a single category by its id.
 * Used on CategoryPage to get the name/description for the header.
 */
export async function getCategoryById(categoryId) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

    if (error) {
        console.error('Failed to fetch category:', error.message);
        throw error;
    }

    return data;
}

/**
 * Updates a category's editable fields (name, description, cover image).
 *
 * Routed through the admin Edge Function — same front desk as
 * artworks.js, just a different department down the hall. The
 * service role key lives only inside the Edge Function, never here.
 */
export function updateCategory(categoryId, updates) {
    return adminFetch('/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, updates }),
    });
}