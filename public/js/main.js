function loadHTML(targetId, filePath, callback) {
  fetch(filePath)
    .then(res => res.text())
    .then(html => {
      document.getElementById(targetId).innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error('Error loading HTML:', err));
}

document.getElementById('dashboardBtn').addEventListener('click', () => {
  loadHTML('content', '/pages/dashboard.html', async () => {
    const dashboardModule = await import('/public/js/dashboard.js');
    dashboardModule.initDashboard();  // call exported function
  });
});