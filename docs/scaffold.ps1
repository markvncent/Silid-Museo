# Adapted for current project structure: the Vite React app is inside 'silid-museo'

$TargetDir = "silid-museo"

if (-not (Test-Path $TargetDir)) {
    Write-Error "Error: Target directory '$TargetDir' not found."
    exit 1
}

Write-Host "Creating scaffold inside '$TargetDir'..."

# Helper function to create directory and any missing parents
function New-Dir {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

# Helper function to create empty file if it doesn't exist
function New-File {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
    }
}

# Supabase schema/config folder
New-Dir "$TargetDir/supabase"
New-File "$TargetDir/supabase/schema.sql"
New-File "$TargetDir/supabase/policies.sql"
New-File "$TargetDir/supabase/seed.sql"
New-File "$TargetDir/.env.local"
New-File "$TargetDir/.env.example"

# src structure
New-Dir "$TargetDir/src/assets/fonts"
New-Dir "$TargetDir/src/lib"
New-Dir "$TargetDir/src/components/layout"
New-Dir "$TargetDir/src/components/landing"
New-Dir "$TargetDir/src/components/gallery"
New-Dir "$TargetDir/src/components/feedback"
New-Dir "$TargetDir/src/components/admin"
New-Dir "$TargetDir/src/pages"
New-Dir "$TargetDir/src/context"
New-Dir "$TargetDir/src/hooks"
New-Dir "$TargetDir/src/services"
New-Dir "$TargetDir/src/data"
New-Dir "$TargetDir/src/utils"
New-Dir "$TargetDir/src/styles"

New-File "$TargetDir/src/lib/supabase.js"

# Create component files
New-File "$TargetDir/src/components/layout/Navbar.jsx"
New-File "$TargetDir/src/components/layout/Footer.jsx"
New-File "$TargetDir/src/components/layout/Layout.jsx"
New-File "$TargetDir/src/components/landing/CategoryDoor.jsx"
New-File "$TargetDir/src/components/gallery/ArtworkCard.jsx"
New-File "$TargetDir/src/components/gallery/ArtworkModal.jsx"
New-File "$TargetDir/src/components/gallery/MediaPlayer.jsx"
New-File "$TargetDir/src/components/feedback/RatingStars.jsx"
New-File "$TargetDir/src/components/feedback/ArtworkFeedbackForm.jsx"
New-File "$TargetDir/src/components/feedback/CategoryFeedbackForm.jsx"
New-File "$TargetDir/src/components/admin/AdminGate.jsx"
New-File "$TargetDir/src/components/admin/AdminPanel.jsx"
New-File "$TargetDir/src/components/admin/ArtworkForm.jsx"
New-File "$TargetDir/src/components/admin/CategoryForm.jsx"
New-File "$TargetDir/src/components/admin/ModerationList.jsx"

# Create pages
New-File "$TargetDir/src/pages/HomePage.jsx"
New-File "$TargetDir/src/pages/CategoryPage.jsx"
New-File "$TargetDir/src/pages/AboutPage.jsx"
New-File "$TargetDir/src/pages/ContactPage.jsx"
New-File "$TargetDir/src/pages/AdminPage.jsx"

# Create context
New-File "$TargetDir/src/context/AdminContext.jsx"

# Create hooks
New-File "$TargetDir/src/hooks/useArtworks.js"
New-File "$TargetDir/src/hooks/useRating.js"
New-File "$TargetDir/src/hooks/useLocalVote.js"

# Create services
New-File "$TargetDir/src/services/categories.js"
New-File "$TargetDir/src/services/artworks.js"
New-File "$TargetDir/src/services/storage.js"
New-File "$TargetDir/src/services/ratings.js"
New-File "$TargetDir/src/services/feedback.js"
New-File "$TargetDir/src/services/admin.js"

# Create data configuration
New-File "$TargetDir/src/data/categoryConfig.js"

# Create utils
New-File "$TargetDir/src/utils/validators.js"
New-File "$TargetDir/src/utils/mediaType.js"

# Create styles
New-File "$TargetDir/src/styles/variables.css"
New-File "$TargetDir/src/styles/global.css"

# add .env.local to gitignore if not already present
$GitIgnorePath = "$TargetDir/.gitignore"
if (Test-Path $GitIgnorePath) {
    $Content = Get-Content $GitIgnorePath
    if ($Content -notcontains ".env.local") {
        Add-Content $GitIgnorePath "`n.env.local"
    }
}

Write-Host "Folder structure created under '$TargetDir' (Supabase-ready)."
