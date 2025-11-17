#!/usr/bin/env node

// Simple HTTP server to receive extension logs and display them
const http = require('http');
const fs = require('fs');
const path = require('path');

class BosserPluginCommander {
    constructor() {
        this.port = 3001;
        this.logs = [];
        this.server = null;
        this.scrapingStrategies = this.initializeScrapingStrategies();
        this.failureHistory = new Map(); // Track failures and adaptations
        this.codeVersions = new Map(); // Track code versions for different scenarios
        this.serverVersion = "3.0.0"; // Plugin Commander version
    }
    
    initializeScrapingStrategies() {
        return {
            linkedin_article_v1: {
                version: 1,
                name: "LinkedIn Article Scraper v1",
                code: `
                    // LinkedIn Article Scraping Strategy v1
                    function scrapeLinkedInArticle() {
                        const result = {
                            title: '',
                            content: '',
                            author: '',
                            publishDate: '',
                            tags: [],
                            url: window.location.href,
                            scrapedAt: new Date().toISOString(),
                            strategy: 'linkedin_article_v1'
                        };
                        
                        // Title extraction with multiple fallbacks
                        const titleSelectors = [
                            'h1.break-words',
                            'h1',
                            '[data-test-id*="title"]',
                            '.article-title'
                        ];
                        
                        for (const selector of titleSelectors) {
                            const element = document.querySelector(selector);
                            if (element && element.textContent.trim()) {
                                result.title = element.textContent.trim();
                                break;
                            }
                        }
                        
                        // Content extraction
                        const contentSelectors = [
                            '.article-content',
                            'article .break-words',
                            '.break-words',
                            '[data-test-id*="content"]',
                            'div[class*="article-body"]'
                        ];
                        
                        for (const selector of contentSelectors) {
                            const element = document.querySelector(selector);
                            if (element && element.innerText.trim()) {
                                result.content = element.innerText.trim();
                                break;
                            }
                        }
                        
                        // Author extraction
                        const authorSelectors = [
                            '.feed-shared-actor__name',
                            '[data-test-id*="author"]',
                            'a[href*="/in/"] span:first-child'
                        ];
                        
                        for (const selector of authorSelectors) {
                            const element = document.querySelector(selector);
                            if (element && element.textContent.trim()) {
                                result.author = element.textContent.trim();
                                break;
                            }
                        }
                        
                        // Date extraction
                        const dateElement = document.querySelector('time[datetime]') || 
                                          document.querySelector('time');
                        if (dateElement) {
                            result.publishDate = dateElement.getAttribute('datetime') || 
                                               dateElement.textContent.trim();
                        }
                        
                        // Hashtag extraction
                        const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"]');
                        result.tags = Array.from(hashtagElements).map(el => 
                            el.textContent.trim().replace('#', '')
                        );
                        
                        // Generate slug
                        result.slug = result.title
                            .toLowerCase()
                            .replace(/[^a-z0-9\\s-]/g, '')
                            .replace(/\\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim('-');
                        
                        return result;
                    }
                    
                    // Execute and return result
                    return scrapeLinkedInArticle();
                `,
                lastUpdated: new Date().toISOString(),
                successRate: 0
            },
            
            linkedin_form_fill_v1: {
                version: 1,
                name: "LinkedIn Form Filler v1", 
                code: `
                    // LinkedIn Form Filling Strategy v1
                    function fillLinkedInForm(draftData) {
                        const result = {
                            titleFilled: false,
                            contentFilled: false,
                            errors: [],
                            strategy: 'linkedin_form_fill_v1'
                        };
                        
                        try {
                            // Fill title
                            const titleSelectors = [
                                'input[placeholder*="Title" i]',
                                '[contenteditable][aria-label*="title" i]',
                                'h1[contenteditable]'
                            ];
                            
                            for (const selector of titleSelectors) {
                                const titleField = document.querySelector(selector);
                                if (titleField) {
                                    titleField.focus();
                                    if (titleField.tagName === 'INPUT') {
                                        titleField.value = draftData.title;
                                    } else {
                                        titleField.textContent = draftData.title;
                                    }
                                    titleField.dispatchEvent(new Event('input', { bubbles: true }));
                                    result.titleFilled = true;
                                    break;
                                }
                            }
                            
                            // Fill content
                            const contentSelectors = [
                                '.ProseMirror',
                                '[contenteditable][role="textbox"]:not([aria-label*="Title"])',
                                '[contenteditable].editor'
                            ];
                            
                            for (const selector of contentSelectors) {
                                const contentField = document.querySelector(selector);
                                if (contentField && contentField.offsetParent !== null) {
                                    contentField.focus();
                                    const formattedContent = draftData.content.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>');
                                    contentField.innerHTML = \`<p>\${formattedContent}</p>\`;
                                    
                                    // Add hashtags
                                    if (draftData.tags && draftData.tags.length > 0) {
                                        const hashtags = draftData.tags.map(tag => \`#\${tag.replace(/\\s+/g, '')}\`).join(' ');
                                        contentField.innerHTML += \`<p><br></p><p>\${hashtags}</p>\`;
                                    }
                                    
                                    contentField.dispatchEvent(new Event('input', { bubbles: true }));
                                    result.contentFilled = true;
                                    break;
                                }
                            }
                            
                        } catch (error) {
                            result.errors.push(error.message);
                        }
                        
                        return result;
                    }
                    
                    // Execute with provided draft data
                    return fillLinkedInForm(arguments[0]);
                `,
                lastUpdated: new Date().toISOString(),
                successRate: 0
            }
        };
    }
    
