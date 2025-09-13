# Newsletter Publishing Workflow

## Quick Start

```bash
# 1. Install dependencies (first time only)
npm run install-deps

# 2. Write your newsletter in drafts/
vim drafts/your-newsletter.md

# 3. Prepare newsletter (generates cover + updates site)
npm run prepare-newsletter your-newsletter

# 4. Review on your site
open https://anttitevanlinna.github.io/bosser/

# 5. Publish to LinkedIn
npm run publish-to-linkedin your-newsletter
```

## Workflow Details

### Step 1: Write Content
Create markdown files in `/drafts/` with this frontmatter:

```yaml
---
title: "Your Newsletter Title"
slug: "url-friendly-slug"
status: "draft"
created_at: "2025-08-31"
author: "Antti Tevanlinna"
newsletter: true
cover_animation: "particles-flow"
tags: ["leadership", "strategy"]
---

Your content here...
```

### Step 2: Prepare Newsletter
`npm run prepare-newsletter draft-name` does:
- ✅ Generates 15-second animated cover (cloud→brain→arrow particles)
- ✅ Converts markdown to HTML
- ✅ Updates site articles index
- ✅ Creates article page on your site
- ✅ Status: ready-for-review

### Step 3: Manual Review
- Visit your site to review layout and cover
- Check animated cover video quality
- Verify content formatting

### Step 4: Publish to LinkedIn
`npm run publish-to-linkedin draft-name` does:
- 📋 Creates manual publishing guide (for now)
- 🎬 Provides cover video file path
- 📝 Formats content for LinkedIn
- ✅ Marks article as published

## Generated Files

```
bosser/
├── drafts/                    # Your writing workspace
│   └── newsletter-name.md     # Markdown drafts
├── covers/                    # Generated video covers
│   └── newsletter-cover.mp4   # 1920x1080 MP4 videos
├── data/articles/             # Processed articles
│   └── newsletter.json        # Article data + metadata
├── docs/articles/             # Site pages
│   └── newsletter.html        # Individual article pages
└── temp/                      # Publishing guides
    └── publishing-guide.md    # Manual steps for LinkedIn
```

## Brand Consistency

All covers use your brand colors:
- **Background**: `#0a0a0a` (deep black)
- **Particles**: `#ff6b35` (vibrant orange)
- **Text**: `#ffffff` (white)
- **Typography**: Inter font family

The particle animation matches your site's visual system: cloud→brain→arrow transformation over 15 seconds.

## LinkedIn Specifications

Generated covers meet LinkedIn's 2025 requirements:
- ✅ **Size**: 1920x1080 pixels
- ✅ **Duration**: 15 seconds (under 30s limit)
- ✅ **Format**: MP4 with H.264 encoding
- ✅ **Mobile**: Works on mobile and email newsletters
- ✅ **Brand**: Consistent with your site design