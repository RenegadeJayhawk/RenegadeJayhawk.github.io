document.addEventListener('DOMContentLoaded', () => {
    showSection('overview', document.querySelector('.nav-link[onclick*="overview"]'));
    
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
    document.querySelectorAll('[data-section]').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

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
