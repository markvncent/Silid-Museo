/**
 * Static category configuration for the landing page.
 * Each entry maps to one of the 8 "door" cards.
 *
 * `slug` is used for URL routing (/category/:slug).
 * `icon` is an emoji used as a visual placeholder until cover images are set.
 * `gradient` defines the Tailwind gradient classes for each door card.
 */
const categories = [
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Captured moments through the lens.',
    icon: '📷',
    gradient: 'from-amber-500/70 to-orange-600/70',
  },
  {
    slug: 'digital-art',
    name: 'Digital Art',
    description: 'Illustrations and designs created digitally.',
    icon: '🎨',
    gradient: 'from-orange-500/70 to-red-600/70',
  },
  {
    slug: 'music-audio',
    name: 'Music & Audio',
    description: 'Original compositions and sound pieces.',
    icon: '🎵',
    gradient: 'from-yellow-500/70 to-amber-600/70',
  },
  {
    slug: 'film-video',
    name: 'Film & Video',
    description: 'Short films, animations, and video works.',
    icon: '🎬',
    gradient: 'from-orange-600/70 to-rose-600/70',
  },
  {
    slug: 'writing-poetry',
    name: 'Writing & Poetry',
    description: 'Poems, short stories, and written works.',
    icon: '✍️',
    gradient: 'from-yellow-600/70 to-orange-500/70',
  },
  {
    slug: 'sculpture-3d',
    name: 'Sculpture & 3D Art',
    description: 'Three-dimensional and physical art forms.',
    icon: '🗿',
    gradient: 'from-amber-600/70 to-yellow-500/70',
  },
  {
    slug: 'traditional-art',
    name: 'Traditional Art',
    description: 'Paintings, sketches, and traditional media.',
    icon: '🖌️',
    gradient: 'from-orange-500/70 to-amber-600/70',
  },
  {
    slug: 'mixed-media',
    name: 'Mixed Media',
    description: 'Works combining multiple art forms and techniques.',
    icon: '🌀',
    gradient: 'from-red-500/70 to-amber-500/70',
  },
];

export default categories;
