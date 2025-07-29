# Groqsters Discourse Theme

A modern, customizable Discourse theme designed for enhanced user experience and developer flexibility.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Custom Color Schemes**: Easy-to-customize color palette
- **Advanced Animations**: Smooth transitions and engaging micro-interactions
- **Custom JavaScript Components**: Built-in widgets and utilities
- **3-Column Feature Banner**: Responsive grid banner with customizable icons and titles
- **Flexible Templates**: Handlebars templates for header, footer, and topic lists
- **Developer-Friendly**: Well-structured codebase with utility functions

## 📦 Installation

### Option 1: Direct Upload (Recommended)

1. Download or clone this repository
2. Create a `.tar.gz` archive of the theme files
3. Go to your Discourse Admin Panel → Customize → Themes
4. Click "Install" → "From a file"
5. Upload the archive file

### Option 2: Git Repository

1. Go to your Discourse Admin Panel → Customize → Themes
2. Click "Install" → "From a git repository"
3. Enter this repository URL: `https://github.com/your-username/groqsters`
4. Click "Install"

## ⚙️ Configuration

After installation, configure the theme through **Admin Panel → Customize → Themes → Groqsters Theme → Settings**:

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enable_custom_js` | Boolean | `true` | Enable custom JavaScript functionality |
| `custom_header_text` | String | `""` | Custom text displayed in header |
| `primary_brand_color` | String | `#1f8dd6` | Primary brand color |
| `show_welcome_banner` | Boolean | `false` | Show welcome banner on homepage |
| `welcome_banner_text` | String | `"Welcome to our Groqsters community!"` | Welcome banner text |
| `custom_footer_text` | String | `""` | Custom footer text |
| `enable_animations` | Boolean | `true` | Enable CSS animations |
| `show_alert_banner` | Boolean | `false` | Show custom alert banner on homepage |
| `alert_banner_message` | String | `"Important announcement: Check out our latest updates and features!"` | Message text for alert banner |
| `alert_banner_color` | String | `"#ff6a39"` | Background color for alert banner (hex color) |
| `alert_banner_cta_text` | String | `"Learn More"` | Text for the call-to-action button |
| `alert_banner_cta_url` | String | `""` | URL for the CTA button (relative or external) |
| `show_feature_banner` | Boolean | `true` | Show 3-column feature banner on homepage |
| `feature_banner_item_1_title` | String | `"Fast & Powerful"` | Title for first feature item |
| `feature_banner_item_1_image` | String | `""` | Image URL for first item (local: `assets/image.png` or external URL) |
| `feature_banner_item_1_url` | String | `""` | Click URL for first item (relative: `/about` or external: `https://example.com`) |
| `feature_banner_item_2_title` | String | `"Community Driven"` | Title for second feature item |
| `feature_banner_item_2_image` | String | `""` | Image URL for second item (local: `assets/image.png` or external URL) |
| `feature_banner_item_2_url` | String | `""` | Click URL for second item (relative: `/about` or external: `https://example.com`) |
| `feature_banner_item_3_title` | String | `"Always Learning"` | Title for third feature item |
| `feature_banner_item_3_image` | String | `""` | Image URL for third item (local: `assets/image.png` or external URL) |
| `feature_banner_item_3_url` | String | `""` | Click URL for third item (relative: `/about` or external: `https://example.com`) |

## 🎨 Customization

### Feature Banner Images

The 3-column feature banner supports both local and external images:

#### Local Images (Recommended)
1. Upload your images to the `assets/` folder
2. Use relative paths in settings: `assets/your-image.png`
3. Recommended size: 200x200px minimum
4. Formats: PNG, JPG, WebP, SVG

#### External Images
Use full URLs: `https://example.com/image.png`

#### Image Features
- **Clean Placeholders**: If no image is provided or fails to load, shows a subtle placeholder
- **Loading States**: Displays a spinner while images load
- **Responsive Design**: Images scale appropriately on mobile devices
- **Hover Effects**: Subtle zoom effect on desktop (disabled on mobile)

### Color Scheme

The theme includes a custom color scheme called "Groqsters" with the following colors:

- **Primary**: `#1f8dd6` (Blue)
- **Secondary**: `#f3f3f3` (Light Gray)
- **Tertiary**: `#0084ff` (Bright Blue)
- **Success**: `#009900` (Green)
- **Danger**: `#e45735` (Red)

### CSS Variables

The theme uses CSS custom properties for easy customization:

```css
:root {
  --groqsters-primary: #1f8dd6;
  --groqsters-transition: all 0.3s ease;
}
```

### JavaScript API

The theme provides utility functions for developers:

```javascript
// Import utilities
import { addCustomClass, animateElement, getThemeSetting } from '../lib/groqsters-utilities';

// Add custom classes
addCustomClass('.topic-list-item', 'groqsters-enhanced');

// Animate elements
animateElement(element, 'groqsters-fade-in');

// Get theme settings
const primaryColor = getThemeSetting('primary_brand_color', '#1f8dd6');
```

## 📁 File Structure

```
groqsters/
├── about.json                          # Theme manifest
├── settings.yml                        # Theme settings configuration
├── common/
│   └── common.scss                     # Common styles (all devices)
├── desktop/
│   └── desktop.scss                    # Desktop-specific styles
├── mobile/
│   └── mobile.scss                     # Mobile-specific styles
├── javascripts/
│   └── discourse/
│       ├── initializers/
│       │   └── groqsters-theme.js      # Main theme initializer
│       ├── lib/
│       │   └── groqsters-utilities.js  # Utility functions
│       └── components/
│           └── groqsters-custom-widget.js # Custom widget component
├── templates/
│   ├── header.hbs                      # Custom header template
│   ├── footer.hbs                      # Custom footer template
│   └── list/
│       └── topic-list-item.hbs         # Custom topic list item
└── assets/
    └── logo.png                        # Theme logo (placeholder)
```

## 🛠️ Development

### Prerequisites

- Access to a Discourse instance (admin privileges)
- Basic knowledge of:
  - SCSS/CSS
  - JavaScript (ES6+)
  - Handlebars templates
  - Discourse theme development

### Local Development

1. Clone this repository
2. Make your changes to the relevant files
3. Test changes by uploading to your Discourse development instance
4. Use browser developer tools for debugging

### Adding Custom JavaScript

Create new JavaScript files in `javascripts/discourse/` following Discourse conventions:

```javascript
// Example: javascripts/discourse/initializers/my-feature.js
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "my-feature",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Your custom code here
    });
  }
};
```

### Adding Custom Styles

Add styles to the appropriate SCSS files:

- `common/common.scss` - Styles for all devices
- `desktop/desktop.scss` - Desktop-only styles  
- `mobile/mobile.scss` - Mobile-only styles

## 🐛 Troubleshooting

### Common Issues

1. **Theme not loading**: Check that all required files are present and properly formatted
2. **JavaScript errors**: Check browser console for syntax errors
3. **Styles not applying**: Verify SCSS syntax and clear browser cache
4. **Settings not working**: Ensure settings are properly defined in `settings.yml`

### Debug Mode

Enable debug logging by setting `enable_custom_js` to `true` and checking browser console for theme-specific logs.

## 📄 License

This theme is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- Create an issue in this repository for bugs or feature requests
- Check the [Discourse Meta](https://meta.discourse.org) for general Discourse theming help
- Review the [Discourse Theme Development Guide](https://meta.discourse.org/t/developer-s-guide-to-discourse-themes/93648)

## 🙏 Acknowledgments

- Built for the Discourse platform
- Inspired by modern web design principles
- Thanks to the Discourse community for their excellent documentation

---

**Happy theming! 🎨** 