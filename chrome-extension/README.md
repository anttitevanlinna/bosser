# Bosser LinkedIn Assistant Chrome Extension

A Chrome extension for publishing and scraping LinkedIn articles for the Bosser newsletter system.

## Features

- **Publishing**: Load drafts from Bosser project and auto-fill LinkedIn forms
- **Scraping**: Extract articles from LinkedIn (individual or batch)
- **Data Sync**: Export scraped data to sync with Bosser project
- **Visual Indicators**: Shows Bosser status on LinkedIn pages

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" 
4. Select the `chrome-extension` folder: `/Users/anttitevanlinna/Projects/bosser/chrome-extension/`
5. The extension should now appear in your toolbar

## Usage

### Publishing to LinkedIn

1. Go to LinkedIn article editor or newsletter creation
2. Click the Bosser extension icon
3. Click "Load Draft from Bosser" (currently loads checking-assumptions draft)
4. Click "Fill LinkedIn Form" to auto-populate title and content
5. Review and publish manually

### Scraping from LinkedIn

**Single Article:**
1. Navigate to any LinkedIn article
2. Click the Bosser extension icon  
3. Click "Scrape Current Article"

**Batch Scraping:**
1. Go to your LinkedIn profile articles: `/recent-activity/articles/`
2. Click the Bosser extension icon
3. Click "Scrape All Articles" 

### Data Management

1. Click "Sync to Bosser Project" to download scraped articles as JSON
2. Click "Download Scraped Data" for backup
3. Files download to your Downloads folder in Bosser-compatible format

## Files Structure

```
chrome-extension/
├── manifest.json     # Extension configuration
├── popup.html       # Extension popup interface  
├── popup.js         # Popup functionality
├── content.js       # LinkedIn page integration
├── background.js    # Background service worker
└── icons/           # Extension icons
```

## Development

The extension uses:
- **Manifest V3** for modern Chrome extension standards
- **Content Scripts** to interact with LinkedIn pages
- **Service Worker** for background processing
- **Chrome Storage API** for data persistence

## Current Limitations

- Draft loading is simulated (loads checking-assumptions)
- Sync downloads files instead of direct file system access
- No content scraping for batch operations (would need individual visits)
- Visual indicators are basic

## Future Enhancements

- Native file system integration for true sync
- Content scraping for batch operations  
- Multiple draft management
- Better LinkedIn form detection
- Automated publishing workflows