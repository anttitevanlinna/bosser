/**
 * Pure article data processing functions (no DOM dependencies)
 * These can be easily tested in isolation
 */

class ArticleDataProcessor {
    /**
     * Extracts categories from articles array
     * @param {Array} articles - Array of article objects
     * @returns {Map} Map of category -> count
     */
    static extractCategories(articles) {
        const categories = new Map();
        
        if (!Array.isArray(articles)) {
            return categories;
        }
        
        articles.forEach(article => {
            const tags = article.tags || [];
            tags.forEach(tag => {
                const count = categories.get(tag) || 0;
                categories.set(tag, count + 1);
            });
        });
        
        return categories;
    }

    /**
     * Sorts categories by count descending
     * @param {Map} categories - Category map
     * @returns {Array} Array of [category, count] tuples
     */
    static sortCategoriesByCount(categories) {
        return Array.from(categories.entries())
            .sort((a, b) => b[1] - a[1]);
    }

    /**
     * Filters articles by search query and category
     * @param {Array} articles - Array of article objects
     * @param {string} searchQuery - Search string (case insensitive)
     * @param {string} activeCategory - Category to filter by (null for no filter)
     * @returns {Array} Filtered articles
     */
    static filterArticles(articles, searchQuery = '', activeCategory = null) {
        if (!Array.isArray(articles)) {
            return [];
        }

        let filtered = [...articles];

        // Apply category filter
        if (activeCategory) {
            filtered = filtered.filter(article => {
                const tags = article.tags || [];
                return tags.includes(activeCategory);
            });
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(article => {
                const searchableText = [
                    article.title,
                    article.excerpt || this.getExcerpt(article.title),
                    ...(article.tags || [])
                ].join(' ').toLowerCase();

                return searchableText.includes(query);
            });
        }

        return filtered;
    }

    /**
     * Gets excerpt for an article based on its title
     * @param {string} title - Article title
     * @returns {string} Article excerpt
     */
    static getExcerpt(title) {
        const excerpts = {
            "checking-assumptions": "Knowing more over being right. Exploring how effective leadership requires challenging assumptions and fostering open communication to drive strategic decision-making.",
            "ai-and-certainty-dont-mix": "Exploring why the inherent uncertainty in AI systems mirrors the unpredictability that has always existed in product development and business strategy.",
            "skating-where-the-puck-is-going": "Strategic positioning for the future. Applying Wayne Gretzky's famous insight to AI strategy and business transformation.",
            "evals-is-the-new-black": "The genie and lion tamer metaphor for embracing uncertainty in AI product development. Not knowing beforehand is perfectly okay.",
            "visioning": "Strategic planning and future thinking in an uncertain world. Building shared understanding of direction and purpose.",
            "ai-and-agile-20": "How AI is fundamentally transforming agile methodologies and product development practices for the next decade.",
            "time-to-rethink-your-knowledge-management": "Modern approaches to organizing and leveraging organizational knowledge in the AI era.",
            "inputs-to-strategy": "Key inputs and considerations for effective strategic planning in uncertain environments.",
            "imagination-feeds-off-on-examples": "How concrete examples fuel imagination and strategic thinking in complex problem-solving scenarios.",
            "picturing-product-ownership": "Visualizing the product owner role through simple diagrams. How a stick-figure drawing helped clarify the position between user needs and company capabilities.",
            "the-ceiling": "GenAI removes coding as the limiting factor. Two new ceilings emerge: knowing what to build and doing it right. The frontiers that leaders will pursue.",
            "the-flywheel": "Agents that build agents create compounding context. The flywheel accelerates until hitting three ceilings: memory, meaning, and processing. Ralph Wiggum loop included.",
            "scenario-play-everybody-builds-software": "Playing with the future through scenarios. When everyone builds agents, what shifts? From CISOs to customers creating software. Prepared minds see patterns unfold.",
            "selling-agents": "If everyone builds agents, who sells them? The death of bloated SaaS, consultants as agents, and finding business opportunities in human activities turned digital.",
            "shifting-toward-customers-finding-the-truth": "Building with AI is easy. Finding customer truth is hard. Truth is subjective and segmented. Turn outward with evals and customer feedback.",
            "for-innovators": "12 months immersed in agentic AI. The isolation of being ahead, the frustration when others don't see it, the vindication when the future catches up. Portfolio play.",
            "the-mechanical-duck-and-processes": "Exploring how processes can create the illusion of capability while hiding fundamental limitations, like Vaucanson's famous mechanical duck.",
            "vision-prepares-for-serendipity": "How a clear vision creates the conditions for recognizing and acting on unexpected opportunities when they arise.",
            "organisational-change-and-cycle-racing": "Lessons from competitive cycling applied to organizational transformation. Pacing, momentum, and knowing when to sprint.",
            "the-remarkable-year-of-ai-in-software": "Reflecting on a transformative year in AI and software development. The acceleration of capabilities and what it means for builders."
        };

        const slug = this.titleToSlug(title);
        return excerpts[slug] || "Strategic insights for navigating complexity and driving meaningful progress in challenging environments.";
    }

    /**
     * Converts title to URL-friendly slug
     * @param {string} title - Article title
     * @returns {string} URL slug
     */
    static titleToSlug(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-');
    }

    /**
     * Calculates reading time based on content length
     * @param {number} contentLength - Number of characters
     * @returns {number} Reading time in minutes
     */
    static calculateReadingTime(contentLength) {
        const averageWordLength = 6; // ~5 chars per word + 1 space
        const wordsPerMinute = 250;
        const estimatedWords = (contentLength || 0) / averageWordLength;
        return Math.max(1, Math.round(estimatedWords / wordsPerMinute));
    }

    /**
     * Formats date string
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    static formatDate(dateString) {
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

    /**
     * Creates pagination info
     * @param {Array} articles - Filtered articles
     * @param {number} currentPage - Current page number
     * @param {number} articlesPerPage - Articles per page
     * @returns {Object} Pagination info
     */
    static getPaginationInfo(articles, currentPage, articlesPerPage) {
        const totalPages = Math.ceil(articles.length / articlesPerPage);
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToShow = articles.slice(0, endIndex);
        const showing = Math.min(currentPage * articlesPerPage, articles.length);

        return {
            totalPages,
            articlesToShow,
            showing,
            hasMore: currentPage < totalPages
        };
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleDataProcessor;
} else if (typeof window !== 'undefined') {
    window.ArticleDataProcessor = ArticleDataProcessor;
}