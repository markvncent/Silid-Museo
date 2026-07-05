import { supabase } from '../lib/supabase';

const BUCKET = 'artwork-media';

/**
 * Uploads a media file to the artwork-media bucket.
 * Returns the public URL to store in artworks.media_url.
 *
 * NOTE: This function is only called from admin-side code
 * (ArtworkForm.jsx), and in production it should route through
 * an Edge Function using the service role key rather than the
 * anon key directly — see admin.js / verify-admin Edge Function
 * in Phase 7. For local development/testing before Phase 7 is
 * built, this direct-upload version is fine to use temporarily.
 */
export async function uploadMedia(file, categoryId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${categoryId}/${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Upload failed:', error.message);
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

    return {
        path: data.path,
        publicUrl: urlData.publicUrl,
    };
}

/**
 * Deletes a media file from storage.
 * Call this when an artwork is deleted, to avoid orphaned files.
 */
export async function deleteMedia(path) {
    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([path]);

    if (error) {
        console.error('Delete failed:', error.message);
        throw error;
    }

    return true;
}

/**
 * Detects a rough media type from a File object's MIME type.
 * Useful when populating artworks.media_type on upload.
 */
export function detectMediaType(file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'text';
}