# Brad Allen - Interactive Resume

An interactive, single-page application (SPA) resume hosted on GitHub Pages, showcasing 20+ years of technology leadership with a focus on AI strategy and engineering.

## 🚀 Live Demo

Visit: [https://renegadejayhawk.github.io](https://renegadejayhawk.github.io)

## 📋 Features

### Core Features
- **Interactive Navigation**: Single-page application with smooth section transitions and hash-based routing
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Dark Mode**: Toggle between light and dark themes with localStorage persistence
- **Data Visualizations**: Chart.js integration for skills visualization with loading states
- **Modern UI**: Built with Tailwind CSS for a professional, clean design

### Content Sections
- **Career Timeline**: Visual representation of professional journey with expandable details
- **AI Focus Dashboard**: Showcase of AI projects and expertise with project thumbnails
- **Key Achievements**: Measurable impact metrics displayed as KPI cards
- **Testimonials**: Professional recommendations with ratings
- **Speaking Engagements**: Conference presentations and workshops
- **Blog & Articles**: Thought leadership content
- **GitHub Contributions**: Live contribution calendar and featured repositories
- **Certifications**: Clickable badges with verification links

### Interactive Elements
- **Filterable Skills**: Real-time search and category filtering (All/AI/Tech) with smooth animations
- **Animated KPI Counters**: Numbers animate from 0 to target value on scroll into view
- **Interactive Project Cards**: Hover effects with detailed modal system featuring 8+ projects
- **Timeline Zoom & Pan**: Zoom controls (50-200%) with mouse wheel and pan functionality
- **Contact Form Modal**: Email integration with form validation
- **Download Resume**: Print-optimized PDF generation
- **Social Media Links**: LinkedIn, GitHub, and email with hover effects
- **Expandable Timeline**: Show more/less functionality for detailed career history
- **Skill Progress Bars**: Animated bars that trigger on scroll
- **Project Details Modal**: Rich project information with features, tech stack, and impact metrics

### Performance & Analytics
- **Google Analytics**: Track visitors and engagement (SPA-compatible)
- **Loading States**: Smooth chart initialization with loading indicators
- **Optimized Print Stylesheet**: Enhanced PDF generation with proper formatting
- **Performance Monitoring**: Page load metrics tracking
- **Lighthouse Optimized**: Fast load times and best practices
- **Deferred Scripts**: Non-critical JavaScript loaded asynchronously
- **Preconnect Links**: Faster external resource loading

## 🛠️ Technology Stack

- **HTML5** - Semantic markup with SEO meta tags
- **CSS3** - Custom styles with Tailwind CSS and CSS custom properties
- **JavaScript (ES6+)** - Vanilla JS for SPA routing, interactive elements, and animations
- **Chart.js v4.4.0** - Animated data visualization
- **Tailwind CSS v3** - Utility-first CSS framework (CDN)
- **Font Awesome 6.4.0** - Icon library
- **Google Fonts** - Inter font family
- **Google Analytics** - Visitor tracking and engagement metrics
- **Intersection Observer API** - Scroll-triggered animations for counters and charts

## 📂 Project Structure

```text
├── index.html      # Main HTML file with all sections
├── app.js          # JavaScript for navigation and Chart.js configuration
├── styles.css      # Custom CSS styles and timeline components
└── README.md       # This file
```

## 🎯 Sections

1. **Overview** - Professional summary, core competencies, and profile photo
2. **Career Timeline** - Visual timeline of career progression with company logos
3. **AI Focus** - Dashboard of AI projects with thumbnails and metrics
4. **Key Achievements** - Measurable business impacts with KPI cards
5. **Education & Skills** - Certifications with verification badges and skill progress bars
6. **Testimonials** - Professional recommendations, speaking engagements, and articles
7. **Contributions** - GitHub activity calendar and featured repositories

## 🎨 Design Choices

- **Color Palette**: Calm Harmony (Light Gray, Slate, Teal with dark mode variants)
- **Typography**: Inter font family for modern readability
- **Layout**: Card-based grid system for scannable content
- **Animations**:
  - Page load fade-ins (0.6s)
  - Section transitions (0.5s)
  - Staggered child animations (0.1-0.5s delays)
  - Hover effects on all interactive elements
  - Skill bar animations triggered by scroll
  - KPI counter animations (0 to target value)
  - Skill tag fade-in animations
  - Project modal slide-up animation
  - Shimmer effects on version/date (8-second intervals)
- **Visualizations**:
  - Horizontal bar chart for AI skills (Chart.js)
  - Visual timeline with company logos
  - KPI cards for achievements
  - Progress bars with shimmer effects
  - GitHub contribution heatmap
- **Accessibility**:
  - ARIA labels on all interactive elements
  - Keyboard navigation support
  - Reduced motion support for accessibility
  - Print-optimized stylesheet

## 📦 Deployment

This site is automatically deployed to GitHub Pages from the `main` branch.

### Pre-Deployment Checklist

1. **Update Google Analytics ID**: Replace `G-XXXXXXXXXX` in `index.html` with your actual GA4 tracking ID
2. **Replace Placeholder Images**: Update profile photo, company logos, and project thumbnails
3. **Update Contact Email**: Change email addresses in contact form and footer
4. **Verify Links**: Check all social media and certification verification links
5. **Test Dark Mode**: Ensure all sections display correctly in both themes
6. **Run Lighthouse**: Test performance, accessibility, SEO scores

### Deployment Steps

1. Push your changes to GitHub:

```bash
git add .
git commit -m "Update resume content"
git push origin main
```

1. Configure GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch as source
   - Save and wait for deployment

## � Performance Optimizations

- **Lazy Loading**: Deferred script loading for non-critical resources
- **Preconnect**: DNS prefetch for external CDNs
- **Chart Loading States**: Smooth initialization with loading indicators
- **GPU Acceleration**: Hardware-accelerated animations
- **Optimized Fonts**: Font-display swap for faster text rendering
- **Print Stylesheet**: Optimized CSS for PDF generation
- **Performance Monitoring**: Built-in page load metrics tracking
- **Reduced Motion**: Respects user's motion preferences

## 📊 Analytics Events Tracked

- Page views (SPA navigation)
- Section views
- Skill searches and filter selections
- Project detail modal views
- Timeline zoom interactions
- Download resume clicks
- Contact modal opens
- Contact form submissions
- Page load performance metrics

## �🔧 Local Development

To test locally, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

Then visit `http://localhost:8000` in your browser.

## 🌐 Browser Compatibility

- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile)

