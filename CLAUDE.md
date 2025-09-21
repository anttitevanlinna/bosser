# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Bosser - LinkedIn Article Showcase & Newsletter Automation

A professional article showcase site with Chrome extension for LinkedIn automation and animated newsletter covers.

## Project Architecture

### Core Components

**Frontend Site** (`/docs/`)
- Static GitHub Pages site showcasing articles
- Interactive particle animation system that morphs between shapes (cloud → constellation → arrow)
- Article filtering system with hover-based category filtering
- Responsive grid layout with search functionality

**Chrome Extension** (`/chrome-extension/`)
- LinkedIn automation for article content extraction
- Background service worker with content script injection
- Dynamic executor for article processing and data extraction
- Session persistence and logging system

**Article Processing Pipeline** (`/scripts/`)
- Newsletter preparation and publishing workflows
- Article synchronization from scraped data to site
- Animated cover generation for social media
- Video recording capabilities for cover animations

**Utility Modules** (`/utils/`, `/config/`)
- Shared text processing, date formatting, and file utilities
- LinkedIn selector configurations for consistent scraping
- Content reading time calculations

### Data Flow

1. **Chrome Extension** → Extracts LinkedIn articles → `temp/` storage
2. **Sync Scripts** → Processes raw data → `data/articles_index.json`
3. **Site JavaScript** → Loads article data → Dynamic category filtering
4. **Cover Generation** → Creates animated covers → `covers/` directory

## Development Commands

### Local Testing
```bash
# Quick local server
npm run test-local
# or manually:
cd docs && python3 -m http.server 8080
```

### Article Management
```bash
# Create new article from markdown draft
node scripts/prepare-newsletter.js <draft-name>

# Sync scraped articles to site data
npm run sync-articles

# Generate animated cover only
npm run generate-cover

# (Note: Video recording disabled - use browser plugin for LinkedIn)
```

## Article Creation Workflow

### Creating a New Article

The project supports creating new articles from markdown drafts with automated processing and site integration:

#### 1. Draft Creation
Create a markdown file in `/drafts/` directory with frontmatter:

```markdown
---
title: "Your Article Title"
slug: "your-article-slug"
author: "Antti Tevanlinna"
created_at: "2025-09-21"
tags: ["strategy", "leadership", "ai"]
newsletter: false
estimated_reading_time: "5 min"
---

# Your Article Title

Your article content here in markdown format...
```

#### 2. Article Processing
Run the newsletter preparation script:

```bash
node scripts/prepare-newsletter.js your-draft-name
```

This automated process will:
- Parse markdown frontmatter and content
- Generate HTML from markdown (removing duplicate H1 headers)
- Create animated cover HTML for social media
- Generate article data JSON with metadata
- Update the articles index with tags for category filtering
- Create responsive article page matching site structure
- Copy data to docs directory for GitHub Pages deployment

#### 3. Cover Generation & Social Media
- Animated cover HTML generated in `/covers/cover.html`
- Open the cover file in browser to record video using browser plugin
- Use recorded video for LinkedIn and other social media posts

#### 4. Publishing Workflow
**Browser Plugin Approach** (Recommended):
1. Review generated article at: `https://anttitevanlinna.github.io/bosser/articles/your-slug.html`
2. Open `/covers/cover.html` in browser
3. Use browser plugin to record cover animation video
4. Use browser plugin to publish to LinkedIn with recorded cover
5. Deploy to site via git commit and push

**Note**: Playwright automation for LinkedIn publishing was removed due to compatibility issues. The browser plugin approach provides more reliable LinkedIn publishing while maintaining the excellent cover generation system.

#### 5. Article Structure & Requirements
- **Tags**: Essential for category filtering system - ensure all articles have relevant tags
- **Content Length**: Automatically calculated for reading time estimation
- **Slug Generation**: Auto-generated from title if not provided in frontmatter
- **HTML Template**: Matches current site structure with navigation, meta tags, and footer
- **Responsive Design**: Articles automatically inherit site's responsive CSS framework

#### 6. Data Flow Integration
```
Draft Markdown → Processing Script → Article JSON → Site Index → GitHub Pages
                                ↓
                        Animated Cover HTML → Browser Plugin → LinkedIn
```

The system maintains article metadata in `/data/articles_index.json` and copies to `/docs/data/` for the live site, ensuring category filtering and article discovery work correctly.

### Server Operations
```bash
# Start log server for extension debugging
npm run log-server
```

## Key Architecture Patterns

### Article System (`/docs/js/articles.js`)
- Loads articles from JSON index at runtime
- Extracts categories dynamically from article tags
- Implements hover-based filtering with debounced timeouts
- Handles smooth transitions between filtered states
- Supports pagination and search functionality

### Particle Animation (`/docs/js/particle-animation.js`)
- Morphs between symbolic shapes representing business concepts
- Uses parametric shape definitions for precise positioning
- Implements staggered animations with CSS transforms
- Auto-cycles between shapes with configurable intervals

### Chrome Extension Architecture
- **Background Service Worker**: Coordinates article extraction
- **Content Scripts**: Inject into LinkedIn pages for data extraction
- **Dynamic Executor**: Handles complex page interactions
- **Logger**: Centralized logging with server communication

### Data Structure
Articles stored in `data/articles_index.json` with structure:
```json
{
  "total_articles": 10,
  "articles": [{
    "title": "Article Title",
    "slug": "article-slug", 
    "tags": ["Category1", "Category2"],
    "content_length": 4094,
    "publish_date": "2025-08-31"
  }]
}
```

## Build & Deploy Process

### Site Updates
1. Modify files in `/docs/` directory
2. Test locally with `npm run test-local`
3. Commit changes - GitHub Pages auto-deploys

### Article Addition
1. Chrome extension extracts article data
2. Run `npm run sync-articles` to process
3. Copy `data/articles_index.json` to `docs/data/`
4. Create individual article HTML in `docs/articles/`
5. Deploy via git push

## Critical Implementation Details

### Category Filtering System
- Uses hover events with 200ms delay to prevent rapid filtering
- Clears filters when leaving category area (300ms delay)
- All articles must have `tags` array for proper categorization
- Category counts calculated dynamically from article tags

### Extension Session Management
- Saves LinkedIn session state to `temp/linkedin-session.json`
- Handles authentication persistence across browser sessions
- Uses shared selectors configuration for maintainable scraping

### Particle Animation Performance
- Creates 240 particles with optimized CSS transforms
- Uses requestAnimationFrame for smooth morphing
- Implements proper cleanup to prevent memory leaks
- Shape definitions use relative coordinates (0-1 range)

## Environment & Dependencies

**Frontend**: Vanilla JavaScript, no build process required
**Backend Scripts**: Node.js with minimal dependencies (dotenv, front-matter, marked)
**Python Scripts**: BeautifulSoup4, markdownify for article processing
**Chrome Extension**: Manifest v3 with service worker architecture

## File Structure Context

- `/docs/` - GitHub Pages site (main user interface)
- `/chrome-extension/` - Browser automation for LinkedIn
- `/scripts/` - Newsletter and article processing automation
- `/data/` - Processed article metadata and content
- `/raw_downloads/` - Manual LinkedIn article downloads
- `/covers/` - Generated animated covers for social media
- `/utils/` - Shared utilities extracted from code deduplication