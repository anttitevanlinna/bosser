#!/usr/bin/env node

/**
 * One-time script to update all article pages with proper SEO:
 * - Fix canonical URLs to bosser.consulting
 * - Extract real descriptions from article content
 * - Add JSON-LD structured data
 */

const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '..', 'docs', 'articles');
const DOMAIN = 'https://bosser.consulting';

// Read articles index for publish dates
const indexPath = path.join(__dirname, '..', 'docs', 'data', 'articles_index.json');
const articlesIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const articleMeta = {};
for (const a of articlesIndex.articles) {
    articleMeta[a.slug] = a;
}

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(articlesDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace('.html', '');
    const meta = articleMeta[slug] || {};

    // Extract title from <h1>
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    // Extract first meaningful paragraph for description
    // Match all <p> tags including those with class attributes (LinkedIn HTML)
    const contentMatch = html.match(/<div class="article-content">([\s\S]*?)<\/article>/);
    let description = title;
    if (contentMatch) {
        const paragraphs = contentMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/g);
        if (paragraphs) {
            for (const p of paragraphs) {
                const text = p.replace(/<[^>]+>/g, '').replace(/<!-- -->/g, '').trim();
                if (text.length > 30 && text !== '—' && !text.startsWith('Published')) {
                    description = text.substring(0, 155).replace(/"/g, '&quot;');
                    if (text.length > 155) description += '...';
                    break;
                }
            }
        }
    }

    const articleUrl = `${DOMAIN}/articles/${file}`;

    // Fix canonical URL
    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${articleUrl}">`
    );

    // Fix og:url
    html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${articleUrl}">`
    );

    // Fix meta description
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${description}">`
    );

    // Fix og:description
    html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${description}">`
    );

    // Fix twitter:description
    html = html.replace(
        /<meta name="twitter:description" content="[^"]*">/,
        `<meta name="twitter:description" content="${description}">`
    );

    // Add og:site_name if missing
    if (!html.includes('og:site_name')) {
        html = html.replace(
            /(<meta property="og:url"[^>]*>)/,
            `$1\n    <meta property="og:site_name" content="Bosser">`
        );
    }

    // Add article:author and article:published_time if missing
    if (!html.includes('article:author') && meta.publish_date && meta.publish_date !== 'Unknown date') {
        html = html.replace(
            /(\s*<!-- Twitter Card -->)/,
            `\n    <meta property="article:author" content="Antti Tevanlinna">\n    <meta property="article:published_time" content="${meta.publish_date}">\n$1`
        );
    }

    // Remove existing JSON-LD to replace it
    html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

    // Add JSON-LD
    {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "author": {
                "@type": "Person",
                "name": "Antti Tevanlinna"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Bosser"
            },
            "url": articleUrl,
            "mainEntityOfPage": articleUrl
        };
        if (meta.publish_date && meta.publish_date !== 'Unknown date') {
            jsonLd.datePublished = meta.publish_date;
        }

        const jsonLdScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 4).replace(/\n/g, '\n    ')}\n    </script>`;

        html = html.replace('</head>', `${jsonLdScript}\n</head>`);
    }

    fs.writeFileSync(filePath, html);
    console.log(`Updated: ${file} - "${description.substring(0, 60)}..."`);
}

console.log(`\nDone! Updated ${files.length} article pages.`);
