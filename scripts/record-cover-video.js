#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function recordCoverVideo(coverHtmlPath, outputVideoPath) {
    console.log('🎬 Starting automated video recording...');
    
    // Launch browser with video recording enabled
    const browser = await chromium.launch({
        headless: false, // Show browser for debugging
        args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: path.dirname(outputVideoPath),
            size: { width: 1920, height: 1080 }
        }
    });
    
    const page = await context.newPage();
    
    try {
        // Load the cover HTML file
        const coverUrl = `file://${path.resolve(coverHtmlPath)}`;
        console.log(`📖 Loading cover: ${coverUrl}`);
        
        await page.goto(coverUrl, { waitUntil: 'networkidle' });
        
        // Wait for particles to be created
        await page.waitForSelector('.particle');
        console.log('✅ Particles loaded');
        
        // Record for 3 full animation cycles (12 seconds total)
        // Each cycle is 4 seconds: cloud -> brain -> arrow -> repeat
        console.log('🔴 Recording 12 seconds of animation...');
        await page.waitForTimeout(12000);
        
        console.log('🎬 Recording complete');
        
    } finally {
        await context.close();
        await browser.close();
    }
    
    // Find the recorded video file
    const videoDir = path.dirname(outputVideoPath);
    const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
    
    if (videoFiles.length > 0) {
        const recordedVideoPath = path.join(videoDir, videoFiles[0]);
        const finalVideoPath = outputVideoPath;
        
        // Rename to desired output name
        fs.renameSync(recordedVideoPath, finalVideoPath);
        console.log(`✅ Video saved: ${finalVideoPath}`);
        console.log('📝 Note: Convert .webm to .mp4 for LinkedIn compatibility');
        
        return finalVideoPath;
    } else {
        throw new Error('No video file was recorded');
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node record-cover-video.js <cover.html> <output.webm>');
        process.exit(1);
    }
    
    const [coverHtmlPath, outputVideoPath] = args;
    
    recordCoverVideo(coverHtmlPath, outputVideoPath)
        .then(videoPath => {
            console.log('🎉 Video recording completed successfully!');
            console.log(`📹 Video: ${videoPath}`);
            console.log('💡 To convert to MP4: ffmpeg -i output.webm -c:v libx264 output.mp4');
        })
        .catch(error => {
            console.error('❌ Recording failed:', error.message);
            process.exit(1);
        });
}

module.exports = { recordCoverVideo };