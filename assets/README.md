# Groqsters Theme Assets

This folder contains static assets for the Groqsters Discourse theme.

## 📁 Directory Structure

```
assets/
├── README.md           # This file
├── feature-1.png       # Example feature banner image 1
├── feature-2.png       # Example feature banner image 2
├── feature-3.png       # Example feature banner image 3
└── logo.png           # Theme logo (placeholder)
```

## 🖼️ Feature Banner Images

### Image Requirements

- **Size**: Recommended 200x200px minimum (will be displayed at 80px on desktop, 60px on mobile)
- **Format**: PNG, JPG, WebP, or SVG
- **Style**: Works best with circular/square images as they'll be displayed in a circle
- **Background**: Transparent or solid background recommended

### Adding Images

1. **Upload your images** to this `assets/` folder
2. **Configure in Discourse Admin**:
   - Go to Admin Panel → Customize → Themes → Groqsters Theme → Settings
   - For each feature banner item, set the image URL:
     - Use relative paths: `assets/feature-1.png`
     - Or external URLs: `https://example.com/image.png`

### Usage Examples

#### Local Assets (Recommended)
```
Feature banner item 1 image: assets/feature-1.png
Feature banner item 2 image: assets/feature-2.png  
Feature banner item 3 image: assets/feature-3.png
```

#### External URLs
```
Feature banner item 1 image: https://picsum.photos/200/200?random=1
Feature banner item 2 image: https://picsum.photos/200/200?random=2
Feature banner item 3 image: https://picsum.photos/200/200?random=3
```

#### CDN URLs
```
Feature banner item 1 image: https://cdn.example.com/images/feature1.png
Feature banner item 2 image: https://cdn.example.com/images/feature2.png
Feature banner item 3 image: https://cdn.example.com/images/feature3.png
```

## 🎨 Image Guidelines

### Best Practices

1. **Consistent Style**: Use images with similar visual style and color palette
2. **High Quality**: Use crisp, high-resolution images that scale well
3. **Optimized Size**: Keep file sizes under 100KB for better loading performance
4. **Accessibility**: Ensure good contrast and readability

### Recommended Image Styles

- **Icons/Illustrations**: Simple, clean graphics with clear symbolism
- **Photos**: Well-lit, focused images with clear subjects
- **Graphics**: Minimal design elements that represent your features
- **Brand Elements**: Consistent with your overall brand design

## 🔄 Fallback System

If an image fails to load or isn't provided:

1. **Loading State**: Shows a spinner while the image loads
2. **Error Fallback**: Falls back to the configured emoji/icon
3. **No Image**: Uses the fallback emoji/icon if no URL is provided

Configure fallback icons in theme settings:
- `feature_banner_fallback_icon_1`: Default "⚡"
- `feature_banner_fallback_icon_2`: Default "🤝" 
- `feature_banner_fallback_icon_3`: Default "🚀"

## 🚀 Performance Tips

1. **Optimize Images**: Use tools like TinyPNG or ImageOptim before uploading
2. **Use WebP**: Modern format with better compression
3. **CDN Hosting**: Consider using a CDN for faster global loading
4. **Lazy Loading**: Images load when needed, built into the theme

## 📱 Mobile Considerations

- Images automatically scale down on mobile devices
- Circular display is maintained across all screen sizes
- Loading states are optimized for touch devices

## 🛠️ Troubleshooting

### Image Not Showing?

1. **Check the URL**: Ensure the path is correct (case-sensitive)
2. **File Format**: Verify the image format is supported
3. **CORS Issues**: External URLs might have cross-origin restrictions
4. **File Size**: Very large images might timeout on slower connections

### Console Debugging

Check your browser's developer console for error messages related to image loading. The theme logs initialization details including banner image URLs.

---

Need help? Check the main [README.md](../README.md) or create an issue in the repository. 