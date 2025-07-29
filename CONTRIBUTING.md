# Contributing to Groqsters Discourse Theme

Thank you for your interest in contributing to the Groqsters Discourse theme! This document provides guidelines and instructions for contributors.

## 🚀 Getting Started

### Prerequisites

- A Discourse development instance or access to a test Discourse site
- Basic knowledge of:
  - SCSS/CSS
  - JavaScript (ES6+)
  - Handlebars templates
  - Git and GitHub

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/your-username/groqsters.git
   cd groqsters
   ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/original-username/groqsters.git
   ```

3. **Install the theme on your Discourse instance**
   - Create a `.tar.gz` archive of the theme files
   - Upload to Admin Panel → Customize → Themes

## 🏗️ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards outlined below
   - Test your changes thoroughly
   - Update documentation if necessary

3. **Test locally**
   - Upload the modified theme to your test Discourse instance
   - Check functionality across desktop and mobile
   - Verify JavaScript console for errors

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### SCSS Guidelines

- Use 2 spaces for indentation
- Follow BEM naming convention where possible
- Group related styles together
- Add comments for complex styles
- Use variables for colors and commonly used values

```scss
// Good
.groqsters-button {
  background: var(--groqsters-primary);
  transition: var(--groqsters-transition);
  
  &:hover {
    transform: translateY(-2px);
  }
}

// Bad
.btn {
  background: #1f8dd6;
  transition: all 0.3s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
```

### JavaScript Guidelines

- Use ES6+ features
- Follow Discourse plugin API conventions
- Add JSDoc comments for functions
- Use descriptive variable names
- Handle errors gracefully

```javascript
// Good
/**
 * Animates an element with the specified class
 * @param {Element} element - The DOM element to animate
 * @param {string} animationClass - CSS class for animation
 * @param {number} duration - Animation duration in milliseconds
 */
export function animateElement(element, animationClass, duration = 600) {
  if (!element || !getThemeSetting('enable_animations', true)) return;
  
  element.classList.add(animationClass);
  setTimeout(() => element.classList.remove(animationClass), duration);
}

// Bad
function animate(el, cls, dur) {
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), dur || 600);
}
```

### Template Guidelines

- Use semantic HTML
- Add appropriate ARIA attributes for accessibility
- Follow Handlebars best practices
- Include helpful comments

```handlebars
{{!-- Good --}}
<button class="btn btn-groqsters" 
        aria-label="Custom action button"
        onclick="customAction()">
  {{d-icon "cog"}} Settings
</button>

{{!-- Bad --}}
<div class="btn" onclick="customAction()">Settings</div>
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Test changes on both desktop and mobile
- [ ] Check browser console for JavaScript errors
- [ ] Verify SCSS compiles without errors
- [ ] Update documentation if needed
- [ ] Add/update comments in code

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] No JavaScript console errors
- [ ] No SCSS compilation errors

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context about the changes.
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - Discourse version
   - Browser and version
   - Device type (desktop/mobile)

2. **Steps to reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Screenshots or console logs**
   - Visual evidence of the issue
   - Any error messages

### Feature Requests

For feature requests, please include:

1. **Use case description**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed solution**
   - How should it work?
   - Any implementation ideas?

3. **Alternatives considered**
   - Other approaches you've thought about

## 🧪 Testing

### Manual Testing Checklist

- [ ] Theme loads without errors
- [ ] All settings work as expected
- [ ] Responsive design works on various screen sizes
- [ ] JavaScript functionality works
- [ ] Animations are smooth and performant
- [ ] Custom templates render correctly
- [ ] Color scheme applies properly

### Browser Support

Test changes in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Resources

### Discourse Development

- [Discourse Theme Development Guide](https://meta.discourse.org/t/developer-s-guide-to-discourse-themes/93648)
- [Discourse Plugin API Documentation](https://github.com/discourse/discourse/blob/main/app/assets/javascripts/discourse/app/lib/plugin-api.js)
- [Handlebars Documentation](https://handlebarsjs.com/)

### Theme Structure

- [Discourse Theme File Structure](https://meta.discourse.org/t/structure-of-themes-and-theme-components/60848)
- [Theme Settings Documentation](https://meta.discourse.org/t/how-to-add-settings-to-your-discourse-theme/82557)

## 🤝 Community Guidelines

- Be respectful and constructive in discussions
- Help others learn and grow
- Follow the [Discourse Community Guidelines](https://meta.discourse.org/guidelines)
- Credit others for their contributions and ideas

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discourse Meta**: For general theming questions
- **Discord/Forum**: For real-time discussion (if available)

## 🎉 Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to the Groqsters theme! 🚀 