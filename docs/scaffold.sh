#!/bin/bash
# Adapted for current project structure: the Vite React app is inside 'silid-museo'

TARGET_DIR="silid-museo"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Target directory '$TARGET_DIR' not found."
  exit 1
fi

echo "Creating scaffold inside '$TARGET_DIR'..."

# Supabase schema/config folder
mkdir -p "$TARGET_DIR/supabase"
touch "$TARGET_DIR/supabase/schema.sql" "$TARGET_DIR/supabase/policies.sql" "$TARGET_DIR/supabase/seed.sql"
touch "$TARGET_DIR/.env.local" "$TARGET_DIR/.env.example"

# src structure
mkdir -p "$TARGET_DIR/src/assets/fonts"
mkdir -p "$TARGET_DIR/src/lib"
mkdir -p "$TARGET_DIR/src/components/layout" "$TARGET_DIR/src/components/landing" "$TARGET_DIR/src/components/gallery"
mkdir -p "$TARGET_DIR/src/components/feedback" "$TARGET_DIR/src/components/admin"
mkdir -p "$TARGET_DIR/src/pages" "$TARGET_DIR/src/context" "$TARGET_DIR/src/hooks" "$TARGET_DIR/src/services" "$TARGET_DIR/src/data" "$TARGET_DIR/src/utils" "$TARGET_DIR/src/styles"

touch "$TARGET_DIR/src/lib/supabase.js"

# Create component files
touch "$TARGET_DIR/src/components/layout/Navbar.jsx" "$TARGET_DIR/src/components/layout/Footer.jsx" "$TARGET_DIR/src/components/layout/Layout.jsx"
touch "$TARGET_DIR/src/components/landing/CategoryDoor.jsx"
touch "$TARGET_DIR/src/components/gallery/ArtworkCard.jsx" "$TARGET_DIR/src/components/gallery/ArtworkModal.jsx" "$TARGET_DIR/src/components/gallery/MediaPlayer.jsx"
touch "$TARGET_DIR/src/components/feedback/RatingStars.jsx" "$TARGET_DIR/src/components/feedback/ArtworkFeedbackForm.jsx" "$TARGET_DIR/src/components/feedback/CategoryFeedbackForm.jsx"
touch "$TARGET_DIR/src/components/admin/AdminGate.jsx" "$TARGET_DIR/src/components/admin/AdminPanel.jsx" "$TARGET_DIR/src/components/admin/ArtworkForm.jsx" "$TARGET_DIR/src/components/admin/CategoryForm.jsx" "$TARGET_DIR/src/components/admin/ModerationList.jsx"

touch "$TARGET_DIR/src/pages/HomePage.jsx" "$TARGET_DIR/src/pages/CategoryPage.jsx" "$TARGET_DIR/src/pages/AboutPage.jsx" "$TARGET_DIR/src/pages/ContactPage.jsx" "$TARGET_DIR/src/pages/AdminPage.jsx"

touch "$TARGET_DIR/src/context/AdminContext.jsx"

touch "$TARGET_DIR/src/hooks/useArtworks.js" "$TARGET_DIR/src/hooks/useRating.js" "$TARGET_DIR/src/hooks/useLocalVote.js"

touch "$TARGET_DIR/src/services/categories.js" "$TARGET_DIR/src/services/artworks.js" "$TARGET_DIR/src/services/storage.js" "$TARGET_DIR/src/services/ratings.js" "$TARGET_DIR/src/services/feedback.js" "$TARGET_DIR/src/services/admin.js"

touch "$TARGET_DIR/src/data/categoryConfig.js"

touch "$TARGET_DIR/src/utils/validators.js" "$TARGET_DIR/src/utils/mediaType.js"

touch "$TARGET_DIR/src/styles/variables.css" "$TARGET_DIR/src/styles/global.css"

# add .env.local to gitignore if not already present
if [ -f "$TARGET_DIR/.gitignore" ]; then
  grep -qxF '.env.local' "$TARGET_DIR/.gitignore" || echo '.env.local' >> "$TARGET_DIR/.gitignore"
fi

echo "Folder structure created under '$TARGET_DIR' (Supabase-ready)."
