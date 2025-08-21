// Theme Management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Loading Screen
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});

// Header Scroll Effects
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');

let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Update scroll progress
    progressBar.style.width = scrollPercent + '%';

    // Header scroll effect
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (scrollTop > lastScrollY && scrollTop > 200) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
            lastScrollY = scrollTop;
            ticking = false;
        });
        ticking = true;
    }

    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (scrollTop > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to Top Button
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
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

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');

            // Animate skill progress bars
            if (entry.target.classList.contains('card') && entry.target.querySelector('.skill-progress-bar')) {
                const progressBar = entry.target.querySelector('.skill-progress-bar');
                const width = progressBar.getAttribute('data-width');
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Project Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.reset();
        }, 2000);
    }, 1500);
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform var(--transition-normal);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
      `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Initialize skill progress bars with 0 width
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-progress-bar').forEach(bar => {
        bar.style.width = '0%';
    });
});

// Add typing effect to hero title
function typeWriter() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    const text = titleElement.innerHTML;
    titleElement.innerHTML = '';

    let index = 0;
    const speed = 50;

    function type() {
        if (index < text.length) {
            if (text.charAt(index) === '<') {
                // Handle HTML tags
                const tagEnd = text.indexOf('>', index);
                titleElement.innerHTML += text.substring(index, tagEnd + 1);
                index = tagEnd + 1;
            } else {
                titleElement.innerHTML += text.charAt(index);
                index++;
            }
            setTimeout(type, speed);
        }
    }

    setTimeout(type, 2000);
}

// Initialize typing effect
window.addEventListener('load', () => {
    setTimeout(typeWriter, 1500);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-visual');
    if (parallax) {
        const speed = scrolled * 0.1;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add intersection observer for counting animation (if needed for stats)
function animateCounter(element, target) {
    let count = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(count);
    }, 20);
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1551281044-8b39f5430b8a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=800&auto=format&fit=crop'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', preloadImages);

// Add interactive glow on buttons following cursor
function attachButtonGlow() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });
}

document.addEventListener('DOMContentLoaded', attachButtonGlow);

// Subtle 3D tilt effect for cards and project cards
function attachTiltEffect() {
    const tiltSelectors = ['.card', '.project-card'];
    const elements = document.querySelectorAll(tiltSelectors.join(','));

    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const rotateX = (dy / rect.height) * -8; // tilt up/down
            const rotateY = (dx / rect.width) * 8;  // tilt left/right
            el.style.setProperty('--tiltX', rotateX.toFixed(2) + 'deg');
            el.style.setProperty('--tiltY', rotateY.toFixed(2) + 'deg');
        });

        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--tiltX', '0deg');
            el.style.setProperty('--tiltY', '0deg');
        });
    });
}

document.addEventListener('DOMContentLoaded', attachTiltEffect);
