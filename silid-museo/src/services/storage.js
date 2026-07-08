import { adminFetch } from './adminApi.js';

export async function uploadMedia(file, categoryId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('categoryId', categoryId);

  // NOTE: no Content-Type header here — the browser sets the
  // multipart boundary itself when you pass FormData as body
  const data = await adminFetch('/media', { method: 'POST', body: formData });
  return { path: data.path, publicUrl: data.publicUrl };
}

export async function deleteMedia(path) {
  await adminFetch('/media', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  return true;
}

export function detectMediaType(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return 'text';
}