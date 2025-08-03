#!/usr/bin/env python3
"""
LinkedIn Article Scraper for Antti Tevanlinna's Newsletter
Uses Playwright with stealth mode to scrape articles from LinkedIn
Works with existing Chrome session to avoid detection
"""

import asyncio
import json
import re
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.async_api import async_playwright
from playwright_stealth import stealth_async
import markdownify

class LinkedInArticleScraper:
    def __init__(self, headless=False, use_existing_chrome=False):
        self.headless = headless
        self.use_existing_chrome = use_existing_chrome
        self.articles = []
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.articles_dir = self.data_dir / "articles"
        
        # Ensure directories exist
        self.data_dir.mkdir(exist_ok=True)
        self.articles_dir.mkdir(exist_ok=True)
        
    async def setup_browser(self, playwright):
        """Set up browser with stealth mode"""
        if self.use_existing_chrome:
            # Connect to existing Chrome instance
            # You need to start Chrome with: chrome --remote-debugging-port=9222
            try:
                browser = await playwright.chromium.connect_over_cdp("http://localhost:9222")
                # Use existing context and page
                contexts = browser.contexts
                if contexts:
                    context = contexts[0]
                    pages = context.pages
                    if pages:
                        page = pages[0]
                    else:
                        page = await context.new_page()
                else:
                    context = await browser.new_context()
                    page = await context.new_page()
            except Exception as e:
                print(f"Could not connect to existing Chrome: {e}")
                print("Starting new browser instance...")
                browser = await self.launch_new_browser(playwright)
                context = await browser.new_context()
                page = await context.new_page()
        else:
            browser = await self.launch_new_browser(playwright)
            context = await browser.new_context()
            page = await context.new_page()
        
        # Apply stealth mode
        await stealth_async(page)
        
        return browser, context, page
    
    async def launch_new_browser(self, playwright):
        """Launch new browser with stealth settings"""
        return await playwright.chromium.launch(
            headless=self.headless,
            args=[
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        )
    
    async def get_article_urls_from_newsletter(self, page):
        """Extract article URLs from your newsletter page"""
        newsletter_url = "https://www.linkedin.com/in/anttitevanlinna/recent-activity/newsletter/"
        
        print(f"Navigating to: {newsletter_url}")
        await page.goto(newsletter_url, wait_until="networkidle")
        
        # Wait for content to load
        await page.wait_for_timeout(3000)
        
        # Look for article links
        article_links = []
        
        # Multiple selectors to find article links
        selectors = [
            'a[href*="/pulse/"]',
            'a[href*="/posts/"]',
            '.feed-shared-update-v2 a[href*="/pulse/"]',
            '.article-link'
        ]
        
        for selector in selectors:
            elements = await page.query_selector_all(selector)
            for element in elements:
                href = await element.get_attribute('href')
                if href and ('/pulse/' in href or '/posts/' in href):
                    full_url = urljoin('https://www.linkedin.com', href)
                    article_links.append(full_url)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_links = []
        for link in article_links:
            if link not in seen:
                seen.add(link)
                unique_links.append(link)
        
        print(f"Found {len(unique_links)} article URLs")
        return unique_links
    
    async def scrape_article(self, page, url):
        """Scrape a single LinkedIn article"""
        try:
            print(f"Scraping: {url}")
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(2000)
            
            article_data = {
                'url': url,
                'scraped_at': datetime.now().isoformat(),
            }
            
            # Extract title
            title_selectors = [
                'h1.reader-article-header__title',
                'h1.article-header__title',
                'h1',
                '.reader-article-header__title',
                '.article-title'
            ]
            
            title = None
            for selector in title_selectors:
                try:
                    title_element = await page.query_selector(selector)
                    if title_element:
                        title = await title_element.inner_text()
                        if title.strip():
                            break
                except:
                    continue
            
            article_data['title'] = title.strip() if title else 'No title found'
            
            # Extract content
            content_selectors = [
                '.reader-article-content',
                '.article-content',
                '.article-body',
                '.reader-content'
            ]
            
            content = None
            content_html = None
            for selector in content_selectors:
                try:
                    content_element = await page.query_selector(selector)
                    if content_element:
                        content = await content_element.inner_text()
                        content_html = await content_element.inner_html()
                        if content.strip():
                            break
                except:
                    continue
            
            article_data['content'] = content.strip() if content else 'No content found'
            article_data['content_html'] = content_html
            article_data['content_length'] = len(content) if content else 0
            
            # Convert to markdown
            if content_html:
                markdown_content = markdownify.markdownify(content_html, heading_style="ATX")
                article_data['content_markdown'] = markdown_content
            
            # Extract publish date
            date_selectors = [
                'time[datetime]',
                '.reader-publish-date',
                '.article-date'
            ]
            
            publish_date = None
            for selector in date_selectors:
                try:
                    date_element = await page.query_selector(selector)
                    if date_element:
                        datetime_attr = await date_element.get_attribute('datetime')
                        if datetime_attr:
                            publish_date = datetime_attr
                            break
                        else:
                            date_text = await date_element.inner_text()
                            if date_text:
                                publish_date = date_text.strip()
                                break
                except:
                    continue
            
            article_data['publish_date'] = publish_date
            
            # Extract author info (should be you)
            author_selectors = [
                '.reader-author-info',
                '.article-author'
            ]
            
            author = None
            for selector in author_selectors:
                try:
                    author_element = await page.query_selector(selector)
                    if author_element:
                        author = await author_element.inner_text()
                        if author.strip():
                            break
                except:
                    continue
            
            article_data['author'] = author.strip() if author else 'Antti Tevanlinna'
            
            # Generate slug for filename
            slug = self.generate_slug(article_data['title'])
            article_data['slug'] = slug
            
            return article_data
            
        except Exception as e:
            print(f"Error scraping article {url}: {e}")
            return None
    
    def generate_slug(self, title):
        """Generate a URL-friendly slug from title"""
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    async def save_article(self, article_data):
        """Save article data to files"""
        if not article_data:
            return
        
        slug = article_data['slug']
        
        # Save as JSON
        json_path = self.articles_dir / f"{slug}.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(article_data, f, indent=2, ensure_ascii=False)
        
        # Save as Markdown
        md_path = self.articles_dir / f"{slug}.md"
        markdown_content = f"""---
title: {article_data['title']}
url: {article_data['url']}
author: {article_data['author']}
publish_date: {article_data['publish_date']}
scraped_at: {article_data['scraped_at']}