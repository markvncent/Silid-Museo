-- ============================================================
-- Interactive Virtual Gallery — Database Schema
-- Run this in the Supabase SQL Editor (Phase 2 of workflow)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. CATEGORIES
-- The 8 fixed art medium "doors"
-- ============================================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_image_url text,
  medium_type text not null,           -- e.g. 'photography', 'music', 'video'
  display_order smallint not null,     -- controls order on landing page (1–8)
  expanded_description text,           -- detailed room description for CategoryPage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint categories_display_order_unique unique (display_order),
  constraint categories_display_order_range check (display_order between 1 and 8)
);

-- ============================================================
-- 2. ARTWORKS
-- Individual uploaded pieces within a category
-- ============================================================
create table artworks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  title text not null,
  description text,
  media_url text not null,             -- public URL from Supabase Storage
  media_type text not null,            -- 'image' | 'audio' | 'video' | 'text'
  thumbnail_url text,                  -- optional separate preview image (useful for audio/video)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint artworks_media_type_check
    check (media_type in ('image', 'audio', 'video', 'text'))
);

create index idx_artworks_category_id on artworks(category_id);

-- ============================================================
-- 3. RATINGS
-- Per-artwork star ratings (anonymous, no user accounts)
-- ============================================================
create table ratings (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks(id) on delete cascade,
  score smallint not null,
  voter_token text,                    -- optional: browser-generated id from useLocalVote hook
  created_at timestamptz not null default now(),

  constraint ratings_score_range check (score between 1 and 5)
);

create index idx_ratings_artwork_id on ratings(artwork_id);

-- Optional: prevent the same browser voting twice on the same artwork
-- (only useful if voter_token is populated consistently by the frontend)
create unique index idx_ratings_unique_voter_per_artwork
  on ratings(artwork_id, voter_token)
  where voter_token is not null;

-- ============================================================
-- 4. ARTWORK FEEDBACK
-- Comments tied to a specific artwork
-- ============================================================
create table artwork_feedback (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks(id) on delete cascade,
  comment_text text not null,
  created_at timestamptz not null default now(),

  constraint artwork_feedback_not_blank check (length(trim(comment_text)) > 0)
);

create index idx_artwork_feedback_artwork_id on artwork_feedback(artwork_id);

-- ============================================================
-- 5. CATEGORY FEEDBACK
-- General comments on a category page as a whole
-- ============================================================
create table category_feedback (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  comment_text text not null,
  created_at timestamptz not null default now(),

  constraint category_feedback_not_blank check (length(trim(comment_text)) > 0)
);

create index idx_category_feedback_category_id on category_feedback(category_id);

-- ============================================================
-- 6. HELPER VIEW — average rating per artwork
-- Lets the frontend fetch an artwork with its rating already
-- calculated instead of aggregating client-side
-- ============================================================
create view artwork_ratings_summary as
select
  artwork_id,
  round(avg(score)::numeric, 2) as average_rating,
  count(*) as rating_count
from ratings
group by artwork_id;

-- ============================================================
-- 7. AUTO-UPDATE updated_at TIMESTAMPS
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create trigger trg_artworks_updated_at
  before update on artworks
  for each row execute function set_updated_at();

-- ============================================================
-- NOTE: Row Level Security (RLS) is intentionally NOT enabled
-- here — that's handled in policies.sql (Phase 3 of workflow).
-- Do not skip that step before going live, or every table is
-- wide open to anonymous writes.
-- ============================================================