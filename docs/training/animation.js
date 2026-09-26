/**
 * =============================================================================
 * Bosser Animation Systems - Extracted for Reuse
 * =============================================================================
 *
 * Extracted from the Bosser website for use in the Agents 102 training site.
 * Contains three systems:
 *
 *   1. ParticleAnimationSystem - Hero section particle morphing animation
 *      Creates particles that morph between shapes: cloud, constellation, arrow.
 *      Requires: .hero-visual > .particle-container#particle-container in HTML
 *      Requires: Particle CSS from bosser-extracted-styles.css
 *
 *   2. TimelineAnimationSystem - Scroll-triggered horizontal timeline
 *      Animates timeline events as user scrolls into view.
 *      Requires: .timeline-horizontal with .timeline-event elements in HTML
 *      Requires: Timeline CSS from bosser-extracted-styles.css
 *
 *   3. UIUtils - Common UI interaction utilities
 *      Hover effects, smooth scrolling, debounce/throttle helpers.
 *
 * =============================================================================
 */


/* =============================================================================
   1. PARTICLE ANIMATION SYSTEM
   =============================================================================
   Dynamic particle animation that morphs between symbolic shapes:
   Cloud (ideas/possibilities) -> Constellation (intelligence/strategy) -> Arrow (direction/momentum)

   Usage:
     HTML: <div class="hero-visual"><div class="particle-container" id="particle-container"></div></div>
     JS:   Auto-initializes on DOMContentLoaded if #particle-container exists.
           Or manually: new ParticleAnimationSystem('particle-container', { particleCount: 240 });

   Options:
     - particleCount:      Number of particles (default: 240)
     - transitionDuration: Duration of shape transitions in ms (default: 4000)
     - shapeInterval:      Interval between shape changes in ms (default: 10000)
*/

class ParticleAnimationSystem {
    /**
     * @param {string} containerId - The ID of the HTML container element
     * @param {Object} options - Configuration options
     * @param {number} [options.particleCount=240] - Number of particles to create
     * @param {number} [options.transitionDuration=4000] - Duration of shape transitions in ms
     * @param {number} [options.shapeInterval=10000] - Interval between shape changes in ms
     */
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
        this.shapeNames = ['cloud', 'constellation', 'arrow'];

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
            // Cloud formation - organic, flowing shape representing ideas/possibilities
            cloud: [
                {x: 0.3, y: 0.4}, {x: 0.35, y: 0.42}, {x: 0.4, y: 0.38}, {x: 0.45, y: 0.4}, {x: 0.5, y: 0.36},
                {x: 0.55, y: 0.38}, {x: 0.6, y: 0.4}, {x: 0.65, y: 0.42}, {x: 0.7, y: 0.4}, {x: 0.25, y: 0.45},
                {x: 0.3, y: 0.5}, {x: 0.35, y: 0.52}, {x: 0.4, y: 0.5}, {x: 0.45, y: 0.48}, {x: 0.5, y: 0.5},
                {x: 0.55, y: 0.52}, {x: 0.6, y: 0.5}, {x: 0.65, y: 0.48}, {x: 0.7, y: 0.5}, {x: 0.75, y: 0.45},
                {x: 0.28, y: 0.55}, {x: 0.32, y: 0.58}, {x: 0.38, y: 0.6}, {x: 0.42, y: 0.58}, {x: 0.48, y: 0.6},
                {x: 0.52, y: 0.62}, {x: 0.58, y: 0.6}, {x: 0.62, y: 0.58}, {x: 0.68, y: 0.6}, {x: 0.72, y: 0.55},
                {x: 0.33, y: 0.35}, {x: 0.37, y: 0.37}, {x: 0.43, y: 0.33}, {x: 0.47, y: 0.35}, {x: 0.53, y: 0.31},
                {x: 0.57, y: 0.33}, {x: 0.63, y: 0.35}, {x: 0.67, y: 0.37}, {x: 0.73, y: 0.35}, {x: 0.22, y: 0.48},
                {x: 0.26, y: 0.52}, {x: 0.31, y: 0.47}, {x: 0.36, y: 0.49}, {x: 0.41, y: 0.45}, {x: 0.46, y: 0.47},
                {x: 0.51, y: 0.49}, {x: 0.56, y: 0.47}, {x: 0.61, y: 0.45}, {x: 0.66, y: 0.47}, {x: 0.71, y: 0.49},
                {x: 0.29, y: 0.62}, {x: 0.34, y: 0.64}, {x: 0.39, y: 0.66}, {x: 0.44, y: 0.64}, {x: 0.49, y: 0.66},
                {x: 0.54, y: 0.68}, {x: 0.59, y: 0.66}, {x: 0.64, y: 0.64}, {x: 0.69, y: 0.66}, {x: 0.74, y: 0.62}
            ],

