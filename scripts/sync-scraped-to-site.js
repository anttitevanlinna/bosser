#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { formatDate } = require('../utils/date-utils');
const { calculateReadingTimeFromLength } = require('../utils/content-utils');
const { ensureDirectories, fileExists } = require('../utils/file-utils');

class ScrapedArticlesSiteSync {
    constructor() {
        this.articlesDir = path.join(__dirname, '..', 'data', 'articles');
        this.scrapedDir = path.join(__dirname, '..', 'data', 'scraped-articles');
        this.docsDir = path.join(__dirname, '..', 'docs');
        this.docsArticlesDir = path.join(this.docsDir, 'articles');
        this.docsDataDir = path.join(this.docsDir, 'data');
    }

    async syncAll() {
        console.log('🔄 Syncing scraped articles to site...');
        
        try {
            // Ensure directories exist
            this.ensureDirectories();
            
            // Get all articles
            const manualArticles = this.loadManualArticles();
            const scrapedArticles = this.loadScrapedArticles();
            
            // Combine and process
            const allArticles = this.combineArticles(manualArticles, scrapedArticles);
            
            // Generate HTML pages for new scraped articles
            await this.generateHTMLPages(scrapedArticles);
            
            // Update articles index
            this.updateArticlesIndex(allArticles);
            
            // Update the main articles.js with new excerpts
            this.updateArticlesJS(scrapedArticles);
            
            console.log(`✅ Sync complete! ${allArticles.length} total articles available`);
            console.log(`📊 Manual: ${manualArticles.length}, Scraped: ${scrapedArticles.length}`);
            
        } catch (error) {
            console.error('❌ Sync failed:', error.message);
            throw error;
        }
    }

    ensureDirectories() {
        // Using shared utility from utils/file-utils.js
        ensureDirectories([this.docsArticlesDir, this.docsDataDir]);
        console.log(`📁 Ensured directories exist`);
    }

    loadManualArticles() {
        const articles = [];
        
        if (fileExists(this.articlesDir)) {
            const files = fs.readdirSync(this.articlesDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                try {
                    const articlePath = path.join(this.articlesDir, file);
                    const article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    articles.push({
                        ...article,
                        source: 'manual',
                        linkedin_url: null
                    });
                } catch (error) {
                    console.log(`⚠️  Failed to load manual article ${file}:`, error.message);
                }
            }
        }
        
        console.log(`📄 Loaded ${articles.length} manual articles`);
        return articles;
    }

    loadScrapedArticles() {
        const articles = [];
        
        if (fileExists(this.scrapedDir)) {
            const files = fs.readdirSync(this.scrapedDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                try {
                    const articlePath = path.join(this.scrapedDir, file);
                    const article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    articles.push({
                        ...article,
                        source: 'scraped',
                        linkedin_url: article.url,
                        content_length: article.content ? article.content.length : 0,
                        // Convert scraped format to site format
                        publish_date: article.publishDate || article.scraped_at,
                        content_markdown: article.content,
                        content_html: this.markdownToHTML(article.content)
                    });
                } catch (error) {
                    console.log(`⚠️  Failed to load scraped article ${file}:`, error.message);
                }
            }
        }
        
        console.log(`🌐 Loaded ${articles.length} scraped articles`);
        return articles;
    }

    combineArticles(manual, scraped) {
        // Combine articles, avoiding duplicates (manual takes precedence)
        const combined = [...manual];
        const manualSlugs = new Set(manual.map(a => a.slug));
        
        for (const article of scraped) {
            if (!manualSlugs.has(article.slug)) {
                combined.push(article);
            } else {
                console.log(`⏭️  Skipping scraped duplicate: ${article.title}`);
            }
        }
        
        // Sort by date (newest first)
        combined.sort((a, b) => {
            const dateA = new Date(a.publish_date || a.scraped_at || '2025-01-01');
            const dateB = new Date(b.publish_date || b.scraped_at || '2025-01-01');
            return dateB - dateA;
        });
        
        return combined;
    }

