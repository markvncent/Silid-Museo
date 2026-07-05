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
    id: 'd1a1b1c1-1111-4111-a111-111111111111',
    slug: 'silid-lona',
    name: 'Silid-Lona (The Canvas Room)',
    description: 'Features digital artworks exploring AI as a creative medium, and hand-drawn works capturing line, composition, and form in a single moment.',
    icon: '🎨',
    gradient: 'from-orange-500/70 to-red-600/70',
    mediaType: 'image',
  },
  {
    id: 'd2a2b2c2-2222-4222-a222-222222222222',
    slug: 'silid-tinig',
    name: 'Silid-Tinig (The Audio Room)',
    description: 'Dedicated to original music and songwriting, where sound becomes a medium for reflection and expression.',
    icon: '🔊',
    gradient: 'from-yellow-500/70 to-amber-600/70',
    mediaType: 'audio',
  },
  {
    id: 'd3a3b3c3-3333-4333-a333-333333333333',
    slug: 'silid-salin',
    name: 'Silid-Salin (The Transcreation Room)',
    description: 'Presents works that transform existing art into new creative works, featuring the original musical play "Larong Pinoy".',
    icon: '🎭',
    gradient: 'from-amber-600/70 to-orange-600/70',
    mediaType: 'video',
  },
  {
    id: 'd4a4b4c4-4444-4444-a444-444444444444',
    slug: 'silid-kasaysayan',
    name: 'Silid-Kasaysayan (The History Room)',
    description: 'Traces the development of art through history from Prehistoric, Egyptian, Classical, Medieval, and Renaissance Art to Mannerism.',
    icon: '🏛️',
    gradient: 'from-yellow-600/70 to-orange-500/70',
    mediaType: 'image',
  },
  {
    id: 'd5a5b5c5-5555-4555-a555-555555555555',
    slug: 'silid-espasyo',
    name: 'Silid-Espasyo (The Spatial Room)',
    description: 'Dedicated to installation art and three-dimensional forms of expression, featuring a scale model of an Ancient Greek temple.',
    icon: '📐',
    gradient: 'from-amber-600/70 to-yellow-500/70',
    mediaType: 'sculpture',
  },
  {
    id: 'd6a6b6c6-6666-4666-a666-666666666666',
    slug: 'silid-aninag',
    name: 'Silid-Aninag (The Screening Room)',
    description: 'A screening room dedicated to digital video presentations, short films, animation, and visual storytelling.',
    icon: '🎬',
    gradient: 'from-orange-600/70 to-rose-600/70',
    mediaType: 'video',
  },
  {
    id: 'd7a7b7c7-7777-4777-a777-777777777777',
    slug: 'silid-manlilikha',
    name: "Silid-Manlilikha (The Creators' Room)",
    description: 'A tribute to the group members and subject instructor whose guidance and collaboration made Silid Museo possible.',
    icon: '👥',
    gradient: 'from-red-500/70 to-amber-500/70',
    mediaType: 'image',
  },
];

export default categories;
