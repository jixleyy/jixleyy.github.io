// Wii-style Cursor with Physics
class DSCursor {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = 0.9;
    this.spring = 0.15;
    this.wobbleIntensity = 0;
    this.cursorElement = null;
    this.init();
  }

  init() {
    this.createCursorElements();
    this.setupEventListeners();
    this.animate();
  }

  createCursorElements() {
    this.cursorElement = document.createElement('div');
    this.cursorElement.classList.add('ds-cursor');
    this.cursorElement.id = 'ds-cursor';
    document.body.appendChild(this.cursorElement);
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      this.cursorElement.classList.add('clicked');
      if (window.audioManager) {
        if (window.audioManager.audioContext && window.audioManager.audioContext.state === 'suspended') {
          window.audioManager.audioContext.resume();
        }
        window.audioManager.playClickSound();
      }
    });

    document.addEventListener('mouseup', () => {
      this.cursorElement.classList.remove('clicked');
    });

    const interactiveElements = document.querySelectorAll('a, button, .channel-tile, .project-tile, input, textarea, select');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursorElement.classList.add('hover');
        if (window.audioManager) {
          if (window.audioManager.audioContext && window.audioManager.audioContext.state === 'suspended') {
            window.audioManager.audioContext.resume();
          }
          if (element.tagName === 'BUTTON' || element.classList.contains('contact-button') || 
              element.classList.contains('submit-button') || element.classList.contains('filter-btn') || 
              element.classList.contains('project-link')) {
            window.audioManager.playClickSound();
          } else if (element.classList.contains('channel-tile') || element.classList.contains('project-tile') || 
                     element.classList.contains('skill-tile') || element.classList.contains('testimonial-card') || 
                     element.classList.contains('achievement-tile') || element.classList.contains('blog-post-tile')) {
            window.audioManager.playHoverSound();
          } else {
            window.audioManager.playHoverSound();
          }
        }
      });

      element.addEventListener('mouseleave', () => {
        this.cursorElement.classList.remove('hover');
      });
    });
  }

  animate() {
    const reducedMotion = window.settingsManager.getSetting('reducedMotion');

    if (reducedMotion) {
      // Direct follow for reduced motion
      this.targetX = this.mouseX;
      this.targetY = this.mouseY;
      this.cursorElement.style.left = `${this.targetX}px`;
      this.cursorElement.style.top = `${this.targetY}px`;
      this.wobbleIntensity = 0; // Ensure no wobble when reduced motion is active
    } else {
      // Original physics-based movement
      const dx = this.mouseX - this.targetX;
      const dy = this.mouseY - this.targetY;
      
      this.velocityX += dx * this.spring;
      this.velocityY += dy * this.spring;
      
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      
      this.targetX += this.velocityX;
      this.targetY += this.velocityY;
      
      const wobbleX = Math.sin(Date.now() * 0.01) * this.wobbleIntensity * Math.min(1, Math.abs(this.velocityX) * 2);
      const wobbleY = Math.cos(Date.now() * 0.013) * this.wobbleIntensity * Math.min(1, Math.abs(this.velocityY) * 2);
      
      this.cursorElement.style.left = `${this.targetX + wobbleX}px`;
      this.cursorElement.style.top = `${this.targetY + wobbleY}px`;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DSCursor();
});