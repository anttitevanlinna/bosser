// Date utility functions
// Shared utilities for date formatting across the Bosser project

/**
 * Format a date string in a consistent way
 * Used by: docs/js/articles.js, scripts/sync-scraped-to-site.js
 */
function formatDate(dateString) {
    if (!dateString || dateString === 'Unknown date') {
        return '2025';
    }
    
    try {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

/**
 * Simple date formatting for prepare-newsletter.js 
 * (different from formatDate - uses default locale)
 */
function formatDateSimple(dateString) {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return dateString;
    }
}

module.exports = {
    formatDate,
    formatDateSimple
};