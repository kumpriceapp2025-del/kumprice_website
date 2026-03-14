// Smooth scroll for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Download button alert
document.querySelectorAll('a[href="#download"], .btn-light').forEach(btn => {
    if (btn.textContent.includes('Download')) {
        btn.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#download') {
                e.preventDefault();
                alert('Download will start shortly. Make sure to enable "Install from Unknown Sources" in your device settings before installation.');
                // Replace with actual download link:
                // window.location.href = 'path/to/kumprice.apk';
            }
        });
    }
});

// Smart App Link Handler for KumPrice downloads
function handleSmartDownload(event, downloadUrl) {
    // Detect if user is on Android
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
        // Try to open in app first, fallback to download
        const appIntent = `intent://download/kumprice_app#Intent;scheme=https;package=com.example.kumprice_app;S.browser_fallback_url=${encodeURIComponent(downloadUrl)};end`;

        // Create a temporary link to trigger the intent
        const tempLink = document.createElement('a');
        tempLink.href = appIntent;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        // Fallback after a short delay if app doesn't open
        setTimeout(() => {
            if (confirm('Open in KumPrice app or download APK file?')) {
                // User wants to try app again or download
                window.location.href = downloadUrl;
            }
        }, 2000);

        event.preventDefault();
        return false;
    }

    // For non-Android devices, proceed with normal download
    return true;
}

// Apply smart download to all APK download links
document.addEventListener('DOMContentLoaded', function () {
    const downloadLinks = document.querySelectorAll('a[href*=".apk"], a[href*="download"]');
    downloadLinks.forEach(link => {
        if (link.href.includes('.apk') || link.textContent.toLowerCase().includes('download')) {
            link.addEventListener('click', function (event) {
                handleSmartDownload(event, this.href);
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .feature-card, .installation-step, .troubleshoot-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Troubleshooting cards hover effect with JavaScript
document.querySelectorAll('.troubleshoot-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.border = '2px solid var(--primary)';
        this.style.borderLeft = '6px solid var(--primary)';
        this.style.transform = 'translateX(5px)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.border = 'none';
        this.style.borderLeft = '4px solid var(--primary)';
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    });
});

// Stats counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const stats = entry.target.querySelectorAll('.stat-item .h2');
            stats.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('K')) {
                    const value = parseInt(text);
                    animateCounter(stat, value);
                    setTimeout(() => stat.textContent = value + 'K+', 1000);
                } else if (text.includes('★')) {
                    const value = parseFloat(text);
                    let current = 0;
                    const timer = setInterval(() => {
                        current += 0.1;
                        if (current >= value) {
                            stat.textContent = value + '★';
                            clearInterval(timer);
                        } else {
                            stat.textContent = current.toFixed(1) + '★';
                        }
                    }, 30);
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    statsObserver.observe(heroContent);
}

// Store Map Functionality
const mapMarkers = document.querySelectorAll('.map-marker');
const storeItems = document.querySelectorAll('.store-item');
const navigateBtns = document.querySelectorAll('.navigate-btn');
const filterBtn = document.getElementById('filter-open');
const currentLocationBtn = document.getElementById('current-location');

// Map marker interactions
mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
        const storeName = marker.getAttribute('data-store');
        const storeStatus = marker.getAttribute('data-status');

        // Highlight corresponding store in list
        storeItems.forEach(item => {
            const itemName = item.querySelector('h6').textContent;
            if (itemName === storeName) {
                item.style.borderColor = 'var(--primary)';
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => {
                    item.style.borderColor = '';
                }, 2000);
            }
        });
    });
});

// Store item interactions
storeItems.forEach(item => {
    item.addEventListener('click', function () {
        const storeName = this.querySelector('h6').textContent;

        // Highlight corresponding marker on map
        mapMarkers.forEach(marker => {
            if (marker.getAttribute('data-store') === storeName) {
                marker.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    marker.style.transform = '';
                }, 1000);
            }
        });
    });
});

