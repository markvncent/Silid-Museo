-- ============================================================
-- Interactive Virtual Gallery — Seed Data
-- Run this AFTER schema.sql and policies.sql, in the Supabase
-- SQL Editor. Populates the 8 fixed category slots.
--
-- Feel free to rename/reword these to match your actual
-- mediums before running — these are placeholders based on
-- common art mediums from the FRD.
-- ============================================================

insert into categories (name, description, medium_type, display_order) values
  ('Photography', 'Captured moments through the lens.', 'photography', 1),
  ('Digital Art', 'Illustrations and designs created digitally.', 'digital_art', 2),
  ('Music & Audio', 'Original compositions and sound pieces.', 'audio', 3),
  ('Film & Video', 'Short films, animations, and video works.', 'video', 4),
  ('Writing & Poetry', 'Poems, short stories, and written works.', 'writing', 5),
  ('Sculpture & 3D Art', 'Three-dimensional and physical art forms.', 'sculpture', 6),
  ('Traditional Art', 'Paintings, sketches, and traditional media.', 'traditional', 7),
  ('Mixed Media', 'Works combining multiple art forms and techniques.', 'mixed_media', 8);

-- ============================================================
-- VERIFY: after running, check the Table Editor -> categories
-- table, or run:
--   select id, name, display_order from categories order by display_order;
-- You should see exactly 8 rows.
-- ============================================================