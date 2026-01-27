(function() {
    'use strict';

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    }
    
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                    entry.target.classList.add('animated');
                    animateCounter(entry.target, target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.casino-card, .transaction-card, .pros-card, .cons-card, .stat-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            element.classList.add('scroll-fade-in');
            observer.observe(element);
        });
    }
    
    // ============================================
    // PROGRESS INDICATOR
    // ============================================
    
    function initProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-indicator';
        document.body.appendChild(progressBar);
        
        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            progressBar.style.setProperty('--progress', scrollPercent + '%');
            progressBar.querySelector('::after')?.style.setProperty('width', scrollPercent + '%');
            
            const afterElement = progressBar;
            afterElement.style.setProperty('--progress-width', scrollPercent + '%');
        };
        
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ============================================
    // PARALLAX EFFECT FOR DECORATIVE ELEMENTS
    // ============================================
    
    function initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const parallaxElements = document.querySelectorAll('.decorative-cards, .decorative-coins, .decorative-stars');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * 0.1;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // ============================================
    // TABLE ROW HOVER EFFECTS
    // ============================================
    
    function initTableEffects() {
        const tableRows = document.querySelectorAll('.wp-block-table tbody tr');
        
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // ============================================
    // EXPANDABLE SECTIONS
    // ============================================
    
    function initExpandableSections() {
        const toggles = document.querySelectorAll('.expand-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const section = this.nextElementSibling;
                if (section && section.classList.contains('expandable-section')) {
                    const isCollapsed = section.classList.contains('collapsed');
                    
                    if (isCollapsed) {
                        section.classList.remove('collapsed');
                        section.classList.add('expanded');
                        this.classList.remove('collapsed');
                    } else {
                        section.classList.remove('expanded');
                        section.classList.add('collapsed');
                        this.classList.add('collapsed');
                    }
                }
            });
        });
    }
    
    // ============================================
    // TOOLTIP FUNCTIONALITY
    // ============================================
    
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.classList.add('tooltip');
        });
    }
    
    // ============================================
    // TESTIMONIAL CAROUSEL
    // ============================================
    
    function initTestimonialCarousel() {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;
        
        const items = carousel.querySelectorAll('.testimonial-item');
        if (items.length === 0) return;
        
        let currentIndex = 0;
        items[0].classList.add('active');
        
        const showNext = () => {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.add('active');
        };
        
        const interval = setInterval(showNext, 5000);
        
        carousel.addEventListener('mouseenter', () => clearInterval(interval));
        carousel.addEventListener('mouseleave', () => {
            setInterval(showNext, 5000);
        });
    }
    
    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    
    function initCountdownTimer() {
        const timer = document.querySelector('.countdown-timer');
        if (!timer) return;
        
        const targetDate = timer.getAttribute('data-target-date');
        if (!targetDate) return;
        
        const target = new Date(targetDate).getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = target - now;
            
            if (distance < 0) {
                timer.innerHTML = '<div class="countdown-expired">Expired</div>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const units = timer.querySelectorAll('.countdown-unit');
            if (units.length >= 4) {
                units[0].querySelector('.countdown-value').textContent = days;
                units[1].querySelector('.countdown-value').textContent = hours;
                units[2].querySelector('.countdown-value').textContent = minutes;
                units[3].querySelector('.countdown-value').textContent = seconds;
            }
        };
        
        setInterval(updateTimer, 1000);
        updateTimer();
    }
    
    // ============================================
    // IMAGE COMPARISON SLIDER
    // ============================================
    
    function initComparisonSlider() {
        const slider = document.querySelector('.comparison-slider');
        if (!slider) return;
        
        const handle = slider.querySelector('.comparison-slider-handle');
        if (!handle) return;
        
        let isDragging = false;
        
        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            handle.style.left = percent + '%';
            const beforeImage = slider.querySelector('.comparison-before');
            if (beforeImage) {
                beforeImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            }
        };
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        slider.addEventListener('click', (e) => {
            if (!isDragging) {
                updateSlider(e.clientX);
            }
        });
    }
    
    // ============================================
    // STICKY NAVIGATION
    // ============================================
    
    function initStickyNav() {
        const nav = document.querySelector('.sticky-nav');
        if (!nav) return;
        
        const navOffset = nav.offsetTop;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset >= navOffset) {
                nav.classList.add('stuck');
            } else {
                nav.classList.remove('stuck');
            }
        });
    }
    
    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Keyboard navigation for interactive elements
        document.querySelectorAll('.stat-card, .casino-card, .transaction-card').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize all features
        initCounters();
        initScrollAnimations();
        initProgressIndicator();
        initSmoothScroll();
        initParallax();
        initTableEffects();
        initExpandableSections();
        initTooltips();
        initTestimonialCarousel();
        initCountdownTimer();
        initComparisonSlider();
        initStickyNav();
        initLazyLoading();
        initAccessibility();
        
        // Optimize scroll handlers
        const optimizedScrollHandler = throttle(() => {
            // Scroll-based animations
        }, 16);
        
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        
        // Optimize resize handlers
        const optimizedResizeHandler = debounce(() => {
            // Recalculate layouts if needed
        }, 250);
        
        window.addEventListener('resize', optimizedResizeHandler);
    }
    
    // Start initialization
    init();
    
    // Export functions for potential external use
    window.KlarnaCasinoPage = {
        initCounters,
        initScrollAnimations,
        initProgressIndicator,
        initSmoothScroll,
        initParallax
    };
    
})();
