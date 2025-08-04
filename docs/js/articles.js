/**
 * Bosser Articles Loading System
 * Handles dynamic loading and display of articles from JSON data
 */

class ArticleSystem {
    constructor(containerId, dataPath = './data/articles_index.json') {
        this.container = document.getElementById(containerId);
        this.dataPath = dataPath;
        this.articles = [];
        
        if (!this.container) {
            console.warn(`Articles container '${containerId}' not found`);
            return;
        }
        
        this.init();
    }

    async init() {
        try {
            await this.loadArticles();
            this.renderArticles();
        } catch (error) {
            console.error('Failed to load articles:', error);
            this.showFallbackArticles();
        }
    }

    async loadArticles() {
        const response = await fetch(this.dataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.articles = data.articles || [];
        
        console.log(`Loaded ${this.articles.length} articles successfully`);
    }

    renderArticles(limit = 6) {
        const articlesToShow = this.articles.slice(0, limit);
        this.container.innerHTML = articlesToShow
            .map(article => this.createArticleCard(article))
            .join('');
    }

    createArticleCard(article) {
        const excerpt = this.getExcerpt(article.title);
        const readingTime = this.calculateReadingTime(article.content_length);
        const formattedDate = this.formatDate(article.publish_date);
        
        return `
            <article class="article-card">
                <div class="article-meta">
                    <span>${readingTime} min read</span>
                    <span>${formattedDate}</span>
                </div>
                <a href="./articles/${article.slug}.html" class="article-title">
                    ${article.title}
                </a>
                <div class="article-excerpt">
                    ${excerpt}
                </div>
                <a href="./articles/${article.slug}.html" class="read-more">Read Article</a>
            </article>
        `;
    }

    calculateReadingTime(contentLength) {
        const wordsPerMinute = 250;
        const readingTime = Math.max(1, Math.round((contentLength || 0) / wordsPerMinute));
        return readingTime;
    }

    getExcerpt(title) {
        const excerpts = {
            "ai-and-certainty-dont-mix": "Exploring why the inherent uncertainty in AI systems mirrors the unpredictability that has always existed in product development and business strategy.",
            "skating-where-the-puck-is-going": "Strategic positioning for the future. Applying Wayne Gretzky's famous insight to AI strategy and business transformation.",
            "evals-is-the-new-black": "The genie and lion tamer metaphor for embracing uncertainty in AI product development. Not knowing beforehand is perfectly okay.",
            "visioning": "Strategic planning and future thinking in an uncertain world. Building shared understanding of direction and purpose.",
            "ai-and-agile-20": "How AI is fundamentally transforming agile methodologies and product development practices for the next decade.",
            "time-to-rethink-your-knowledge-management": "Modern approaches to organizing and leveraging organizational knowledge in the AI era.",
            "inputs-to-strategy": "Key inputs and considerations for effective strategic planning in uncertain environments.",
            "imagination-feeds-off-on-examples": "How concrete examples fuel imagination and strategic thinking in complex problem-solving scenarios."
        };
        
        const slug = this.titleToSlug(title);
        return excerpts[slug] || "Strategic insights for navigating complexity and driving meaningful progress in challenging environments.";
    }

    titleToSlug(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-');
    }

    formatDate(dateString) {
        if (!dateString || dateString === 'Unknown date') {
            return '2025';
        }
        
        try {
            return new Date(dateString).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
        } catch {
            return dateString;
        }
    }

    showFallbackArticles() {
        console.log('Loading fallback articles...');
        
        const fallbackArticles = [
            { 
                title: 'AI and certainty don\'t mix', 
                slug: 'ai-and-certainty-dont-mix', 
                content_length: 4647,
                publish_date: '2025-01-01'
            },
            { 
                title: 'Skating where the puck is going', 
                slug: 'skating-where-the-puck-is-going', 
                content_length: 5973,
                publish_date: '2025-01-01'
            },
            { 
                title: 'Evals is the new black', 
                slug: 'evals-is-the-new-black', 
                content_length: 3233,
                publish_date: '2025-01-01'
            },
            { 
                title: 'Visioning', 
                slug: 'visioning', 
                content_length: 8661,
                publish_date: '2025-01-01'
            },
            { 
                title: 'AI and Agile 2.0', 
                slug: 'ai-and-agile-20', 
                content_length: 4094,
                publish_date: '2025-01-01'
            },
            { 
                title: 'Time to rethink your knowledge management', 
                slug: 'time-to-rethink-your-knowledge-management', 
                content_length: 4878,
                publish_date: '2025-01-01'
            }
        ];
        
        this.articles = fallbackArticles;
        this.renderArticles();
    }

    // Public methods for external control
    refresh() {
        this.init();
    }

    filterByTag(tag) {
        // Future implementation for article filtering
        console.log(`Filtering by tag: ${tag}`);
    }

    search(query) {
        // Future implementation for article search
        console.log(`Searching for: ${query}`);
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('articles-container')) {
        window.articleSystem = new ArticleSystem('articles-container');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleSystem;
}