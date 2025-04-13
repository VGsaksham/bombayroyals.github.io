document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    loadCartItems();
    
    // Initialize quantity selectors
    initQuantitySelectors();
    
    // Initialize remove buttons
    initRemoveButtons();
    
    // Initialize update cart button
    initUpdateCart();
    
    // Initialize coupon code
    initCouponCode();
    
    // Initialize shipping method selection
    initShippingMethod();
    
    // Initialize checkout button
    initCheckoutButton();
});

function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItems = CartHandler.getCart();
    
    // Clear existing cart items (except header and actions)
    const cartHeader = cartItemsContainer.querySelector('.cart-header');
    const cartActions = cartItemsContainer.querySelector('.cart-actions');
    
    // Remove all cart items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    // If cart is empty, show message
    if (cartItems.length === 0) {
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.className = 'empty-cart-message';
        emptyCartMessage.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        
        // Insert after header
        cartHeader.insertAdjacentElement('afterend', emptyCartMessage);
        
        // Hide cart actions and summary
        if (cartActions) cartActions.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none';
        document.querySelector('.you-may-like').style.marginTop = '50px';
        
        return;
    }
    
    // Show cart actions if hidden
    if (cartActions) cartActions.style.display = '';
    document.querySelector('.cart-summary').style.display = '';
    
    // Add cart items from localStorage
    cartItems.forEach((item, index) => {
        const cartItemHTML = `
            <div class="cart-item" data-index="${index}">
                <div class="product-col">
                    <div class="product-info">
                        <div class="product-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="product-details">
                            <h3 class="product-title">${item.title}</h3>
                            <div class="product-meta">
                                <span class="product-size">Size: ${item.size}</span>
                                <span class="product-color">Color: ${item.color}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="price-col">
                    <span class="price">${item.price}</span>
                </div>
                <div class="quantity-col">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="subtotal-col">
                    <span class="subtotal">${calculateSubtotal(item.price, item.quantity)}</span>
                </div>
                <div class="remove-col">
                    <button class="remove-btn"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;
        
        // Insert before cart actions
        if (cartActions) {
            cartActions.insertAdjacentHTML('beforebegin', cartItemHTML);
        } else {
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        }
    });
    
    // Update cart totals
    updateCartTotals();
}

function calculateSubtotal(price, quantity) {
    // Remove currency symbol and commas
    const numericPrice = parseFloat(price.replace(/[₹$,]/g, ''));
    const subtotal = numericPrice * parseInt(quantity);
    
    // Format with currency symbol
    return price.includes('₹') ? `₹${subtotal.toLocaleString()}` : `$${subtotal.toLocaleString()}`;
}

function initQuantitySelectors() {
    document.addEventListener('click', function(e) {
        // Handle minus button
        if (e.target.closest('.quantity-btn.minus')) {
            const btn = e.target.closest('.quantity-btn.minus');
            const input = btn.nextElementSibling;
            const cartItem = btn.closest('.cart-item');
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = value - 1;
                updateItemSubtotal(cartItem);
                
                // Update in localStorage
                const index = cartItem.dataset.index;
                CartHandler.updateQuantity(index, input.value);
            }
        }
        
        // Handle plus button
        if (e.target.closest('.quantity-btn.plus')) {
            const btn = e.target.closest('.quantity-btn.plus');
            const input = btn.previousElementSibling;
            const cartItem = btn.closest('.cart-item');
            let value = parseInt(input.value);
            
            if (value < 10) {
                input.value = value + 1;
                updateItemSubtotal(cartItem);
                
                // Update in localStorage
                const index = cartItem.dataset.index;
                CartHandler.updateQuantity(index, input.value);
            }
        }
    });
    
    // Handle direct input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            const cartItem = input.closest('.cart-item');
            let value = parseInt(input.value);
            
            if (value < 1) input.value = 1;
            if (value > 10) input.value = 10;
            
            updateItemSubtotal(cartItem);
            
            // Update in localStorage
            const index = cartItem.dataset.index;
            CartHandler.updateQuantity(index, input.value);
        }
    });
}

function initRemoveButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const cartItem = btn.closest('.cart-item');
            const index = cartItem.dataset.index;
            
            // Animate removal
            cartItem.style.opacity = '0';
            setTimeout(() => {
                // Remove from localStorage
                CartHandler.removeFromCart(index);
                
                // Reload cart items to update indices
                loadCartItems();
            }, 300);
        }
    });
}

function initUpdateCart() {
    const updateButton = document.querySelector('.cart-update button');
    
    if (updateButton) {
        updateButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update cart totals
            updateCartTotals();
            
            // Show success message
            CartHandler.showNotification('Cart updated successfully');
        });
    }
}

function initCouponCode() {
    const couponForm = document.querySelector('.cart-coupon');
    
    if (couponForm) {
        const couponButton = couponForm.querySelector('button');
        const couponInput = couponForm.querySelector('input');
        
        couponButton.addEventListener('click', function(e) {
            e.preventDefault();
            const code = couponInput.value.trim();
            
            if (code === 'ROYALTY') {
                applyCouponDiscount();
                CartHandler.showNotification('Coupon applied successfully');
            } else {
                CartHandler.showNotification('Invalid coupon code', 'error');
            }
        });
    }
}

function initShippingMethod() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateCartTotals();
        });
    });
}

function initCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Here you would typically redirect to checkout page
            // For now, just show a message
            CartHandler.showNotification('Proceeding to checkout...');
            
            // Simulate redirect after 1 second
            setTimeout(() => {
                alert('This would normally redirect to a checkout page. For this demo, we\'ll just clear the cart.');
                CartHandler.clearCart();
                loadCartItems();
            }, 1000);
        });
    }
}

function updateItemSubtotal(cartItem) {
    const price = cartItem.querySelector('.price').textContent;
    const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
    const subtotalElement = cartItem.querySelector('.subtotal');
    
    subtotalElement.textContent = calculateSubtotal(price, quantity);
    
    updateCartTotals();
}

function updateCartTotals() {
    // Get cart totals from CartHandler
    const totals = CartHandler.calculateTotals();
    
    // Get currency symbol from first item
    const firstItem = document.querySelector('.cart-item');
    const currencySymbol = firstItem ? 
        (firstItem.querySelector('.price').textContent.includes('₹') ? '₹' : '$') : 
        '₹';
    
    // Update subtotal
    document.querySelector('.subtotal-row .summary-value').textContent = 
        `${currencySymbol}${totals.subtotal.toLocaleString()}`;
    
    // Get shipping cost
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    let shippingCost = 0;
    if (selectedShipping) {
        const shippingText = selectedShipping.parentElement.querySelector('.shipping-method').textContent;
        if (shippingText.includes('Express')) {
            shippingCost = 800;
        } else if (shippingText.includes('Same Day')) {
            shippingCost = 1500;
        }
    }
    
    // Update tax (GST)
    document.querySelector('.tax-row .summary-value').textContent = 
        `${currencySymbol}${totals.tax.toLocaleString()}`;
    
    // Calculate total with shipping
    const total = totals.subtotal + totals.tax + shippingCost;
    
    // Update total
    document.querySelector('.total-row .summary-value').textContent = 
        `${currencySymbol}${total.toLocaleString()}`;
}

function applyCouponDiscount() {
    const subtotalElement = document.querySelector('.subtotal-row .summary-value');
    const subtotalText = subtotalElement.textContent;
    const currencySymbol = subtotalText.includes('₹') ? '₹' : '$';
    const subtotal = parseFloat(subtotalText.replace(/[₹$,]/g, ''));
    const discount = subtotal * 0.1; // 10% discount
    
    // Create or update discount row
    let discountRow = document.querySelector('.discount-row');
    if (!discountRow) {
        discountRow = document.createElement('div');
        discountRow.className = 'summary-row discount-row';
        discountRow.innerHTML = `
            <span class="summary-label">Discount (10%)</span>
            <span class="summary-value">-${currencySymbol}${discount.toLocaleString()}</span>
        `;
        const taxRow = document.querySelector('.tax-row');
        taxRow.parentNode.insertBefore(discountRow, taxRow);
    } else {
        discountRow.querySelector('.summary-value').textContent = `-${currencySymbol}${discount.toLocaleString()}`;
    }
    
    updateCartTotals();
} 