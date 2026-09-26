// Content utility functions
// Shared utilities for content processing across the Bosser project

/**
 * Calculate reading time from content length (number of characters)
 * Used by: docs/js/articles.js, scripts/sync-scraped-to-site.js
 * Note: Uses 250 words per minute
 */
function calculateReadingTimeFromLength(contentLength) {
    const wordsPerMinute = 250;
    return Math.max(1, Math.round((contentLength || 0) / 6 / wordsPerMinute));
}

/**
 * Calculate reading time from actual content (string)
 * Used by: chrome-extension/background.js
 * Note: Uses 250 words per minute, counts actual words
 */
function calculateReadingTimeFromContent(content) {
    if (!content) return '1 min';
    const wordsPerMinute = 250;
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
    return `${minutes} min`;
}

/**
 * Estimate reading time from content (string)
 * Used by: scripts/prepare-newsletter.js
 * Note: Uses the same 250 words per minute as published articles
 */
function estimateReadingTime(content) {
    return calculateReadingTimeFromContent(content);
}

/** Use the opening paragraph when a publisher has no supplied summary. */
function createExcerpt(content = '') {
    const paragraphs = content.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || content.split(/\n\s*\n/);
    const plain = paragraphs.map(paragraph => paragraph.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ').trim()).filter(Boolean);
    const opening = plain.find(paragraph => paragraph.length >= 60 && !paragraph.startsWith('#')) || plain[0] || '';
    return opening.length <= 240 ? opening : opening.slice(0, 237).replace(/\s+\S*$/, '') + '…';
}

module.exports = {
    calculateReadingTimeFromLength,
    calculateReadingTimeFromContent,
    estimateReadingTime,
    createExcerpt
};
