#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

class AnimatedCoverGenerator {
    constructor() {
        this.width = 1920;
        this.height = 1080;
        this.fps = 30;
        this.duration = 15; // seconds
        this.totalFrames = this.fps * this.duration;
        
        // Brand colors from site
        this.colors = {
            background: '#0a0a0a',
            accent: '#ff6b35',
            text: '#ffffff',
            textSecondary: '#b3b3b3'
        };
        
        // Particle system - simplified version of site's system
        this.particleCount = 120; // Reduced for performance
        this.particles = [];
        
        this.initParticles();
    }
    
    initParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    // Shape definitions matching your site's particle system
    getCloudFormation() {
        const formations = [];
        const centerX = this.width * 0.7;
        const centerY = this.height * 0.4;
        
        for (let i = 0; i < this.particleCount; i++) {
            const angle = (i / this.particleCount) * Math.PI * 2 * 3;
            const radius = 150 + Math.sin(angle * 2) * 50;
            formations.push({
                x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
                y: centerY + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 80
            });
        }
        return formations;
    }
    
    getBrainFormation() {
        const formations = [];
        const centerX = this.width * 0.7;
        const centerY = this.height * 0.4;
        
        // Brain-like neural network pattern
        for (let i = 0; i < this.particleCount; i++) {
            const cluster = Math.floor(i / (this.particleCount / 6));
            const clusterAngle = (cluster / 6) * Math.PI * 2;
            const clusterX = centerX + Math.cos(clusterAngle) * 120;
            const clusterY = centerY + Math.sin(clusterAngle) * 80;
            
            formations.push({
                x: clusterX + (Math.random() - 0.5) * 80,
                y: clusterY + (Math.random() - 0.5) * 60
            });
        }
        return formations;
    }
    
    getArrowFormation() {
        const formations = [];
        const startX = this.width * 0.5;
        const endX = this.width * 0.85;
        const centerY = this.height * 0.4;
        
        // Arrow shaft and head
        for (let i = 0; i < this.particleCount; i++) {
            const progress = i / this.particleCount;
            
            if (progress < 0.7) {
                // Arrow shaft
                formations.push({
                    x: startX + (endX - startX) * progress * 0.7,
                    y: centerY + (Math.random() - 0.5) * 20
                });
            } else {
                // Arrow head
                const headProgress = (progress - 0.7) / 0.3;
                const headX = endX - 30 + headProgress * 30;
                const headY = centerY + (Math.random() - 0.5) * 100 * (1 - headProgress);
                formations.push({ x: headX, y: headY });
            }
        }
        return formations;
    }
    
    drawFrame(canvas, ctx, frameNumber, title) {
        // Clear canvas
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Calculate animation progress
        const cycleProgress = (frameNumber / this.totalFrames) * 3; // 3 shapes over 15 seconds
        const shapeIndex = Math.floor(cycleProgress) % 3;
        const shapeProgress = cycleProgress % 1;
        
        // Get current and next formations
        const formations = [
            this.getCloudFormation(),
            this.getBrainFormation(),
            this.getArrowFormation()
        ];
        
        const currentFormation = formations[shapeIndex];
        const nextFormation = formations[(shapeIndex + 1) % 3];
        
        // Smooth transition between formations
        const easeProgress = this.easeInOutCubic(shapeProgress);
        
        // Draw particles
        for (let i = 0; i < this.particleCount; i++) {
            const current = currentFormation[i];
            const next = nextFormation[i];
            const particle = this.particles[i];
            
            // Interpolate position
            const x = current.x + (next.x - current.x) * easeProgress;
            const y = current.y + (next.y - current.y) * easeProgress;
            
            // Draw particle
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = this.colors.accent;
            
            // Add glow effect for some particles
            if (i % 10 === 0) {
                ctx.shadowColor = this.colors.accent;
                ctx.shadowBlur = 6;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.beginPath();
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Draw title
        this.drawTitle(ctx, title);
    }
    
    drawTitle(ctx, title) {
        // Title styling matching site
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 72px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        
        // Position on left side (particles on right)
        const x = 80;
        const y = this.height * 0.4;
        
        // Word wrap title
        const words = title.split(' ');
        const maxWidth = this.width * 0.4;
        let line = '';
        let lineHeight = 90;
        let currentY = y;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), x, currentY);
                line = word + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        
        // Subtitle
        ctx.fillStyle = this.colors.accent;
        ctx.font = '600 24px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('INTELLIGENT HARD WORK', x, y - 100);
        
        // Author
        ctx.fillStyle = this.colors.textSecondary;
        ctx.font = '400 20px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Antti Tevanlinna', x, currentY + 60);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    async generateCover(title, outputPath) {
        console.log(`🎬 Generating animated cover for: ${title}`);
        
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');
        
        // Create frames directory
        const framesDir = path.join(__dirname, '../temp/frames');
        if (!fs.existsSync(framesDir)) {
            fs.mkdirSync(framesDir, { recursive: true });
        }
        
        // Generate frames
        console.log(`📸 Generating ${this.totalFrames} frames...`);
        for (let frame = 0; frame < this.totalFrames; frame++) {
            this.drawFrame(canvas, ctx, frame, title);
            
            const buffer = canvas.toBuffer('image/png');
            const framePath = path.join(framesDir, `frame_${frame.toString().padStart(4, '0')}.png`);
            fs.writeFileSync(framePath, buffer);
            
            if (frame % 90 === 0) {
                console.log(`📸 Generated ${frame}/${this.totalFrames} frames`);
            }
        }
        
        // Convert frames to MP4
        console.log('🎥 Converting frames to MP4...');
        
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(path.join(framesDir, 'frame_%04d.png'))
                .inputOptions(['-framerate', this.fps])
                .outputOptions([
                    '-c:v libx264',
                    '-pix_fmt yuv420p',
                    '-crf 18',
                    '-preset slow'
                ])
                .output(outputPath)
                .on('end', () => {
                    console.log('✅ Video cover generated successfully');
                    // Cleanup frames
                    fs.rmSync(framesDir, { recursive: true });
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('❌ Error generating video:', err);
                    reject(err);
                })
                .run();
        });
    }
}

module.exports = AnimatedCoverGenerator;