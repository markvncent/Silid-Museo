/**
 * Pre-populated fallback mock artworks matching docs/categories-details.md.
 * These display if no database entries are found in Supabase.
 */
export const fallbackArtworks = {
  'silid-lona': [
    {
      id: 'mock-lona-1',
      title: 'Kalayaan at Teknolohiya (AI-Generated Painting)',
      description: 'An AI-generated digital painting inspired by the 128th Philippine Independence Day. Demonstrates the coordination of technology and creative expression by translating descriptive prompts into visual compositions.',
      media_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
      media_type: 'image',
      subcategory: 'Painting',
      thumbnail_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-06-12').toISOString(),
      is_fallback: true,
    },
    {
      id: 'mock-lona-2',
      title: 'Saglit na Pagninilay (Hand-Drawn Sketch)',
      description: "A hand-drawn sketch reflecting the artist's personal thoughts, observations, and ideas captured in a single moment through line, form, and composition.",
      media_url: 'https://images.unsplash.com/photo-1579783928621-7a13d66a6211?q=80&w=1000&auto=format&fit=crop',
      media_type: 'image',
      subcategory: 'Drawing',
      thumbnail_url: 'https://images.unsplash.com/photo-1579783928621-7a13d66a6211?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-01').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-tinig': [
    {
      id: 'mock-tinig-1',
      title: 'Hindi Kami Kaaway (Original Composition)',
      description: 'An original musical composition and song responding to the issue of red-tagging and its impact on innocent communities. It invites listeners to reflect on truth, dignity, and justice.',
      media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Safe demo audio url
      media_type: 'audio',
      thumbnail_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-02').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-salin': [
    {
      id: 'mock-salin-1',
      title: 'Larong Pinoy (Original Musical Play)',
      description: 'A theatrical and musical adaptation inspired by the paintings of Rico Doronio. Follows a modern child transported into the traditional game scenes (luksong baka, patintero, luksong tinik, tumbang preso) introduced by her grandmother.',
      media_url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-playing-guitar-under-neon-light-4720-large.mp4', // Safe demo video url
      media_type: 'video',
      thumbnail_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-03').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-kasaysayan': [
    {
      id: 'mock-kasaysayan-1',
      title: 'Timeline of Art History (Presentation Overview)',
      description: 'An educational slide presentation tracing art development from Prehistoric, Egyptian, Classical (Greek & Roman), Medieval, Renaissance to Mannerism. Showcases styles, architecture, and defining techniques.',
      media_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      media_type: 'image',
      thumbnail_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-04').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-espasyo': [
    {
      id: 'mock-espasyo-1',
      title: 'Ancient Greek Temple Scale Model',
      description: 'A miniature architectural installation constructed entirely from recycled cardboard and discarded materials, interpreting classical Greek proportions through modern sustainable practices.',
      media_url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1000&auto=format&fit=crop',
      media_type: 'image',
      thumbnail_url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-05').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-aninag': [
    {
      id: 'mock-aninag-1',
      title: 'Exhibition Screening Reel (Short Film)',
      description: 'A compilation of digital visual storytelling, short animated clips, and exhibition video highlights prepared for the screening room.',
      media_url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
      media_type: 'video',
      thumbnail_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-05').toISOString(),
      is_fallback: true,
    }
  ],
  'silid-manlilikha': [
    {
      id: 'mock-manlilikha-1',
      title: 'Group Members & Instructor Tribute',
      description: 'An interactive layout introducing the dedicated creators behind Silid Museo, acknowledging the group members and the subject instructor who guided the project to realization.',
      media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
      media_type: 'image',
      thumbnail_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop',
      created_at: new Date('2026-07-05').toISOString(),
      is_fallback: true,
    }
  ],
};
