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
    initInteractiveElements();
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

// ==========================================
// INTERACTIVE ELEMENTS
// ==========================================

function initInteractiveElements() {
    // Initialize animated counters when achievements section is viewed
    const achievementsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateKPICounters();
            }
        });
    }, { threshold: 0.5 });
    
    const achievementsSection = document.querySelector('[data-section="achievements"]');
    if (achievementsSection) {
        achievementsObserver.observe(achievementsSection);
    }
    
    // Initialize timeline zoom/pan
    initTimelineZoomPan();
}

// ==========================================
// FILTERABLE SKILLS
// ==========================================

let currentSkillFilter = 'all';

function filterSkills(searchTerm) {
    const skillTags = document.querySelectorAll('.skill-tag');
    const noSkillsMessage = document.getElementById('noSkillsMessage');
    let visibleCount = 0;
    
    searchTerm = searchTerm.toLowerCase().trim();
    
    skillTags.forEach(tag => {
        const skillName = tag.dataset.skill.toLowerCase();
        const category = tag.dataset.category;
        
        const matchesSearch = searchTerm === '' || skillName.includes(searchTerm);
        const matchesCategory = currentSkillFilter === 'all' || category === currentSkillFilter;
        
        if (matchesSearch && matchesCategory) {
            tag.classList.remove('hidden');
            visibleCount++;
        } else {
            tag.classList.add('hidden');
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noSkillsMessage.classList.remove('hidden');
    } else {
        noSkillsMessage.classList.add('hidden');
    }
    
    // Track skill search
    if (typeof gtag !== 'undefined' && searchTerm) {
        gtag('event', 'skill_search', {
            search_term: searchTerm,
            event_category: 'Skills'
        });
    }
}

function filterSkillsByCategory(category) {
    currentSkillFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-apply current search with new filter
    const searchInput = document.getElementById('skillSearch');
    filterSkills(searchInput.value);
    
    // Announce to screen reader
    announceToScreenReader(`Showing ${category === 'all' ? 'all' : category} skills`);
    
    // Track category filter
    if (typeof gtag !== 'undefined') {
        gtag('event', 'skill_filter', {
            filter_category: category,
            event_category: 'Skills'
        });
    }
}

// ==========================================
// ANIMATED KPI COUNTERS
// ==========================================

function animateKPICounters() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach((card, index) => {
        setTimeout(() => {
            const valueElement = card.querySelector('.kpi-value');
            const target = parseFloat(valueElement.dataset.target);
            const prefix = valueElement.dataset.prefix || '';
            const suffix = valueElement.dataset.suffix || '';
            const decimals = parseInt(valueElement.dataset.decimals) || 0;
            
            animateCounter(valueElement, 0, target, 2000, prefix, suffix, decimals);
            card.classList.add('animating');
            
            setTimeout(() => {
                card.classList.remove('animating');
            }, 2500);
        }, index * 200);
    });
}

function animateCounter(element, start, end, duration, prefix, suffix, decimals) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        const displayValue = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
        element.textContent = `${prefix}${displayValue}${suffix}`;
    }, 16);
}

// ==========================================
// INTERACTIVE PROJECT CARDS
// ==========================================

