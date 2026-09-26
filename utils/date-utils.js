// Date utility functions
// Shared utilities for date formatting across the Bosser project

/**
 * Format a date string in a consistent way
 * Used by: docs/js/articles.js, scripts/sync-scraped-to-site.js
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    if (!dateString || !Number.isFinite(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
    });
}

/**
 * Simple date formatting for prepare-newsletter.js 
 * Uses the same publication date format as the other publisher.
 */
function formatDateSimple(dateString) {
    return formatDate(dateString);
}

module.exports = {
    formatDate,
    formatDateSimple
};
