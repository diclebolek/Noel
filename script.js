/**
 * Interactive Christmas Tree
 * Handles star blinking and letter/envelope interactions
 */

// Star toggle functionality - click/tap to toggle glow/blink animation
const star = document.getElementById('star');

function toggleStar() {
    star.classList.toggle('active');
}

// Mouse and touch support for star
star.addEventListener('click', toggleStar);
star.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleStar();
});

// Keyboard support for star
star.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleStar();
    }
});

// All envelopes/letters on the tree
const envelopes = document.querySelectorAll('.envelope');

// Function to open envelope
function openEnvelope(envelope) {
    // Close all other envelopes first
    envelopes.forEach(env => {
        if (env !== envelope) {
            env.classList.remove('active');
        }
    });
    envelope.classList.add('active');
}

// Function to close envelope
function closeEnvelope(envelope) {
    envelope.classList.remove('active');
}

// Handle envelope interactions (mouse, touch, keyboard)
envelopes.forEach((envelope, index) => {
    const envelopeIcon = envelope.querySelector('.envelope-icon');
    const closeBtn = envelope.querySelector('.close-btn');
    
    // Mouse click on envelope icon
    envelopeIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        openEnvelope(envelope);
    });
    
    // Touch support for envelope icon
    envelopeIcon.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope(envelope);
    });
    
    // Click on envelope container
    envelope.addEventListener('click', (e) => {
        if (e.target === envelope) {
            openEnvelope(envelope);
        }
    });
    
    // Touch support for envelope container
    envelope.addEventListener('touchend', (e) => {
        if (e.target === envelope || e.target === envelopeIcon) {
            e.preventDefault();
            openEnvelope(envelope);
        }
    });
    
    // Close button - mouse
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeEnvelope(envelope);
    });
    
    // Close button - touch
    closeBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeEnvelope(envelope);
    });
    
    // Keyboard support for envelope
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope(envelope);
        }
    });
    
    // Keyboard support for close button
    closeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeEnvelope(envelope);
        }
    });
});

// Close envelope when clicking on overlay/background
document.addEventListener('click', (e) => {
    // Don't close if clicking inside the envelope content
    if (e.target.closest('.envelope-content')) {
        return;
    }
    
    // Check if click is on the overlay (before pseudo-element)
    const activeEnvelope = Array.from(envelopes).find(env => env.classList.contains('active'));
    if (activeEnvelope && !activeEnvelope.contains(e.target) && e.target !== activeEnvelope) {
        closeEnvelope(activeEnvelope);
    }
});

// Touch support for overlay closing
document.addEventListener('touchend', (e) => {
    const activeEnvelope = Array.from(envelopes).find(env => env.classList.contains('active'));
    if (activeEnvelope && !activeEnvelope.contains(e.target) && e.target !== activeEnvelope) {
        if (!e.target.closest('.envelope-content')) {
            e.preventDefault();
            closeEnvelope(activeEnvelope);
        }
    }
});

// ESC key to close all envelopes
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        envelopes.forEach(envelope => {
            closeEnvelope(envelope);
        });
    }
});

// Allow body scroll when envelope is open
// (Removed overflow: hidden to allow page scrolling)

/**
 * Slider functionality for envelope content
 */
function initSlider(envelope) {
    const sliderTrack = envelope.querySelector('.slider-track');
    const slides = envelope.querySelectorAll('.slide');
    const prevBtn = envelope.querySelector('.prev-btn');
    const nextBtn = envelope.querySelector('.next-btn');
    const dotsContainer = envelope.querySelector('.slider-dots');
    
    if (!sliderTrack || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Resim ${index + 1}'e git`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = envelope.querySelectorAll('.slider-dot');
    
    // Initialize slider dimensions
    function initSliderDimensions() {
        const wrapper = sliderTrack.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        
        // Set track width to accommodate all slides
        sliderTrack.style.width = `${totalSlides * wrapperWidth}px`;
        
        // Ensure each slide is exactly wrapper width
        slides.forEach(slide => {
            slide.style.width = `${wrapperWidth}px`;
            slide.style.minWidth = `${wrapperWidth}px`;
            slide.style.flexBasis = `${wrapperWidth}px`;
        });
    }
    
    // Update slider display
    function updateSlider() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Calculate translateX in pixels for accurate positioning
        const wrapper = sliderTrack.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const translateX = -currentSlide * wrapperWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    // Initialize dimensions on load and resize
    initSliderDimensions();
    
    // Recalculate on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initSliderDimensions();
            updateSlider();
        }, 250);
    });
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Button events
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
    }
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderTrack.addEventListener('touchend', (e) => {
        e.stopPropagation();
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextSlide();
            } else {
                // Swipe right - previous
                prevSlide();
            }
        }
    }
    
    // Keyboard navigation
    envelope.addEventListener('keydown', (e) => {
        if (!envelope.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Initialize - ensure dimensions are set before first update
    setTimeout(() => {
        initSliderDimensions();
        updateSlider();
    }, 100);
    
    // Reset to first slide when envelope closes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (!envelope.classList.contains('active')) {
                    currentSlide = 0;
                    updateSlider();
                }
            }
        });
    });
    
    observer.observe(envelope, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Initialize sliders for all envelopes
envelopes.forEach(envelope => {
    initSlider(envelope);
});

