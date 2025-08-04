/**
 * Bosser Particle Animation System
 * Dynamic particle animation that morphs between symbolic shapes:
 * Cloud (ideas/possibilities) → Brain (intelligence/strategy) → Arrow (direction/momentum)
 */

class ParticleAnimationSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Particle container '${containerId}' not found`);
            return;
        }

        this.particles = [];
        this.particleCount = options.particleCount || 240;
        this.transitionDuration = options.transitionDuration || 4000;
        this.shapeInterval = options.shapeInterval || 10000;
        this.currentShapeIndex = 0;
        this.shapeNames = ['cloud', 'brain', 'arrow'];
        
        this.init();
    }

    init() {
        this.startAnimation();
    }

    createParticles(count) {
        // Clear existing particles
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
        
        const particleCount = count || this.particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Add glow effect to every 10th particle
            if (i % 10 === 0) {
                particle.classList.add('glow');
            }
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    getShapeDefinitions() {
        return {
            cloud: [
                // Cloud formation - organic, flowing
                {x: 0.3, y: 0.4}, {x: 0.35, y: 0.42}, {x: 0.4, y: 0.38}, {x: 0.45, y: 0.4}, {x: 0.5, y: 0.36},
                {x: 0.55, y: 0.38}, {x: 0.6, y: 0.4}, {x: 0.65, y: 0.42}, {x: 0.7, y: 0.4}, {x: 0.25, y: 0.45},
                {x: 0.3, y: 0.5}, {x: 0.35, y: 0.52}, {x: 0.4, y: 0.5}, {x: 0.45, y: 0.48}, {x: 0.5, y: 0.5},
                {x: 0.55, y: 0.52}, {x: 0.6, y: 0.5}, {x: 0.65, y: 0.48}, {x: 0.7, y: 0.5}, {x: 0.75, y: 0.45},
                {x: 0.28, y: 0.55}, {x: 0.32, y: 0.58}, {x: 0.38, y: 0.6}, {x: 0.42, y: 0.58}, {x: 0.48, y: 0.6},
                {x: 0.52, y: 0.62}, {x: 0.58, y: 0.6}, {x: 0.62, y: 0.58}, {x: 0.68, y: 0.6}, {x: 0.72, y: 0.55},
                // Additional cloud positions for density
                {x: 0.33, y: 0.35}, {x: 0.37, y: 0.37}, {x: 0.43, y: 0.33}, {x: 0.47, y: 0.35}, {x: 0.53, y: 0.31},
                {x: 0.57, y: 0.33}, {x: 0.63, y: 0.35}, {x: 0.67, y: 0.37}, {x: 0.73, y: 0.35}, {x: 0.22, y: 0.48},
                {x: 0.26, y: 0.52}, {x: 0.31, y: 0.47}, {x: 0.36, y: 0.49}, {x: 0.41, y: 0.45}, {x: 0.46, y: 0.47},
                {x: 0.51, y: 0.49}, {x: 0.56, y: 0.47}, {x: 0.61, y: 0.45}, {x: 0.66, y: 0.47}, {x: 0.71, y: 0.49},
                {x: 0.29, y: 0.62}, {x: 0.34, y: 0.64}, {x: 0.39, y: 0.66}, {x: 0.44, y: 0.64}, {x: 0.49, y: 0.66},
                {x: 0.54, y: 0.68}, {x: 0.59, y: 0.66}, {x: 0.64, y: 0.64}, {x: 0.69, y: 0.66}, {x: 0.74, y: 0.62}
            ],
            
            brain: [
                // Brain formation - neural network pattern
                {x: 0.4, y: 0.3}, {x: 0.45, y: 0.32}, {x: 0.5, y: 0.3}, {x: 0.55, y: 0.32}, {x: 0.6, y: 0.3},
                {x: 0.35, y: 0.38}, {x: 0.42, y: 0.4}, {x: 0.5, y: 0.38}, {x: 0.58, y: 0.4}, {x: 0.65, y: 0.38},
                {x: 0.3, y: 0.45}, {x: 0.38, y: 0.48}, {x: 0.45, y: 0.5}, {x: 0.5, y: 0.45}, {x: 0.55, y: 0.5},
                {x: 0.62, y: 0.48}, {x: 0.7, y: 0.45}, {x: 0.35, y: 0.55}, {x: 0.42, y: 0.58}, {x: 0.48, y: 0.6},
                {x: 0.52, y: 0.58}, {x: 0.58, y: 0.6}, {x: 0.65, y: 0.55}, {x: 0.4, y: 0.65}, {x: 0.45, y: 0.68},
                {x: 0.5, y: 0.7}, {x: 0.55, y: 0.68}, {x: 0.6, y: 0.65}, {x: 0.25, y: 0.5}, {x: 0.75, y: 0.5},
                // Neural connections
                {x: 0.38, y: 0.28}, {x: 0.43, y: 0.26}, {x: 0.48, y: 0.28}, {x: 0.53, y: 0.26}, {x: 0.58, y: 0.28},
                {x: 0.32, y: 0.36}, {x: 0.37, y: 0.34}, {x: 0.47, y: 0.36}, {x: 0.53, y: 0.34}, {x: 0.63, y: 0.36},
                {x: 0.28, y: 0.43}, {x: 0.33, y: 0.41}, {x: 0.43, y: 0.43}, {x: 0.53, y: 0.41}, {x: 0.68, y: 0.43},
                {x: 0.33, y: 0.53}, {x: 0.38, y: 0.51}, {x: 0.46, y: 0.53}, {x: 0.54, y: 0.51}, {x: 0.67, y: 0.53},
                {x: 0.38, y: 0.63}, {x: 0.43, y: 0.61}, {x: 0.47, y: 0.63}, {x: 0.53, y: 0.61}, {x: 0.58, y: 0.63},
                {x: 0.27, y: 0.48}, {x: 0.73, y: 0.48}, {x: 0.29, y: 0.52}, {x: 0.71, y: 0.52}, {x: 0.5, y: 0.25}
            ],
            
            arrow: [
                // Arrow shaft - horizontal lines for thickness
                ...this.generateArrowShaft(),
                // Arrow head
                ...this.generateArrowHead()
            ]
        };
    }

    generateArrowShaft() {
        const shaft = [];
        // Create a horizontal shaft with proper thickness
        const shaftRows = [0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53];
        
        shaftRows.forEach(y => {
            for (let x = 0.15; x <= 0.60; x += 0.015) { // Stop at 0.60 to leave room for head
                shaft.push({x, y});
            }
        });
        
        return shaft;
    }

    generateArrowHead() {
        const head = [];
        const tipX = 0.75; // Further reduced to prevent clipping
        const baseX = 0.60; // Connect to shaft end
        const centerY = 0.5; // Center line
        const headHeight = 0.10; // Even smaller
        
        // Generate arrow head with proper geometry - constrained to container
        const steps = 12;
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const x = baseX + (tipX - baseX) * progress;
            
            const topY = centerY - headHeight * (1 - progress);
            head.push({x, y: topY});
            
            const bottomY = centerY + headHeight * (1 - progress);
            head.push({x, y: bottomY});
            
            if (progress < 0.8) {
                const fillSteps = Math.floor(headHeight * 2 * (1 - progress * 0.5) / 0.02);
                for (let j = 1; j < fillSteps; j++) {
                    const fillY = topY + (bottomY - topY) * (j / fillSteps);
                    head.push({x, y: fillY});
                }
            }
        }
        
        return head;
    }

    getRandomPositions(count) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push({
                x: 0.2 + Math.random() * 0.6,
                y: 0.3 + Math.random() * 0.4
            });
        }
        return positions;
    }

    morphToShape(shapeName) {
        const shapes = this.getShapeDefinitions();
        const targetPositions = shapes[shapeName] || this.getRandomPositions(this.particleCount);
        const containerRect = this.container.getBoundingClientRect();
        
        // Create enough particles for the largest shape (like test page)
        if (this.particles.length === 0) {
            const maxParticles = Math.max(
                shapes.arrow.length,
                shapes.cloud.length, 
                shapes.brain.length
            );
            this.createParticles(maxParticles);
        }
        
        this.particles.forEach((particle, index) => {
            const target = targetPositions[index % targetPositions.length];
            
            // Reduce randomization for geometric shapes like arrow
            const jitterAmount = shapeName === 'arrow' ? 0.01 : 0.05;
            const randomOffset = {
                x: (Math.random() - 0.5) * jitterAmount,
                y: (Math.random() - 0.5) * jitterAmount
            };
            
            const finalX = (target.x + randomOffset.x) * containerRect.width;
            const finalY = (target.y + randomOffset.y) * containerRect.height;
            
            particle.style.left = finalX + 'px';
            particle.style.top = finalY + 'px';
            
            // Staggered animation for wave effect
            particle.style.transitionDelay = (index * 20) + 'ms';
        });
    }

    nextShape() {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapeNames.length;
        this.morphToShape(this.shapeNames[this.currentShapeIndex]);
    }

    startAnimation() {
        // Initialize with first shape
        this.morphToShape(this.shapeNames[0]);
        
        // Set up shape cycling
        this.animationInterval = setInterval(() => {
            this.nextShape();
        }, this.shapeInterval);
    }

    destroy() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.particles = [];
    }

    // Public methods for external control
    pause() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    resume() {
        if (!this.animationInterval) {
            this.animationInterval = setInterval(() => {
                this.nextShape();
            }, this.shapeInterval);
        }
    }

    morphToSpecificShape(shapeName) {
        if (this.shapeNames.includes(shapeName)) {
            this.morphToShape(shapeName);
            this.currentShapeIndex = this.shapeNames.indexOf(shapeName);
        }
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particle-container')) {
        // Destroy existing system if present (for hot reloading)
        if (window.particleSystem) {
            window.particleSystem.destroy();
        }
        
        window.particleSystem = new ParticleAnimationSystem('particle-container', {
            particleCount: 240,
            transitionDuration: 4000,
            shapeInterval: 10000
        });
        
        console.log('Particle system initialized - v2.6');
        console.log('Shape order:', window.particleSystem.shapeNames);
        console.log('Starting with shape:', window.particleSystem.shapeNames[0]);
        
        // Debug arrow generation
        const shapes = window.particleSystem.getShapeDefinitions();
        const arrowPositions = shapes.arrow;
        console.log(`Arrow particles: ${arrowPositions.length}`);
        if (arrowPositions.length > 0) {
            const maxX = Math.max(...arrowPositions.map(p => p.x));
            const minX = Math.min(...arrowPositions.map(p => p.x));
            console.log(`Arrow spans from x=${minX.toFixed(2)} to x=${maxX.toFixed(2)}`);
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleAnimationSystem;
}