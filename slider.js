document.addEventListener('DOMContentLoaded', function() {
    // Slider elements
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    // State
    let currentSlide = 0;
    let slideInterval;
    const slideCount = slides.length;
    
    // Initialize slider
    function initSlider() {
        // Set initial active slide
        updateActiveSlide(0);
        
        // Start autoplay
        startAutoPlay();
        
        // Add event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Pause on hover
        sliderTrack.addEventListener('mouseenter', pauseSlider);
        sliderTrack.addEventListener('mouseleave', startAutoPlay);
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            pauseSlider();
        }, { passive: true });
        
        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
    }
    
    // Update active slide
    function updateActiveSlide(slideIndex) {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
            
            // Trigger animation
            if (index === slideIndex) {
                const content = slide.querySelector('.slide-content');
                if (content) {
                    content.style.animation = 'none';
                    void content.offsetWidth; // Trigger reflow
                    content.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            }
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        // Update current slide index
        currentSlide = slideIndex;
    }
    
    // Next slide
    function nextSlide() {
        const newIndex = (currentSlide + 1) % slideCount;
        updateActiveSlide(newIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const newIndex = (currentSlide - 1 + slideCount) % slideCount;
        updateActiveSlide(newIndex);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        updateActiveSlide(slideIndex);
    }
    
    // Auto play
    function startAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    function pauseSlider() {
        clearInterval(slideInterval);
    }
    
    // Initialize countdown timer
    function initCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        // Set the date we're counting down to (24 hours from now)
        const countDownDate = new Date();
        countDownDate.setHours(countDownDate.getHours() + 24);
        
        // Update the countdown every 1 second
        const x = setInterval(function() {
            // Get today's date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            
            // Time calculations for hours, minutes and seconds
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // If the countdown is finished, reset it
            if (distance < 0) {
                clearInterval(x);
                countDownDate.setDate(countDownDate.getDate() + 1);
            }
        }, 1000);
    }
    
    // Initialize everything
    initSlider();
    initCountdown();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            pauseSlider();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            pauseSlider();
        }
    });
    
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const lazyLoad = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        };
        
        const imageObserver = new IntersectionObserver(lazyLoad, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
