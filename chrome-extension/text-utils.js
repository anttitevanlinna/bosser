// Text utility functions for Chrome Extension
// Shared utilities for text processing across the extension

/**
 * Generate a URL-friendly slug from a title
 * Used by: content.js, popup.js
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/\\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

// Make available globally for content scripts
window.BosserTextUtils = {
    generateSlug: generateSlug
};