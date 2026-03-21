#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('front-matter');
const { marked } = require('marked');
const HTMLCoverGenerator = require('./generate-cover-html');
// Note: Cover video recording disabled - Playwright removed for LinkedIn publishing
const { formatDateSimple } = require('../utils/date-utils');
const { estimateReadingTime } = require('../utils/content-utils');
const { ensureDirectories, ensureDirectory, fileExists } = require('../utils/file-utils');

class NewsletterPreparer {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.draftsDir = path.join(this.baseDir, 'drafts');
        this.dataDir = path.join(this.baseDir, 'data');
        this.articlesDir = path.join(this.dataDir, 'articles');
        this.docsDir = path.join(this.baseDir, 'docs');
        this.coversDir = path.join(this.baseDir, 'covers');
        
        // Ensure directories exist
        // Using shared utility from utils/file-utils.js
        ensureDirectories([this.dataDir, this.articlesDir, this.coversDir]);
    }
    
    async prepareDraft(draftName) {
        console.log(`📝 Preparing newsletter: ${draftName}`);
        
        // Read draft file
        const draftPath = path.join(this.draftsDir, `${draftName}.md`);
        if (!fileExists(draftPath)) {
            throw new Error(`Draft not found: ${draftPath}`);
        }
        
        const draftContent = fs.readFileSync(draftPath, 'utf8');
        const { attributes: frontMatter, body: content } = matter(draftContent);
        
        console.log(`📄 Processing: ${frontMatter.title}`);
        
        // Generate animated cover HTML (video recording skipped - use browser plugin for LinkedIn)
        const coverGenerator = new HTMLCoverGenerator();
        
        try {
            const coverPath = await coverGenerator.generateCover(frontMatter.title, this.coversDir);
            console.log(`🎨 Cover HTML generated: ${coverPath}`);
            console.log('📝 Use browser plugin to record and publish to LinkedIn');
        } catch (error) {
            console.error('❌ Cover generation failed:', error.message);
            // Continue without cover
        }
        
        // Process content - remove first H1 since template provides it
        const contentWithoutFirstH1 = content.replace(/^# .+\n\n/, '');
        const htmlContent = marked(contentWithoutFirstH1);
        const slug = frontMatter.slug || this.generateSlug(frontMatter.title);
        
        // Create article data structure
        const articleData = {
            title: frontMatter.title,
            slug: slug,
            author: frontMatter.author || 'Antti Tevanlinna',
            publish_date: frontMatter.created_at || new Date().toISOString().split('T')[0],
            content: content,
            content_html: htmlContent,
            content_markdown: content,
            content_length: content.length,
            processed_at: new Date().toISOString(),
            source_file: `${draftName}.md`,
            newsletter: frontMatter.newsletter || false,
            tags: frontMatter.tags || [],
            cover_html: `../covers/cover.html`,
            estimated_reading_time: frontMatter.estimated_reading_time || estimateReadingTime(content),
            status: 'ready-for-review'
        };
        
        // Save processed article
        const articlePath = path.join(this.articlesDir, `${slug}.json`);
        fs.writeFileSync(articlePath, JSON.stringify(articleData, null, 2));
        
        // Update articles index
        this.updateArticlesIndex();
        
        // Create article page for site
        this.createArticlePage(articleData);
        
        console.log(`✅ Newsletter prepared successfully!`);
        console.log(`📁 Article saved: ${articlePath}`);
        console.log(`🌐 Review at: https://anttitevanlinna.github.io/bosser/articles/${slug}.html`);
        
        return articleData;
    }
    
    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .trim();
    }
    
    
    updateArticlesIndex() {
        // Read all articles
        const articles = [];
        const articleFiles = fs.readdirSync(this.articlesDir).filter(f => f.endsWith('.json'));
        
        for (const file of articleFiles) {
            const articlePath = path.join(this.articlesDir, file);
            const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
            articles.push({
                title: articleData.title,
                slug: articleData.slug,
                url: articleData.url || 'Unknown URL',
                publish_date: articleData.publish_date,
                content_length: articleData.content_length,
                processed_at: articleData.processed_at,
                cover_video: articleData.cover_video,
                estimated_reading_time: articleData.estimated_reading_time,
                status: articleData.status,
                tags: articleData.tags || []
            });
        }
        
        // Sort by publish date
        articles.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
        
        // Save updated index
        const indexData = {
            total_articles: articles.length,
            last_updated: new Date().toISOString(),
            articles: articles
        };
        
        const indexPath = path.join(this.dataDir, 'articles_index.json');
        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
        
        // Copy to docs for site
        const docsIndexPath = path.join(this.docsDir, 'data', 'articles_index.json');
        ensureDirectory(path.dirname(docsIndexPath));
        fs.copyFileSync(indexPath, docsIndexPath);
        
        console.log(`📊 Updated articles index (${articles.length} articles)`);
    }
    
    createArticlePage(articleData) {
        const templatePath = path.join(this.docsDir, 'articles');
        ensureDirectory(templatePath);
        
        // Article page template matching current site structure
        const readingTime = Math.ceil(articleData.content_length / 250);
        const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title} - Bosser</title>
    <script defer src="https://cloud.umami.is/script.js" data-website-id="e7541ca0-f7cb-4adb-ac15-b2f0f8b3a4b9"></script>
    <meta name="description" content="${articleData.title.substring(0, 150)}...">
    <link rel="stylesheet" href="../styles.css">
    <link rel="canonical" href="https://anttitevanlinna.github.io/bosser/articles/${articleData.slug}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${articleData.title}">
    <meta property="og:description" content="${articleData.title.substring(0, 150)}...">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://anttitevanlinna.github.io/bosser/articles/${articleData.slug}.html">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${articleData.title}">
    <meta name="twitter:description" content="${articleData.title.substring(0, 150)}...">
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
                    <span>${formatDateSimple(articleData.publish_date)}</span>
                </div>
                <h1 class="article-title">${articleData.title}</h1>
            </div>
        </header>

        <div class="article-content">
            <div class="container">
                ${articleData.content_html}
            </div>
        </div>

        <footer class="article-footer">
            <div class="container">
                <a href="../index.html#articles" class="back-to-top">← Back to Articles</a>
                <p style="color: var(--text-muted); font-size: 0.875rem;">
                    Published on Bosser
                </p>
            </div>
        </footer>
    </article>
</body>
</html>`;
        
        const articlePagePath = path.join(templatePath, `${articleData.slug}.html`);
        fs.writeFileSync(articlePagePath, articleHtml);
        
        console.log(`📄 Article page created: ${articlePagePath}`);
    }
}

// CLI interface
async function main() {
    const draftName = process.argv[2];
    if (!draftName) {
        console.error('Usage: node prepare-newsletter.js <draft-name>');
        console.error('Example: node prepare-newsletter.js checking-assumptions');
        process.exit(1);
    }
    
    try {
        const preparer = new NewsletterPreparer();
        await preparer.prepareDraft(draftName);
        
        console.log('\n🎯 Next steps:');
        console.log('1. Review at: https://anttitevanlinna.github.io/bosser/');
        console.log('2. Open covers/cover.html to record video with browser plugin');
        console.log('3. Use browser plugin to publish to LinkedIn');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = NewsletterPreparer;