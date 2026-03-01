# Matt Simpson Photography — Technical Architecture

Last updated: March 1, 2026

This document is the complete reference for the Matt Simpson Photography website and custom CMS. It covers every file, every system, every integration, and every workflow. If you're an AI agent picking this up for the first time, this is everything you need.

---

## Overview

A Hugo static site hosted on Netlify, managed through a custom single-file HTML CMS (`site-manager.html`) that runs locally and commits directly to GitHub via the GitHub API. The site is a professional photography portfolio and business site for Matt Simpson, a commercial photographer based in Louisville, Kentucky.

**Live site:** https://mattsimpsonphoto.com (Netlify)
**Repo:** https://github.com/msimpson82/matt-simpson-photography (branch: `main`)
**CMS:** `site-manager.html` — runs from Desktop via `python3 -m http.server 8000` then accessed at `http://localhost:8000/site-manager.html`

---

## Key Accounts & URLs

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub | https://github.com/msimpson82/matt-simpson-photography | Source repo. CMS commits here via Personal Access Token |
| Netlify | https://app.netlify.com | Hosting. Auto-deploys on push to `main`. Builds with Hugo |
| Google Analytics (GA4) | https://analytics.google.com | Traffic analytics. Property ID stored in CMS localStorage |
| Google Cloud Console | https://console.cloud.google.com | OAuth 2.0 Client ID for GA4 + Search Console API access |
| Google Search Console | https://search.google.com/search-console | SEO performance data (impressions, clicks, position) |
| Anthropic Console | https://console.anthropic.com | API key for AI features (image renaming, alt text, captions, alert copy generation) |

### Authentication Flow

**GitHub:** User enters a Personal Access Token (PAT) on first login. Stored in `localStorage` as `msp_token`. All CMS operations (read, write, delete) go through the GitHub Contents API with this token.

**Google Analytics:** Uses OAuth 2.0 implicit flow. User provides GA4 Property ID and Google Cloud Client ID. The CMS loads the Google Identity Services library, requests `analytics.readonly` and `webmasters.readonly` scopes, and stores the token in memory (not persisted — re-auths each session).

**Anthropic:** User enters API key in the Analytics settings section. Stored in `localStorage` as `anthropic_key`. Used client-side with `anthropic-dangerous-direct-browser-access` header for vision API calls.

---

## Deployment Workflow

1. Matt makes changes in the CMS (edits content, uploads images, toggles settings)
2. CMS commits directly to GitHub via the Contents API
3. Netlify detects the push and triggers a Hugo build
4. Site is live in ~60 seconds

### Manual Deploy (for site file changes like templates, CSS, JS)

```bash
cd ~/matt-simpson-photography
git pull origin main
unzip -o ~/Downloads/[filename].zip
git add . && git commit -m "description" && git push origin main
```

---

## File Structure

### Hugo Data Files (`data/`)

These JSON files drive the site content. The CMS reads and writes them via GitHub API.

#### `data/homepage.json`
Controls all editable text on the homepage. Schema:

```json
{
  "hero": {
    "eyebrow": "Louisville, KY Photographer",
    "heading_pre": "Professional ",
    "heading_serif": "headshots,",
    "heading_post": " event coverage, and commercial photography...",
    "paragraph": "I'm Matt Simpson...",
    "button_primary": "Book a Session",
    "button_secondary": "See the Work"
  },
  "statement": {
    "bold": "Bold, professional, and built for business.",
    "text": "My photography shows up on company websites..."
  },
  "about": {
    "photo": "/images/matt-simpson-photographer-louisville-ky.jpg",
    "photo_alt": "Matt Simpson — professional photographer...",
    "label": "About the Photographer",
    "heading_pre": "Who's Behind ",
    "heading_serif": "the Camera",
    "paragraph_1": "I'm Matt Simpson, a commercial photographer...",
    "paragraph_2": "My studio is in the Germantown neighborhood... (supports HTML like <strong>)",
    "button": "More About Me"
  },
  "contact": {
    "label": "Book a Louisville Photographer",
    "heading": "Let's Get to Work.",
    "paragraph": "Ready to book a headshot session..."
  }
}
```

