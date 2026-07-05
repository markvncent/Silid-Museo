import { supabase } from '../lib/supabase';

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
 * NOTE: this will fail under current RLS policies when called with the
 * anon key — that's expected. This function exists now so it's ready
 * to be called from an Edge Function (service role key) in Phase 7,
 * rather than something we build from scratch later.
 */
export async function updateCategory(categoryId, updates) {
    const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .select()
        .single();

    if (error) {
        console.error('Failed to update category:', error.message);
        throw error;
    }

    return data;
}