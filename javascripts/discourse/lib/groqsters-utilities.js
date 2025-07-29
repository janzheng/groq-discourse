// Groqsters Theme Utility Functions

export function addCustomClass(selector, className) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  });
}

export function removeCustomClass(selector, className) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.classList.remove(className);
  });
}

export function createCustomElement(tag, className, content, attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
  
  return element;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function getThemeSetting(settingName, defaultValue = null) {
  try {
    return window.settings && window.settings[settingName] !== undefined 
      ? window.settings[settingName] 
      : defaultValue;
  } catch (e) {
    console.warn(`Could not retrieve theme setting: ${settingName}`, e);
    return defaultValue;
  }
}

export function animateElement(element, animationClass, duration = 600) {
  if (!element || !getThemeSetting('enable_animations', true)) return;
  
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

export function observeElements(selector, callback, options = {}) {
  if (!window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, entry);
      }
    });
  }, options);
  
  document.querySelectorAll(selector).forEach(element => {
    observer.observe(element);
  });
  
  return observer;
}

export function isMobileDevice() {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function getCurrentUser() {
  try {
    return window.Discourse && window.Discourse.currentUser;
  } catch (e) {
    return null;
  }
} 