#### `data/alert.json`
Controls the site-wide banner ribbon and lightbox popup. Only one alert config is active at a time (tied to a single blog post).

```json
{
  "banner": {
    "active": true,
    "message": "New work just dropped from Taste of Louisville",
    "cta_text": "See the Photos →",
    "url": "/blog/taste-of-louisville/",
    "post_slug": "taste-of-louisville"
  },
  "lightbox": {
    "active": true,
    "message": "I just posted 50+ photos from Taste of Louisville. Come check them out.",
    "cta_text": "Take Me There",
    "url": "/blog/taste-of-louisville/",
    "image": "/images/blog/taste-of-louisville.jpg",
    "post_slug": "taste-of-louisville",
    "scroll_trigger": 40
  }
}
```

#### `data/galleries/hero.json`
Controls the scrolling mosaic hero on the homepage.

```json
{
  "columns": 3,
  "opacity": 0.85,
  "images": [
    {
      "filename": "example.jpg",
      "path": "/images/headshots/"
    }
  ]
}
```

- `columns`: 2-5, how many scrolling columns in the hero
- `opacity`: 0-1, the white wash overlay (0 = fully visible images, 1 = solid white)
- `images`: array of image objects with `filename` and `path`

#### `data/galleries/headshots.json`, `events.json`, `commercial.json`
Gallery data for service pages. Schema:

```json
{
  "display_count": 8,
  "images": [
    {
      "filename": "headshot-executive-man-gray-suit-louisville.jpg",
      "alt": "Executive headshot in gray suit",
      "order": 1,
      "active": true
    }
  ]
}
```

### Hugo Templates (`layouts/`)

| File | Purpose |
|------|---------|
| `layouts/index.html` | Homepage. Reads from `homepage.json`, `hero.json`. All sections are data-driven |
| `layouts/_default/baseof.html` | Base template. Includes nav, footer, CSS imports, JS scripts, alerts partial |
| `layouts/_default/single.html` | Default single page layout |
| `layouts/_default/headshots.html` | Headshots service page |
| `layouts/_default/events.html` | Events service page |
| `layouts/_default/commercial.html` | Commercial service page |
| `layouts/blog/list.html` | Blog index page |
| `layouts/blog/single.html` | Individual blog post |
| `layouts/potd/list.html` | Photo of the Day index |
| `layouts/projects/single.html` | Individual project page |
| `layouts/about.html` | About page |
| `layouts/partials/alerts.html` | Banner ribbon + lightbox popup (reads from `alert.json`) |
| `layouts/shortcodes/gallery.html` | Blog gallery wrapper shortcode |
| `layouts/shortcodes/gallery-img.html` | Individual gallery image shortcode |

### CSS (`static/css/`)

Main entry point is `styles.css` which imports everything:

```
base.css          → Variables, resets, typography
navigation.css    → Header, nav, mobile menu
hero.css          → Scrolling mosaic hero
statement.css     → Bold statement section
services.css      → Services grid
portfolio.css     → Portfolio/project cards
potd.css          → Photo of the Day
contact.css       → Contact form
footer.css        → Footer
headshots.css     → Headshots page
events.css        → Events page
commercial.css    → Commercial page
lightbox.css      → Image lightbox overlay
blog-gallery.css  → Blog post gallery (grid/masonry/carousel)
alerts.css        → Banner ribbon + lightbox popup
pages.css         → Page-specific styles
content.css       → Content pages
utilities.css     → Utility classes
```

**CSS Variables** (defined in `base.css`):
- `--teal` / `--t`: `#4a9e8e` — primary brand color
- `--d`: dark text color
- `--teal-soft`: light teal background for badges/highlights
- Background: `#faf8f5` (warm off-white)

