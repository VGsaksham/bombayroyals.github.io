// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close sidebar if open on mobile
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Adjust for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    
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
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            
            // Clear form
            this.reset();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            successMessage.style.backgroundColor = 'rgba(230, 248, 178, 0.2)';
            successMessage.style.borderLeft = '3px solid #294936';
            successMessage.style.padding = '15px';
            successMessage.style.marginTop = '20px';
            
            this.parentNode.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
    
    // Product actions
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length > 0) {
        productCards.forEach(card => {
            const actionButtons = card.querySelectorAll('.action-btn');
            
            actionButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Add animation effect
                    this.classList.add('clicked');
                    
                    // Remove animation after a short delay
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                    
                    // Here you would typically handle the action (add to cart, wishlist, etc.)
                });
            });
        });
    }
    
    // Image lazy loading
    const lazyImages = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    observer.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
    
    // Add active class to nav links based on URL hash
    const currentHash = window.location.hash;
    
    if (currentHash) {
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    // Add CSS class for clicked state on buttons
    const style = document.createElement('style');
    style.textContent = `
        .action-btn.clicked {
            transform: scale(0.9);
            transition: transform 0.2s ease;
        }
        
        .header.scrolled {
            padding: 10px 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .success-message {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}); 