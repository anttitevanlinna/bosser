// LinkedIn selectors configuration
// Shared selectors for LinkedIn elements across the Bosser project

// Title element selectors (for extraction)
const TITLE_SELECTORS = [
    'h1',
    '[data-test-id="article-title"]',
    '.article-title',
    'h1.break-words'
];

// Content element selectors (for extraction)
const CONTENT_SELECTORS = [
    '.article-content',
    '[data-test-id="article-content"]',
    '.break-words',
    'article .break-words',
    '.article-body'
];

// Author element selectors (for extraction)
const AUTHOR_SELECTORS = [
    '[data-test-id="article-author"]',
    '.article-author',
    '.feed-shared-actor__name',
    'a[href*="/in/"] span:first-child'
];

// Title input selectors (for form filling)
const TITLE_INPUT_SELECTORS = [
    'input[placeholder*="Title"]',
    '[contenteditable][aria-label*="title"]',
    '[placeholder*="Title"]',
    'div[aria-label*="title"]',
    '[data-test-id="article-title"]',
    '.article-title',
    'h1[contenteditable]'
];

// Content input selectors (for form filling)
const CONTENT_INPUT_SELECTORS = [
    '.ProseMirror',
    '[contenteditable][role="textbox"]:not([aria-label*="Title"])',
    'div[aria-label*="content"]',
    '[data-test-id="article-content"]'
];

module.exports = {
    TITLE_SELECTORS,
    CONTENT_SELECTORS,
    AUTHOR_SELECTORS,
    TITLE_INPUT_SELECTORS,
    CONTENT_INPUT_SELECTORS
};