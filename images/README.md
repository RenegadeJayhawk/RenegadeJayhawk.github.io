# Images Directory

This directory contains optimized images for the resume website.

## Image Optimization Guidelines

### Profile Photo
- **File**: `profile.jpg`
- **Recommended Size**: 400x400px (displayed at 192x192px for retina displays)
- **Format**: JPEG with 85% quality
- **Max File Size**: 50KB for fast loading

### Optimization Tips

1. **Resize images** to 2x the display size for retina support
2. **Compress** using tools like:
   - [TinyJPG](https://tinyjpg.com/)
   - [Squoosh](https://squoosh.app/)
   - ImageOptim (Mac)
   - RIOT (Windows)
3. **Use JPEG** for photos (better compression)
4. **Use WebP** for modern browsers (even better compression)

### Fast Loading Strategy

The site implements several performance optimizations:

1. **Preload Tag**: Profile image is preloaded in `<head>` with `fetchpriority="high"`
2. **Eager Loading**: Image uses `loading="eager"` attribute
3. **Explicit Dimensions**: Width and height attributes prevent layout shift
4. **Local Storage**: Images are served from the same domain (no DNS lookup)

### Adding New Images

1. Save images in this directory
2. Use descriptive filenames (e.g., `company-logo-hyundai.png`)
3. Reference in HTML: `<img src="images/your-image.jpg">`
4. For above-the-fold images, add preload:
   ```html
   <link rel="preload" href="images/your-image.jpg" as="image" type="image/jpeg">
   ```

### Supported Formats

- **JPEG** (.jpg, .jpeg) - Best for photos
- **PNG** (.png) - Best for logos, icons with transparency
- **WebP** (.webp) - Modern format, best compression
- **SVG** (.svg) - Best for vector graphics, logos

## Current Images

### Profile & Company Logos
- `profile.jpg` - Brad Allen's professional headshot (400x400px, ~50KB)
- `company-hyundai.jpg` - Hyundai Capital America logo (96x96px, ~15KB)
- `company-deloitte.jpg` - Deloitte logo (96x96px, ~15KB)
- `company-achieve.jpg` - Achieve Internet logo (96x96px, ~15KB)
- `company-straviso.png` - STRAVISO logo (96x96px, PNG format)
- `company-raytheon.png` - Raytheon logo (96x96px, PNG format)

### Project Thumbnails
- `AI_Workflow.png` - AI-Driven Workflow & Security project (400x250px, PNG format)
- `Data_Agg.png` - Data Aggregation & Analysis project (400x250px, PNG format)
- `Resume_SPA.png` - Interactive Resume SPA project (400x250px, PNG format)
- `Automation.png` - Automation & Tooling project (400x250px, PNG format)

### Image Specifications

#### Company Logos
Company logos in the timeline use 96x96px (displayed at 48x48px) for retina support.
Most logos are optimized to <15KB each. PNG format used for logos with transparency.

#### Project Images
Project images for the Innovation section use 400x250px (displayed at ~400x192px responsive).
PNG format for high-quality renders. Lazy loading enabled for optimal performance.
