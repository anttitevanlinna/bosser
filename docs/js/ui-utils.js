/**
 * UI Utilities
 * Common UI interaction utilities and helper functions
 */
class UIUtils {
    /**
     * Creates hover effect for elements with color change
     * @param {string} selector - CSS selector for elements
     * @param {string} hoverColor - Color to use on hover
     * @param {string} defaultColor - Default color to use
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
     * Creates hover effect for elements using CSS custom properties
     * @param {string} selector - CSS selector for elements
     * @param {string} hoverColor - CSS custom property value for hover color
     * @param {string} defaultColor - CSS custom property value for default color
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
     * Sets up smooth scroll behavior for navigation links
     * @param {string} selector - CSS selector for navigation links
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
     * Sets up generic hover effects using data attributes
     * Elements should have data-hover-color and data-default-color attributes
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
     * Debounces function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttles function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
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

    /**
     * Initializes common UI interactions
     */
    static initCommonInteractions() {
        // Setup LinkedIn hover effect using CSS variables
        this.setupCSSVariableHoverEffect(
            '.linkedin-link', 
            '--accent', 
            '--text-secondary'
        );

        // Setup smooth scrolling for navigation
        this.setupSmoothScroll('a[href^="#"]');

        // Setup data-attribute hover effects
        this.setupDataAttributeHoverEffects('[data-hover-color]');
    }
}

// Auto-initialize common interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UIUtils.initCommonInteractions();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUtils;
} else if (typeof window !== 'undefined') {
    window.UIUtils = UIUtils;
}