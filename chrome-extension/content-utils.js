// Content utility functions for Chrome Extension
// Shared utilities for content processing across the extension

/**
 * Calculate reading time from actual content (string)
 * Used by: background.js
 */
function calculateReadingTimeFromContent(content) {
    if (!content) return '1 min';
    const wordsPerMinute = 250;
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / wordsPerMinute));
    return `${minutes} min`;
}

// Make available globally for background scripts
window.BosserContentUtils = {
    calculateReadingTimeFromContent: calculateReadingTimeFromContent
};