    start() {
        this.server = http.createServer((req, res) => {
            // Set CORS headers for extension
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            
            if (req.url === '/bosser-logs' && req.method === 'POST') {
                this.handleLogs(req, res);
            } else if (req.url === '/logs' && req.method === 'GET') {
                this.serveLogs(req, res);
            } else if (req.url === '/get-code' && req.method === 'POST') {
                this.serveExecutableCode(req, res);
            } else if (req.url === '/report-failure' && req.method === 'POST') {
                this.handleScrapingFailure(req, res);
            } else if (req.url === '/analyze' && req.method === 'POST') {
                this.handlePageAnalysis(req, res);
            } else if (req.url === '/' && req.method === 'GET') {
                this.serveHomePage(req, res);
            } else if (req.url === '/version' && req.method === 'GET') {
                this.serveVersion(req, res);
            } else if (req.url === '/save-scraped-data' && req.method === 'POST') {
                this.saveScrapedData(req, res);
            } else if (req.url === '/latest-article' && req.method === 'GET') {
                this.serveLatestArticle(req, res);
            } else if (req.url === '/covers/mechanical-duck-cover.webm' && req.method === 'GET') {
                this.serveCoverVideo(req, res);
            } else if (req.url === '/publish-to-linkedin' && req.method === 'POST') {
                this.handleLinkedInPublishing(req, res);
            } else if (req.url === '/upload-cover-video' && req.method === 'POST') {
                this.handleCoverVideoUpload(req, res);
            } else if (req.url === '/execute-publishing-step' && req.method === 'POST') {
                this.handlePublishingStep(req, res);
            } else if (req.url === '/mark-article-published' && req.method === 'POST') {
                this.markArticleAsPublished(req, res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        
        this.server.listen(this.port, () => {
            console.log(`🚀 Bosser Plugin Commander running on http://localhost:${this.port}`);
            console.log(`📊 View logs at: http://localhost:${this.port}/logs`);
            console.log(`🏠 Homepage at: http://localhost:${this.port}/`);
            console.log(`📄 Latest article: http://localhost:${this.port}/latest-article`);
            console.log(`🎬 Cover video: http://localhost:${this.port}/covers/mechanical-duck-cover.webm`);
            console.log(`\n🔗 LinkedIn Publishing Endpoints:`);
            console.log(`   📝 Create plan: POST /publish-to-linkedin`);
            console.log(`   ⚡ Execute step: POST /execute-publishing-step`);
            console.log(`   🎥 Upload video: POST /upload-cover-video`);
            console.log(`   ✅ Mark published: POST /mark-article-published`);
            console.log(`\n📡 Extension will send logs to: http://localhost:${this.port}/bosser-logs`);
            console.log(`\n⏳ Waiting for plugin commands...`);
        });
    }
    
    async handleLogs(req, res) {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    
                    if (data.logs && Array.isArray(data.logs)) {
                        data.logs.forEach(log => {
                            this.logs.push(log);
                            this.displayLog(log);
                        });
                    }
                    
                    // Save to file
                    this.saveLogsToFile();
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        received: data.logs ? data.logs.length : 0,
                        totalLogs: this.logs.length 
                    }));
                    
                } catch (error) {
                    console.error('❌ Error parsing log data:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error handling logs:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    displayLog(log) {
        const timestamp = new Date(log.timestamp).toLocaleTimeString();
        const level = log.level.toUpperCase().padEnd(8);
        const url = log.url ? new URL(log.url).pathname : 'background';
        
        // Color-coded console output
        const colors = {
            INFO: '\x1b[36m',      // Cyan
            SUCCESS: '\x1b[32m',   // Green  
            WARNING: '\x1b[33m',   // Yellow
            ERROR: '\x1b[31m',     // Red
            CRITICAL: '\x1b[41m'   // Red background
        };
        
        const color = colors[log.level] || colors.INFO;
        const reset = '\x1b[0m';
        
        console.log(`${color}[${timestamp}] ${level}${reset} ${log.message}`);
        
        if (log.data && Object.keys(log.data).length > 0) {
            console.log(`  📊 Data:`, log.data);
        }
        
        if (log.data && log.data.error) {
            console.log(`  🚨 Error:`, log.data.error.message);
            if (log.data.error.stack) {
                console.log(`  📍 Stack:`, log.data.error.stack.split('\\n')[0]);
            }
        }
        
        console.log(`  🌐 URL: ${url}`);
        console.log(''); // Empty line for readability
    }
    
    async serveExecutableCode(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', () => {
                try {
                    const request = JSON.parse(body);
                    const { action, pageType, url, previousFailures } = request;
                    
                    console.log(`🤖 Code request: ${action} for ${pageType} (${previousFailures || 0} failures)`);
                    
                    // Determine which strategy to use
                    let strategyKey = this.selectStrategy(action, pageType, previousFailures);
                    let strategy = this.scrapingStrategies[strategyKey];
                    
                    if (!strategy) {
                        // Generate new strategy if none exists
                        strategy = this.generateNewStrategy(action, pageType, request);
                        strategyKey = `${action}_${pageType}_v${Object.keys(this.scrapingStrategies).length + 1}`;
                        this.scrapingStrategies[strategyKey] = strategy;
                    }
                    
                    console.log(`📝 Serving strategy: ${strategy.name}`);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        strategy: strategyKey,
                        code: strategy.code,
                        version: strategy.version,
                        name: strategy.name
                    }));
                    
                } catch (error) {
                    console.error('❌ Error parsing code request:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error serving code:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    async handleScrapingFailure(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', () => {
                try {
                    const failure = JSON.parse(body);
                    const { strategy, error, pageAnalysis, url, timestamp } = failure;
                    
                    console.log(`🚨 Scraping failure reported: ${strategy}`);
                    console.log(`   Error: ${error}`);
                    console.log(`   URL: ${url}`);
                    
                    // Store failure for analysis
                    const failureKey = `${strategy}_${Date.now()}`;
                    this.failureHistory.set(failureKey, {
                        strategy,
                        error,
                        pageAnalysis,
                        url,
                        timestamp: timestamp || new Date().toISOString()
                    });
                    
                    // Generate improved strategy
                    const newStrategy = this.generateImprovedStrategy(strategy, failure);
                    
                    if (newStrategy) {
                        const newKey = `${strategy.split('_v')[0]}_v${this.getNextVersion(strategy)}`;
                        this.scrapingStrategies[newKey] = newStrategy;
                        
                        console.log(`🔧 Generated improved strategy: ${newStrategy.name}`);
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            message: 'Failure recorded and new strategy generated',
                            newStrategy: newKey,
                            newCode: newStrategy.code
                        }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            message: 'Failure recorded for analysis'
                        }));
                    }
                    
                } catch (error) {
                    console.error('❌ Error parsing failure report:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid failure report' }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error handling failure:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    selectStrategy(action, pageType, previousFailures = 0) {
        // Find the best strategy for this action/pageType combination
        const baseKey = `linkedin_${pageType}`;
        const strategies = Object.keys(this.scrapingStrategies)
            .filter(key => key.startsWith(baseKey))
            .sort((a, b) => {
                // Prefer newer versions if there have been failures
                if (previousFailures > 0) {
                    const versionA = parseInt(a.split('_v')[1] || '1');
                    const versionB = parseInt(b.split('_v')[1] || '1');
                    return versionB - versionA; // Newer first
                }
                // Otherwise prefer higher success rate
                const successA = this.scrapingStrategies[a].successRate || 0;
                const successB = this.scrapingStrategies[b].successRate || 0;
                return successB - successA;
            });
        
        return strategies[0] || null;
    }
    
    generateNewStrategy(action, pageType, request) {
        // This would be where the LLM generates new code based on the request
        console.log(`🤖 LLM: Generating new strategy for ${action} on ${pageType}`);
        
        // For now, return a basic strategy
        return {
            version: 1,
            name: `Generated ${action} strategy for ${pageType}`,
            code: `
                // Auto-generated strategy
                function executeStrategy() {
                    return {
                        success: false,
                        error: 'Generated strategy needs implementation',
                        strategy: '${action}_${pageType}_generated'
                    };
                }
                return executeStrategy();
            `,
            lastUpdated: new Date().toISOString(),
            successRate: 0,
            generated: true
        };
    }
    
    generateImprovedStrategy(oldStrategy, failure) {
        console.log(`🤖 LLM: Analyzing failure and generating improved strategy`);
        console.log(`   Failed selectors: ${JSON.stringify(failure.pageAnalysis?.selectorTests)}`);
        
        // This is where I (the LLM) would analyze the failure and generate new code
        // For now, return null to indicate no improvement generated yet
        return null;
    }
    
    getNextVersion(strategyKey) {
        const baseKey = strategyKey.split('_v')[0];
        const versions = Object.keys(this.scrapingStrategies)
            .filter(key => key.startsWith(baseKey))
            .map(key => parseInt(key.split('_v')[1] || '1'));
        
        return Math.max(...versions, 0) + 1;
    }
    
    serveLogs(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            totalLogs: this.logs.length,
            recentLogs: this.logs.slice(-20), // Last 20 logs
            summary: this.getLogSummary()
        }, null, 2));
    }
    
    serveHomePage(req, res) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Bosser Extension Logs</title>
    <style>
        body { 
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #0a0a0a; 
            color: #ffffff; 
            padding: 20px; 
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { 
            text-align: center; 
            margin-bottom: 40px;
            padding: 20px;
            background: #1a1a1a;
            border-radius: 10px;
            border: 1px solid #ff6b35;
        }
        .logo { font-size: 28px; font-weight: bold; color: #ff6b35; margin-bottom: 10px; }
        .subtitle { color: #999; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #333;
            text-align: center;
        }
        .stat-number { font-size: 2em; color: #ff6b35; font-weight: bold; }
        .stat-label { color: #999; margin-top: 5px; }
        .logs-container {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #333;
            max-height: 600px;
            overflow-y: auto;
        }
        .log-entry {
            margin-bottom: 15px;
            padding: 10px;
            background: #2a2a2a;
            border-radius: 5px;
            border-left: 4px solid #ff6b35;
        }
        .log-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .log-level {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .level-INFO { background: #2196F3; }
        .level-SUCCESS { background: #4CAF50; }
        .level-WARNING { background: #FF9800; }
        .level-ERROR { background: #F44336; }
        .level-CRITICAL { background: #FF0000; }
        .log-message { margin: 5px 0; }
        .log-data { 
            font-family: 'SF Mono', Monaco, monospace; 
            font-size: 12px; 
            background: #0a0a0a; 
            padding: 8px; 
            border-radius: 4px; 
            margin-top: 8px;
            color: #00ff00;
        }
        .controls {
            text-align: center;
            margin: 20px 0;
        }
        .button {
            background: #ff6b35;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 0 10px;
            font-weight: bold;
        }
        .button:hover { background: #ff8555; }
    </style>
    <meta http-equiv="refresh" content="5">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Bosser Extension Log Server</div>
            <div class="subtitle">Real-time logging from Chrome extension</div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${this.logs.length}</div>
                <div class="stat-label">Total Logs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.getErrorCount()}</div>
                <div class="stat-label">Errors</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.getUniqueSessionsCount()}</div>
                <div class="stat-label">Sessions</div>
            </div>
        </div>
        
        <div class="controls">
            <button class="button" onclick="location.reload()">🔄 Refresh</button>
            <button class="button" onclick="window.open('/logs', '_blank')">📊 JSON Logs</button>
        </div>
        
        <div class="logs-container">
            <h3>Recent Logs (auto-refreshes every 5 seconds)</h3>
            ${this.logs.slice(-20).reverse().map(log => this.formatLogHTML(log)).join('')}
            ${this.logs.length === 0 ? '<div style="text-align: center; color: #666; padding: 40px;">No logs received yet. Use the extension to generate logs.</div>' : ''}
        </div>
    </div>
</body>
</html>`;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
    
    serveVersion(req, res) {
        const versionInfo = {
            version: this.serverVersion,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            strategies: Object.keys(this.scrapingStrategies).length,
            totalLogs: this.logs.length
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(versionInfo));
    }
    
    async saveScrapedData(req, res) {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    
                    console.log(`📥 Receiving scraped data: ${data.title || 'Unknown'}`);
                    
                    // Create safe filename from title and date
                    const date = new Date(data.publishDate || data.scrapedAt).toISOString().split('T')[0];
                    const safeTitle = (data.title || 'unknown')
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 50);
                    
                    const filename = `${date}-${safeTitle}.json`;
                    const filepath = path.join(__dirname, 'raw_downloads', filename);
                    
                    // Save article data
                    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));
                    console.log(`💾 Saved article: ${filename}`);
                    
                    // Download and save images
                    let downloadedImages = 0;
                    if (data.images && data.images.length > 0) {
                        for (let i = 0; i < data.images.length; i++) {
                            const image = data.images[i];
                            try {
                                const imageUrl = image.src || image.url;
                                if (imageUrl) {
                                    const imageExtension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
                                    const imageFilename = `${date}-${safeTitle}-image-${i}.${imageExtension}`;
                                    const imagePath = path.join(__dirname, 'raw_downloads', 'images', imageFilename);
                                    
                                    // Download image
                                    const https = require('https');
                                    const response = await new Promise((resolve, reject) => {
                                        https.get(imageUrl, resolve).on('error', reject);
                                    });
                                    
                                    if (response.statusCode === 200) {
                                        const fileStream = fs.createWriteStream(imagePath);
                                        response.pipe(fileStream);
                                        
                                        await new Promise((resolve, reject) => {
                                            fileStream.on('finish', resolve);
                                            fileStream.on('error', reject);
                                        });
                                        
                                        console.log(`🖼️  Downloaded image: ${imageFilename}`);
                                        downloadedImages++;
                                        
                                        // Update image data with local path
                                        data.images[i].localPath = `raw_downloads/images/${imageFilename}`;
                                        data.images[i].localFilename = imageFilename;
                                    }
                                }
                            } catch (imageError) {
                                console.error(`❌ Failed to download image ${i}:`, imageError.message);
                            }
                        }
                        
                        // Update article file with local image paths
                        if (downloadedImages > 0) {
                            await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));
                        }
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        filename: filename,
                        imagesDownloaded: downloadedImages,
                        message: `Saved article and ${downloadedImages} images`
                    }));
                    
                } catch (error) {
                    console.error('❌ Error saving scraped data:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error in saveScrapedData:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    formatLogHTML(log) {
        const timestamp = new Date(log.timestamp).toLocaleTimeString();
        const data = log.data && Object.keys(log.data).length > 0 ? 
            `<div class="log-data">${JSON.stringify(log.data, null, 2)}</div>` : '';
        
        return `
            <div class="log-entry">
                <div class="log-header">
                    <span>${timestamp}</span>
                    <span class="log-level level-${log.level}">${log.level}</span>
                </div>
                <div class="log-message">${log.message}</div>
                ${data}
            </div>
        `;
    }
    
    getLogSummary() {
        const levels = {};
        this.logs.forEach(log => {
            levels[log.level] = (levels[log.level] || 0) + 1;
        });
        
        return {
            totalLogs: this.logs.length,
            byLevel: levels,
            lastLog: this.logs[this.logs.length - 1]?.timestamp,
            uniqueSessions: this.getUniqueSessionsCount()
        };
    }
    
    getErrorCount() {
        return this.logs.filter(log => log.level === 'ERROR' || log.level === 'CRITICAL').length;
    }
    
    getUniqueSessionsCount() {
        const sessions = new Set(this.logs.map(log => log.sessionId));
        return sessions.size;
    }
    
    saveLogsToFile() {
        const logFile = path.join(__dirname, 'extension-logs.json');
        fs.writeFileSync(logFile, JSON.stringify(this.logs, null, 2));
    }
    
    async serveLatestArticle(req, res) {
        try {
            const articlesIndexPath = path.join(__dirname, 'data', 'articles_index.json');
            
            if (!fs.existsSync(articlesIndexPath)) {
                throw new Error('Articles index not found');
            }
            
            const indexData = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
            
            if (!indexData.articles || indexData.articles.length === 0) {
                throw new Error('No articles found in index');
            }
            
            // Find next unpublished article
            const unpublishedArticle = this.findNextUnpublishedArticle(indexData.articles);
            
            if (!unpublishedArticle) {
                // If no unpublished articles, serve the latest one
                console.log('📄 No unpublished articles found, serving latest published article');
                const latestArticle = indexData.articles[0];
                const fullArticleData = await this.loadFullArticleData(latestArticle.slug);
                this.addCoverVideoPath(fullArticleData, latestArticle.slug);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...fullArticleData,
                    _publishStatus: 'already_published',
                    _message: 'This article appears to already be published on LinkedIn'
                }, null, 2));
                
                console.log(`📄 Served already published article: ${fullArticleData.title}`);
                return;
            }
            
            // Load the full unpublished article data
            const fullArticleData = await this.loadFullArticleData(unpublishedArticle.slug);
            this.addCoverVideoPath(fullArticleData, unpublishedArticle.slug);
            
            // Add publication status info
            fullArticleData._publishStatus = 'ready_to_publish';
            fullArticleData._publishReason = this.getPublishReason(fullArticleData);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(fullArticleData, null, 2));
            
            console.log(`📄 Served unpublished article: ${fullArticleData.title} (${fullArticleData._publishReason})`);
            
        } catch (error) {
            console.error('❌ Error serving latest article:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Failed to load latest article',
                details: error.message 
            }));
        }
    }
    
    findNextUnpublishedArticle(articles) {
        // Strategy 1: Look for articles with explicit draft status first (highest priority)
        const explicitDrafts = articles.filter(article => {
            const slug = article.slug;
            try {
                const articlePath = path.join(__dirname, 'data', 'articles', `${slug}.json`);
                if (fs.existsSync(articlePath)) {
                    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    
                    // Skip already scraped articles
                    if (articleData.source_file && articleData.source_file.includes('LinkedIn.html')) {
                        return false;
                    }
                    
                    // Prioritize articles with explicit draft status
                    return articleData.status === 'ready-for-review' ||
                           articleData.status === 'draft' ||
                           articleData.newsletter === false;
                }
            } catch (error) {
                console.error(`Error checking article ${slug}:`, error);
            }
            return false;
        });
        
        if (explicitDrafts.length > 0) {
            console.log(`📝 Found ${explicitDrafts.length} explicit draft(s): ${explicitDrafts.map(a => a.title).join(', ')}`);
            return explicitDrafts[0];
        }
        
        // Strategy 2: Look for articles with clear markdown source files (medium priority)
        const markdownDrafts = articles.filter(article => {
            const slug = article.slug;
            try {
                const articlePath = path.join(__dirname, 'data', 'articles', `${slug}.json`);
                if (fs.existsSync(articlePath)) {
                    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    
                    // Skip already scraped articles
                    if (articleData.source_file && articleData.source_file.includes('LinkedIn.html')) {
                        return false;
                    }
                    
                    // Look for markdown source files
                    return articleData.source_file && articleData.source_file.endsWith('.md');
                }
            } catch (error) {
                console.error(`Error checking article ${slug}:`, error);
            }
            return false;
        });
        
        if (markdownDrafts.length > 0) {
            console.log(`📄 Found ${markdownDrafts.length} markdown draft(s): ${markdownDrafts.map(a => a.title).join(', ')}`);
            return markdownDrafts[0];
        }
        
        // Strategy 2: Look for articles with source_file indicating they are drafts (not scraped)
        const nonScrapedArticles = articles.filter(article => {
            const slug = article.slug;
            try {
                const articlePath = path.join(__dirname, 'data', 'articles', `${slug}.json`);
                if (fs.existsSync(articlePath)) {
                    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    
                    // Check if this looks like a scraped article vs a draft
                    const isScraped = articleData.source_file && 
                                    (articleData.source_file.includes('LinkedIn.html') ||
                                     articleData.source_file.includes('scraped') ||
                                     articleData.url !== 'Unknown URL');
                    
                    return !isScraped;
                }
            } catch (error) {
                console.error(`Error checking article ${slug}:`, error);
            }
            return false;
        });
        
        if (nonScrapedArticles.length > 0) {
            return nonScrapedArticles[0];
        }
        
        // Strategy 3: Look for articles created recently that might be new drafts
        const recentArticles = articles.filter(article => {
            try {
                const articlePath = path.join(__dirname, 'data', 'articles', `${article.slug}.json`);
                if (fs.existsSync(articlePath)) {
                    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    const processedDate = new Date(articleData.processed_at || articleData.created_at || 0);
                    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
                    
                    return processedDate > twoDaysAgo;
                }
            } catch (error) {
                console.error(`Error checking article date ${article.slug}:`, error);
            }
            return false;
        });
        
        if (recentArticles.length > 0) {
            return recentArticles[0];
        }
        
        return null;
    }
    
    async loadFullArticleData(slug) {
        const articlePath = path.join(__dirname, 'data', 'articles', `${slug}.json`);
        
        if (!fs.existsSync(articlePath)) {
            throw new Error(`Article file not found: ${slug}.json`);
        }
        
        return JSON.parse(fs.readFileSync(articlePath, 'utf8'));
    }
    
    addCoverVideoPath(articleData, slug) {
        // Add cover video path if it exists
        const coverVideoPath = path.join(__dirname, 'covers', `${slug}-cover.webm`);
        const mechanicalDuckCoverPath = path.join(__dirname, 'covers', 'mechanical-duck-cover.webm');
        
        if (fs.existsSync(coverVideoPath)) {
            articleData.coverVideo = `/covers/${slug}-cover.webm`;
        } else if (fs.existsSync(mechanicalDuckCoverPath)) {
            articleData.coverVideo = '/covers/mechanical-duck-cover.webm';
        }
    }
    
    getPublishReason(articleData) {
        if (articleData.status === 'ready-for-review') {
            return 'Article marked as ready for review';
        }
        if (articleData.newsletter === false) {
            return 'Article not yet configured for newsletter';
        }
        if (!articleData.url || articleData.url === 'Unknown URL') {
            return 'No LinkedIn URL found - appears to be unpublished';
        }
        if (articleData.publish_date === 'Unknown date') {
            return 'No publish date found - appears to be unpublished';
        }
        if (!articleData.source_file || !articleData.source_file.includes('LinkedIn.html')) {
            return 'Article appears to be a draft, not scraped from LinkedIn';
        }
        return 'Article appears ready for publishing';
    }
    
    async markArticleAsPublished(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', async () => {
                try {
                    const request = JSON.parse(body);
                    const { articleSlug, linkedinUrl, publishDate } = request;
                    
                    console.log(`✅ Marking article as published: ${articleSlug}`);
                    
                    // Load the article data
                    const articlePath = path.join(__dirname, 'data', 'articles', `${articleSlug}.json`);
                    if (!fs.existsSync(articlePath)) {
                        throw new Error(`Article file not found: ${articleSlug}.json`);
                    }
                    
                    const articleData = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
                    
                    // Update the article with LinkedIn publication info
                    articleData.linkedin_url = linkedinUrl || 'Published to LinkedIn';
                    articleData.linkedin_published_at = publishDate || new Date().toISOString();
                    articleData.status = 'published';
                    articleData.url = linkedinUrl || articleData.url || 'Published to LinkedIn';
                    
                    if (articleData.publish_date === 'Unknown date') {
                        articleData.publish_date = new Date().toISOString().split('T')[0];
                    }
                    
                    // Save the updated article
                    fs.writeFileSync(articlePath, JSON.stringify(articleData, null, 2));
                    
                    // Update the articles index
                    const articlesIndexPath = path.join(__dirname, 'data', 'articles_index.json');
                    if (fs.existsSync(articlesIndexPath)) {
                        const indexData = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
                        const articleIndex = indexData.articles.find(a => a.slug === articleSlug);
                        if (articleIndex) {
                            articleIndex.url = linkedinUrl || 'Published to LinkedIn';
                            articleIndex.publish_date = articleData.publish_date;
                            articleIndex.status = 'published';
                            
                            fs.writeFileSync(articlesIndexPath, JSON.stringify(indexData, null, 2));
                        }
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: `Article "${articleData.title}" marked as published`,
                        linkedinUrl: linkedinUrl
                    }));
                    
                    console.log(`✅ Article marked as published: ${articleData.title}`);
                    
                } catch (error) {
                    console.error('❌ Error marking article as published:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error in markArticleAsPublished:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    async serveCoverVideo(req, res) {
        try {
            const videoPath = path.join(__dirname, 'covers', 'mechanical-duck-cover.webm');
            
            if (!fs.existsSync(videoPath)) {
                throw new Error('Cover video not found');
            }
            
            const stat = fs.statSync(videoPath);
            const fileSize = stat.size;
            const range = req.headers.range;
            
            if (range) {
                // Handle range requests for video streaming
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                
                const file = fs.createReadStream(videoPath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/webm',
                };
                
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                // Serve entire file
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/webm',
                };
                
                res.writeHead(200, head);
                fs.createReadStream(videoPath).pipe(res);
            }
            
            console.log(`🎬 Served cover video: mechanical-duck-cover.webm`);
            
        } catch (error) {
            console.error('❌ Error serving cover video:', error.message);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Cover video not found',
                details: error.message 
            }));
        }
    }
    
    async handleLinkedInPublishing(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', async () => {
                try {
                    const request = JSON.parse(body);
                    const { articleSlug, uploadCover = true } = request;
                    
                    console.log(`🚀 Starting LinkedIn publishing for: ${articleSlug}`);
                    
                    // Get the article data
                    const article = await this.getArticleBySlug(articleSlug);
                    if (!article) {
                        throw new Error(`Article not found: ${articleSlug}`);
                    }
                    
                    // Create publishing plan
                    const publishingPlan = this.createPublishingPlan(article, uploadCover);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        article: {
                            title: article.title,
                            slug: article.slug
                        },
                        plan: publishingPlan,
                        message: 'Publishing plan created. Use /execute-publishing-step to run each step.'
                    }));
                    
                } catch (error) {
                    console.error('❌ Error creating publishing plan:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error in handleLinkedInPublishing:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    async handlePublishingStep(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', async () => {
                try {
                    const request = JSON.parse(body);
                    const { step, articleData, stepData } = request;
                    
                    console.log(`🔧 Executing publishing step: ${step}`);
                    
                    let result;
                    switch (step) {
                        case 'navigate_to_editor':
                            result = this.generateNavigationCode();
                            break;
                        case 'fill_article_form':
                            result = this.generateFormFillCode(articleData);
                            break;
                        case 'upload_cover_video':
                            result = this.generateVideoUploadCode(stepData.videoPath);
                            break;
                        case 'add_hashtags':
                            result = this.generateHashtagCode(articleData.tags);
                            break;
                        case 'review_and_publish':
                            result = this.generatePublishCode();
                            break;
                        default:
                            throw new Error(`Unknown publishing step: ${step}`);
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        step: step,
                        code: result.code,
                        instructions: result.instructions,
                        nextStep: result.nextStep
                    }));
                    
                } catch (error) {
                    console.error(`❌ Error executing step ${request.step}:`, error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error in handlePublishingStep:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    async handleCoverVideoUpload(req, res) {
        try {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            
            req.on('end', async () => {
                try {
                    const request = JSON.parse(body);
                    const { videoPath, articleSlug } = request;
                    
                    console.log(`🎬 Handling cover video upload for: ${articleSlug}`);
                    
                    // Generate code to upload video to LinkedIn
                    const uploadCode = this.generateVideoUploadCode(videoPath);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        code: uploadCode.code,
                        instructions: uploadCode.instructions,
                        videoPath: videoPath
                    }));
                    
                } catch (error) {
                    console.error('❌ Error handling video upload:', error.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            
        } catch (error) {
            console.error('❌ Error in handleCoverVideoUpload:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
    
    async getArticleBySlug(slug) {
        try {
            const articlesIndexPath = path.join(__dirname, 'data', 'articles_index.json');
            if (!fs.existsSync(articlesIndexPath)) {
                throw new Error('Articles index not found');
            }
            
            const indexData = JSON.parse(fs.readFileSync(articlesIndexPath, 'utf8'));
            const articleMeta = indexData.articles.find(a => a.slug === slug);
            
            if (!articleMeta) {
                throw new Error(`Article not found in index: ${slug}`);
            }
            
            // Load full article data
            const articlePath = path.join(__dirname, 'data', 'articles', `${slug}.json`);
            if (!fs.existsSync(articlePath)) {
                throw new Error(`Article file not found: ${slug}.json`);
            }
            
            return JSON.parse(fs.readFileSync(articlePath, 'utf8'));
            
        } catch (error) {
            console.error(`❌ Error loading article ${slug}:`, error.message);
            throw error;
        }
    }
    
    createPublishingPlan(article, uploadCover) {
        const plan = [
            {
                step: 'navigate_to_editor',
                description: 'Navigate to LinkedIn article editor',
                url: 'https://linkedin.com/article/new',
                automated: true
            },
            {
                step: 'fill_article_form',
                description: 'Fill article title and content',
                automated: true,
                data: {
                    title: article.title,
                    content: article.content_markdown || article.content,
                    tags: article.tags
                }
            }
        ];
        
        if (uploadCover && article.coverVideo) {
            plan.push({
                step: 'upload_cover_video',
                description: 'Upload cover video',
                automated: true,
                data: {
                    videoPath: article.coverVideo
                }
            });
        }
        
        plan.push(
            {
                step: 'add_hashtags',
                description: 'Add hashtags to content',
                automated: true,
                data: {
                    tags: article.tags
                }
            },
            {
                step: 'review_and_publish',
                description: 'Review article and publish',
                automated: false, // User should review before publishing
                manual: true
            }
        );
        
        return plan;
    }
    
    generateNavigationCode() {
        return {
            code: JSON.stringify({
                action: 'navigate_to_editor',
                url: 'https://www.linkedin.com/article/new/',
                instructions: 'Navigate to LinkedIn article editor page'
            }),
            instructions: 'Navigate to LinkedIn article editor page',
            nextStep: 'fill_article_form'
        };
    }
    
    generateFormFillCode(articleData) {
        return {
            code: JSON.stringify({
                action: 'fill_content',
                title: articleData.title,
                content: articleData.content_markdown || articleData.content,
                tags: articleData.tags || [],
                instructions: 'Fill article title and content in LinkedIn editor'
            }),
            instructions: 'Fill article title and content in LinkedIn editor',
            nextStep: 'upload_cover_video'
        };
    }
    
    generateVideoUploadCode(videoPath) {
        return {
            code: `
                // Upload cover video to LinkedIn
                function uploadCoverVideo(videoPath) {
                    const result = {
                        uploaded: false,
                        error: null
                    };
                    
                    try {
                        // Look for video upload button or area
                        const videoUploadSelectors = [
                            '[data-test-id="video-upload"]',
                            'input[type="file"][accept*="video"]',
                            '[aria-label*="video" i] input[type="file"]',
                            '.video-upload input[type="file"]'
                        ];
                        
                        let fileInput = null;
                        for (const selector of videoUploadSelectors) {
                            fileInput = document.querySelector(selector);
                            if (fileInput) break;
                        }
                        
                        if (!fileInput) {
                            // Look for general upload buttons that might trigger video upload
                            const uploadButtons = document.querySelectorAll('button[aria-label*="upload" i], button[aria-label*="media" i]');
                            if (uploadButtons.length > 0) {
                                uploadButtons[0].click();
                                result.uploaded = false;
                                result.message = 'Clicked upload button. Manual video selection required.';
                                return result;
                            } else {
                                throw new Error('No video upload controls found');
                            }
                        }
                        
                        // Note: Due to browser security, we cannot programmatically set file input values
                        // The user will need to manually select the video file
                        fileInput.click();
                        result.uploaded = false;
                        result.message = 'File dialog opened. Please select the cover video manually.';
                        result.instructions = \`Please select the video file: \${videoPath}\`;
                        
                    } catch (error) {
                        result.error = error.message;
                    }
                    
                    return result;
                }
                
                return uploadCoverVideo("${videoPath}");
            `,
            instructions: `Upload cover video: ${videoPath}. Note: Manual file selection required due to browser security.`,
            nextStep: 'add_hashtags'
        };
    }
    
    generateHashtagCode(tags) {
        return {
            code: `
                // Add hashtags to article content
                function addHashtags(tags) {
                    const result = {
                        added: false,
                        error: null
                    };
                    
                    try {
                        const contentField = document.querySelector('.ProseMirror') || 
                                           document.querySelector('[contenteditable][role="textbox"]');
                        
                        if (!contentField) {
                            throw new Error('Content field not found');
                        }
                        
                        // Add hashtags at the end
                        const hashtags = tags.map(tag => \`#\${tag.replace(/\\\\s+/g, '')}\`).join(' ');
                        
                        // Append hashtags
                        const currentContent = contentField.innerHTML;
                        contentField.innerHTML = currentContent + \`<p><br></p><p>\${hashtags}</p>\`;
                        contentField.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        result.added = true;
                        result.hashtags = hashtags;
                        
                    } catch (error) {
                        result.error = error.message;
                    }
                    
                    return result;
                }
                
                return addHashtags(${JSON.stringify(tags)});
            `,
            instructions: `Add hashtags: ${tags.map(t => `#${t}`).join(' ')}`,
            nextStep: 'review_and_publish'
        };
    }
    
    generatePublishCode() {
        return {
            code: `
                // Review and publish article
                function reviewAndPublish() {
                    const result = {
                        reviewComplete: false,
                        publishButtonFound: false,
                        message: ''
                    };
                    
                    // Look for publish button
                    const publishSelectors = [
                        'button[data-test-id="publish-button"]',
                        'button[aria-label*="publish" i]',
                        'button:contains("Publish")',
                        '.publish-button'
                    ];
                    
                    let publishButton = null;
                    for (const selector of publishSelectors) {
                        publishButton = document.querySelector(selector);
                        if (publishButton) {
                            result.publishButtonFound = true;
                            break;
                        }
                    }
                    
                    if (!publishButton) {
                        // Look for buttons with "Publish" text
                        const buttons = Array.from(document.querySelectorAll('button'));
                        publishButton = buttons.find(btn => 
                            btn.textContent.toLowerCase().includes('publish')
                        );
                        if (publishButton) {
                            result.publishButtonFound = true;
                        }
                    }
                    
                    if (publishButton) {
                        result.message = 'Publish button found. Review the article and click publish when ready.';
                        // Highlight the publish button
                        publishButton.style.border = '3px solid #ff6b35';
                        publishButton.style.boxShadow = '0 0 10px #ff6b35';
                    } else {
                        result.message = 'Publish button not found. Look for publish controls manually.';
                    }
                    
                    result.reviewComplete = true;
                    return result;
                }
                
                return reviewAndPublish();
            `,
            instructions: 'Review the article content and publish when ready. The publish button will be highlighted.',
            nextStep: null // Final step
        };
    }
    
    stop() {
        if (this.server) {
            this.server.close();
            console.log('🛑 Plugin Commander stopped');
        }
    }
}

// Start the server
const pluginCommander = new BosserPluginCommander();
pluginCommander.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down Plugin Commander...');
    pluginCommander.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    pluginCommander.stop();
    process.exit(0);
});

module.exports = BosserPluginCommander;