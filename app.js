document.addEventListener('DOMContentLoaded', () => {
    showSection('overview', document.querySelector('.nav-link[onclick*="overview"]'));
    
    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Initialize mobile features
    initMobileFeatures();
    
    // Animate skill bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    bar.style.width = bar.getAttribute('style').match(/width:\s*(\d+%)/)[1];
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-bar-container').forEach(container => {
        observer.observe(container.parentElement);
    });
    
    const aiSkillsData = {
        labels: [
            'Generative AI', 
            'LLMs (GPT, Claude, Gemini)', 
            'NLP', 
            'Prompt Engineering', 
            'Applied AI Prototyping', 
            'Responsible AI Practices'
        ],
        datasets: [{
            label: 'AI Skill Focus',
            data: [90, 95, 80, 95, 85, 80],
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderColor: 'rgba(13, 148, 136, 1)',
            borderWidth: 1
        }]
    };
    
    // Initialize chart with loading state
    const chartCanvas = document.getElementById('aiSkillsChart');
    const loadingState = document.getElementById('chartLoadingState');
    const chartContainer = chartCanvas ? chartCanvas.parentElement : null;
    
    const initializeChart = () => {
        if (typeof Chart === 'undefined') {
            setTimeout(initializeChart, 100);
            return;
        }
        
        if(chartCanvas) {
            const ctx = chartCanvas.getContext('2d');
            new Chart(ctx, {
            type: 'bar',
            data: aiSkillsData,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += context.parsed.x + '% Expertise';
                                }
                                return wrapText(label, 30);
                            }
                        }
                    }
                }
            },
            // Mobile-optimized chart configuration
            responsive: true,
            maintainAspectRatio: window.innerWidth > 768
        });
            
            // Hide loading state and show chart
            setTimeout(() => {
                if (loadingState) loadingState.style.display = 'none';
                if (chartContainer) chartContainer.style.display = 'block';
            }, 300);
        }
    };
    
    initializeChart();
});

// Track section views in analytics
function trackSectionView(sectionName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'section_view', {
            section_name: sectionName,
            event_category: 'Navigation'
        });
    }
}

function showSection(sectionId, element) {
    const allSections = document.querySelectorAll('[data-section]');
    const targetSection = document.querySelector(`[data-section="${sectionId}"]`);
    
    // Remove active class from all sections
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add active class to target section
        if (targetSection) {
            targetSection.classList.add('active');
            trackSectionView(sectionId);
        }
    }, 50);
    
    // Update active nav link for keyboard navigation
    updateActiveNavLink(element);
    
    // Announce section change to screen readers
    announceToScreenReader(`Navigated to ${sectionId} section`);
}

function wrapText(text, maxCharsPerLine) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxCharsPerLine) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    lines.push(currentLine.trim());
    return lines;
}

// Timeline Expand/Collapse
function toggleExpand(button) {
    const content = button.previousElementSibling;
    const icon = button.querySelector('i');
    const span = button.querySelector('span');
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
        content.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
        span.textContent = 'Show more';
        button.setAttribute('aria-expanded', 'false');
        announceToScreenReader('Content collapsed');
    } else {
        content.classList.add('expanded');
        icon.style.transform = 'rotate(180deg)';
        span.textContent = 'Show less';
        button.setAttribute('aria-expanded', 'true');
        announceToScreenReader('Content expanded');
    }
}

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track modal open
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_modal_open', {
            event_category: 'Engagement'
        });
    }
    
    // Focus first input for accessibility
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
    
    announceToScreenReader('Contact form opened');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Return focus to the button that opened the modal
    const contactButton = document.querySelector('[onclick*="openContactModal"]');
    if (contactButton) contactButton.focus();
    
    announceToScreenReader('Contact form closed');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeContactModal();
    }
}