            // Constellation - interconnected network representing intelligence/strategy
            constellation: [
                // Major star clusters
                {x: 0.2, y: 0.25}, {x: 0.25, y: 0.28}, {x: 0.22, y: 0.32}, {x: 0.28, y: 0.3},
                {x: 0.65, y: 0.2}, {x: 0.68, y: 0.25}, {x: 0.72, y: 0.22}, {x: 0.7, y: 0.28},
                {x: 0.45, y: 0.45}, {x: 0.5, y: 0.5}, {x: 0.55, y: 0.48}, {x: 0.48, y: 0.52},
                {x: 0.52, y: 0.45}, {x: 0.47, y: 0.48}, {x: 0.53, y: 0.52},
                {x: 0.15, y: 0.5}, {x: 0.18, y: 0.52}, {x: 0.2, y: 0.48}, {x: 0.22, y: 0.55},
                {x: 0.75, y: 0.45}, {x: 0.78, y: 0.48}, {x: 0.72, y: 0.52}, {x: 0.8, y: 0.5},
                {x: 0.25, y: 0.7}, {x: 0.28, y: 0.72}, {x: 0.22, y: 0.75}, {x: 0.3, y: 0.68},
                {x: 0.7, y: 0.75}, {x: 0.72, y: 0.72}, {x: 0.68, y: 0.78}, {x: 0.75, y: 0.7},
                // Mesh network connections
                {x: 0.3, y: 0.32}, {x: 0.36, y: 0.38}, {x: 0.42, y: 0.44},
                {x: 0.62, y: 0.3}, {x: 0.57, y: 0.37}, {x: 0.53, y: 0.44},
                {x: 0.25, y: 0.51}, {x: 0.35, y: 0.49}, {x: 0.44, y: 0.47},
                {x: 0.56, y: 0.47}, {x: 0.65, y: 0.46}, {x: 0.74, y: 0.47},
                {x: 0.47, y: 0.55}, {x: 0.4, y: 0.64}, {x: 0.3, y: 0.69},
                {x: 0.53, y: 0.55}, {x: 0.61, y: 0.65}, {x: 0.68, y: 0.72},
                {x: 0.32, y: 0.27}, {x: 0.45, y: 0.25}, {x: 0.58, y: 0.23},
                {x: 0.18, y: 0.35}, {x: 0.19, y: 0.42}, {x: 0.21, y: 0.48},
                {x: 0.19, y: 0.58}, {x: 0.22, y: 0.64}, {x: 0.24, y: 0.68},
                {x: 0.68, y: 0.32}, {x: 0.72, y: 0.38}, {x: 0.74, y: 0.42},
                {x: 0.73, y: 0.58}, {x: 0.72, y: 0.65}, {x: 0.71, y: 0.7},
                {x: 0.32, y: 0.72}, {x: 0.45, y: 0.74}, {x: 0.58, y: 0.73},
                {x: 0.35, y: 0.35}, {x: 0.5, y: 0.4}, {x: 0.65, y: 0.44},
                {x: 0.62, y: 0.32}, {x: 0.45, y: 0.4}, {x: 0.25, y: 0.48},
                {x: 0.32, y: 0.4}, {x: 0.45, y: 0.55}, {x: 0.58, y: 0.68},
                {x: 0.58, y: 0.35}, {x: 0.45, y: 0.5}, {x: 0.32, y: 0.65},
                {x: 0.25, y: 0.58}, {x: 0.4, y: 0.63}, {x: 0.55, y: 0.7},
                {x: 0.7, y: 0.58}, {x: 0.55, y: 0.63}, {x: 0.4, y: 0.68},
                {x: 0.35, y: 0.4}, {x: 0.4, y: 0.35}, {x: 0.6, y: 0.4}, {x: 0.65, y: 0.35},
                {x: 0.35, y: 0.6}, {x: 0.4, y: 0.65}, {x: 0.6, y: 0.6}, {x: 0.65, y: 0.65},
                {x: 0.3, y: 0.4}, {x: 0.3, y: 0.6}, {x: 0.7, y: 0.4}, {x: 0.7, y: 0.6}
            ],

