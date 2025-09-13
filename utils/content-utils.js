// Content utility functions
// Shared utilities for content processing across the Bosser project

/**
 * Calculate reading time from content length (number of characters)
 * Used by: docs/js/articles.js, scripts/sync-scraped-to-site.js
 * Note: Uses 250 words per minute
 */
function calculateReadingTimeFromLength(contentLength) {
    const wordsPerMinute = 250;
    return Math.max(1, Math.round((contentLength || 0) / wordsPerMinute));
}

/**
 * Calculate reading time from actual content (string)
 * Used by: chrome-extension/background.js
 * Note: Uses 250 words per minute, counts actual words
 */
function calculateReadingTimeFromContent(content) {
    if (!content) return '1 min';
    const wordsPerMinute = 250;
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / wordsPerMinute));
    return `${minutes} min`;
}

/**
 * Estimate reading time from content (string) with different WPM
 * Used by: scripts/prepare-newsletter.js
 * Note: Uses 200 words per minute (different from above)
 */
function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
}

module.exports = {
    calculateReadingTimeFromLength,
    calculateReadingTimeFromContent,
    estimateReadingTime
};