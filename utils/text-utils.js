// Text utility functions
// Shared utilities for text processing across the Bosser project

/**
 * Generate a URL-friendly slug from a title
 * Used by: content.js, popup.js, linkedin-articles-scraper.js, sync-scraped-to-site.js
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

module.exports = {
    generateSlug
};