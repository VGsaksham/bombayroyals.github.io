// Product Carousel for "You May Also Like" section
document.addEventListener('DOMContentLoaded', function() {
    initProductCarousel();
    fixProductImages();
});

// Function to ensure images are properly displayed
function fixProductImages() {
    const productImages = document.querySelectorAll('.recommended-products .product-image img');
    
    productImages.forEach(img => {
        // Force image to take full width
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Check if image is loaded
        if (img.complete) {
            ensureFullWidth(img);
        } else {
            img.onload = function() {
                ensureFullWidth(img);
            };
        }
    });
}

function ensureFullWidth(img) {
    // Get the parent container width
    const container = img.closest('.product-image');
    const containerWidth = container.offsetWidth;
    
    // Force image to be at least as wide as container
    if (img.offsetWidth < containerWidth) {
        img.style.width = '100%';
        img.style.maxWidth = 'none';
    }
}

function initProductCarousel() {
    const carousel = document.querySelector('.product-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    // Variables for touch events
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Number of items visible based on screen width
    function getVisibleItems() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 768) return 2;
        if (window.innerWidth < 1024) return 3;
        return 4;
    }
    
    // Calculate item width including gap
    function getItemWidth() {
        const firstItem = carousel.querySelector('.product-card');
        if (!firstItem) return 0;
        
        const itemStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const itemMargin = parseFloat(itemStyle.marginRight) || 20; // Default gap is 20px
        
        return itemWidth + itemMargin;
    }
    
    // Scroll to specific slide
    function scrollToSlide(index) {
        const itemWidth = getItemWidth();
        const scrollPosition = index * itemWidth;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update active dot
        updateActiveDot(index);
    }
    
    // Update active dot
    function updateActiveDot(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Next slide
    function nextSlide() {
        const itemWidth = getItemWidth();
        const visibleItems = getVisibleItems();
        const totalItems = carousel.querySelectorAll('.product-card').length;
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        
        // If we're at the end, go to the beginning
        if (carousel.scrollLeft >= maxScrollLeft - 10) {
            carousel.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
            updateActiveDot(0);
        } else {
            // Otherwise, scroll one item
            carousel.scrollBy({
                left: itemWidth * visibleItems,
                behavior: 'smooth'
            });
            
            // Calculate current slide index
            const newIndex = Math.min(
                Math.floor((carousel.scrollLeft + itemWidth * visibleItems) / (itemWidth * visibleItems)),
                Math.floor(totalItems / visibleItems)
            );
            updateActiveDot(newIndex);
        }
        
        // Add animation to button
        nextBtn.classList.add('clicked');
        setTimeout(() => {
            nextBtn.classList.remove('clicked');
        }, 300);
    }
    
    // Previous slide
    function prevSlide() {
        const itemWidth = getItemWidth();
        const visibleItems = getVisibleItems();
        const totalItems = carousel.querySelectorAll('.product-card').length;
        
        // If we're at the beginning, go to the end
        if (carousel.scrollLeft <= 10) {
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            carousel.scrollTo({
                left: maxScrollLeft,
                behavior: 'smooth'
            });
            updateActiveDot(Math.floor(totalItems / visibleItems));
        } else {
            // Otherwise, scroll back one item
            carousel.scrollBy({
                left: -itemWidth * visibleItems,
                behavior: 'smooth'
            });
            
            // Calculate current slide index
            const newIndex = Math.max(
                Math.floor((carousel.scrollLeft - itemWidth * visibleItems) / (itemWidth * visibleItems)),
                0
            );
            updateActiveDot(newIndex);
        }
        
        // Add animation to button
        prevBtn.classList.add('clicked');
        setTimeout(() => {
            prevBtn.classList.remove('clicked');
        }, 300);
    }
    
    // Touch events for mobile swiping
    function touchStart(e) {
        isDragging = true;
        startPosition = getPositionX(e);
        carousel.classList.add('grabbing');
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    }
    
    function touchEnd() {
        isDragging = false;
        carousel.classList.remove('grabbing');
        
        const movedBy = currentTranslate - prevTranslate;
        
        // If moved significantly, navigate to next/prev slide
        if (movedBy < -100) {
            nextSlide();
        } else if (movedBy > 100) {
            prevSlide();
        }
        
        prevTranslate = currentTranslate;
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSlide(index);
        });
    });
    
    // Touch events
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('touchstart', touchStart);
    
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('touchmove', touchMove);
    
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('touchend', touchEnd);
    
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            touchEnd();
        }
    });
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Start auto-play
    startAutoPlay();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate visible items and update carousel
        updateActiveDot(0);
    });
    
    // Initialize first dot as active
    updateActiveDot(0);
    
    // Add hover effect to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
} 