// ===== READING PROGRESS INDICATOR =====
function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  });
}

// ===== ANIMATED COUNTERS =====
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter');
  const options = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach(counter => observer.observe(counter));
}

// ===== TESTIMONIAL CAROUSEL =====
function initCarousel() {
  const carousels = document.querySelectorAll('.testimonial-carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextSlide();
      if (touchEndX > touchStartX + 50) prevSlide();
    }
  });
}

// ===== GLASS CARDS PARALLAX EFFECT =====
function initParallaxCards() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

// ===== TRUST BADGES SPARKLE ANIMATION =====
function initTrustBadgesAnimation() {
  const badges = document.querySelectorAll('.trust-badge');
  
  badges.forEach((badge, index) => {
    // Stagger animation delay
    badge.style.animationDelay = `${index * 0.1}s`;
    
    // Add random sparkles
    setInterval(() => {
      const sparkle = document.createElement('span');
      sparkle.textContent = '✦';
      sparkle.style.position = 'absolute';
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.color = 'var(--pink-star-1)';
      sparkle.style.fontSize = '0.5rem';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
      
      badge.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 2000);
    }, 3000 + Math.random() * 2000);
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.glass-card, .trust-badge, .pros-column, .cons-column');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===== TABLE RESPONSIVE SCROLL HINT =====
function initTableScrollHint() {
  const tables = document.querySelectorAll('.payment-table, .limits-table');
  
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.overflow = 'hidden';
    
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    
    if (table.scrollWidth > table.clientWidth) {
      const hint = document.createElement('div');
      hint.textContent = '← Swipe to see more →';
      hint.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: var(--crimson);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        pointer-events: none;
        animation: fadeOut 3s forwards;
      `;
      wrapper.appendChild(hint);
    }
  });
}

// ===== SMOOTH ANCHOR SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== GLOW ON HOVER FOR HEADINGS =====
function initHeadingGlow() {
  const headings = document.querySelectorAll('h2, h3');
  
  headings.forEach(heading => {
    heading.addEventListener('mouseenter', () => {
      heading.style.textShadow = '0 0 20px var(--crimson), 0 0 40px var(--pink-star-1)';
      heading.style.transition = 'text-shadow 0.3s ease';
    });
    
    heading.addEventListener('mouseleave', () => {
      heading.style.textShadow = 'none';
    });
  });
}

// ===== ADD SPARKLE ANIMATION KEYFRAMES =====
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkleFloat {
      0% {
        opacity: 0;
        transform: translateY(0) scale(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-20px) scale(1.5);
      }
      100% {
        opacity: 0;
        transform: translateY(-40px) scale(0);
      }
    }
    
    @keyframes fadeOut {
      0% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    @keyframes floatChip {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-30px) rotate(180deg);
      }
    }
    
    @keyframes luckyGlow {
      0%, 100% {
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }
      50% {
        box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== INITIALIZE ALL ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initAnimatedCounters();
  initCarousel();
  initParallaxCards();
  initTrustBadgesAnimation();
  initScrollReveal();
  initTableScrollHint();
  initSmoothScrolling();
  initHeadingGlow();
  addAnimationStyles();
  initCasinoEffects(); // New casino effects
  
  console.log('🎰 Klarna Casino page initialized successfully!');
});

// ===== CASINO EFFECTS =====
function initCasinoEffects() {
  // Random floating poker chips
  createFloatingChips();
  
  // Slot machine spin effect
  initSlotMachine();
  
  // Card shuffle animation on scroll
  initCardShuffle();
  
  // Lucky number generator
  createLuckyNumbers();
  
  // Games carousel navigation
  initGamesCarousel();
}

function initGamesCarousel() {
  const track = document.querySelector('.games-carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  const scrollAmount = 300;
  
  prevBtn.addEventListener('click', () => {
    track.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  nextBtn.addEventListener('click', () => {
    track.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Auto-scroll carousel
  let autoScrollInterval = setInterval(() => {
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, 4000);
  
  // Pause auto-scroll on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });
  
  track.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 4000);
  });
}

function createFloatingChips() {
  const sections = document.querySelectorAll('.intro-section, .how-it-works-section');
  
  sections.forEach(section => {
    for (let i = 0; i < 3; i++) {
      const chip = document.createElement('div');
      chip.className = 'floating-casino-chip';
      chip.style.cssText = `
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid var(--crimson);
        background: conic-gradient(from 0deg, var(--dark-bg-3) 0deg 90deg, var(--crimson) 90deg 180deg, var(--dark-bg-3) 180deg 270deg, var(--crimson) 270deg 360deg);
        top: ${Math.random() * 80 + 10}%;
        ${Math.random() > 0.5 ? 'left' : 'right'}: ${Math.random() * 10}%;
        opacity: 0.1;
        animation: floatChip ${8 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
        z-index: 0;
      `;
      
      const chipValue = document.createElement('span');
      chipValue.textContent = '€';
      chipValue.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: 900;
        font-size: 1rem;
      `;
      
      chip.appendChild(chipValue);
      section.style.position = 'relative';
      section.appendChild(chip);
    }
  });
}

function initSlotMachine() {
  const slotReel = document.querySelector('.slot-reel');
  if (!slotReel) return;
  
  const symbols = ['🍒', '🍋', '7️⃣', '💎', '⭐', '🎰'];
  let currentIndex = 0;
  
  setInterval(() => {
    currentIndex = (currentIndex + 1) % symbols.length;
    const display = symbols.slice(currentIndex, currentIndex + 3).join(' ');
    slotReel.textContent = display;
  }, 1000);
}

function initCardShuffle() {
  const cards = document.querySelectorAll('.floating-card');
  
  window.addEventListener('scroll', debounce(() => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    cards.forEach((card, index) => {
      const rotation = scrollPercent * 360 * (index % 2 === 0 ? 1 : -1);
      card.style.transform = `translateY(-30px) rotate(${rotation}deg)`;
    });
  }, 50));
}

function createLuckyNumbers() {
  const tables = document.querySelectorAll('.payment-table, .limits-table');
  
  tables.forEach(table => {
    const luckyBadge = document.createElement('div');
    luckyBadge.className = 'lucky-badge';
    luckyBadge.innerHTML = `
      <span class="lucky-text">🍀 Lucky Number: <span class="lucky-number">777</span></span>
    `;
    luckyBadge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(220, 20, 60, 0.2));
      padding: 8px 15px;
      border-radius: 20px;
      border: 2px solid #FFD700;
      font-size: 0.9rem;
      font-weight: 700;
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      animation: luckyGlow 2s ease-in-out infinite;
    `;
    
    table.parentElement.style.position = 'relative';
    table.parentElement.appendChild(luckyBadge);
    
    // Animate lucky number
    setInterval(() => {
      const luckyNum = document.querySelector('.lucky-number');
      if (luckyNum) {
        luckyNum.textContent = Math.floor(Math.random() * 999) + 1;
      }
    }, 3000);
  });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll/resize events
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

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}