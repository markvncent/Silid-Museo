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
    expanded_description: 'The Silid-Lona painting section features digital artworks that explore the use of artificial intelligence as a creative medium. Presented in this space is an AI-generated digital painting inspired by the 128th Philippine Independence Day, demonstrating how descriptions given by the artists can be transformed into visual compositions. The work highlights the coordination of technology and artistic expression, inviting viewers to consider new possibilities in contemporary art.\n\nThe Silid-Lona drawing section presents hand-drawn works that reflect the artist\'s thoughts, observations, and ideas at the time of their creation. Through line, composition, and form, each drawing offers a personal perspective captured in a single moment. Together, these works emphasize drawing as both a creative process and a means of visual expression.',
    icon: '🎨',
    gradient: 'from-orange-500/70 to-red-600/70',
    mediaType: 'image',
  },
  {
    id: 'd2a2b2c2-2222-4222-a222-222222222222',
    slug: 'silid-tinig',
    name: 'Silid-Tinig (The Audio Room)',
    description: 'Dedicated to original music and songwriting, where sound becomes a medium for reflection and expression.',
    expanded_description: 'Silid-Tinig is dedicated to original music and songwriting, where sound becomes a medium for reflection and expression. Featured in this room is our original composition, "Hindi Kami Kaaway," a song that responds to the issue of red-tagging and its impact on innocent individuals and communities. Through this piece, it invites listeners to reflect on the human cost of false accusations and the importance of protecting truth, dignity, and justice.',
    icon: '🔊',
    gradient: 'from-yellow-500/70 to-amber-600/70',
    mediaType: 'audio',
  },
  {
    id: 'd3a3b3c3-3333-4333-a333-333333333333',
    slug: 'silid-salin',
    name: 'Silid-Salin (The Transcreation Room)',
    description: 'Presents works that transform existing art into new creative works, featuring the original musical play "Larong Pinoy".',
    expanded_description: 'Silid-Salin presents works that transform existing art into new creative works. Featured in this room is our original musical play entitled "Larong Pinoy" inspired by the Larong Pinoy paintings of Rico Doronio. The story follows a child from the present generation who, through her grandmother\'s introduction to the paintings, is transported into their world and experiences traditional Filipino games such as luksong baka, patintero, luksong tinik, and tumbang preso. By bringing these painted scenes to life through music, storytelling, and performance, the production explores the value of play, memory, and culture across generations.',
    icon: '🎭',
    gradient: 'from-amber-600/70 to-orange-600/70',
    mediaType: 'video',
  },
  {
    id: 'd4a4b4c4-4444-4444-a444-444444444444',
    slug: 'silid-kasaysayan',
    name: 'Silid-Kasaysayan (The History Room)',
    description: 'Traces the development of art through history from Prehistoric, Egyptian, Classical, Medieval, and Renaissance Art to Mannerism.',
    expanded_description: 'Silid-Kasaysayan is a room that traces the development of art through history, specifically from the Early stages of art history; Prehistoric Art, Egyptian Art, Classical Art (Greek and Roman Art and Architecture), Medieval Art, Renaissance Art, and Mannerism. Through a Powerpoint presentation, art forms such as architecture, painting, and sculptures are introduced, providing an overview of the defining styles, techniques, and artistic developments that shaped each historical period.',
    icon: '🏛️',
    gradient: 'from-yellow-600/70 to-orange-500/70',
    mediaType: 'image',
  },
  {
    id: 'd5a5b5c5-5555-4555-a555-555555555555',
    slug: 'silid-espasyo',
    name: 'Silid-Espasyo (The Spatial Room)',
    description: 'Dedicated to installation art and three-dimensional forms of expression, featuring a scale model of an Ancient Greek temple.',
    expanded_description: 'Silid-Espasyo is a room dedicated to installation art and other three-dimensional forms of artistic expression. Featured in this space is a scale model of an Ancient Greek temple, inspired by Art History and the architectural principles of Classical Greece. Constructed from discarded cardboard and recycled materials, the installation reimagines a historical structure through contemporary, sustainable materials, demonstrating how the past can be interpreted through present-day artistic practice.',
    icon: '📐',
    gradient: 'from-amber-600/70 to-yellow-500/70',
    mediaType: 'sculpture',
  },
  {
    id: 'd6a6b6c6-6666-4666-a666-666666666666',
    slug: 'silid-aninag',
    name: 'Silid-Aninag (The Screening Room)',
    description: 'A screening room dedicated to digital video presentations, short films, animation, and visual storytelling.',
    expanded_description: 'Silid-Aninag is a screening room dedicated to digital video presentations, short films, animation, and visual storytelling.',
    icon: '🎬',
    gradient: 'from-orange-600/70 to-rose-600/70',
    mediaType: 'video',
  },
  {
    id: 'd7a7b7c7-7777-4777-a777-777777777777',
    slug: 'silid-manlilikha',
    name: "Silid-Manlilikha (The Creators' Room)",
    description: 'A tribute to the group members and subject instructor whose guidance and collaboration made Silid Museo possible.',
    expanded_description: 'Silid-Manlilikha is a room dedicated to the people behind the exhibition. This space acknowledges the members of the group and our subject instructor, whose collaboration, creativity, and guidance made Silid Museo possible. It serves as a tribute to everyone who contributed to the realization of the exhibition.',
    icon: '👥',
    gradient: 'from-red-500/70 to-amber-500/70',
    mediaType: 'image',
  },
];

export default categories;
