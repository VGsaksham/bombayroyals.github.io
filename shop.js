// Shop Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation and UI Controls
    initSidebar();
    initSearchOverlay();
    initMobileFilters();
    
    // Product Filtering and Sorting
    initFilters();
    initSorting();
    
    // Product Actions
    initProductActions();
    initQuickView();
    
    // Featured Products Slider
    initFeaturedSlider();
    
    // Load More Products
    initLoadMore();
});

// ===== NAVIGATION AND UI CONTROLS =====

function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const body = document.body;
    
    if (menuToggle && sidebar && closeSidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            body.classList.add('sidebar-open');
        });
        
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
            body.classList.remove('sidebar-open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                event.target !== menuToggle) {
                sidebar.classList.remove('active');
                body.classList.remove('sidebar-open');
            }
        });
    }
}

function initSearchOverlay() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');
    
    if (searchToggle && searchOverlay && closeSearch) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
        
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
        
        // Close search when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

function initMobileFilters() {
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const shopSidebar = document.querySelector('.shop-sidebar');
    const closeFilters = document.querySelector('.close-filters');
    const body = document.body;
    
    if (filterToggleBtn && shopSidebar && closeFilters) {
        filterToggleBtn.addEventListener('click', function() {
            shopSidebar.classList.add('active');
            body.classList.add('filters-open');
        });
        
        closeFilters.addEventListener('click', function() {
            shopSidebar.classList.remove('active');
            body.classList.remove('filters-open');
        });
    }
}

// ===== PRODUCT FILTERING AND SORTING =====

function initFilters() {
    // Category filters
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input[data-category]');
    
    // Price range slider
    const rangeMin = document.querySelector('.range-min');
    const rangeMax = document.querySelector('.range-max');
    const rangeValueMin = document.querySelector('.range-value-min');
    const rangeValueMax = document.querySelector('.range-value-max');
    
    // Color filters
    const colorFilters = document.querySelectorAll('.color-filter');
    
    // Size filters
    const sizeFilters = document.querySelectorAll('.size-filter');
    
    // Material filters
    const materialCheckboxes = document.querySelectorAll('.filter-checkbox input[data-material]');
    
    // Filter buttons
    const applyFilterBtn = document.querySelector('.filter-apply-btn');
    const resetFilterBtn = document.querySelector('.filter-reset-btn');
    
    // Initialize price range slider
    if (rangeMin && rangeMax && rangeValueMin && rangeValueMax) {
        rangeMin.addEventListener('input', function() {
            const minValue = parseInt(this.value);
            const maxValue = parseInt(rangeMax.value);
            
            if (minValue > maxValue) {
                this.value = maxValue;
            }
            
            rangeValueMin.textContent = '$' + this.value;
        });
        
        rangeMax.addEventListener('input', function() {
            const maxValue = parseInt(this.value);
            const minValue = parseInt(rangeMin.value);
            
            if (maxValue < minValue) {
                this.value = minValue;
            }
            
            rangeValueMax.textContent = '$' + this.value;
        });
    }
    
    // Initialize color filters
    if (colorFilters) {
        colorFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // Initialize size filters
    if (sizeFilters) {
        sizeFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // Apply filters
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Reset filters
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

function applyFilters() {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox input[data-category]:checked'))
        .map(checkbox => checkbox.dataset.category);
    
    // Get price range
    const minPrice = parseInt(document.querySelector('.range-min').value);
    const maxPrice = parseInt(document.querySelector('.range-max').value);
    
    // Get selected colors
    const selectedColors = Array.from(document.querySelectorAll('.color-filter.active'))
        .map(color => color.dataset.color);
    
    // Get selected sizes
    const selectedSizes = Array.from(document.querySelectorAll('.size-filter.active'))
        .map(size => size.dataset.size);
    
    // Get selected materials
    const selectedMaterials = Array.from(document.querySelectorAll('.filter-checkbox input[data-material]:checked'))
        .map(checkbox => checkbox.dataset.material);
    
    // Filter products
    productCards.forEach(card => {
        let showCard = true;
        
        // Filter by category
        if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
            const cardCategory = card.dataset.category;
            if (!selectedCategories.includes(cardCategory)) {
                showCard = false;
            }
        }
        
        // Filter by price
        const cardPrice = parseInt(card.dataset.price);
        if (cardPrice < minPrice || cardPrice > maxPrice) {
            showCard = false;
        }
        
        // Filter by color
        if (selectedColors.length > 0) {
            const cardColors = card.dataset.colors.split(',');
            if (!selectedColors.some(color => cardColors.includes(color))) {
                showCard = false;
            }
        }
        
        // Filter by size
        if (selectedSizes.length > 0) {
            const cardSizes = card.dataset.sizes.split(',');
            if (!selectedSizes.some(size => cardSizes.includes(size))) {
                showCard = false;
            }
        }
        
        // Filter by material
        if (selectedMaterials.length > 0) {
            // Note: Material data is not in the current HTML, would need to be added
            // This is just a placeholder for the functionality
            const cardMaterial = card.dataset.material;
            if (cardMaterial && !selectedMaterials.includes(cardMaterial)) {
                showCard = false;
            }
        }
        
        // Show or hide card
        card.style.display = showCard ? 'block' : 'none';
    });
    
    // Update results count
    updateResultsCount();
}

function resetFilters() {
    // Reset category checkboxes
    document.querySelectorAll('.filter-checkbox input[data-category]').forEach(checkbox => {
        checkbox.checked = checkbox.dataset.category === 'all';
    });
    
    // Reset price range
    const rangeMin = document.querySelector('.range-min');
    const rangeMax = document.querySelector('.range-max');
    const rangeValueMin = document.querySelector('.range-value-min');
    const rangeValueMax = document.querySelector('.range-value-max');
    
    if (rangeMin && rangeMax && rangeValueMin && rangeValueMax) {
        rangeMin.value = 0;
        rangeMax.value = 1000;
        rangeValueMin.textContent = '$0';
        rangeValueMax.textContent = '$1000';
    }
    
    // Reset color filters
    document.querySelectorAll('.color-filter').forEach(filter => {
        filter.classList.remove('active');
    });
    
    // Reset size filters
    document.querySelectorAll('.size-filter').forEach(filter => {
        filter.classList.remove('active');
    });
    
    // Reset material checkboxes
    document.querySelectorAll('.filter-checkbox input[data-material]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Show all products
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
    });
    
    // Update results count
    updateResultsCount();
}

function updateResultsCount() {
    const visibleProducts = document.querySelectorAll('.product-card[style="display: block"]').length;
    const resultsCount = document.querySelector('.shop-results span');
    
    if (resultsCount) {
        resultsCount.textContent = visibleProducts;
    }
}

function initSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortProducts(sortValue);
        });
    }
}

