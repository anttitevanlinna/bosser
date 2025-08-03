#!/usr/bin/env python3
"""
Manual Article Organization Tool
Helps organize manually downloaded LinkedIn articles
"""

import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import markdownify
from bs4 import BeautifulSoup

class ArticleOrganizer:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.articles_dir = self.data_dir / "articles"
        self.raw_dir = self.base_dir / "raw_downloads"
        
        # Create directories
        self.data_dir.mkdir(exist_ok=True)
        self.articles_dir.mkdir(exist_ok=True)
        self.raw_dir.mkdir(exist_ok=True)
        
        print(f"📁 Articles will be organized in: {self.articles_dir}")
        print(f"📁 Put raw downloads in: {self.raw_dir}")
    
    def process_downloaded_html(self, html_file_path):
        """Process a manually downloaded HTML file"""
        html_path = Path(html_file_path)
        
        if not html_path.exists():
            print(f"❌ File not found: {html_path}")
            return None
        
        print(f"📄 Processing: {html_path.name}")
        
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract article data
        article_data = self.extract_article_data(soup, html_path.name)
        
        if article_data:
            # Save organized files
            self.save_article(article_data)
            print(f"✅ Processed: {article_data['title']}")
            return article_data
        else:
            print(f"❌ Could not extract data from {html_path.name}")
            return None
    
    def extract_article_data(self, soup, filename):
        """Extract article data from BeautifulSoup object"""
        article_data = {
            'source_file': filename,
            'processed_at': datetime.now().isoformat(),
        }
        
        # Extract title - try multiple selectors
        title_selectors = [
            'h1.reader-article-header__title',
            'h1.article-header__title',
            'h1',
            '.reader-article-header__title',
            '.article-title',
            'title'
        ]
        
        title = None
        for selector in title_selectors:
            element = soup.select_one(selector)
            if element:
                title = element.get_text(strip=True)
                if title and len(title) > 10:  # Reasonable title length
                    break
        
        # Clean up title (remove " | LinkedIn" etc.)
        if title:
            title = re.sub(r'\s*\|\s*LinkedIn.*$', '', title)
            title = title.strip()
        
        article_data['title'] = title or 'Untitled Article'
        
        # Extract URL from canonical link or meta
        url_selectors = [
            'link[rel="canonical"]',
            'meta[property="og:url"]'
        ]
        
        url = None
        for selector in url_selectors:
            element = soup.select_one(selector)
            if element:
                url = element.get('href') or element.get('content')
                if url:
                    break
        
        article_data['url'] = url or 'Unknown URL'
        
        # Extract content
        content_selectors = [
            '.reader-article-content',
            '.article-content',
            '.article-body',
            '.reader-content',
            '[data-module-id="reader-article-content"]'
        ]
        
        content_element = None
        for selector in content_selectors:
            element = soup.select_one(selector)
            if element:
                content_element = element
                break
        
        if content_element:
            # Get clean text
            content_text = content_element.get_text(separator='\n', strip=True)
            
            # Get HTML for markdown conversion
            content_html = str(content_element)
            
            # Convert to markdown
            markdown_content = markdownify.markdownify(content_html, heading_style="ATX")
            
            article_data.update({
                'content': content_text,
                'content_html': content_html,
                'content_markdown': markdown_content,
                'content_length': len(content_text)
            })
        else:
            article_data.update({
                'content': 'Content not found',
                'content_html': '',
                'content_markdown': '',
                'content_length': 0
            })
        
        # Extract publish date
        date_selectors = [
            'time[datetime]',
            '.reader-publish-date',
            '.article-date',
            'meta[property="article:published_time"]'
        ]
        
        publish_date = None
        for selector in date_selectors:
            element = soup.select_one(selector)
            if element:
                publish_date = element.get('datetime') or element.get('content') or element.get_text(strip=True)
                if publish_date:
                    break
        
        article_data['publish_date'] = publish_date or 'Unknown date'
        
        # Set author
        article_data['author'] = 'Antti Tevanlinna'
        
        # Generate slug
        slug = self.generate_slug(article_data['title'])
        article_data['slug'] = slug
        
        return article_data
    
    def generate_slug(self, title):
        """Generate a URL-friendly slug from title"""
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def save_article(self, article_data):
        """Save article data to organized files"""
        slug = article_data['slug']
        
        # Save as JSON
        json_path = self.articles_dir / f"{slug}.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(article_data, f, indent=2, ensure_ascii=False)
        
        # Save as Markdown
        md_path = self.articles_dir / f"{slug}.md"
        markdown_content = f"""---
title: "{article_data['title']}"
url: {article_data['url']}
author: {article_data['author']}
publish_date: {article_data['publish_date']}
processed_at: {article_data['processed_at']}
source_file: {article_data['source_file']}
content_length: {article_data['content_length']}
slug: {article_data['slug']}
---

# {article_data['title']}

{article_data.get('content_markdown', article_data.get('content', ''))}
"""
        
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        print(f"💾 Saved: {json_path.name} and {md_path.name}")
    
    def process_all_downloads(self):
        """Process all HTML files in the raw downloads directory"""
        html_files = list(self.raw_dir.glob("*.html"))
        
        if not html_files:
            print(f"📭 No HTML files found in {self.raw_dir}")
            print("💡 Save downloaded LinkedIn articles as .html files in that directory")
            return []
        
        processed_articles = []
        for html_file in html_files:
            article_data = self.process_downloaded_html(html_file)
            if article_data:
                processed_articles.append(article_data)
        
        return processed_articles
    
    def create_index(self):
        """Create an index of all articles"""
        json_files = list(self.articles_dir.glob("*.json"))
        articles = []
        
        for json_file in json_files:
            with open(json_file, 'r', encoding='utf-8') as f:
                article_data = json.load(f)
                articles.append({
                    'title': article_data.get('title'),
                    'slug': article_data.get('slug'),
                    'url': article_data.get('url'),
                    'publish_date': article_data.get('publish_date'),
                    'content_length': article_data.get('content_length', 0),
                    'processed_at': article_data.get('processed_at')
                })
        
        # Sort by publish date (newest first)
        articles.sort(key=lambda x: x.get('publish_date', ''), reverse=True)
        
        # Save index
        index_path = self.data_dir / "articles_index.json"
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump({
                'total_articles': len(articles),
                'last_updated': datetime.now().isoformat(),
                'articles': articles
            }, f, indent=2, ensure_ascii=False)
        
        print(f"📋 Created index with {len(articles)} articles: {index_path}")
        return articles

def main():
    organizer = ArticleOrganizer()
    
    print("🎯 LinkedIn Article Organizer")
    print("=" * 40)
    
    # Process existing article
    existing_article = organizer.base_dir / "Ai and certainty don't mix _ LinkedIn.html"
    if existing_article.exists():
        print("🔄 Processing existing article...")
        organizer.process_downloaded_html(existing_article)
    
    # Process any articles in raw_downloads
    processed = organizer.process_all_downloads()
    
    # Create index
    organizer.create_index()
    
    print(f"\n✨ Summary: Processed {len(processed)} articles")
    print(f"📁 Articles saved in: {organizer.articles_dir}")
    print(f"📋 Index created: {organizer.data_dir}/articles_index.json")

if __name__ == "__main__":
    main()
