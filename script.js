// Academy of Jeet Kune Do Fresno - Interactive Script

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientPosition().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background change on scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Animated counter for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Animate stats when they come into view
                if (entry.target.classList.contains('about-stats')) {
                    const stats = entry.target.querySelectorAll('.stat h3');
                    stats.forEach(stat => {
                        const target = parseInt(stat.textContent);
                        if (!isNaN(target)) {
                            stat.textContent = '0';
                            animateCounter(stat, target);
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.instructor-card, .program-card, .about-stats, .contact-item').forEach(el => {
        observer.observe(el);
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                program: document.getElementById('program').value,
                message: document.getElementById('message').value
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.program) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            showNotification('Thank you for your interest! We will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this data to your server
            console.log('Form submitted with data:', formData);
        });
    }

    // Form validation helpers
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    padding: 1rem;
                    border-radius: 8px;
                    color: white;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                }
                .notification-error {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                }
                .notification-info {
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-content i {
                    font-size: 1.2rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    opacity: 0.8;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemoveTimer);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Class schedule interactions
    const classCells = document.querySelectorAll('.class-cell');
    
    classCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const className = this.querySelector('.class-name')?.textContent;
            const instructor = this.querySelector('.instructor')?.textContent;
            
            if (className) {
                showNotification(`Want to join "${className}" with ${instructor}? Contact us to get started!`, 'info');
            }
        });

        // Add hover effect
        cell.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });

        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Instructor card interactions
    const instructorCards = document.querySelectorAll('.instructor-card');
    
    instructorCards.forEach(card => {
        card.addEventListener('click', function() {
            const instructorName = this.querySelector('h3').textContent;
            showNotification(`Interested in training with ${instructorName}? Contact us for more information!`, 'info');
        });
    });

    // Program card interactions
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('click', function() {
            const programName = this.querySelector('h3').textContent;
            const contactSection = document.getElementById('contact');
            const programSelect = document.getElementById('program');
            
            // Scroll to contact form
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-select the program in the form
            setTimeout(() => {
                if (programSelect) {
                    const optionText = programName.toLowerCase();
                    const options = programSelect.options;
                    
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].text.toLowerCase().includes(optionText.split(' ')[0])) {
                            programSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                // Focus on name field
                document.getElementById('name')?.focus();
            }, 800);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Add active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add CSS for active nav links
    const navStyles = document.createElement('style');
    navStyles.textContent = `
        .nav-link.active {
            color: var(--primary-color) !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(navStyles);

    // Lazy loading for images (when you add real images)
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Add click-to-call functionality for phone numbers
    const phoneNumbers = document.querySelectorAll('a[href^="tel:"]');
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function() {
            showNotification('Calling Academy of Jeet Kune Do Fresno...', 'info');
        });
    });

    console.log('Academy of Jeet Kune Do Fresno website loaded successfully!');
});
