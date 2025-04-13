// Product Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Product Image Gallery
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                const imageUrl = this.getAttribute('data-image');
                mainImage.src = imageUrl;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColor = document.getElementById('selected-color');
    
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Update active color
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Update selected color text
                if (selectedColor) {
                    selectedColor.textContent = this.getAttribute('data-color');
                }
            });
        });
    }
    
    // Size Options
    const sizeOptions = document.querySelectorAll('.size-option');
    
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Update active size
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Quantity Selector
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
    
    // Add to Cart Button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get product details
            const productTitle = document.querySelector('.product-title').textContent;
            const productPrice = document.querySelector('.current-price').textContent;
            const productColor = document.querySelector('.color-option.active').getAttribute('data-color');
            const productSize = document.querySelector('.size-option.active').textContent;
            const productQuantity = document.querySelector('.quantity-input').value;
            const productImage = document.getElementById('main-product-image').src;
            
            // Create cart item object
            const cartItem = {
                title: productTitle,
                price: productPrice,
                color: productColor,
                size: productSize,
                quantity: productQuantity,
                image: productImage
            };
            
            // Add to cart using CartHandler
            CartHandler.addToCart(cartItem);
            CartHandler.showNotification(`${productTitle} added to cart!`);
        });
    }
    
    // Wishlist Button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            // Toggle wishlist icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                CartHandler.showNotification('Product added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                CartHandler.showNotification('Product removed from wishlist!');
            }
        });
    }
    
    // Product Tabs
    const tabButtons = document.querySelectorAll('.product-tabs .tab-btn');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the tab to show
                const tabId = this.getAttribute('data-tab');
                
                // Hide all tab panes
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Show the selected tab pane
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Review Rating Selector
    const ratingStars = document.querySelectorAll('.rating-selector i');
    
    if (ratingStars.length > 0) {
        ratingStars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // Update stars
                ratingStars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                // Highlight stars on hover
                ratingStars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('hover');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                // Remove highlight on mouseout
                ratingStars.forEach(s => s.classList.remove('hover'));
            });
        });
    }
    
    // Review Form Submission
    const reviewForm = document.querySelector('.review-form');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('review-name').value;
            const email = document.getElementById('review-email').value;
            const content = document.getElementById('review-content').value;
            const rating = document.querySelectorAll('.rating-selector .fas').length;
            
            // Here you would typically send the review data to a server
            // For now, we'll just show a success message
            
            // Clear form
            this.reset();
            ratingStars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
            
            // Show success message
            CartHandler.showNotification('Thank you for your review! It will be published after moderation.');
        });
    }
    
    // Notification Function
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--brunswick-green)';
        notification.style.color = 'var(--white)';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Add notification to the DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}); 