### JavaScript (`static/js/`)

| File | Purpose |
|------|---------|
| `alerts.js` | Banner + lightbox display logic, session tracking, GA4 conversion events |
| `blog-gallery.js` | Blog post gallery lightbox (click to fullscreen, arrow nav, keyboard nav) |

### Content (`content/`)

| Path | Purpose |
|------|---------|
| `content/blog/*.md` | Blog posts. Front matter: title, date, description, image, tags, body_class |
| `content/potd/*.md` | Photo of the Day posts. Front matter: title, date, image, featured, body_class |
| `content/projects/*.md` | Featured project pages |
| `content/headshots.md` | Headshots page content |
| `content/events.md` | Events page content |
| `content/commercial.md` | Commercial page content |

### Blog Post Front Matter

```yaml
---
title: "Taste of Louisville 2025 — Event & Food Photography"
date: 2025-12-15
description: "Event and food photography from Taste of Louisville 2025..."
image: "taste-of-louisville.jpg"
tags: ["event photography", "food photography", "Louisville"]
body_class: "page-blog"
---
```

The `image` field is the hero image filename (lives in `/images/blog/`). The gallery shortcode is appended at the end of the markdown body.

### Blog Gallery Shortcode Format

```
{{< gallery layout="grid" columns="3" >}}
{{< gallery-img src="/images/blog/photo.jpg" alt="description" caption="caption text" >}}
{{< gallery-img src="/images/blog/photo2.jpg" alt="description" caption="caption text" >}}
{{< /gallery >}}
```

Layouts: `grid` (square thumbnails), `masonry` (natural heights), `carousel` (horizontal scroll).

---

## CMS — site-manager.html

A single self-contained HTML file with embedded CSS and JavaScript. No build step, no dependencies. Runs locally on any machine with Python 3 (for the local server).

### Launching

```bash
cd ~/Desktop
python3 -m http.server 8000
# Open http://localhost:8000/site-manager.html
```

### CMS Sidebar Sections

| Section | ID | Purpose |
|---------|-----|---------|
| 🏠 Edit Homepage | `homepage` | WYSIWYG editor for all homepage sections (hero, statement, about photo/bio, contact) |
| 📷 Photo of the Day | `potd` | Upload, caption, publish POTD posts. Toggle featured |
| ✍️ Blog | `blog` | Full blog editor with WYSIWYG, gallery builder, SEO, alerts |
| 📁 Projects | `proj` | Create/edit featured project pages |
| 🖼️ Hero Scroller | `hero` | Manage hero mosaic images, columns, opacity |
| 👤 Headshots | `gh` | Manage headshots gallery |
| 🎪 Events | `ge` | Manage events gallery |
| 🏢 Commercial | `gc` | Manage commercial gallery |
| 📊 Analytics | `analytics` | GA4 dashboard, Search Console, SEO rank tracker |

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `msp_token` | GitHub Personal Access Token |
| `ga_prop` | GA4 Property ID |
| `ga_cid` | Google Cloud OAuth Client ID |
| `anthropic_key` | Anthropic API key for AI features |
| `seo_snapshots` | Historical SEO keyword ranking data (JSON array) |

### GitHub API Config

```javascript
const O = "msimpson82";    // GitHub owner
const R = "matt-simpson-photography";  // repo name
const B = "main";          // branch
```

All API calls use `https://api.github.com/repos/{O}/{R}/contents/{path}` with the PAT as Bearer token.

### Blog Editor Features

**WYSIWYG Editor:** Rich text toolbar (bold, italic, H2, H3, link, image, list, blockquote, HR, code). Toggle to HTML source view. Outputs markdown via `getEditorMD()`.