function sortProducts(sortBy) {
    const productGrid = document.querySelector('.product-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    if (productGrid && productCards.length > 0) {
        // Sort products based on selected option
        productCards.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'newest':
                    return parseInt(b.dataset.date) - parseInt(a.dataset.date);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'featured':
                default:
                    return parseInt(b.dataset.featured) - parseInt(a.dataset.featured);
            }
        });
        
        // Reorder products in the DOM
        productCards.forEach(card => {
            productGrid.appendChild(card);
        });
    }
}

// ===== PRODUCT ACTIONS =====

function initProductActions() {
    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll('.action-btn[data-action="wishlist"]');
    
    // Cart buttons
    const cartBtns = document.querySelectorAll('.action-btn[data-action="cart"]');
    
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.action-btn[data-action="quickview"]');
    
    // Initialize wishlist buttons
    if (wishlistBtns) {
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                
                // Toggle wishlist icon
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification(`${productTitle} added to wishlist`);
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification(`${productTitle} removed from wishlist`);
                }
            });
        });
    }
    
    // Initialize cart buttons
    if (cartBtns) {
        cartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                
                // Add to cart
                addToCart(productCard);
                showNotification(`${productTitle} added to cart`);
            });
        });
    }
    
    // Initialize quick view buttons
    if (quickViewBtns) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                openQuickView(productCard);
            });
        });
    }
}

