/**
 * Timeline Animation System
 * Handles horizontal timeline animations with scroll-based triggers
 */
class TimelineAnimationSystem {
    /**
     * Creates a new TimelineAnimationSystem instance
     * @param {string} timelineId - The ID of the timeline container element
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

    /**
     * Sets up intersection observer for scroll-based animation trigger
     */
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

    /**
     * Animates the timeline progress bar and events
     */
    animateTimeline() {
        if (this.animationStarted) return;
        this.animationStarted = true;
        
        // Start progress bar animation
        this.progress.style.width = '100%';
        
        // Animate events one by one
        this.events.forEach((event, index) => {
            setTimeout(() => {
                event.classList.add('animate');
                event.classList.add('active');
                
                // Remove active class from previous event
                if (index > 0) {
                    this.events[index - 1].classList.remove('active');
                }
                
                // Keep the last event active
                if (index === this.events.length - 1) {
                    setTimeout(() => {
                        this.events.forEach(e => e.classList.add('active'));
                    }, 500);
                }
            }, index * 800);
        });
    }

    /**
     * Resets the timeline animation
     */
    reset() {
        this.animationStarted = false;
        this.progress.style.width = '0%';
        this.events.forEach(event => {
            event.classList.remove('animate', 'active');
        });
    }

    /**
     * Destroys the timeline system
     */
    destroy() {
        // Observer cleanup is handled automatically
        this.reset();
    }
}

// Auto-initialize if timeline elements exist
document.addEventListener('DOMContentLoaded', function() {
    const timeline = document.getElementById('timeline-events');
    const progress = document.getElementById('timeline-progress');
    
    if (timeline && progress) {
        window.timelineSystem = new TimelineAnimationSystem('timeline-events', 'timeline-progress');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineAnimationSystem;
}