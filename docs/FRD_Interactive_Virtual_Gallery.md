# Functional Requirements Document (FRD)
## Interactive Virtual Gallery Website

**Document Version:** 1.0
**Date:** July 3, 2026
**Prepared by:** Mark Vincent D. Limpahan

---
## 1. Introduction

### 1.1 Purpose
This document defines the functional requirements for the **Interactive Virtual Gallery Website**, a portfolio-style web application that showcases multiple art mediums organized into distinct categories. The system allows visitors to browse, view, and rate artworks, while giving a content owner (admin) a simple, password-gated way to manage uploaded content.

### 1.2 Scope
The system is a single web application composed of:
- A **public-facing gallery** with a landing page, 7 category "doors," expandable artwork views, and feedback/rating mechanisms.
- A **lightweight admin interface** (code/password-gated, no user accounts) for managing categories and artworks.

The system does **not** include multi-user account registration, e-commerce/checkout functionality, or social sharing integrations unless later added as an extension.

### 1.3 Intended Audience
Instructor/evaluator, project adviser, and the developer (for implementation reference).

### 1.4 Definitions
| Term | Definition |
|---|---|
| Category | One of the 7 sections representing an art medium (e.g., Photography, Music, Film/Video) |
| Artwork/Art Piece | An individual uploaded item (image, audio, video, etc.) within a category |
| Admin Mode | A restricted state of the site unlocked via a code/password, allowing content edits |
| Visitor | Any unauthenticated user browsing the public gallery |

---

## 2. System Overview

The website behaves like a **digital gallery/portfolio**. The landing page introduces the gallery and presents 7 categories, visually represented as doors or shelves. Selecting a category "opens" into a dedicated page listing the artworks under that medium. Each artwork can be expanded for a closer view and rated individually. Each category page also collects general feedback about that category as a whole. An admin, using a simple code, can add/edit/delete categories and artworks directly from the interface.

---

## 3. User Roles

| Role | Description | Access Level |
|---|---|---|
| Visitor | General public browsing the gallery | Read-only, can rate/give feedback |
| Admin | Content owner managing the gallery | Full CRUD on categories & artworks, unlocked via code/password |

> Note: Admin access is **not** account-based. It is a single shared code/password that toggles an "edit mode" on the site (e.g., similar to a hidden settings panel unlocked by entering a passphrase).

---

## 4. Functional Requirements

Requirements are grouped by module. Each has an ID, description, and priority (**M**ust-have, **S**hould-have, **C**ould-have).

### 4.1 Landing Page & Global Navigation

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | The system shall display a landing/home page featuring the gallery's title, introduction/artist statement, and a call-to-action to explore categories. | M |
| FR-1.2 | The system shall display a persistent navigation bar with links to Home, Categories/Gallery, About, and Contact (or equivalent portfolio sections). | M |
| FR-1.3 | The system shall display a footer containing contact details, social/portfolio links, and copyright information. | M |
| FR-1.4 | The landing page shall visually present the 7 categories as interactive elements (doors/shelves) that respond to hover/click with a transition effect (e.g., opening animation). | S |
| FR-1.5 | The navigation shall remain accessible/responsive across desktop and mobile viewports. | M |

### 4.2 Category (Art Medium) Pages

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | The system shall support exactly 7 predefined categories, each representing a distinct art medium (e.g., Photography, Digital Art, Music/Audio, Film/Video, Writing/Poetry, Sculpture/3D, Traditional/Painting, Mixed Media). | M |
| FR-2.2 | Selecting a category from the landing page shall navigate the visitor to a dedicated category page displaying all artworks under that medium. | M |
| FR-2.3 | Each category page shall display the category name, short description, and a grid/list of uploaded artworks. | M |
| FR-2.4 | Each category page shall support multiple media types appropriate to that category (image files, audio files, video files, text/PDF, etc.). | M |
| FR-2.2 | Each category page shall include a category-level feedback section (see FR-4.x) separate from individual artwork ratings. | M |

### 4.3 Artwork Display & Interaction

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Each artwork shall be displayed as a thumbnail/preview card within its category page. | M |
| FR-3.2 | Clicking/tapping an artwork card shall expand it into a larger, focused view (modal or dedicated view) showing full media, title, description, medium tags, and upload date. | M |
| FR-3.3 | The expanded view shall support the correct playback/display method per media type (image viewer, audio player, video player, text reader). | M |
| FR-3.4 | The expanded view shall allow the visitor to close/return to the category grid without a full page reload. | S |
| FR-3.5 | The expanded view shall display the artwork's current average rating and rating count. | M |

