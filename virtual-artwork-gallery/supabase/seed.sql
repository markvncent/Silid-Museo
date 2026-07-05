-- ============================================================
-- Interactive Virtual Gallery — Seed Data
-- Run this AFTER schema.sql and policies.sql, in the Supabase
-- SQL Editor. Populates the 8 fixed category slots.
--
-- Feel free to rename/reword these to match your actual
-- mediums before running — these are placeholders based on
-- common art mediums from the FRD.
-- ============================================================

insert into categories (id, name, description, medium_type, display_order) values
  ('d1a1b1c1-1111-4111-a111-111111111111', 'Silid-Lona (The Canvas Room)', 'Features digital artworks exploring AI as a creative medium, and hand-drawn works capturing line, composition, and form in a single moment.', 'silid-lona', 1),
  ('d2a2b2c2-2222-4222-a222-222222222222', 'Silid-Tinig (The Audio Room)', 'Dedicated to original music and songwriting, where sound becomes a medium for reflection and expression.', 'silid-tinig', 2),
  ('d3a3b3c3-3333-4333-a333-333333333333', 'Silid-Salin (The Transcreation Room)', 'Presents works that transform existing art into new creative works, featuring the original musical play "Larong Pinoy".', 'silid-salin', 3),
  ('d4a4b4c4-4444-4444-a444-444444444444', 'Silid-Kasaysayan (The History Room)', 'Traces the development of art through history from Prehistoric, Egyptian, Classical, Medieval, and Renaissance Art to Mannerism.', 'silid-kasaysayan', 4),
  ('d5a5b5c5-5555-4555-a555-555555555555', 'Silid-Espasyo (The Spatial Room)', 'Dedicated to installation art and three-dimensional forms of expression, featuring a scale model of an Ancient Greek temple.', 'silid-espasyo', 5),
  ('d6a6b6c6-6666-4666-a666-666666666666', 'Silid-Aninag (The Screening Room)', 'A screening room dedicated to digital video presentations, short films, animation, and visual storytelling.', 'silid-aninag', 6),
  ('d7a7b7c7-7777-4777-a777-777777777777', 'Silid-Manlilikha (The Creators'' Room)', 'A tribute to the group members and subject instructor whose guidance and collaboration made Silid Museo possible.', 'silid-manlilikha', 7);

-- ============================================================
-- VERIFY: after running, check the Table Editor -> categories
-- table, or run:
--   select id, name, display_order from categories order by display_order;
-- You should see exactly 8 rows.
-- ============================================================