    async generateHTMLPages(scrapedArticles) {
        console.log('📝 Generating HTML pages for scraped articles...');
        
        for (const article of scrapedArticles) {
            const htmlPath = path.join(this.docsArticlesDir, `${article.slug}.html`);
            
            // Skip if HTML already exists
            if (fileExists(htmlPath)) {
                console.log(`⏭️  HTML exists: ${article.slug}.html`);
                continue;
            }
            
            const html = this.generateArticleHTML(article);
            fs.writeFileSync(htmlPath, html, 'utf8');
            console.log(`✅ Generated: ${article.slug}.html`);
        }
    }

    generateArticleHTML(article) {
        const formattedDate = formatDate(article.publish_date || article.scraped_at);
        const readingTime = calculateReadingTimeFromLength(article.content_length);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Bosser</title>
    <script defer src="https://cloud.umami.is/script.js" data-website-id="eb766906-49ac-4f5c-941c-b107cf0e7c4f"></script>
    <meta name="description" content="${this.createMetaDescription(article)}">
    <link rel="canonical" href="https://anttitevanlinna.github.io/bosser/articles/${article.slug}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${this.createMetaDescription(article)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://anttitevanlinna.github.io/bosser/articles/${article.slug}.html">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.title}">
    <meta name="twitter:description" content="${this.createMetaDescription(article)}">
    
