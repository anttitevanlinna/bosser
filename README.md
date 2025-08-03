# 🚀 Bosser - LinkedIn Article Showcase

A professional article showcase site featuring Antti Tevanlinna's LinkedIn articles with AI-powered insights and analysis.

## 📊 Current Status

- **📄 8 Articles** published and live
- **🌐 Live Site**: https://anttitevanlinna.github.io/bosser/
- **📱 Mobile responsive** design with professional styling
- **🔍 Searchable** article index with metadata

## 📁 Project Structure

```
bosser/
├── data/                   # Processed article data
│   ├── articles/          # Individual articles (JSON + MD)
│   └── articles_index.json # Searchable article catalog
├── docs/                  # GitHub Pages site
│   ├── index.html         # Homepage with article grid
│   ├── articles/          # Individual article pages
│   └── data/              # Article index for site
├── raw_downloads/         # Manual article downloads (HTML)
├── scripts/               # Utility scripts
│   ├── organize_articles.py # Process downloaded articles
│   └── test_local.sh      # Local testing server
├── scrapers/             # Scraping scripts (if needed)
└── requirements.txt      # Python dependencies
```

## 🔄 Article Workflow

### 1. Download Articles Manually
- Visit your LinkedIn article on LinkedIn
- **Right-click** → **Save As** → **Webpage, Complete**
- Save to `raw_downloads/` folder
- Include both `.html` file and `_files` folder

### 2. Process Articles
```bash
cd ~/Projects/bosser
python3 scripts/organize_articles.py
```

This automatically:
- ✅ Extracts clean content from HTML
- ✅ Converts to JSON and Markdown formats
- ✅ Generates URL-friendly slugs
- ✅ Creates searchable index
- ✅ Preserves all metadata

### 3. Update Website
```bash
# Copy updated index to docs folder
cp data/articles_index.json docs/data/

# Create individual article page (manual for now)
# See existing examples in docs/articles/

# Test locally
./scripts/test_local.sh

# Commit and deploy
git add .
git commit -m "Add new article: [title]"
git push origin main
```

### 4. Live in ~2 minutes
GitHub Pages automatically rebuilds and deploys your site.

## 🧪 Local Testing

### Quick Test
```bash
cd ~/Projects/bosser
./scripts/test_local.sh
```
Visit: http://localhost:8000

### Manual Test
```bash
cd ~/Projects/bosser/docs
python3 -m http.server 8000
```

### Testing Checklist
- ✅ Homepage loads without errors
- ✅ Shows correct article count (currently 8)
- ✅ All articles display in grid
- ✅ Individual article links work
- ✅ Mobile responsive design
- ✅ No JavaScript console errors

## 📚 Current Articles

1. **AI and certainty don't mix** - Embracing uncertainty in AI systems
2. **Skating where the puck is going** - Strategic positioning for AI's future
3. **Evals is the new black** - AI evaluation methods and uncertainty
4. **Visioning** - Strategic planning in uncertain environments
5. **AI and Agile 2.0** - AI's impact on agile methodologies
6. **Time to rethink your knowledge management** - Modern knowledge practices
7. **Inputs to Strategy** - Strategic decision-making elements
8. **Imagination feeds off on examples** - Examples fueling innovation

## 🛠 Setup & Dependencies

### Initial Setup
```bash
cd ~/Projects/bosser
pip3 install -r requirements.txt
```

### Required Dependencies
- `beautifulsoup4` - HTML parsing
- `markdownify` - HTML to Markdown conversion
- `pathlib` - File path handling

## 🎯 Linear Project Management

- **Project**: Bosser (`ba959b5e-295d-48da-84f2-1c537f72e471`)
- **Team**: Happeniser (`9a8b6384-b48d-4b90-b7c7-33fd9a9049d4`)
- **Issues**: Track progress on feature development

### Current Issues
- ✅ **HAP-75**: Article scraping infrastructure (Complete - Manual workflow)
- ✅ **HAP-76**: GitHub Pages showcase (Complete - Live site)
- ⏳ **HAP-77**: LLM-powered article analysis and mashups (Next phase)

## 🌐 Live Site Features

### Homepage
- 📊 Article statistics (count, word count, year started)
- 🗂️ Responsive article grid with hover effects
- 📱 Mobile-friendly design
- 📖 Reading time estimates
- 📄 Character counts and metadata

### Article Pages
- 📖 Reading progress indicator
- 📱 Responsive layout
- 👤 Author info and social links
- ⬅️ Navigation back to homepage
- 🔗 Links to original LinkedIn articles
- 🎨 Professional typography

### Technical Features
- ⚡ Fast loading (static files)
- 📱 Responsive design
- 🔍 SEO optimized
- 📊 Automatic article index loading
- 🎯 Cache-busting for updates
- 🛡️ Security: No private contact info exposed

## 🚀 Future Enhancements (HAP-77)

### AI-Powered Features
- [ ] Article content analysis and theme extraction
- [ ] Generate cross-article connections
- [ ] Create topic clusters and content maps
- [ ] Build article recommendation engine
- [ ] Generate data visualizations (word clouds, networks)
- [ ] Sentiment analysis and tone detection

### Technical Improvements
- [ ] Search functionality
- [ ] Article tagging and categories
- [ ] Reading analytics
- [ ] Progressive Web App features
- [ ] Automated article page generation

## 🔗 Links

- **Live Site**: https://anttitevanlinna.github.io/bosser/
- **GitHub Repository**: https://github.com/anttitevanlinna/bosser
- **Linear Project**: https://linear.app/happeniser/project/bosser-4d213d068c18
- **LinkedIn Profile**: https://www.linkedin.com/in/anttitevanlinna/

## 🤝 Development Workflow

### For New Articles
1. Download from LinkedIn → `raw_downloads/`
2. Run `python3 scripts/organize_articles.py`
3. Copy index: `cp data/articles_index.json docs/data/`
4. Create article page in `docs/articles/`
5. Test locally: `./scripts/test_local.sh`
6. Commit and push to deploy

### For Site Updates
1. Edit files in `docs/` folder
2. Test locally first
3. Commit with descriptive message
4. Push to trigger GitHub Pages rebuild

## 📝 Notes

- **Manual workflow** chosen over scraping for reliability and LinkedIn ToS compliance
- **Static site** for maximum performance and security
- **Progressive enhancement** - site works without JavaScript
- **Mobile-first** responsive design approach

## 📄 License

- **Code & Website**: MIT License - Free to use, modify, and distribute
- **Article Content**: Creative Commons BY 4.0 - Free to share and adapt with attribution
- **Copyright**: © 2025 Antti Tevanlinna

See [LICENSE](LICENSE) file for full details.

---

*Last updated: August 3, 2025*
*Total articles: 8 | Live at: https://anttitevanlinna.github.io/bosser/*