const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const os = require('node:os');
const path = require('node:path');
const Processor = require('../docs/js/article-data');
const { calculateReadingTimeFromLength, calculateReadingTimeFromContent, createExcerpt } = require('../utils/content-utils');
const { formatDate, formatDateSimple } = require('../utils/date-utils');
const ArticleSystem = vm.runInNewContext(
    fs.readFileSync(require.resolve('../docs/js/articles'), 'utf8') + '\nArticleSystem;',
    { document: { addEventListener() {} }, ArticleDataProcessor: Processor }
);

test('character counts are converted to words before estimating reading time', () => {
    assert.equal(calculateReadingTimeFromLength(9000), 6);
    assert.equal(Processor.calculateReadingTime(9000), 6);
});

test('published reading time counts readable words and rounds up', () => {
    assert.equal(calculateReadingTimeFromContent('<p>' + 'word '.repeat(251) + '</p>'), '2 min');
});

test('new articles get a readable excerpt without requiring front matter', () => {
    const paragraph = 'Your first real agent changes how you see the work. Build it, check it, and carry what you learn into the next run.';
    assert.equal(createExcerpt('<h1>A title</h1><p>Antti Tevanlinna</p><p>' + paragraph + '</p>'), paragraph);
});

test('latest known dates come first; undated articles remain in stable order', () => {
    const articles = [{slug:'unknown'}, {slug:'old', publish_date:'2025-01-01'},
        {slug:'invalid', publish_date:'Unknown date'}, {slug:'new', publish_date:'2026-09-19'}];
    assert.deepEqual(Processor.sortByDate(articles).map(a => a.slug), ['new', 'old', 'unknown', 'invalid']);
    assert.equal(articles[0].slug, 'unknown');
    assert.equal(Processor.formatDate('Unknown date'), '');
    assert.equal(Processor.formatDate('bad date'), '');
});

test('publishers omit unknown dates and format known dates consistently', () => {
    assert.equal(formatDate('Unknown date'), '');
    assert.equal(formatDateSimple('bad date'), '');
    assert.equal(formatDate('2026-09-19'), 'Sep 19, 2026');
    assert.equal(formatDateSimple('2026-09-19'), 'Sep 19, 2026');
});

test('cards use the actual excerpt and measured reading time', () => {
    const card = ArticleSystem.prototype.createArticleCard({title:'A title with a subtitle',
        slug:'checking-assumptions', excerpt:'A distinctive summary.', reading_minutes:4, content_length:9000});
    assert.match(card, /A distinctive summary\./);
    assert.match(card, /4 min read/);
    assert.doesNotMatch(card, /2025/);
});

test('category controls support keyboard activation without activating on hover', () => {
    let markup = '';
    const listeners = [];
    const badge = {addEventListener(name) { listeners.push(name); }};
    ArticleSystem.prototype.renderCategories.call({categories:new Map([['AI', 2]]),
        categoriesCloud:{set innerHTML(value) { markup = value; }, querySelectorAll(){ return [badge]; }}});
    assert.match(markup, /<button[^>]+aria-pressed="false"/);
    assert.deepEqual(listeners, ['click']);
});

test('switching category restores the selected badge visibility', () => {
    const badge = {dataset:{category:'AI'}, style:{opacity:'0.5'},
        classList:{add(){}, remove(){}}, setAttribute(key, value) { this[key] = value; }};
    ArticleSystem.prototype.applyCategoryFilter.call({categoriesCloud:{querySelectorAll(){return [badge];}},
        filterArticles(){}, renderArticlesWithTransition(){}, updateStats(){}}, 'AI');
    assert.equal(badge.style.opacity, '');
    assert.equal(badge['aria-pressed'], 'true');
});

test('both publishers preserve the complete library and corrected reading times', () => {
    const NewsletterPreparer = require('./prepare-newsletter');
    const { ScrapedArticlesSiteSync } = require('./sync-scraped-to-site');
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bosser-library-'));
    try {
        const sourceDirectory = path.resolve(__dirname, '../data/articles');
        const docsDirectory = path.join(directory, 'docs');
        fs.mkdirSync(path.join(docsDirectory, 'data'), {recursive:true});
        const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../docs/data/articles_index.json')));
        NewsletterPreparer.prototype.updateArticlesIndex.call({
            articlesDir:sourceDirectory, dataDir:directory, docsDir:docsDirectory
        });
        const verify = () => {
            const actual = JSON.parse(fs.readFileSync(path.join(docsDirectory, 'data/articles_index.json')));
            assert.equal(actual.total_articles, expected.total_articles);
            assert.equal(actual.articles[0].slug, expected.articles[0].slug);
            for (const article of expected.articles) {
                const generated = actual.articles.find(a => a.slug === article.slug);
                assert.ok(generated, article.slug);
                assert.equal(generated.reading_minutes, article.reading_minutes, article.slug);
                assert.equal(generated.publish_date, article.publish_date, article.slug);
            }
        };
        verify();
        const sources = fs.readdirSync(sourceDirectory).filter(f=>f.endsWith('.json'))
            .map(f=>JSON.parse(fs.readFileSync(path.join(sourceDirectory, f))));
        ScrapedArticlesSiteSync.prototype.updateArticlesIndex.call({docsDataDir:path.join(docsDirectory, 'data')}, sources);
        verify();
    } finally {
        fs.rmSync(directory, {recursive:true, force:true});
    }
});
