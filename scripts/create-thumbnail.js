const puppeteer = require('playwright');
const path = require('path');

async function createThumbnail() {
    console.log('🖼️  Creating static thumbnail from cover HTML...');
    
    const browser = await puppeteer.chromium.launch({
        headless: true
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match video dimensions
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Load the cover HTML
    const coverPath = path.resolve(__dirname, '../covers/cover.html');
    await page.goto(`file://${coverPath}`);
    
    // Wait for particles to load and settle
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const thumbnailPath = path.resolve(__dirname, '../covers/vision-serendipity-static-thumbnail.png');
    await page.screenshot({
        path: thumbnailPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    
    console.log('✅ Static thumbnail created:', thumbnailPath);
    
    await browser.close();
}

createThumbnail().catch(console.error);