### 4.4 Rating & Feedback System

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | The system shall allow a visitor to submit a rating (e.g., 1–5 stars) for an individual artwork from its expanded view. | M |
| FR-4.2 | The system shall calculate and display the average rating per artwork after each submission. | M |
| FR-4.3 | The system shall allow a visitor to submit written feedback/comments for an individual artwork (optional field alongside the rating). | S |
| FR-4.4 | The system shall allow a visitor to submit general feedback/comments for the category page as a whole (not tied to a single artwork). | M |
| FR-4.5 | The system shall prevent empty/blank submissions and validate rating input range. | M |
| FR-4.6 | The system should apply basic spam/abuse protection on feedback submission (e.g., simple rate limiting or input sanitization). | C |
| FR-4.7 | The system shall persist ratings and feedback so they remain visible on subsequent visits (not just client-side/session only). | M |

### 4.5 Admin (Content Management) Module

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | The system shall provide a hidden/accessible entry point (e.g., an admin route or a discreet button) that prompts for a single access code/password. | M |
| FR-5.2 | The system shall grant "edit mode" access only when the correct code/password is entered; no user registration, login accounts, or personal credentials are required. | M |
| FR-5.3 | While in edit mode, the admin shall be able to add a new artwork to a category (upload file, title, description, medium tag). | M |
| FR-5.4 | While in edit mode, the admin shall be able to edit an existing artwork's details or replace its media file. | M |
| FR-5.5 | While in edit mode, the admin shall be able to delete an artwork from a category. | M |
| FR-5.6 | While in edit mode, the admin shall be able to edit category-level content (name, description, cover image). | S |
| FR-5.7 | While in edit mode, the admin shall be able to moderate (view/delete) submitted ratings or feedback comments deemed inappropriate. | S |
| FR-5.8 | The system shall allow the admin to exit edit mode (log out of the code-gated session) at any time. | M |
| FR-5.9 | The access code/password shall not be visibly exposed in client-side source code or network requests in plaintext. | M |

### 4.6 Portfolio-Standard Pages

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | The system shall include an "About" page describing the artist/curator behind the gallery. | S |
| FR-6.2 | The system shall include a "Contact" page or section with a contact form or contact details. | S |
| FR-6.3 | The system shall maintain consistent branding (typography, color palette, logo) across all pages. | M |

---

## 5. Use Case Summary

| Use Case | Actor | Description |
|---|---|---|
| UC-01 | Visitor | Browse landing page and select a category |
| UC-02 | Visitor | View artworks within a category |
| UC-03 | Visitor | Expand an artwork for detailed viewing |
| UC-04 | Visitor | Rate and/or comment on an individual artwork |
| UC-05 | Visitor | Submit general feedback on a category page |
| UC-06 | Admin | Enter access code to unlock edit mode |
| UC-07 | Admin | Add/edit/delete an artwork |
| UC-08 | Admin | Edit category details |
| UC-09 | Admin | Moderate feedback/ratings |

---

## 6. Data Requirements (High-Level Entities)

| Entity | Key Attributes |
|---|---|
| Category | id, name, description, cover_image, medium_type |
| Artwork | id, category_id, title, description, media_file/url, media_type, upload_date, average_rating |
| Rating | id, artwork_id, score, timestamp |
| ArtworkFeedback | id, artwork_id, comment_text, timestamp |
| CategoryFeedback | id, category_id, comment_text, timestamp |
| AdminSession | access_code_hash, session_token, expiry |

> Note: Since there is no account authentication, ratings/feedback will not be tied to a user identity — consider basic safeguards (e.g., one rating per artwork per browser session, via localStorage or a session cookie) to reduce duplicate submissions.

---

## 7. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | The website shall be responsive across desktop, tablet, and mobile screen sizes. |
| NFR-2 | Media (images/audio/video) shall load with reasonable performance (e.g., lazy-loading for gallery grids). |
| NFR-3 | The admin access code shall be stored securely (hashed) rather than in plain text, even for a simple implementation. |
| NFR-4 | The interface shall follow consistent visual design to preserve the "portfolio" feel (clean typography, whitespace, cohesive color scheme). |
| NFR-5 | The system shall gracefully handle unsupported file types with a clear error message. |
| NFR-6 | Category/artwork data changes made by the admin shall reflect on the public gallery without requiring a manual redeploy (e.g., backed by a database or CMS-like storage). |

---

## 8. Assumptions and Constraints

- The 7 categories are fixed in structure (the admin can edit their content/labels but the system is designed around 8 slots, per the project requirement).
- No third-party authentication (Google/Facebook login, etc.) is required — access control for admin is a single shared code.
- Ratings and feedback are anonymous; no user profiles are created or stored.
- File storage approach (local server storage vs. cloud storage/CDN) is an implementation decision outside the scope of this FRD.

---

## 9. Out of Scope

- Multi-admin accounts with different permission levels
- Payment or art sales/checkout functionality
- Social media authentication or sharing APIs
- Real-time chat or messaging between visitors and admin

---

*End of Document*
