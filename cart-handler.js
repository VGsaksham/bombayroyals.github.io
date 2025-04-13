// Cart Handler for Bombay Royals
// This script handles cart operations across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Update cart count
    updateCartCount();
});

// Initialize cart
function initCart() {
    // Check if cart exists in localStorage
    if (!localStorage.getItem('cart')) {
        // Create empty cart
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Add item to cart
function addToCart(item) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
        // Update quantity if item already in cart
        cart[existingItemIndex].quantity += item.quantity || 1;
    } else {
        // Add new item to cart
        cart.push({
            id: item.id || Date.now(),
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity || 1,
            size: item.size || 'M'
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showCartNotification(item.title);
}

// Remove item from cart
function removeFromCart(itemId) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove item from cart
    cart = cart.filter(item => item.id !== itemId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Update item quantity in cart
function updateCartItemQuantity(itemId, quantity) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find item in cart
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Update quantity
        cart[itemIndex].quantity = quantity;
        
        // Remove item if quantity is 0
        if (quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
    }
}

// Get cart total
function getCartTotal() {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total
    return cart.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        // Get current cart
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate total items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count
        cartCount.textContent = totalItems;
        
        // Add animation class
        cartCount.classList.add('pulse');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 300);
    }
}

// Show cart notification
function showCartNotification(productTitle) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content
    notification.textContent = `${productTitle} added to cart`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Clear cart
function clearCart() {
    // Clear cart in localStorage
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Update cart count
    updateCartCount();
}

// Export functions
window.cartHandler = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    clearCart
}; 