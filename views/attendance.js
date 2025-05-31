export function render() {
  const div = document.createElement('div');
  div.innerHTML = `
    <h2>Employee Management</h2>
    <p>Manage your Attendance here.</p>
  `;
  return div;
}
