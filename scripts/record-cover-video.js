#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function recordCoverVideo(coverHtmlPath, outputVideoPath) {
    console.log('🎬 Starting automated video recording...');

    const coverUrl = `file://${path.resolve(coverHtmlPath)}`;

    // Generate PNG thumbnail first (headless)
    const pngPath = outputVideoPath.replace(/\.\w+$/, '.png');
    const thumbBrowser = await chromium.launch();
    const thumbPage = await thumbBrowser.newPage({ viewport: { width: 1920, height: 1080 } });
    await thumbPage.goto(coverUrl, { waitUntil: 'networkidle' });
    await thumbPage.waitForSelector('.particle');
    await thumbPage.waitForTimeout(2500);
    await thumbPage.screenshot({ path: pngPath });
    await thumbBrowser.close();
    console.log(`📸 Thumbnail saved: ${pngPath}`);

    // Launch browser with video recording enabled
    const browser = await chromium.launch({
        headless: false,
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

        // Rename raw recording
        fs.renameSync(recordedVideoPath, finalVideoPath + '.raw');

        // Trim white first frame(s) from webm and convert to mp4
        const { execSync } = require('child_process');
        const mp4Path = finalVideoPath.replace('.webm', '.mp4');
        try {
            execSync(`ffmpeg -ss 1 -i "${finalVideoPath}.raw" -c:v libvpx-vp9 "${finalVideoPath}" -y`, { stdio: 'pipe' });
            execSync(`ffmpeg -ss 1 -i "${finalVideoPath}.raw" -c:v libx264 -pix_fmt yuv420p "${mp4Path}" -y`, { stdio: 'pipe' });
            fs.unlinkSync(finalVideoPath + '.raw');
            console.log(`✅ Trimmed webm saved: ${finalVideoPath}`);
            console.log(`✅ Trimmed MP4 saved: ${mp4Path}`);
        } catch (e) {
            // Fallback: keep raw if ffmpeg fails
            fs.renameSync(finalVideoPath + '.raw', finalVideoPath);
            console.log(`✅ Video saved: ${finalVideoPath}`);
            console.log('⚠️  ffmpeg not available — skipping trim/conversion');
        }

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