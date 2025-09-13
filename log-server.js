#!/usr/bin/env node

// Simple HTTP server to receive extension logs and display them
const http = require('http');
const fs = require('fs');
const path = require('path');

class BosserLogServer {
    constructor() {
        this.port = 3001;
        this.logs = [];
        this.server = null;
        this.scrapingStrategies = this.initializeScrapingStrategies();
        this.failureHistory = new Map(); // Track failures and adaptations
        this.codeVersions = new Map(); // Track code versions for different scenarios
        this.serverVersion = "2.2.0"; // Server/code version
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
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        
        this.server.listen(this.port, () => {
            console.log(`🚀 Bosser Log Server running on http://localhost:${this.port}`);
            console.log(`📊 View logs at: http://localhost:${this.port}/logs`);
            console.log(`🏠 Homepage at: http://localhost:${this.port}/`);
            console.log(`\n📡 Extension will send logs to: http://localhost:${this.port}/bosser-logs`);
            console.log(`\n⏳ Waiting for extension logs...`);
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
    
    stop() {
        if (this.server) {
            this.server.close();
            console.log('🛑 Log server stopped');
        }
    }
}

// Start the server
const logServer = new BosserLogServer();
logServer.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down log server...');
    logServer.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logServer.stop();
    process.exit(0);
});

module.exports = BosserLogServer;