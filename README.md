# 🚀 Bosser - LinkedIn Article Showcase

A project to collect, organize, and showcase Antti Tevanlinna's LinkedIn articles with AI-powered features.

## 📁 Project Structure

```
bosser/
├── data/                   # Processed article data
│   ├── articles/          # Individual articles (JSON + MD)
│   └── articles_index.json
├── docs/                  # GitHub Pages site (coming soon)
├── raw_downloads/         # Manual article downloads go here
├── scrapers/             # Scraping scripts (if needed)
├── scripts/              # Utility scripts
│   └── organize_articles.py
└── requirements.txt      # Python dependencies
```

## 🎯 Current Linear Issues

- **HAP-75**: Set up LinkedIn article scraping infrastructure (High Priority)
- **HAP-76**: Build GitHub Pages article showcase website (High Priority) 
- **HAP-77**: Implement LLM-powered article analysis and mashups (Medium Priority)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ~/Projects/bosser
pip install -r requirements.txt
```

### 2. Download Articles Manually
- Go to your LinkedIn articles
- Save as "Webpage, Complete" 
- Put HTML files in `raw_downloads/` folder

### 3. Process Articles
```bash
python scripts/organize_articles.py
```

This will:
- Extract clean content from HTML files
- Convert to JSON and Markdown formats  
- Generate slugs and metadata
- Create a searchable index

## 🔄 Workflow

1. **Manual Download** → LinkedIn articles saved as HTML
2. **Process** → Run organizer script to clean and structure
3. **Showcase** → GitHub Pages site with article listing
4. **AI Features** → LLM-powered analysis and mashups

## 📋 Features (Planned)

### Core Features
- [ ] Article content extraction and cleaning
- [ ] Markdown conversion for easy editing
- [ ] Searchable article index
- [ ] GitHub Pages showcase site

### AI-Powered Features  
- [ ] Article summaries and insights
- [ ] Topic clustering and content maps
- [ ] Cross-article connections
- [ ] Content recommendation engine
- [ ] Interactive visualizations

## 💻 Development

This project uses:
- **Python** for article processing
- **GitHub Pages** for hosting
- **Linear** for project management
- **Claude Code** for AI-assisted development

## 📖 Articles Collection

Currently building a collection of 50+ LinkedIn articles covering topics like:
- AI and technology trends
- Product management insights  
- Business strategy
- Industry analysis

## 🔗 Links

- **GitHub Repo**: https://github.com/anttitevanlinna/bosser
- **Linear Project**: https://linear.app/happeniser/project/bosser-4d213d068c18
- **LinkedIn Profile**: https://www.linkedin.com/in/anttitevanlinna/

---

*Last updated: August 3, 2025*
