/**
 * Bosser Articles Loading System
 * Handles dynamic loading and display of articles from JSON data
 */
class ArticleSystem {
    /**
     * Creates a new ArticleSystem instance
     * @param {string} containerId - The ID of the HTML container element
     * @param {string} dataPath - Path to the articles JSON data file
     */
    constructor(containerId, dataPath = './data/articles_index.json') {
        this.container = document.getElementById(containerId);
        this.dataPath = dataPath;
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 12;
        this.searchQuery = '';
        
        // Get additional UI elements
        this.searchInput = document.getElementById('article-search');
        this.statsElement = document.getElementById('articles-count');
        this.paginationElement = document.getElementById('articles-pagination');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.categoriesCloud = document.getElementById('categories-cloud');
        this.categoryFilterStatus = document.getElementById('category-filter-status');
        this.activeCategoryElement = document.getElementById('active-category');
        this.clearCategoryFilter = document.getElementById('clear-category-filter');
        
        // Category state
        this.activeCategory = null;
        this.categories = new Map(); // category -> count
        
        // Timeout references for hover filtering
        this.filterTimeout = null;
        this.clearFilterTimeout = null;
        
        if (!this.container) {
            console.warn(`Articles container '${containerId}' not found`);
            return;
        }
        
        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterArticles();
                this.currentPage = 1;
                this.renderArticles();
            });
        }

        // Load more functionality
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Category filtering
        if (this.clearCategoryFilter) {
            this.clearCategoryFilter.addEventListener('click', () => {
                this.clearCategoryFiltering();
            });
        }
    }

    async init() {
        try {
            await this.loadArticles();
            this.extractCategories();
            this.renderCategories();
            this.filterArticles();
            this.renderArticles();
            this.updateStats();
        } catch (error) {
            console.error('Failed to load articles:', error);
            this.container.innerHTML = '<p style="color: #ff6b35;">Unable to load articles. Please refresh the page.</p>';
        }
    }

    /**
     * Loads articles data from the JSON file
     * @returns {Promise<void>}
     */
    async loadArticles() {
        const response = await fetch(this.dataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.articles = data.articles || [];
    }

    extractCategories() {
        // Use pure function for extraction
        this.categories = ArticleDataProcessor.extractCategories(this.articles);
    }

    renderCategories() {
        if (!this.categoriesCloud || this.categories.size === 0) return;

        const sortedCategories = ArticleDataProcessor.sortCategoriesByCount(this.categories);

        const categoryBadges = sortedCategories.map(([category, count]) => {
            return `
                <div class="category-badge" data-category="${category}">
                    ${category}
                    <span class="category-badge-count">${count}</span>
                </div>
            `;
        }).join('');

        this.categoriesCloud.innerHTML = categoryBadges;

        // Add event listeners to category badges
        this.categoriesCloud.querySelectorAll('.category-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                const category = badge.dataset.category;
                // Clear any existing timeout
                if (this.filterTimeout) {
                    clearTimeout(this.filterTimeout);
                }
                // Apply filter after short delay to prevent rapid filtering
                this.filterTimeout = setTimeout(() => {
                    this.applyCategoryFilter(category);
                }, 200);
            });

            badge.addEventListener('mouseleave', () => {
                // Clear timeout if user leaves before delay
                if (this.filterTimeout) {
                    clearTimeout(this.filterTimeout);
                }
            });
        });
    }

    /**
     * Filters articles based on current search and category criteria
     */
    filterArticles() {
        // Use pure function for filtering
        this.filteredArticles = ArticleDataProcessor.filterArticles(
            this.articles, 
            this.searchQuery, 
            this.activeCategory
        );
    }


    /**
     * Applies a category filter to show only articles with specific tags
     * @param {string} category - The category to filter by
     */
    applyCategoryFilter(category) {
        this.activeCategory = category;
        this.currentPage = 1;
        
        // Update UI state
        if (this.categoryFilterStatus && this.activeCategoryElement) {
            this.categoryFilterStatus.style.display = 'flex';
            this.activeCategoryElement.textContent = category;
        }

        // Update category badges
        this.categoriesCloud.querySelectorAll('.category-badge').forEach(badge => {
            if (badge.dataset.category === category) {
                badge.classList.add('active');
            } else {
                badge.classList.remove('active');
                badge.style.opacity = '0.5';
            }
        });

        // Apply filter and re-render
        this.filterArticles();
        this.renderArticlesWithTransition();
        this.updateStats();
    }

    clearCategoryFiltering() {
        this.activeCategory = null;
        this.currentPage = 1;

        // Hide filter status
        if (this.categoryFilterStatus) {
            this.categoryFilterStatus.style.display = 'none';
        }

        // Reset category badges
        this.categoriesCloud.querySelectorAll('.category-badge').forEach(badge => {
            badge.classList.remove('active');
            badge.style.opacity = '';
        });

        // Apply filter and re-render
        this.filterArticles();
        this.renderArticlesWithTransition();
        this.updateStats();
    }

    renderArticlesWithTransition() {
        // Add fade-out animation to current articles
        const currentCards = this.container.querySelectorAll('.article-card');
        currentCards.forEach(card => {
            card.classList.add('filtering-out');
        });

        // Wait for fade-out, then render new articles
        setTimeout(() => {
            this.renderArticles();
        }, 200);
    }

    /**
     * Renders the filtered articles to the DOM with pagination
     */
    renderArticles() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(0, endIndex);

        
        // Clear container and add articles with staggered animation
        this.container.innerHTML = '';
        
        articlesToShow.forEach((article, index) => {
            const articleElement = this.createArticleElement(article, index);
            this.container.appendChild(articleElement);
        });

        // Update pagination visibility
        this.updatePagination(totalPages);
        this.updateStats();
    }

    createArticleElement(article, index) {
        const div = document.createElement('div');
        div.className = 'article-card';

        // Calculate delay based on position on current page, not absolute position
        const articlesOnPreviousPages = (this.currentPage - 1) * this.articlesPerPage;
        const relativeIndex = index - articlesOnPreviousPages;
        const delay = relativeIndex * 0.3;

        div.style.animationDelay = `${delay}s`;
        div.style.setProperty('--delay', `${delay}s`);
        div.innerHTML = this.createArticleCard(article);
        return div;
    }

    loadMoreArticles() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        
        if (this.currentPage < totalPages) {
            this.showLoadingSpinner(true);
            
            // Simulate loading delay for smooth UX
            setTimeout(() => {
                this.currentPage++;
                this.renderArticles();
                this.showLoadingSpinner(false);
            }, 500);
        }
    }

    showLoadingSpinner(show) {
        if (this.loadMoreBtn) {
            const spinner = this.loadMoreBtn.querySelector('.load-more-spinner');
            const text = this.loadMoreBtn.querySelector('span');
            
            if (show) {
                spinner.style.display = 'block';
                text.textContent = 'Loading...';
                this.loadMoreBtn.disabled = true;
            } else {
                spinner.style.display = 'none';
                text.textContent = 'Load More Articles';
                this.loadMoreBtn.disabled = false;
            }
        }
    }

    updatePagination(totalPages) {
        if (!this.paginationElement || !this.loadMoreBtn) return;

        if (this.currentPage < totalPages) {
            this.paginationElement.style.display = 'block';
        } else {
            this.paginationElement.style.display = 'none';
        }
    }

    updateStats() {
        if (!this.statsElement) return;

        const showing = Math.min(this.currentPage * this.articlesPerPage, this.filteredArticles.length);
        const total = this.filteredArticles.length;
        const totalArticles = this.articles.length;

        let statsText = `${showing} of ${total} articles`;
        if (total !== totalArticles) {
            statsText += ` (filtered from ${totalArticles})`;
        }

        this.statsElement.textContent = statsText;
    }

    /**
     * Creates HTML markup for an individual article card
     * @param {Object} article - The article data object
     * @returns {string} HTML string for the article card
     */
    createArticleCard(article) {
        const excerpt = ArticleDataProcessor.getExcerpt(article.title);
        const readingTime = ArticleDataProcessor.calculateReadingTime(article.content_length);
        const formattedDate = ArticleDataProcessor.formatDate(article.publish_date);
        const tags = article.tags || [];
        const primaryTag = tags.length > 0 ? tags[0] : null;
        
        return `
            <div class="article-meta">
                <div class="article-meta-item">
                    <span>${readingTime} min read</span>
                </div>
                <div class="article-meta-item">
                    <span>${formattedDate}</span>
                </div>
                ${primaryTag ? `<div class="article-tag">${primaryTag}</div>` : ''}
            </div>
            <a href="./articles/${article.slug}.html" class="article-title">
                ${article.title}
            </a>
            <div class="article-excerpt">
                ${excerpt}
            </div>
            <a href="./articles/${article.slug}.html" class="read-more">
                Read Article
            </a>
        `;
    }






    /**
     * Refreshes the article system by reloading data
     * @returns {Promise<void>}
     */
    refresh() {
        this.init();
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('articles-container');
    if (container) {
        window.articleSystem = new ArticleSystem('articles-container');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArticleSystem;
}