**Gallery Builder:**
- Layout selector: Grid, Masonry, Carousel
- Column selector: 2, 3, 4, 5
- Image browser: fetches thumbnails from GitHub folders (Images, Blog, POTD, Projects)
- Multi-file upload with drag-drop reorder
- Edit modal for alt text and caption per image
- 🤖 AI Rename toggle: sends each image to Claude vision API to generate SEO-friendly filename, alt text, and caption automatically
- Outputs `{{< gallery >}}` shortcode markdown

**Promote This Post (Alert System):**
- Banner Ribbon toggle + message + CTA text fields
- Lightbox Popup toggle + message + CTA + scroll trigger %
- 🤖 Generate with AI button for each (writes copy based on post title)
- Conversion stats display (impressions, clicks, CTR)
- Saves to `data/alert.json` on publish/update

**Edit Mode:**
- Click Edit on existing post → loads all fields, gallery, and alert config
- Update Post saves in place (stays in editor for continued editing)
- Done Editing button clears back to new post

### Homepage Editor

Four collapsible accordion sections:
1. **Hero** — eyebrow, heading (split into pre/serif/post for italic control), paragraph, button labels
2. **Statement** — bold lead-in, supporting text
3. **Who's Behind the Camera** — photo upload with preview, alt text, label, heading, two paragraphs, button text
4. **Contact** — label, heading, paragraph

Saves to `data/homepage.json`. Hugo template reads from this data file.

### Gallery Manager (Headshots, Events, Commercial)

- Thumbnail grid loaded from GitHub
- Drag-drop reorder
- Edit modal (alt text, order, active toggle)
- Upload new images
- Toggle active/inactive per image
- Display count control

### Hero Scroller Manager

- Visual image browser with folder tabs
- Column count selector (2-5) with live preview labels
- Opacity slider (0-1) with percentage badge
- Add/remove images from mosaic
- Saves to `data/galleries/hero.json`

### Analytics Dashboard

**GA4 Integration:**
- Period selector: 7d, 14d, 28d, 90d
- Metrics: sessions, users, page views, avg engagement time
- Traffic chart (Chart.js line graph)
- Top pages table
- Traffic sources table

**Search Console Integration:**
- Top queries with clicks, impressions, CTR, position
- Sortable columns

**SEO Rank Tracker:**
- Add target keywords
- Track Google Search Console position over time
- Snapshot history with date comparison
- Position change indicators (↑ green, ↓ red)

---

## Alert System

### Banner Ribbon
- Fixed to top of page, dark charcoal background
- Teal "New" badge + message + CTA link with animated arrow
- Slides down on load (CSS animation), slides up on dismiss
- Uses `sessionStorage` per post slug — shows once per browser session
- Push body content down with `body.has-alert-banner` class

### Lightbox Popup
- Triggers on scroll past configurable threshold (5-90%, default 40%)
- Full backdrop blur overlay
- Card with hero image (fading into white), "📸 Fresh Work" badge, message, teal CTA button
- "No, thanks!" dismiss link below CTA
- Clicking CTA dismisses before navigating (prevents re-trigger on blog page)
- Uses `sessionStorage` per post slug

### Conversion Tracking
Both alert types fire GA4 custom events:
- `alert_impression` — when alert is shown (type + slug)
- `alert_click` — when CTA is clicked (type + slug)
- Also tracked in localStorage for CMS stats display

View in GA4: Events → alert_impression, alert_click. Filter by `alert_type` and `post_slug` dimensions.

---

## AI Integrations

All AI features use the Anthropic Messages API client-side.

**Endpoint:** `https://api.anthropic.com/v1/messages`
**Model:** `claude-sonnet-4-20250514`
**Headers:** `x-api-key`, `anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true`

### Image Rename + Alt Text + Caption (Gallery Upload)

When 🤖 AI Rename is checked, each uploaded image is:
1. Converted to base64
2. Sent to Claude vision with the blog post title for context
3. Claude returns: SEO-friendly kebab-case filename, alt text (under 120 chars), caption (under 100 chars)
4. Image is committed to GitHub with the AI-generated filename
5. Alt text and caption are pre-filled in the gallery builder

