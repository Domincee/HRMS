export function render() {
  const div = document.createElement('div');
  div.innerHTML = `
    <h2>Dashboard</h2>
    <p>Welcome to the Dashboard overview.</p>
  `;
  return div;
}