const projectDetails = {
    workflow: {
        title: 'AI-Driven Workflow & Security',
        description: 'Developed AI-powered tools to enhance team productivity and security awareness within Microsoft Teams ecosystem.',
        features: [
            'NLP-based prompt optimization agent with real-time suggestions',
            'Phishing pre-warning scanner using anomaly detection',
            'Microsoft Teams integration with Bot Framework',
            'Real-time feedback and learning capabilities'
        ],
        technologies: ['Python', 'Azure Bot Service', 'NLP', 'Microsoft Teams API', 'Anomaly Detection', 'OAuth 2.0'],
        impact: 'Reduced phishing incidents by 35% and improved prompt quality across 200+ team members',
        github: 'https://github.com/RenegadeJayhawk'
    },
    aggregator: {
        title: 'Data Aggregation & Analysis Platform',
        description: 'Built intelligent web scrapers and aggregation tools to automate data collection and analysis from multiple sources.',
        features: [
            'Multi-source shopping aggregator (Craigslist, Facebook Marketplace)',
            'Automated software comparison and ranking system',
            'Real-time price tracking and notifications',
            'Data visualization and trend analysis'
        ],
        technologies: ['Python', 'BeautifulSoup', 'Selenium', 'FastAPI', 'PostgreSQL', 'React', 'Chart.js'],
        impact: 'Saved 15+ hours per week in manual research and comparison tasks',
        github: 'https://github.com/RenegadeJayhawk'
    },
    resume: {
        title: 'Interactive Resume SPA',
        description: 'The application you\'re currently viewing! A modern, accessible, and feature-rich single-page application.',
        features: [
            'Smooth section transitions with hash-based routing',
            'Dark mode with localStorage persistence',
            'WCAG 2.1 Level AA accessibility compliance',
            'Mobile-optimized with pull-to-refresh and swipe gestures',
            'Google Analytics integration',
            'Print-friendly stylesheet',
            'Animated charts and interactive elements'
        ],
        technologies: ['Vanilla JavaScript', 'Tailwind CSS', 'Chart.js', 'Font Awesome', 'Google Analytics', 'HTML5', 'CSS3'],
        impact: 'Showcases technical skills and attention to detail with 100% custom code',
        github: 'https://github.com/RenegadeJayhawk/RenegadeJayhawk.github.io'
    },
    automation: {
        title: 'DevOps Automation & Tooling',
        description: 'Created custom automation scripts and CI/CD pipelines to streamline development workflows and reduce manual overhead.',
        features: [
            'Custom CLI tools for project scaffolding',
            'Automated deployment pipelines with GitHub Actions',
            'Code quality gates and automated testing',
            'Environment provisioning automation'
        ],
        technologies: ['Python', 'Bash', 'GitHub Actions', 'Docker', 'Terraform', 'Jenkins', 'YAML'],
        impact: 'Reduced deployment time by 60% and eliminated manual configuration errors',
        github: 'https://github.com/RenegadeJayhawk'
    },
    genai: {
        title: 'GenAI Prototypes & Experiments',
        description: 'Built proof-of-concept applications using state-of-the-art LLMs for various business use cases.',
        features: [
            'Document analysis and summarization tool',
            'Code generation and review assistant',
            'Customer service automation chatbot',
            'Knowledge base with RAG architecture'
        ],
        technologies: ['OpenAI API', 'Claude API', 'Anthropic', 'LangChain', 'Vector Databases', 'Python', 'FastAPI'],
        impact: 'Demonstrated 25-30% potential reduction in onboarding time',
        github: 'https://github.com/RenegadeJayhawk'
    },
    knowledge: {
        title: 'AI Knowledge Base (RAG System)',
        description: 'Implemented retrieval-augmented generation system to provide instant answers from internal documentation.',
        features: [
            'Vector embeddings for semantic search',
            'Hybrid search (semantic + keyword)',
            'Source citation and verification',
            'Real-time document ingestion pipeline'
        ],
        technologies: ['OpenAI Embeddings', 'Pinecone', 'LangChain', 'Python', 'FastAPI', 'React', 'Redis'],
        impact: 'Reduced average query response time from 15 minutes to 30 seconds',
        github: 'https://github.com/RenegadeJayhawk'
    },
    prompt: {
        title: 'Prompt Engineering Workshop & Training',
        description: 'Developed comprehensive training materials and workshops on advanced AI prompting techniques.',
        features: [
            'Chain-of-thought reasoning examples',
            'Few-shot learning templates',
            'Prompt optimization techniques',
            'Role-based prompting strategies'
        ],
        technologies: ['GPT-4', 'Claude', 'Gemini', 'Markdown', 'Jupyter Notebooks', 'Python'],
        impact: 'Trained 50+ team members, improving AI output quality by 40%',
        github: 'https://github.com/RenegadeJayhawk'
    },
    governance: {
        title: 'AI Governance Framework',
        description: 'Contributed to responsible AI guidelines, risk assessment frameworks, and ethical usage policies.',
        features: [
            'Risk assessment matrix for AI projects',
            'Ethical AI usage guidelines',
            'Data privacy and security protocols',
            'Model evaluation and monitoring framework'
        ],
        technologies: ['Documentation', 'Policy Framework', 'Risk Management', 'Compliance Tools'],
        impact: 'Established organization-wide AI governance standards',
        github: 'https://github.com/RenegadeJayhawk'
    }
};

