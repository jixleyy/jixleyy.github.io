// Interactive Sonar Ping and Drifting Particles

// Sonar ping following cursor
const sonar = document.getElementById('sonar');
document.addEventListener('mousemove', (e) => {
  const rect = sonar.parentElement.getBoundingClientRect();
  const x = e.clientX - rect.left - sonar.offsetWidth/2;
  const y = e.clientY - rect.top - sonar.offsetHeight/2;
  sonar.style.transform = `translate(${x}px, ${y}px)`;
});

// Simple drifting particles
const hero = document.getElementById('hero');
const particleCount = 50;
const particles = [];

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
  hero.appendChild(particle);
  particles.push({el: particle, speedX: (Math.random()-0.5)/2, speedY: (Math.random()-0.5)/2});
}

function animateParticles() {
  particles.forEach(p => {
    let top = parseFloat(p.el.style.top);
    let left = parseFloat(p.el.style.left);
    top += p.speedY;
    left += p.speedX;
    if (top < 0) top = 100;
    if (top > 100) top = 0;
    if (left < 0) left = 100;
    if (left > 100) left = 0;
    p.el.style.top = top + '%';
    p.el.style.left = left + '%';
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();