            // Arrow - direction/momentum shape, generated procedurally
            arrow: [
                ...this.generateArrowShaft(),
                ...this.generateArrowHead()
            ]
        };
    }

    generateArrowShaft() {
        const shaft = [];
        // Horizontal shaft with thickness (7 rows)
        const shaftRows = [0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53];

        shaftRows.forEach(y => {
            for (let x = 0.15; x <= 0.60; x += 0.015) {
                shaft.push({x, y});
            }
        });

        return shaft;
    }

    generateArrowHead() {
        const head = [];
        const tipX = 0.75;
        const baseX = 0.60;
        const centerY = 0.5;
        const headHeight = 0.10;

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

    /**
     * Morphs all particles to form a specific shape
     * @param {string} shapeName - Name of the shape to morph to ('cloud', 'constellation', 'arrow')
     */
    morphToShape(shapeName) {
        const shapes = this.getShapeDefinitions();
        const targetPositions = shapes[shapeName] || this.getRandomPositions(this.particleCount);
        const containerRect = this.container.getBoundingClientRect();

        // Create enough particles for the largest shape
        if (this.particles.length === 0) {
            const maxParticles = Math.max(
                shapes.arrow.length,
                shapes.cloud.length,
                shapes.constellation.length
            );
            this.createParticles(maxParticles);
        }

        this.particles.forEach((particle, index) => {
            const target = targetPositions[index % targetPositions.length];

            // Reduce randomization for geometric shapes
            const jitterAmount = (shapeName === 'arrow' || shapeName === 'constellation') ? 0.01 : 0.05;
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

    /** Pause the automatic shape cycling */
    pause() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /** Resume the automatic shape cycling */
    resume() {
        if (!this.animationInterval) {
            this.animationInterval = setInterval(() => {
                this.nextShape();
            }, this.shapeInterval);
        }
    }

    /** Manually morph to a specific shape by name */
    morphToSpecificShape(shapeName) {
        if (this.shapeNames.includes(shapeName)) {
            this.morphToShape(shapeName);
            this.currentShapeIndex = this.shapeNames.indexOf(shapeName);
        }
    }
}


/* =============================================================================
   2. TIMELINE ANIMATION SYSTEM
   =============================================================================
   Scroll-triggered horizontal timeline with animated progress bar and events.
   Uses IntersectionObserver to detect when the timeline enters the viewport.

   Usage:
     HTML: <div class="timeline-horizontal">
             <div class="timeline-line"><div class="timeline-progress" id="timeline-progress"></div></div>
             <div class="timeline-events" id="timeline-events">
               <div class="timeline-event">...</div>
             </div>
           </div>
     JS:   Auto-initializes on DOMContentLoaded if elements exist.
           Or manually: new TimelineAnimationSystem('timeline-events', 'timeline-progress');
*/

class TimelineAnimationSystem {
    /**
     * @param {string} timelineId - The ID of the timeline events container
     * @param {string} progressId - The ID of the progress bar element
     */
    constructor(timelineId, progressId) {
        this.timeline = document.getElementById(timelineId);
        this.progress = document.getElementById(progressId);

        if (!this.timeline || !this.progress) {
            console.warn('Timeline elements not found');
            return;
        }

        this.events = this.timeline.querySelectorAll('.timeline-event');
        this.animationStarted = false;

        this.init();
    }

    init() {
        this.setupScrollObserver();
    }

    /** Sets up IntersectionObserver for scroll-based animation trigger */
    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animationStarted) {
                    setTimeout(() => {
                        this.animateTimeline();
                    }, 200);
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(this.timeline);
    }

    /** Animates the timeline progress bar and events sequentially */
    animateTimeline() {
        if (this.animationStarted) return;
        this.animationStarted = true;

        // Start progress bar animation
        this.progress.style.width = '100%';

        // Animate events one by one with 800ms stagger
        this.events.forEach((event, index) => {
            setTimeout(() => {
                event.classList.add('animate');
                event.classList.add('active');

                // Remove active class from previous event
                if (index > 0) {
                    this.events[index - 1].classList.remove('active');
                }

                // Keep the last event active, then activate all
                if (index === this.events.length - 1) {
                    setTimeout(() => {
                        this.events.forEach(e => e.classList.add('active'));
                    }, 500);
                }
            }, index * 800);
        });
    }

    /** Resets the timeline animation to initial state */
    reset() {
        this.animationStarted = false;
        this.progress.style.width = '0%';
        this.events.forEach(event => {
            event.classList.remove('animate', 'active');
        });
    }

    /** Destroys the timeline system */
    destroy() {
        this.reset();
    }
}


/* =============================================================================
   3. UI UTILITIES
   =============================================================================
   Common UI interaction utilities: hover effects, smooth scrolling,
   debounce/throttle helpers.
*/

class UIUtils {
    /**
     * Creates hover effect for elements with direct color values
     * @param {string} selector - CSS selector
     * @param {string} hoverColor - Color on hover
     * @param {string} defaultColor - Default color
     */
    static setupColorHoverEffect(selector, hoverColor, defaultColor) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.color = hoverColor;
            });
            element.addEventListener('mouseleave', () => {
                element.style.color = defaultColor;
            });
        });
    }

    /**
     * Creates hover effect using CSS custom property names
     * @param {string} selector - CSS selector
     * @param {string} hoverColor - CSS variable name (e.g. '--accent')
     * @param {string} defaultColor - CSS variable name (e.g. '--text-secondary')
     */
    static setupCSSVariableHoverEffect(selector, hoverColor, defaultColor) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.color = `var(${hoverColor})`;
            });
            element.addEventListener('mouseleave', () => {
                element.style.color = `var(${defaultColor})`;
            });
        });
    }

    /**
     * Sets up smooth scroll for anchor links
     * @param {string} selector - CSS selector for links (default: 'a[href^="#"]')
     */
    static setupSmoothScroll(selector) {
        const links = document.querySelectorAll(selector);
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    /**
     * Sets up hover effects using data-hover-color and data-default-color attributes
     * @param {string} selector - CSS selector for elements with data attributes
     */
    static setupDataAttributeHoverEffects(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const hoverColor = element.dataset.hoverColor;
            const defaultColor = element.dataset.defaultColor;
            if (hoverColor && defaultColor) {
                element.addEventListener('mouseenter', () => {
                    element.style.color = hoverColor;
                });
                element.addEventListener('mouseleave', () => {
                    element.style.color = defaultColor;
                });
            }
        });
    }

    /**
     * Debounce utility
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {Function}
     */
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle utility
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function}
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /** Initializes common UI interactions (call on DOMContentLoaded) */
    static initCommonInteractions() {
        // LinkedIn-style link hover using CSS variables
        this.setupCSSVariableHoverEffect(
            '.linkedin-link',
            '--accent',
            '--text-secondary'
        );

        // Smooth scrolling for all anchor links
        this.setupSmoothScroll('a[href^="#"]');

        // Data-attribute driven hover effects
        this.setupDataAttributeHoverEffects('[data-hover-color]');
    }
}


/* =============================================================================
   AUTO-INITIALIZATION
   =============================================================================
   All systems auto-initialize on DOMContentLoaded if their required
   HTML elements exist on the page.
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle animation if container exists
    if (document.getElementById('particle-container')) {
        if (window.particleSystem) {
            window.particleSystem.destroy();
        }
        window.particleSystem = new ParticleAnimationSystem('particle-container', {
            particleCount: 240,
            transitionDuration: 4000,
            shapeInterval: 10000
        });
    }

    // Initialize timeline animation if elements exist
    const timeline = document.getElementById('timeline-events');
    const progress = document.getElementById('timeline-progress');
    if (timeline && progress) {
        window.timelineSystem = new TimelineAnimationSystem('timeline-events', 'timeline-progress');
    }

    // Initialize common UI interactions
    UIUtils.initCommonInteractions();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleAnimationSystem, TimelineAnimationSystem, UIUtils };
}