    <style>
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --bg-card: #1e1e1e;
            --text-primary: #ffffff;
            --text-secondary: #b3b3b3;
            --text-muted: #666666;
            --accent: #ff6b35;
            --accent-hover: #ff8555;
            --border: #333333;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 24px;
        }

        nav {
            padding: 20px 0;
            border-bottom: 1px solid var(--border);
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
        }

        .back-link {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }

        .back-link:hover {
            color: var(--accent);
        }

        .article-header {
            padding: 80px 0 40px;
            border-bottom: 1px solid var(--border);
        }

        .article-meta {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .source-badge {
            background: var(--accent);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .linkedin-link {
            color: var(--accent);
            text-decoration: none;
            font-size: 0.875rem;
            margin-left: 8px;
        }

        .article-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 24px;
        }

        .article-content {
            padding: 60px 0;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3 {
            margin-top: 40px;
            margin-bottom: 20px;
            color: var(--text-primary);
        }

        .article-content h1 {
            font-size: 2rem;
            border-bottom: 2px solid var(--accent);
            padding-bottom: 10px;
        }

        .article-content h2 {
            font-size: 1.5rem;
        }

        .article-content h3 {
            font-size: 1.25rem;
        }

        .article-content p {
            margin-bottom: 20px;
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .article-content strong {
            color: var(--text-primary);
        }

        .article-content em {
            color: var(--accent);
        }

        .article-content blockquote {
            border-left: 3px solid var(--accent);
            padding-left: 24px;
            margin: 24px 0;
            color: var(--text-secondary);
            font-style: italic;
        }

        .article-content hr {
            border: none;
            height: 1px;
            background: var(--border);
            margin: 40px 0;
        }

        .article-footer {
            padding: 40px 0;
            border-top: 1px solid var(--border);
            text-align: center;
        }

        .back-to-top {
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 20px;
            transition: background 0.3s ease;
        }

        .back-to-top:hover {
            background: var(--accent-hover);
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 16px;
            }
            
            .article-header {
                padding: 40px 0 20px;
            }
            
            .article-title {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <a href="../index.html" class="logo">Bosser</a>
            <a href="../index.html#articles" class="back-link">← Back to Articles</a>
        </div>
    </nav>

    <article>
        <header class="article-header">
            <div class="container">
                <div class="article-meta">
                    <span>${readingTime} min read</span>
                    <span>${formattedDate}</span>
                    ${article.source === 'scraped' ? '<span class="source-badge">LinkedIn</span>' : ''}
                    ${article.linkedin_url ? `<a href="${article.linkedin_url}" target="_blank" class="linkedin-link">View on LinkedIn →</a>` : ''}
                </div>
                <h1 class="article-title">${article.title}</h1>
            </div>
        </header>

        <div class="article-content">
            <div class="container">
                ${article.content_html || this.markdownToHTML(article.content_markdown || article.content || '')}
            </div>
        </div>

        <footer class="article-footer">
            <div class="container">
                <a href="../index.html#articles" class="back-to-top">← Back to Articles</a>
                <p style="color: var(--text-muted); font-size: 0.875rem;">
                    ${article.source === 'scraped' ? 'Originally published on LinkedIn' : 'Published on Bosser'}
                </p>
            </div>
        </footer>
    </article>
</body>
</html>`;
    }

    markdownToHTML(markdown) {
        if (!markdown) return '';
        
        // Basic markdown to HTML conversion
        return markdown
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^---$/gm, '<hr>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            .replace(/<p><h([123])>/g, '<h$1>')
            .replace(/<\/h([123])><\/p>/g, '</h$1>')
            .replace(/<p><hr><\/p>/g, '<hr>')
            .replace(/^\s*<p>\s*<\/p>\s*$/gm, '');
    }

    createMetaDescription(article) {
        const content = article.content || article.content_markdown || '';
        return content.substring(0, 160).replace(/\n/g, ' ').trim() + '...';
    }

    updateArticlesIndex(allArticles) {
        const indexData = {
            total_articles: allArticles.length,
            last_updated: new Date().toISOString(),
            articles: allArticles.map(article => ({
                title: article.title,
                slug: article.slug,
                url: article.linkedin_url || "Unknown URL",
                publish_date: article.publish_date || article.scraped_at || "Unknown date",
                content_length: article.content_length || 0,
                estimated_reading_time: article.estimated_reading_time || `${calculateReadingTimeFromLength(article.content_length)} min`,
                status: article.status || "published",
                source: article.source,
                processed_at: article.processed_at || article.scraped_at,
                tags: article.tags || []
            }))
        };

        const indexPath = path.join(this.docsDataDir, 'articles_index.json');
        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
        console.log(`📚 Updated articles index: ${allArticles.length} articles`);
    }

    updateArticlesJS(scrapedArticles) {
        // Add excerpts for new scraped articles to the articles.js excerpts object
        const articlesJSPath = path.join(this.docsDir, 'js', 'articles.js');
        
        if (!fileExists(articlesJSPath)) {
            console.log('⚠️  articles.js not found, skipping excerpt updates');
            return;
        }

        let articlesJS = fs.readFileSync(articlesJSPath, 'utf8');
        
        // Extract new excerpts from scraped articles
        const newExcerpts = {};
        scrapedArticles.forEach(article => {
            if (article.content) {
                const excerpt = this.createExcerpt(article.content);
                newExcerpts[article.slug] = excerpt;
            }
        });

        if (Object.keys(newExcerpts).length > 0) {
            console.log(`📝 Adding ${Object.keys(newExcerpts).length} new excerpts to articles.js`);
            
            // Find the excerpts object and add new entries
            const excerptRegex = /(const excerpts = \{[^}]*)(}\s*;)/s;
            const match = articlesJS.match(excerptRegex);
            
            if (match) {
                const existingExcerpts = match[1];
                const newExcerptEntries = Object.entries(newExcerpts)
                    .map(([slug, excerpt]) => `            "${slug}": "${excerpt}"`)
                    .join(',\n');
                
                const updatedExcerpts = existingExcerpts.replace(/,$/, '') + ',\n' + newExcerptEntries;
                articlesJS = articlesJS.replace(excerptRegex, updatedExcerpts + match[2]);
                
                fs.writeFileSync(articlesJSPath, articlesJS);
                console.log('✅ Updated articles.js with new excerpts');
            }
        }
    }

    createExcerpt(content) {
        // Create excerpt from article content
        const text = content.replace(/[#*]/g, '').replace(/\n/g, ' ').trim();
        const sentences = text.split('. ');
        return sentences.slice(0, 2).join('. ').substring(0, 150) + '...';
    }


}

async function syncScrapedToSite() {
    const sync = new ScrapedArticlesSiteSync();
    await sync.syncAll();
}

// Command line usage
if (require.main === module) {
    syncScrapedToSite().catch(error => {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
    });
}

module.exports = { ScrapedArticlesSiteSync, syncScrapedToSite };