// Navigate button functionality
navigateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!btn.disabled) {
            const storeName = btn.closest('.store-item').querySelector('h6').textContent;
            alert(`Opening navigation to ${storeName}...\nIn a real app, this would open your preferred map application.`);
        }
    });
});

// Filter open stores
let filterActive = false;
if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        filterActive = !filterActive;

        storeItems.forEach(item => {
            if (filterActive) {
                if (item.classList.contains('closed')) {
                    item.style.display = 'none';
                }
                filterBtn.textContent = 'Show All';
                filterBtn.classList.add('active');
            } else {
                item.style.display = '';
                filterBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="4" y1="6" x2="20" y2="6"/>
                        <line x1="4" y1="12" x2="20" y2="12"/>
                        <line x1="4" y1="18" x2="20" y2="18"/>
                    </svg>
                    Filter
                `;
                filterBtn.classList.remove('active');
            }
        });
    });
}

// Scroll to top button functionality
const scrollToTopBtn = document.querySelector('.scroll-to-top');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Current location button
if (currentLocationBtn) {
    currentLocationBtn.addEventListener('click', () => {
        alert('Getting your current location...\nIn a real app, this would use GPS to show nearby stores.');
    });
}
// Terms checkbox enable download button
const agreeCheckbox = document.getElementById('agreeCheckbox');
const downloadBtn = document.getElementById('downloadBtn');

// Enable download button when checkbox is checked
agreeCheckbox.addEventListener('change', function () {
    downloadBtn.disabled = !this.checked;
});

// Handle Download button
downloadBtn.addEventListener('click', function () {

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('termsModal'));
    modal.hide();

    // Start APK download
    const downloadLink = document.createElement('a');
    downloadLink.href = 'https://github.com/kumpriceapp2025-del/KUMPRICE_APKS/releases/download/KUMPRICE_APKS/kumprice_1.0.1.apk';
    downloadLink.download = 'kumprice_1.0.1.apk';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Reset checkbox after closing
    agreeCheckbox.checked = false;
    downloadBtn.disabled = true;
});
// Phone slideshow — auto-advance + pointer swipe
const slides = document.querySelectorAll('.phone-slideshow .slide');
const dots = document.querySelectorAll('.slide-dots .dot');
const track = document.querySelector('.slides-track');
const phoneSlideshow = document.querySelector('.phone-slideshow');
let current = 0;

function goToSlide(index) {
    dots[current].classList.remove('active');
    current = ((index % slides.length) + slides.length) % slides.length;
    dots[current].classList.add('active');
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = 'translateX(' + (-current * phoneSlideshow.offsetWidth) + 'px)';
}

let autoPlay = setInterval(() => goToSlide(current + 1), 3000);

if (phoneSlideshow && track) {
    let startX = 0;
    let dragX = 0;
    let dragging = false;

    phoneSlideshow.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        startX = dragX = e.clientX;
        dragging = true;
        this.setPointerCapture(e.pointerId);
        clearInterval(autoPlay);
        track.style.transition = 'none';
    });

    phoneSlideshow.addEventListener('pointermove', function(e) {
        if (!dragging) return;
        dragX = e.clientX;
        const w = phoneSlideshow.offsetWidth;
        track.style.transform = 'translateX(' + (-current * w + (dragX - startX)) + 'px)';
    });

    phoneSlideshow.addEventListener('pointerup', function() {
        if (!dragging) return;
        dragging = false;
        const diff = startX - dragX;
        goToSlide(Math.abs(diff) > 40 ? (diff > 0 ? current + 1 : current - 1) : current);
        autoPlay = setInterval(() => goToSlide(current + 1), 3000);
    });

    phoneSlideshow.addEventListener('pointercancel', function() {
        if (!dragging) return;
        dragging = false;
        goToSlide(current);
        autoPlay = setInterval(() => goToSlide(current + 1), 3000);
    });
}