// Handle Contact Form Submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Track form submission
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            event_category: 'Engagement',
            event_label: 'Contact Form'
        });
    }
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Create mailto link with form data
    const mailtoLink = `mailto:bradallen25010@frontier.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Your default email client will open. Please send the message from there.');
    
    // Reset form and close modal
    document.getElementById('contactForm').reset();
    closeContactModal();
}

// Download Resume as PDF
function downloadResume() {
    // Track download event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_resume', {
            event_category: 'Engagement',
            event_label: 'PDF Download'
        });
    }
    
    // Option 1: Simple print dialog (user can save as PDF)
    window.print();
    
    // Option 2: If you have a PDF file, use this instead:
    // const link = document.createElement('a');
    // link.href = 'brad-allen-resume.pdf';
    // link.download = 'Brad-Allen-Resume.pdf';
    // link.click();
}

// ==========================================
// ACCESSIBILITY HELPERS
// ==========================================

// Update active navigation link
function updateActiveNavLink(element) {
    if (!element) return;
    
    // Remove active class and aria-current from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Add active class and aria-current to clicked link
    if (element.classList && element.classList.contains('nav-link')) {
        element.classList.add('active');
        element.setAttribute('aria-current', 'page');
    }
}

// Announce to screen readers using ARIA live region
function announceToScreenReader(message) {
    let liveRegion = document.getElementById('aria-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
    
    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
        liveRegion.textContent = message;
    }, 100);
}

// Handle keyboard navigation for cards
function setupKeyboardNavigation() {
    const cards = document.querySelectorAll('.project-card, .achievement-card, .testimonial-card, .article-card, .repo-card');
    
    cards.forEach(card => {
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Handle Enter and Space key for card interactions
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// Trap focus within modal for accessibility
function trapFocusInModal(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Close modal on Escape key
        if (e.key === 'Escape') {
            closeContactModal();
        }
    });
}

// Initialize accessibility features on page load
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
    
    const modal = document.getElementById('contactModal');
    if (modal) {
        trapFocusInModal(modal);
    }
});

// ==========================================
// MOBILE EXPERIENCE ENHANCEMENTS
// ==========================================

// Section order for swipe navigation
const sectionOrder = ['overview', 'timeline', 'ai-focus', 'achievements', 'education-skills', 'testimonials', 'contributions'];
let currentSectionIndex = 0;

function initMobileFeatures() {
    // Pull to refresh
    initPullToRefresh();
    
    // Swipe gestures
    initSwipeGestures();
    
    // Optimize chart for mobile
    optimizeChartForMobile();
    
    // Auto-hide swipe indicator after first use
    setTimeout(() => {
        const indicator = document.querySelector('.swipe-indicator');
        if (indicator) {
            indicator.style.animation = 'fadeOut 1s ease-out forwards';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 1000);
        }
    }, 5000);
}

// Pull to Refresh functionality
function initPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    const pullThreshold = 80;
    const refreshIndicator = document.getElementById('pullToRefresh');
    
    if (!refreshIndicator) return;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
            refreshIndicator.style.top = `${Math.min(pullDistance - 80, 0)}px`;
            
            if (pullDistance > pullThreshold) {
                refreshIndicator.classList.add('active');
                refreshIndicator.querySelector('.pull-to-refresh-text').textContent = 'Release to refresh';
            } else {
                refreshIndicator.classList.remove('active');
                refreshIndicator.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        const isActive = refreshIndicator.classList.contains('active');
        
        if (isActive) {
            refreshIndicator.classList.add('refreshing');
            refreshIndicator.querySelector('.pull-to-refresh-text').textContent = 'Refreshing...';
            
            // Simulate refresh (reload page or update content)
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            refreshIndicator.style.top = '-80px';
        }
        
        isPulling = false;
    }, { passive: true });
}

// Swipe gestures for section navigation
function initSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;
    const main = document.getElementById('main-content');
    
    if (!main) return;
    
    main.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    main.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const xDiff = touchStartX - touchEndX;
        const yDiff = touchStartY - touchEndY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > swipeThreshold) {
            if (xDiff > 0) {
                // Swipe left - next section
                navigateToNextSection();
            } else {
                // Swipe right - previous section
                navigateToPreviousSection();
            }
        }
    }
}

function navigateToNextSection() {
    const nextIndex = (currentSectionIndex + 1) % sectionOrder.length;
    navigateToSection(nextIndex, 'left');
}

function navigateToPreviousSection() {
    const prevIndex = (currentSectionIndex - 1 + sectionOrder.length) % sectionOrder.length;
    navigateToSection(prevIndex, 'right');
}

function navigateToSection(index, direction) {
    const sectionName = sectionOrder[index];
    const targetSection = document.querySelector(`[data-section="${sectionName}"]`);
    
    if (!targetSection) return;
    
    // Add swipe animation
    targetSection.classList.add(`swipe-${direction}`);
    
    // Navigate to section
    showSection(sectionName);
    currentSectionIndex = index;
    
    // Update mobile select if exists
    const mobileSelect = document.querySelector('select.nav-link');
    if (mobileSelect) {
        mobileSelect.value = sectionName;
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        targetSection.classList.remove(`swipe-${direction}`);
    }, 300);
    
    // Provide haptic feedback if available
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

// Optimize chart for mobile devices
function optimizeChartForMobile() {
    if (window.innerWidth <= 768) {
        const chartCanvas = document.getElementById('aiSkillsChart');
        if (chartCanvas) {
            // Chart will be more compact on mobile
            chartCanvas.style.touchAction = 'pan-y';
        }
    }
}

// Update current section index when navigating via other methods
function showSection(sectionId, element) {
    const allSections = document.querySelectorAll('[data-section]');
    const targetSection = document.querySelector(`[data-section="${sectionId}"]`);
    
    // Update current section index for swipe navigation
    const sectionIndex = sectionOrder.indexOf(sectionId);
    if (sectionIndex !== -1) {
        currentSectionIndex = sectionIndex;
    }
    
    // Remove active class from all sections
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add active class to target section
        if (targetSection) {
            targetSection.classList.add('active');
            trackSectionView(sectionId);
        }
    }, 50);
    
    // Update active nav link for keyboard navigation
    updateActiveNavLink(element);
    
    // Announce section change to screen readers
    announceToScreenReader(`Navigated to ${sectionId} section`);
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Add touch-friendly class to body on mobile
if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        optimizeChartForMobile();
    }, 200);
});

// Prevent zoom on double tap for better UX
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ==========================================
// PROFESSIONAL TOUCHES
// ==========================================

// Language configuration
const languages = {
    en: {
        code: 'EN',
        name: 'English',
        flag: '🇺🇸'
    },
    es: {
        code: 'ES',
        name: 'Español',
        flag: '🇪🇸'
    },
    fr: {
        code: 'FR',
        name: 'Français',
        flag: '🇫🇷'
    },
    de: {
        code: 'DE',
        name: 'Deutsch',
        flag: '🇩🇪'
    },
    zh: {
        code: 'ZH',
        name: '中文',
        flag: '🇨🇳'
    }
};

let currentLanguage = 'en';

// Toggle Language
function toggleLanguage() {
    const langKeys = Object.keys(languages);
    const currentIndex = langKeys.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % langKeys.length;
    currentLanguage = langKeys[nextIndex];
    
    const lang = languages[currentLanguage];
    
    // Update UI
    const langElements = document.querySelectorAll('#currentLang');
    langElements.forEach(el => {
        el.textContent = lang.code;
    });
    
    const footerLang = document.getElementById('footerLang');
    if (footerLang) {
        footerLang.textContent = `${lang.flag} ${lang.name}`;
    }
    
    // Store preference
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Track language change
    if (typeof gtag !== 'undefined') {
        gtag('event', 'language_change', {
            language: currentLanguage,
            event_category: 'Localization'
        });
    }
    
    // Announce to screen reader
    announceToScreenReader(`Language changed to ${lang.name}`);
    
    // Show notification
    showNotification(`Language changed to ${lang.flag} ${lang.name}`, 'info');
    
    // In a real implementation, you would load translations here
    // loadTranslations(currentLanguage);
}

// Toggle Changelog Modal
function toggleChangelog() {
    const modal = document.getElementById('changelogModal');
    
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        announceToScreenReader('Changelog closed');
    } else {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        announceToScreenReader('Changelog opened');
        
        // Track changelog view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'changelog_view', {
                event_category: 'Engagement'
            });
        }
        
        // Focus first element
        setTimeout(() => {
            const firstEntry = modal.querySelector('.changelog-entry');
            if (firstEntry) firstEntry.focus();
        }, 100);
    }
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'info' ? 'fa-info-circle' : 'fa-check-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles inline for simplicity
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: type === 'info' ? '#0d9488' : '#10b981',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update last updated date dynamically
function updateLastUpdatedDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    // Update all instances
    const lastUpdatedElements = document.querySelectorAll('#lastUpdated, #footerLastUpdated');
    lastUpdatedElements.forEach(el => {
        if (el.id === 'footerLastUpdated') {
            el.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
            el.textContent = formattedDate;
        }
    });
}

// Initialize professional touches
function initProfessionalFeatures() {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && languages[savedLang]) {
        currentLanguage = savedLang;
        const lang = languages[currentLanguage];
        document.querySelectorAll('#currentLang').forEach(el => {
            el.textContent = lang.code;
        });
        const footerLang = document.getElementById('footerLang');
        if (footerLang) {
            footerLang.textContent = `${lang.flag} ${lang.name}`;
        }
    }
    
    // Update version info
    updateVersionInfo();
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        const changelogModal = document.getElementById('changelogModal');
        if (e.target === changelogModal) {
            toggleChangelog();
        }
    });
}

// Update version information
function updateVersionInfo() {
    const version = '3.2.0';
    const versionElements = document.querySelectorAll('#resumeVersion, #footerVersion');
    versionElements.forEach(el => {
        el.textContent = version;
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initProfessionalFeatures();
});

// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}
