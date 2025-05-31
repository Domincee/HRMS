export function render() {
  const div = document.createElement('div');
  div.innerHTML = `
    <h2>Employee Management</h2>
    <p>Manage your employees here.</p>
  `;
  return div;
}
