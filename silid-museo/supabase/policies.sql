-- ============================================================
-- Interactive Virtual Gallery — Row Level Security Policies
-- Run this AFTER schema.sql, in the Supabase SQL Editor
-- (Phase 3 of workflow)
--
-- Model: no user accounts exist, so "public" below effectively
-- means "anyone using the anon key" — i.e. every visitor to
-- the site. Admin writes (add/edit/delete categories & artworks)
-- happen through an Edge Function using the SERVICE ROLE key,
-- which bypasses RLS entirely — so no "admin policy" is written
-- here for those tables on purpose.
-- ============================================================

-- ============================================================
-- 1. CATEGORIES
-- Visitors: read-only
-- No public insert/update/delete — admin writes go through the
-- service role key in the Edge Function, which bypasses RLS.
-- ============================================================
alter table categories enable row level security;

create policy "Public can read categories"
  on categories
  for select
  using (true);

-- ============================================================
-- 2. ARTWORKS
-- Same pattern: public read, no public write.
-- ============================================================
alter table artworks enable row level security;

create policy "Public can read artworks"
  on artworks
  for select
  using (true);

-- ============================================================
-- 3. RATINGS
-- Visitors: can read (to show averages/counts) and insert
-- (submit a rating). No update/delete — a rating, once cast,
-- is immutable from the visitor's side. Admin moderation
-- (deleting an abusive rating) goes through the service role key.
-- ============================================================
alter table ratings enable row level security;

create policy "Public can read ratings"
  on ratings
  for select
  using (true);

create policy "Public can submit a rating"
  on ratings
  for insert
  with check (
    score between 1 and 5
  );

-- ============================================================
-- 4. ARTWORK FEEDBACK
-- Visitors: can read and insert. No update/delete from the
-- public side — moderation is an admin-only action.
-- ============================================================
alter table artwork_feedback enable row level security;

create policy "Public can read artwork feedback"
  on artwork_feedback
  for select
  using (true);

create policy "Public can submit artwork feedback"
  on artwork_feedback
  for insert
  with check (
    length(trim(comment_text)) > 0
  );

-- ============================================================
-- 5. CATEGORY FEEDBACK
-- Same pattern as artwork feedback.
-- ============================================================
alter table category_feedback enable row level security;

create policy "Public can read category feedback"
  on category_feedback
  for select
  using (true);

create policy "Public can submit category feedback"
  on category_feedback
  for insert
  with check (
    length(trim(comment_text)) > 0
  );

-- ============================================================
-- VERIFY: after running this, test from the browser console
-- using your anon key client:
--
--   await supabase.from('artworks').select('*')        -> should succeed
--   await supabase.from('artworks').insert({...})       -> should FAIL
--   await supabase.from('ratings').insert({score: 5, artwork_id: '...'}) -> should succeed
--   await supabase.from('ratings').update({score: 1}).eq('id', '...')    -> should FAIL
--
-- If any of the "should FAIL" calls succeed instead, double
-- check that RLS is actually enabled on that table (Supabase
-- Table Editor -> table -> RLS toggle) and that no overly
-- permissive policy was left over from earlier testing.
-- ============================================================