### Alert Copy Generation

🤖 Generate with AI button in the Promote section:
- Banner: generates short punchy message (under 80 chars) + CTA label (2-4 words)
- Lightbox: generates 1-2 sentence message (under 150 chars) + CTA label
- Uses post title as context

---

## Design System

**Fonts:** Plus Jakarta Sans (primary), serif accent font for italic headings
**Colors:**
- Teal: `#4a9e8e` (primary brand, buttons, accents)
- Dark: `#1a1a1a` (text, headings)
- Background: `#faf8f5` (warm off-white)
- Cards: white with `#e8e4df` borders

**CMS UI Patterns:**
- Cards: white bg, 12px border-radius, 1px `#e8e4df` border
- Buttons: `.bt-f` (filled teal), `.bt-o` (outlined), `.bt-s` (small)
- Inputs: `.ip` class, clean borders
- Section headers: uppercase, letter-spaced, 9px
- Accordions: `.hp-section` with `.hp-section-head` toggle
- Drag-drop: `.dragging` opacity, `.drag-over` teal top border
- Status messages: `msg(id, text, isError)` helper

**Matt's writing voice:** Casual, direct, no em dashes, first-person, conversational. Prefers minimal editorial changes that preserve his natural tone. Not salesy — confident and authentic.

---

## Common Operations

### Add a new blog post
1. Open CMS → Blog → New tab
2. Fill title, date, slug, description, tags
3. Upload hero image (drag-drop)
4. Write content in WYSIWYG editor
5. Add gallery images (browse folders or upload with AI rename)
6. Optionally enable Banner Ribbon and/or Lightbox Popup under Promote
7. Click Publish

### Update an existing blog post
1. Open CMS → Blog → Posts tab
2. Click Edit on the post
3. Make changes (content stays loaded after saving)
4. Click Update Post
5. Click Done Editing when finished

### Change the homepage photo
1. Open CMS → Edit Homepage
2. Expand "Who's Behind the Camera"
3. Click Upload new photo
4. Update alt text if needed
5. Click Save & Deploy Homepage

### Turn off blog alerts
1. Open CMS → Blog → Posts tab
2. Click Edit on the post with active alerts
3. Scroll to Promote This Post
4. Uncheck Active on both Banner and Lightbox
5. Click Update Post

### Add images to hero scroller
1. Open CMS → Hero Scroller
2. Click folder tabs to browse images
3. Click thumbnails to select (teal border + ✓)
4. Click Add & Deploy
5. Adjust columns and opacity as needed

---

## Troubleshooting

**CMS won't load / blank screen:** Make sure `python3 -m http.server 8000` is running from the Desktop directory. Open `http://localhost:8000/site-manager.html`.

**GitHub auth fails:** Token may have expired. Generate a new PAT at https://github.com/settings/tokens. Needs `repo` scope.

**AI features don't work:** Check that the Anthropic API key is saved in Analytics settings. Get a key at https://console.anthropic.com → API Keys.

**GA4 not connecting:** Verify Property ID and Client ID. Client ID must be from a Google Cloud project with the Analytics Data API enabled. Authorized origins must include where the CMS is served from.

**Site not updating after push:** Check Netlify deploy status at https://app.netlify.com. Hugo build errors will show in the deploy log.

**Gallery images not showing:** Images must be committed to `static/images/blog/` (or appropriate subfolder). GitHub raw URL caching can delay display — wait 1-2 minutes.

---

## Future / Planned

- **HeyGen integration:** AI video avatar for blog post announcements. Matt is setting up a HeyGen account. Plan is to add a script field in the blog editor that generates a video on publish.
- **CMS hosted version:** Potentially move CMS from local file to a hosted solution for easier access across devices.