function showProjectDetails(projectId) {
    const project = projectDetails[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const titleElement = document.getElementById('projectTitle');
    const contentElement = document.getElementById('projectContent');
    
    titleElement.textContent = project.title;
    
    contentElement.innerHTML = `
        <div class="project-detail-section">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">
                <i class="fas fa-info-circle text-teal-600 mr-2"></i>Overview
            </h3>
            <p class="text-gray-700">${project.description}</p>
        </div>
        
        <div class="project-detail-section">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">
                <i class="fas fa-list-check text-teal-600 mr-2"></i>Key Features
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
                ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-detail-section">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">
                <i class="fas fa-code text-teal-600 mr-2"></i>Technologies Used
            </h3>
            <div class="tech-stack-grid">
                ${project.technologies.map(t => `<div class="tech-badge">${t}</div>`).join('')}
            </div>
        </div>
        
        <div class="project-detail-section">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">
                <i class="fas fa-chart-line text-teal-600 mr-2"></i>Impact
            </h3>
            <p class="text-gray-700 font-medium">${project.impact}</p>
        </div>
        
        <div class="flex gap-4 mt-6">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" 
               class="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-all flex items-center justify-center gap-2">
                <i class="fab fa-github"></i> View on GitHub
            </a>
            <button onclick="closeProjectModal()" 
                    class="px-6 py-3 border-2 border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all">
                Close
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track project view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'project_details_view', {
            project_id: projectId,
            event_category: 'Projects'
        });
    }
    
    announceToScreenReader(`${project.title} details opened`);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    announceToScreenReader('Project details closed');
}

// ==========================================
// TIMELINE ZOOM & PAN
// ==========================================

let timelineZoom = 1;
let timelinePanning = false;
let timelineStartX = 0;
let timelineStartY = 0;
let timelineScrollLeft = 0;
let timelineScrollTop = 0;

function initTimelineZoomPan() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    // Mouse wheel zoom (desktop)
    container.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            adjustZoom(delta);
        }
    }, { passive: false });
    
    // Pan functionality
    container.addEventListener('mousedown', (e) => {
        if (timelineZoom > 1) {
            timelinePanning = true;
            container.classList.add('panning');
            timelineStartX = e.pageX - container.offsetLeft;
            timelineStartY = e.pageY - container.offsetTop;
            timelineScrollLeft = container.scrollLeft || 0;
            timelineScrollTop = container.scrollTop || 0;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!timelinePanning) return;
        e.preventDefault();
        const container = document.getElementById('timelineContainer');
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = (x - timelineStartX) * 2;
        const walkY = (y - timelineStartY) * 2;
        
        if (container.parentElement) {
            container.parentElement.scrollLeft = timelineScrollLeft - walkX;
            container.parentElement.scrollTop = timelineScrollTop - walkY;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (timelinePanning) {
            timelinePanning = false;
            const container = document.getElementById('timelineContainer');
            if (container) {
                container.classList.remove('panning');
            }
        }
    });
}

function zoomTimeline(direction) {
    const delta = direction === 'in' ? 0.2 : -0.2;
    adjustZoom(delta);
    
    // Track zoom interaction
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timeline_zoom', {
            direction: direction,
            zoom_level: timelineZoom,
            event_category: 'Timeline'
        });
    }
}

function adjustZoom(delta) {
    timelineZoom = Math.max(0.5, Math.min(2, timelineZoom + delta));
    updateTimelineZoom();
}

function updateTimelineZoom() {
    const container = document.getElementById('timelineContainer');
    const zoomLevel = document.getElementById('zoomLevel');
    
    if (container) {
        container.style.transform = `scale(${timelineZoom})`;
    }
    
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(timelineZoom * 100)}%`;
    }
    
    announceToScreenReader(`Timeline zoom: ${Math.round(timelineZoom * 100)}%`);
}

function resetTimelineZoom() {
    timelineZoom = 1;
    updateTimelineZoom();
    
    // Reset pan position
    const container = document.getElementById('timelineContainer');
    if (container && container.parentElement) {
        container.parentElement.scrollLeft = 0;
        container.parentElement.scrollTop = 0;
    }
    
    announceToScreenReader('Timeline zoom reset');
    
    // Track reset
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timeline_zoom_reset', {
            event_category: 'Timeline'
        });
    }
}

// Close project modal when clicking outside
window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    if (e.target === projectModal) {
        closeProjectModal();
    }
});
