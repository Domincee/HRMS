export async function loadView(view) {
  const content = document.getElementById('main-content');

   content.innerHTML = '<div class="spinner-con"><div class="spinner"></div></div>';
  try {
    const module = await import(`./views/${view}.js`);
    content.innerHTML = '';
    content.appendChild(module.render());
  } catch (error) {
    content.innerHTML = `<p>View "${view}"In Progress.</p>`;
  }
}

// Make it globally accessible for buttons
window.loadView = loadView;

// Default view



