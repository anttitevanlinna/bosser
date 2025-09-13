#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('front-matter');
const { marked } = require('marked');
const HTMLCoverGenerator = require('./generate-cover-html');
const { recordCoverVideo } = require('./record-cover-video');
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
        
        // Generate animated cover HTML
        const coverGenerator = new HTMLCoverGenerator();
        
        try {
            const coverPath = await coverGenerator.generateCover(frontMatter.title, this.coversDir);
            console.log(`🎨 Cover HTML generated: ${coverPath}`);
            
            // Generate cover video
            try {
                console.log('🎬 Recording cover video...');
                const videoPath = path.join(this.coversDir, 'cover.webm');
                await recordCoverVideo(coverPath, videoPath);
                console.log('✅ Cover video generated:', videoPath);
                
                // Also suggest MP4 conversion
                console.log('💡 To convert for LinkedIn: ffmpeg -i cover.webm -c:v libx264 -t 30 cover.mp4');
            } catch (videoError) {
                console.log('⚠️  Video recording failed:', videoError.message);
                console.log('📝 You can manually record the cover at:', coverPath);
            }
        } catch (error) {
            console.error('❌ Cover generation failed:', error.message);
            // Continue without cover for now
        }
        
        // Process content
        const htmlContent = marked(content);
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
                status: articleData.status
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
        
        // Simple article page template
        const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title} - Bosser</title>
    <link rel="stylesheet" href="../styles.css">
    <meta name="description" content="${articleData.title} by ${articleData.author}">
</head>
<body>
    <nav>
        <div class="nav-container">
            <a href="../index.html" class="logo">← Bosser</a>
        </div>
    </nav>
    
    <article class="article-content">
        <header class="article-header">
            ${articleData.cover_video ? `<video autoplay muted loop class="article-cover">
                <source src="${articleData.cover_video}" type="video/mp4">
            </video>` : ''}
            <h1>${articleData.title}</h1>
            <div class="article-meta">
                <span>By ${articleData.author}</span>
                <span>•</span>
                <span>${articleData.estimated_reading_time}</span>
                <span>•</span>
                <span>${formatDateSimple(articleData.publish_date)}</span>
            </div>
        </header>
        
        <div class="article-body">
            ${articleData.content_html}
        </div>
        
        <footer class="article-footer">
            <a href="../index.html" class="back-link">← Back to all articles</a>
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
        console.log('2. Run: npm run publish-to-linkedin checking-assumptions');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = NewsletterPreparer;