"""Static integration checks: python3 scripts/test-site-integration.py."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest
from urllib.parse import urljoin, urlparse, unquote

ROOT = Path(__file__).resolve().parents[1] / 'docs'
PAGES = ['index.html', 'training/index.html', 'training/curriculum/index.html',
         'training/check/index.html', 'training/readiness/index.html',
         'training/article.html', 'training/privacy.html']


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.feed((ROOT / path).read_text())

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class SiteIntegration(unittest.TestCase):
    def test_every_published_article_is_discoverable(self):
        index = json.loads((ROOT / 'data/articles_index.json').read_text())
        self.assertEqual({a['slug'] for a in index['articles']},
                         {p.stem for p in (ROOT / 'articles').glob('*.html')})

    def test_article_reading_times_match_the_library(self):
        index = json.loads((ROOT / 'data/articles_index.json').read_text())
        for article in index['articles']:
            with self.subTest(article=article['slug']):
                html = (ROOT / 'articles' / (article['slug'] + '.html')).read_text()
                minutes = int(re.search(r'(\d+) min read', html).group(1))
                self.assertEqual(minutes, article.get('reading_minutes'))

    def test_article_images_resolve(self):
        for path in (ROOT / 'articles').glob('*.html'):
            for tag, attrs in Page(path.relative_to(ROOT)).tags:
                ref = attrs.get('src', '')
                if tag == 'img' and ref and not urlparse(ref).scheme:
                    target = ROOT / unquote(urlparse(urljoin('/articles/' + path.name, ref)).path).lstrip('/')
                    with self.subTest(article=path.name, image=ref):
                        self.assertTrue(target.is_file())

    def test_training_is_reachable_without_leaving_site(self):
        links = [a for t, a in Page('index.html').tags if t == 'a']
        self.assertTrue(any(a.get('href') == 'training/' for a in links))
        self.assertFalse(any('github.io/agents-102' in a.get('href', '') for a in links))

    def test_training_pages_have_a_route_home(self):
        for path in PAGES[1:]:
            with self.subTest(page=path):
                page = Page(path)
                self.assertTrue(any(t == 'nav' and a.get('aria-label') == 'Main navigation'
                                    for t, a in page.tags))
                self.assertTrue(any(t == 'a' and urljoin('/' + path, a.get('href', '')) == '/'
                                    for t, a in page.tags))

    def test_metadata_uses_the_main_domain(self):
        for path in PAGES:
            with self.subTest(page=path):
                page = Page(path)
                if path == 'training/article.html':
                    # The renderer adds a slug-specific canonical after loading the article.
                    self.assertFalse(any(t == 'link' and a.get('rel') == 'canonical'
                                         for t, a in page.tags))
                    continue
                expected = 'https://bosser.consulting/' + path.removesuffix('index.html')
                self.assertTrue(any(t == 'link' and a.get('rel') == 'canonical'
                                    and a.get('href') == expected for t, a in page.tags))
                self.assertFalse(any(t == 'meta' and 'github.io/agents-102' in a.get('content', '')
                                     for t, a in page.tags))

    def test_local_links_assets_and_fragments_resolve(self):
        checked = 0
        for path in PAGES:
            for tag, attrs in Page(path).tags:
                ref = attrs.get('href') if tag in ('a', 'link') else attrs.get('src')
                if not ref or ref == '#' or urlparse(ref).scheme or ref.startswith('//'):
                    continue
                target = urlparse(urljoin('/' + path, ref))
                file = ROOT / unquote(target.path).lstrip('/')
                if file.is_dir():
                    file /= 'index.html'
                with self.subTest(page=path, link=ref):
                    self.assertTrue(file.is_file(), str(file))
                    if target.fragment and file.suffix == '.html':
                        ids = [a.get('id') for _, a in Page(file.relative_to(ROOT)).tags]
                        self.assertIn(unquote(target.fragment), ids)
                checked += 1
        self.assertGreater(checked, 50)


if __name__ == '__main__':
    unittest.main()
