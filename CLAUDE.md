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
# Sync scraped articles to site data
npm run sync-articles

# Prepare newsletter from drafts
npm run prepare-newsletter

# Generate animated cover
npm run generate-cover

# Record cover animation as video
npm run record-cover
```

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