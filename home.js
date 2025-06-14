// Home Page JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeroSlider();
    initCountdown();
    initProductFilter();
    loadProducts();
    initTestimonials();
    initBrandsSlider();
    initLoadingOverlay();
});

// Hero Slider
function initHeroSlider() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Reset interval on user interaction
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Next slide
    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Update current slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        // Update slide and dots
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Reset animation for slide content
        const content = slides[currentSlide].querySelector('.slide-content');
        content.style.animation = 'none';
        content.offsetHeight; // Trigger reflow
        content.style.animation = 'fadeInUp 0.6s ease forwards';
        
        resetInterval();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', resetInterval);
}

// Countdown Timer
function initCountdown() {
    // Set the date we're counting down to (24 hours from now)
    const countDownDate = new Date();
    countDownDate.setHours(countDownDate.getHours() + 24);
    
    // Update the count down every 1 second
    const x = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the count down date
        const distance = countDownDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // If the count down is finished, clear interval
        if (distance < 0) {
            clearInterval(x);
            document.getElementById('countdown').innerHTML = "<p>Sale has ended!</p>";
        }
    }, 1000);
}

// Product Filter
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.section-nav-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
}

// Filter Products
function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const category = product.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 50);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

// Load Products
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    // Sample product data (in a real app, this would come from an API)
    const products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            oldPrice: 129.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            category: 'electronics',
            rating: 4.5,
            reviewCount: 128,
            isNew: true
        },
        // Add more products...
    ];
    
    // Generate product cards
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="btn-wishlist" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="btn-quickview" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
                ${product.oldPrice ? `<span class="product-badge sale">Sale</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="review-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to new elements
    initProductCardInteractions();
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return `<div class="stars">${stars}</div>`;
}

// Initialize product card interactions
function initProductCardInteractions() {
    // Wishlist toggle
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
                
            // Update wishlist count
            const wishlistCount = document.getElementById('wishlistCount');
            let count = parseInt(wishlistCount.textContent);
            wishlistCount.textContent = this.classList.contains('active') ? count + 1 : count - 1;
            
            // Show notification
            showNotification(this.classList.contains('active') ? 
                'Added to wishlist' : 'Removed from wishlist');
        });
    });
    
    // Quick view
    document.querySelectorAll('.btn-quickview').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // In a real app, this would open a modal with product details
            showNotification('Quick view feature coming soon!');
        });
    });
    
    // Add to cart
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            // In a real app, this would add the product to the cart
            const cartCount = document.getElementById('cartCount');
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = count + 1;
            
            // Show notification
            showNotification('Added to cart');
        });
    });
}

// Testimonials Slider
function initTestimonials() {
    const testimonials = [
        {
            text: "Amazing quality products and fast delivery. Will definitely shop here again!",
            author: "Sarah Johnson",
            role: "Verified Buyer",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        // Add more testimonials...
    ];
    
    // In a real app, you would implement a slider here
    // For now, we'll just show the first testimonial
}

// Brands Slider
function initBrandsSlider() {
    // In a real app, you would implement a slider for the brands
    // For now, we'll just show the brands in a grid
}

// Loading Overlay
function initLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    
    // Simulate loading
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        
        // Remove overlay after animation completes
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }, 1500);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Initialize mobile search toggle
function initMobileSearch() {
    const searchToggle = document.querySelector('.mobile-search-toggle');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('active');
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initMobileSearch();
});