function addToCart(productCard) {
    // Get product details
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.dataset.price;
    const productImage = productCard.querySelector('.product-image img').src;
    
    // Create cart item object
    const cartItem = {
        id: Date.now(), // Generate unique ID
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.title === productTitle);
    
    if (existingItemIndex > -1) {
        // Increment quantity if already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push(cartItem);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.textContent = totalItems;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== QUICK VIEW MODAL =====

function initQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
        
        // Initialize quantity selector
        const minusBtn = modal.querySelector('.quantity-btn.minus');
        const plusBtn = modal.querySelector('.quantity-btn.plus');
        const quantityInput = modal.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
            });
        }
        
        // Initialize size options
        const sizeOptions = modal.querySelectorAll('.size-option');
        
        if (sizeOptions) {
            sizeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    sizeOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
        
        // Initialize add to cart button
        const addToCartBtn = document.getElementById('quickViewAddToCart');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const title = document.getElementById('quickViewTitle').textContent;
                const price = document.getElementById('quickViewPrice').textContent.replace('$', '');
                const image = document.getElementById('quickViewImage').src;
                const quantity = parseInt(quantityInput.value);
                
                // Create cart item object
                const cartItem = {
                    id: Date.now(), // Generate unique ID
                    title: title,
                    price: price,
                    image: image,
                    quantity: quantity
                };
                
                // Get current cart from localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if product already in cart
                const existingItemIndex = cart.findIndex(item => item.title === title);
                
                if (existingItemIndex > -1) {
                    // Increment quantity if already in cart
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item to cart
                    cart.push(cartItem);
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Close modal
                modal.style.display = 'none';
                
                // Show notification
                showNotification(`${title} added to cart`);
            });
        }
        
        // Initialize view details button
        const viewDetailsBtn = document.getElementById('quickViewDetails');
        
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                window.location.href = 'product-details.html';
            });
        }
    }
}

function openQuickView(productCard) {
    const modal = document.getElementById('quickViewModal');
    
    if (modal) {
        // Get product details
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        
        // Set modal content
        document.getElementById('quickViewTitle').textContent = productTitle;
        document.getElementById('quickViewPrice').textContent = productPrice;
        document.getElementById('quickViewImage').src = productImage;
        
        // Reset quantity
        const quantityInput = modal.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        // Reset size selection
        const sizeOptions = modal.querySelectorAll('.size-option');
        if (sizeOptions) {
            sizeOptions.forEach(option => option.classList.remove('active'));
            sizeOptions[2].classList.add('active'); // Select Medium by default
        }
        
        // Show modal
        modal.style.display = 'block';
    }
}

// ===== FEATURED SLIDER =====

function initFeaturedSlider() {
    const sliderWrapper = document.querySelector('.featured-slider-wrapper');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (sliderWrapper && prevBtn && nextBtn) {
        let slideIndex = 0;
        const slides = sliderWrapper.querySelectorAll('.featured-card');
        const slideWidth = slides[0].offsetWidth;
        const slidesToShow = window.innerWidth < 768 ? 1 : 3;
        
        // Set initial position
        updateSliderPosition();
        
        // Previous slide
        prevBtn.addEventListener('click', function() {
            slideIndex = Math.max(0, slideIndex - 1);
            updateSliderPosition();
        });
        
        // Next slide
        nextBtn.addEventListener('click', function() {
            slideIndex = Math.min(slides.length - slidesToShow, slideIndex + 1);
            updateSliderPosition();
        });
        
        // Update slider position
        function updateSliderPosition() {
            const translateX = -slideIndex * slideWidth;
            sliderWrapper.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            prevBtn.disabled = slideIndex === 0;
            nextBtn.disabled = slideIndex >= slides.length - slidesToShow;
            
            // Update button opacity based on state
            prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
            nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Recalculate slide width
            const newSlideWidth = slides[0].offsetWidth;
            
            // Update slidesToShow based on screen width
            const newSlidesToShow = window.innerWidth < 768 ? 1 : 3;
            
            // Adjust slideIndex if needed
            if (slideIndex > slides.length - newSlidesToShow) {
                slideIndex = Math.max(0, slides.length - newSlidesToShow);
            }
            
            // Update slider position
            updateSliderPosition();
        });
    }
}

// ===== LOAD MORE PRODUCTS =====

function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would typically load more products from an API
            // For demo purposes, we'll just show a message
            this.textContent = 'No More Products';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('All products loaded');
            }, 500);
        });
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
}); 