**Features requiring modern browsers:**
- CSS Custom Properties (dark mode)
- Intersection Observer API (scroll animations)
- localStorage API (dark mode persistence)
- Flexbox and Grid layouts

## 🎨 Customization Guide

### Changing Colors
Edit CSS custom properties in `styles.css`:

```css
:root {
    --bg-primary: #f9fafb;
    --bg-secondary: #ffffff;
    --text-primary: #1e293b;
    --accent-color: #0d9488;
}
```

### Adding New Sections
1. Add section HTML with `data-section="section-name"` attribute
2. Add navigation link calling `showSection('section-name', this)`
3. Add section to mobile dropdown menu
4. Style section in `styles.css`

### Updating Content
- **Profile Photo**: Replace `https://via.placeholder.com/200x200` in Overview section
- **Company Logos**: Replace placeholder URLs in timeline dots
- **Project Thumbnails**: Update image URLs in AI Focus cards
- **Certifications**: Update verification links in Education & Skills
- **GitHub Username**: Change `RenegadeJayhawk` to your GitHub username

## 🐛 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📧 Contact

- **Email**: [bradallen25010@frontier.com](mailto:bradallen25010@frontier.com)
- **LinkedIn**: [linkedin.com/in/bradallen-techleader](https://linkedin.com/in/bradallen-techleader)

## 📝 License

© 2025 Brad Allen. This is an interactive resume application.
