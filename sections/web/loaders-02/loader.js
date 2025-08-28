// loader.js - Vanilla JavaScript implementation

class LoaderManager {
  constructor() {
    this.activeLoaders = new Set();
    this.init();
  }

  init() {
    // Load non-critical CSS asynchronously
    this.loadStylesAsync();
    
    // Set up page load detection
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
      });
    } else {
      document.body.classList.add('loaded');
    }
  }

  loadStylesAsync() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'loaders.css';
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
    document.head.appendChild(link);
  }

  show(type = 'spinner', target = null) {
    const loader = this.create(type);
    const container = target || document.body;
    
    if (!target) {
      // Full screen overlay
      const overlay = document.createElement('div');
      overlay.className = 'loader-overlay';
      overlay.appendChild(loader);
      document.body.appendChild(overlay);
      this.activeLoaders.add(overlay);
      return overlay;
    } else {
      // Inline loader
      target.appendChild(loader);
      this.activeLoaders.add(loader);
      return loader;
    }
  }

  hide(loader = null) {
    if (loader) {
      loader.remove();
      this.activeLoaders.delete(loader);
    } else {
      // Hide all loaders
      this.activeLoaders.forEach(l => l.remove());
      this.activeLoaders.clear();
    }
  }

  create(type) {
    const loaders = {
      spinner: () => {
        const div = document.createElement('div');
        div.className = 'loader-spinner';
        return div;
      },
      
      dots: () => {
        const div = document.createElement('div');
        div.className = 'loader-dots';
        for (let i = 0; i < 3; i++) {
          const span = document.createElement('span');
          div.appendChild(span);
        }
        return div;
      },
      
      progress: () => {
        const div = document.createElement('div');
        div.className = 'loader-progress';
        return div;
      },
      
      skeleton: (lines = 3) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="loader-skeleton skeleton-title"></div>
          ${Array(lines).fill().map(() => 
            '<div class="loader-skeleton skeleton-text"></div>'
          ).join('')}
        `;
        return div;
      },
      
      pulse: (width = '150px', height = '100px') => {
        const div = document.createElement('div');
        div.className = 'loader-pulse';
        div.style.width = width;
        div.style.height = height;
        return div;
      }
    };

    return loaders[type] ? loaders[type]() : loaders.spinner();
  }
}

// Usage examples
const loader = new LoaderManager();

// Show full-screen spinner
const spinner = loader.show('spinner');

// Show inline dots in specific element
const button = document.getElementById('submit-btn');
const dots = loader.show('dots', button);

// Hide specific loader
loader.hide(spinner);

// Hide all loaders
loader.hide();

// Auto-hide when page loads
window.addEventListener('load', () => {
  loader.hide();
});