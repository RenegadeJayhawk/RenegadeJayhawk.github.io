document.addEventListener('DOMContentLoaded', () => {
    showSection('overview', document.querySelector('.nav-link[onclick*="overview"]'));
    
    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').classList.replace('fa-moon', 'fa-sun');
    }
    
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
    
    const ctx = document.getElementById('aiSkillsChart');
    if(ctx) {
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
            }
        });
    }
});

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
        }
    }, 50);

    // Update navigation active states
    if (element) {
        if (element.tagName === 'SELECT') {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            const targetLink = document.querySelector(`.nav-link[onclick*="${sectionId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }
        } else if (element.tagName === 'A') {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            element.classList.add('active');
        }
    }
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
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
        span.textContent = 'Show more';
    } else {
        content.classList.add('expanded');
        icon.style.transform = 'rotate(180deg)';
        span.textContent = 'Show less';
    }
}

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
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
    // Option 1: Simple print dialog (user can save as PDF)
    window.print();
    
    // Option 2: If you have a PDF file, use this instead:
    // const link = document.createElement('a');
    // link.href = 'brad-allen-resume.pdf';
    // link.download = 'Brad-Allen-Resume.pdf';
    // link.click();
}

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
