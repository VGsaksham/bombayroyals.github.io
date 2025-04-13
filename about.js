// About Page JavaScript for Bombay Royals

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
});

// Sidebar Navigation
function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && closeSidebar && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Testimonials Slider
function initTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });
    
    // Function to show testimonial at specific index
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show testimonial at current index
        testimonials[index].style.display = 'block';
        
        // Add active class to current dot
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Event listener for previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = testimonials.length - 1;
            }
            showTestimonial(newIndex);
        });
    }
    
    // Event listener for next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) {
                newIndex = 0;
            }
            showTestimonial(newIndex);
        });
    }
    
    // Auto-rotate testimonials every 5 seconds
    let autoRotate = setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) {
            newIndex = 0;
        }
        showTestimonial(newIndex);
    }, 5000);
    
    // Pause auto-rotation when hovering over testimonials
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        testimonialsSlider.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        
        testimonialsSlider.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= testimonials.length) {
                    newIndex = 0;
                }
                showTestimonial(newIndex);
            }, 5000);
        });
    }
    
    // Add fade animation styles
    const style = document.createElement('style');
    style.textContent = `
        .testimonial {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .testimonial:first-child {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Override display style with opacity for smooth transitions
    function showTestimonialWithFade(index) {
        // Fade out all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.opacity = '0';
            setTimeout(() => {
                testimonial.style.display = 'none';
            }, 500);
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // After short delay, show and fade in the selected testimonial
        setTimeout(() => {
            testimonials[index].style.display = 'block';
            setTimeout(() => {
                testimonials[index].style.opacity = '1';
            }, 50);
            
            // Add active class to current dot
            dots[index].classList.add('active');
            
            // Update current index
            currentIndex = index;
        }, 500);
    }
    
    // Replace the original function with the fade version
    showTestimonial = showTestimonialWithFade;
} 