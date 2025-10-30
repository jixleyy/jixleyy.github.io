// Nautical Portfolio Enhanced JS

// Particle System
const particleContainer = document.getElementById('particle-container');
const particleCount = 40;

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.width = `${Math.random() * 4 + 2}px`;
  particle.style.height = particle.style.width;
  particle.style.top = `${Math.random() * window.innerHeight}px`;
  particle.style.left = `${Math.random() * window.innerWidth}px`;
  particle.style.animationDuration = `${Math.random() * 20 + 15}s`;
  particleContainer.appendChild(particle);
}

for (let i = 0; i < particleCount; i++) {
  createParticle();
}

// Floating Ship Parallax (Optional: Slight Vertical Oscillation)
const ship = document.querySelector('.hero::after'); // For reference; CSS handles animation

// Smooth Scroll for Navigation
document.querySelectorAll('.nav-list a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Optional: Hero Wave Parallax on Scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.wave-layer').forEach((wave, index) => {
    const speed = (index + 1) * 0.3;
    wave.style.transform = `translateX(${-50 + scrollY * speed}px)`;
  });
});

// Optional: Glow Pulse Effect for Buttons
const buttons = document.querySelectorAll('.btn');
setInterval(() => {
  buttons.forEach(btn => {
    btn.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px rgba(0,188,212,${Math.random() * 0.5 + 0.5})`;
  });
}, 2000);

// Resize particles on window resize
window.addEventListener('resize', () => {
  document.querySelectorAll('.particle').forEach(p => p.remove());
  for (let i = 0; i < particleCount; i++) createParticle();
});