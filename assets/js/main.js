// Simple JS to dynamically load projects, notes, and skills

async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <a href="${p.link}" class="btn primary" target="_blank">View</a>
    </div>
  `).join('');
}

function renderNotes(notes) {
  const container = document.getElementById('field-notes-log');
  container.innerHTML = notes.map(n => `
    <article>
      <h3>${n.title}</h3>
      <p class="date">${n.date}</p>
      <p>${n.content}</p>
    </article>
  `).join('');
}

function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = skills.map(s => `
    <div class="skill-group">
      <h3>${s.name}</h3>
      <ul>
        ${s.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

async function init() {
  const projects = await loadJSON('projects.json');
  const notes = await loadJSON('notes.json');
  const skills = await loadJSON('skills.json');

  renderProjects(projects);
  renderNotes(notes);
  renderSkills(skills);
}

init();

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-list a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 60) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.documentElement.dataset.theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
});