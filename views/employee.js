export function render() {
  const div = document.createElement('div');
  div.className = 'employee-container';

  div.innerHTML = `
    <h2 class="title">Employee Management</h2>
    <p class="subtitle">Manage your employees here.</p>

    <div class="table-wrapper">
      <table class="employee-table">
        <thead>
          <tr>
            <th><p class="sort-btn" data-sort="id">ID</p></th>
            <th><button class="sort-btn" data-sort="name">Name ⬍</button></th>
            <th><button class="sort-btn" data-sort="department">Department ⬍</button></th>
            <th><button class="sort-btn" data-sort="date">Date Hired ⬍</button></th>
            <th><button class="sort-btn" data-sort="status">Status ⬍</button></th>
          </tr>
        </thead>
        <tbody id="employeeBody"></tbody>
      </table>
    </div>
  `;

  const employees = [
    { id: '1', name: 'Anna Cruz', gender: 'female', department: 'HR', date: '2023-02-10', status: 'Active' },
    { id: '2', name: 'John Reyes', gender: 'male', department: 'Engineering', date: '2022-11-05', status: 'On Leave' },
    { id: '3', name: 'Mika Tan', gender: 'female', department: 'Marketing', date: '2024-01-15', status: 'Inactive' },
    { id: '4', name: 'Carlos Dela Rosa', gender: 'male', department: 'Finance', date: '2021-08-01', status: 'Active' },
  ];

  const tbody = div.querySelector('#employeeBody');
  const modal = document.querySelector('#employeeModal');
  const modalDetails = modal.querySelector('#modalDetails');
  const closeModal = modal.querySelector('#closeModal');
  const editBtn = modal.querySelector('#editBtn');
  const profile = modal.querySelector('.employee-profile');
  let isEditing = false;
  let currentSort = { key: '', asc: true };

  function getStatusDot(status) {
    const colors = {
      'Active': 'green',
      'Inactive': 'red',
      'On Leave': 'blue'
    };
    return `<span class="status-dot" style="background-color:${colors[status] || 'gray'};"></span> ${status}`;
  }

  function renderTable(data) {
    tbody.innerHTML = '';
    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.date}</td>
        <td>${getStatusDot(emp.status)}</td>
      `;
      row.addEventListener('click', () => showModal(emp));
      tbody.appendChild(row);
    });
  }

  function showModal(emp) {
    modal.dataset.id = emp.id;
    modalDetails.innerHTML = `
      <li><strong>ID:</strong> <span class="value" data-key="id">${emp.id}</span></li>
      <li><strong>Name:</strong> <span class="value" data-key="name">${emp.name}</span></li>
      <li><strong>Department:</strong> <span class="value" data-key="department">${emp.department}</span></li>
      <li><strong>Date Hired:</strong> <span class="value" data-key="date">${emp.date}</span></li>
      <li><strong>Status:</strong> <span class="value" data-key="status">${emp.status}</span></li>
    `;
    profile.querySelector('.male').style.display = emp.gender === 'male' ? 'block' : 'none';
    profile.querySelector('.female').style.display = emp.gender === 'female' ? 'block' : 'none';
    modal.classList.remove('hidden');
    isEditing = false;
    editBtn.textContent = 'Edit';
  }

function hideModal() {
  modal.classList.add('hidden');
  employee.style.display = 'flex';  // Always show employee profile when modal closes
  isEditing = false;                // Reset editing state as well
  editBtn.textContent = 'Edit';     // Reset button text
}
  closeModal.addEventListener('click', hideModal);
    const employee = document.querySelector('.employee-profile');

  
 editBtn.addEventListener('click', () => {
  const detailSpans = modal.querySelectorAll('.value');

  if (!isEditing) {
    // Enter edit mode
    employee.style.display = 'none';  // Hide profile during edit

    detailSpans.forEach(span => {
      const key = span.dataset.key;
      if (key === 'id') return; // Skip ID editing

      const value = span.textContent;
      const input = document.createElement('input');
      input.value = value;
      input.setAttribute('data-key', key);
      span.replaceWith(input);
    });
    editBtn.textContent = 'Save';
  } else {
    // Save mode
    employee.style.display = 'flex';  // Show profile back after edit

    const inputs = modal.querySelectorAll('input[data-key]');
    const updatedData = {};
    inputs.forEach(input => {
      const key = input.dataset.key;
      const value = input.value;
      updatedData[key] = value;
      const span = document.createElement('span');
      span.classList.add('value');
      span.setAttribute('data-key', key);
      span.textContent = value;
      input.replaceWith(span);
    });

    const empIndex = employees.findIndex(e => e.id === modal.dataset.id);
    if (empIndex !== -1) {
      Object.assign(employees[empIndex], updatedData);
    }

    renderTable(employees);
    editBtn.textContent = 'Edit';
  }

  isEditing = !isEditing;
});

  function sortBy(key) {
    currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
    currentSort.key = key;

    const sorted = [...employees].sort((a, b) => {
      if (key === 'date') {
        return currentSort.asc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else {
        return currentSort.asc
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });

    renderTable(sorted);
  }

  div.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => sortBy(btn.dataset.sort));
  });

  renderTable(employees);

  return div;
}
