export async function loadView(view) {
  const content = document.getElementById('main-content');
  try {
    const module = await import(`./views/${view}.js`);
    content.innerHTML = '';
    content.appendChild(module.render());
  } catch (error) {
    content.innerHTML = `<p>View "${view}" not found.</p>`;
  }
}

// Make it globally accessible for buttons
window.loadView = loadView;

// Default view
loadView('dashboard');
