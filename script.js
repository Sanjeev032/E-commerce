document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
const cartCount = document.getElementById('cart-count');
const loginBtn = document.getElementById('login-btn');
const sidebar = document.querySelector('.sidebar');
const closeSidebar = document.querySelector('.close-sidebar');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileSearchBtn = document.querySelector('.mobile-search');
// Search container is not used in the current implementation
// const searchContainer = document.querySelector('.search-container');
const backToTopBtn = document.querySelector('.back-to-top');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const quantityInput = document.getElementById('quantity');
const minusBtn = document.querySelector('.quantity-btn:first-child');
const plusBtn = document.querySelector('.quantity-btn:last-child');
const wishlistBtns = document.querySelectorAll('.wishlist-btn');
const shareBtn = document.querySelector('.share-btn');
const mobileMenu = document.querySelector('.mobile-nav');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileSearch = document.querySelector('.mobile-search-container');
const mobileSearchClose = document.querySelector('.mobile-search-close');

// Cart functionality
let cart = 0;
let isLoggedIn = false;
let wishlist = [];

// Toggle sidebar
function toggleSidebar() {
    document.body.style.overflow = sidebar.classList.contains('active') ? 'auto' : 'hidden';
    sidebar.classList.toggle('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'auto' : 'hidden';
    mobileMenu.classList.toggle('active');
}

// Toggle mobile search
function toggleMobileSearch() {
    document.body.style.overflow = mobileSearch.classList.contains('active') ? 'auto' : 'hidden';
    mobileSearch.classList.toggle('active');
    if (mobileSearch.classList.contains('active')) {
        mobileSearch.querySelector('input').focus();
    }
}

// Close sidebar when clicking outside
function closeSidebarOnClickOutside(e) {
    if (!sidebar.contains(e.target) && !e.target.matches('#login-btn')) {
        sidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking outside
function closeMobileMenuOnClickOutside(e) {
    if (!mobileMenu.contains(e.target) && !e.target.matches('.mobile-menu-btn')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close mobile search when clicking outside
function closeMobileSearchOnClickOutside(e) {
    if (!mobileSearch.contains(e.target) && !e.target.matches('.mobile-search')) {
        mobileSearch.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Show back to top button on scroll
function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Switch tabs
function switchTab(e) {
    const targetTab = e.target.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show corresponding tab content
    tabPanes.forEach(pane => {
        if (pane.id === targetTab) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

// Update quantity
function updateQuantity(change) {
    let newValue = parseInt(quantityInput.value) + change;
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    quantityInput.value = newValue;
}

// Toggle wishlist
function toggleWishlist(e) {
    const productId = e.currentTarget.getAttribute('data-product-id');
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        e.currentTarget.classList.add('active');
        e.currentTarget.innerHTML = '<i class="fas fa-heart"></i> Saved';
    } else {
        wishlist.splice(index, 1);
        e.currentTarget.classList.remove('active');
        e.currentTarget.innerHTML = '<i class="far fa-heart"></i> Save for later';
    }
    
    // Update wishlist count in header if on the wishlist page
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Share product
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: document.querySelector('.product-title').textContent,
            text: 'Check out this amazing product!',
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            copyToClipboard(window.location.href);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard(window.location.href);
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        prompt('Copy to clipboard: Ctrl+C, Enter', text);
    }
    document.body.removeChild(textarea);
}

// Initialize product gallery
function initProductGallery() {
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newSrc = thumb.getAttribute('data-full');
                mainImage.src = newSrc;
                
                // Update active thumbnail
                document.querySelector('.thumbnail.active')?.classList.remove('active');
                thumb.classList.add('active');
            });
        });
        
        // Set first thumbnail as active by default
        thumbnails[0].classList.add('active');
    }
}

// Initialize quantity selector
function initQuantitySelector() {
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => updateQuantity(-1));
        plusBtn.addEventListener('click', () => updateQuantity(1));
        
        // Ensure quantity is within bounds when manually input
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            quantityInput.value = value;
        });
    }
}

// Initialize tabs
function initTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Show first tab by default
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// Initialize wishlist buttons
function initWishlist() {
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', toggleWishlist);
    });
}

// Initialize event listeners
function initEventListeners() {
    // Close sidebar when clicking outside
    document.addEventListener('click', closeSidebarOnClickOutside);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnClickOutside);
    
    // Close mobile search when clicking outside
    document.addEventListener('click', closeMobileSearchOnClickOutside);
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile search toggle
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', toggleMobileSearch);
    }
    
    if (mobileSearchClose) {
        mobileSearchClose.addEventListener('click', toggleMobileSearch);
    }
    
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', toggleBackToTop);
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Share button
    if (shareBtn) {
        shareBtn.addEventListener('click', shareProduct);
    }
    
    // Close sidebar when clicking the close button
    if (closeSidebar) {
        closeSidebar.addEventListener('click', toggleSidebar);
    }
    
    // Show signup form
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }
    
    // Show login form
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            // Hardcoded credentials for demo
            if (username === 'admin' && password === 'password') {
                isLoggedIn = true;
                alert('Login successful!');
                if (loginBtn) {
                    loginBtn.innerHTML = '<i class="fas fa-user"></i> Account';
                }
                toggleSidebar();
                loginForm.reset();
            } else {
                alert('Invalid username or password');
            }
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            // Basic validation
            if (username && email && password) {
                alert('Account created successfully! Please login.');
                signupForm.reset();
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Add to cart and buy now functionality
    document.addEventListener('click', (e) => {
        // Add to cart
        if (e.target.classList.contains('add-to-cart')) {
            const _productId = e.target.getAttribute('data-product-id'); // Used for future reference
            const quantity = parseInt(quantityInput ? quantityInput.value : 1);
            
            cart += quantity;
            if (cartCount) {
                cartCount.textContent = cart;
                cartCount.style.display = 'flex';
            }
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 3000);
            }, 100);
        }
        
        // Buy now functionality
        if (e.target.classList.contains('buy-now')) {
            if (!isLoggedIn) {
                alert('Please login to proceed to checkout');
                toggleSidebar();
                return;
            }
            
            const productId = e.target.getAttribute('data-product-id');
            const quantity = parseInt(quantityInput ? quantityInput.value : 1);
            
            // In a real app, you would redirect to checkout with the product ID and quantity
            window.location.href = `checkout.html?product=${productId}&quantity=${quantity}`;
        }
        
        // Toggle sidebar when clicking login button
        if (e.target.id === 'login-btn' || e.target.closest('#login-btn')) {
            toggleSidebar();
        }
    });
}

// Initialize the application
function init() {
    initEventListeners();
    initProductGallery();
    initQuantitySelector();
    initTabs();
    initWishlist();
    
    // Check if user is logged in (in a real app, this would check localStorage or a cookie)
    // For demo purposes, we'll assume the user is logged out initially
    isLoggedIn = false;
    
    // Initialize cart count display
    if (cartCount) {
        cartCount.style.display = cart > 0 ? 'flex' : 'none';
    }
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Responsive adjustments
function handleResize() {
    // Add any responsive adjustments here if needed
}

// Initial call
handleResize();
    
// Add event listener for window resize
window.addEventListener('resize', handleResize);
});
