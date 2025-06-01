import { employeesFromRecord } from '/employee.js';

export function render() {
  const div = document.createElement('div');
  div.className = 'employee-container';

  div.innerHTML = `
    <h2 class="title">Employee Management</h2>
    <p class="subtitle">Manage your employees here.</p>

    <input type="text" id="searchInput" placeholder="Search by name..." class="search-input" />

    <div class="table-wrapper">
      <table class="employee-table">
        <thead>
          <tr>
            <th><p class="sort-btn" data-sort="id">ID</p></th>
            <th><button class="sort-btn" data-sort="name">Name ⬍</button></th>
            <th><button class="sort-btn" data-sort="department">Department ⬍</button></th>
            <th><button class="sort-btn" data-sort="dateHired">Date Hired ⬍</button></th>
            <th><button class="sort-btn" data-sort="status">Status ⬍</button></th>
          </tr>
        </thead>
        <tbody id="employeeBody"></tbody>
      </table>
    </div>
  `;

  const employees = [...employeesFromRecord];
  let filteredEmployees = [...employees];
  const tbody = div.querySelector('#employeeBody');
  const searchInput = div.querySelector('#searchInput');

  const modal = document.querySelector('#employeeModal');
  const modalDetails = modal.querySelector('#modalDetails');
  const closeModal = modal.querySelector('#closeModal');
  const editBtn = modal.querySelector('#editBtn');
  const uploadBtn = modal.querySelector('.upload-profile');
  const fileInput = modal.querySelector('#profileUpload');
  const profile = modal.querySelector('.employee-profile');
  const maleImg = profile.querySelector('.male');
  const femaleImg = profile.querySelector('.female');

  let isEditing = false;
  let currentSort = { key: '', asc: true };

  const departments = ['HR', 'Finance', 'IT', 'Marketing', 'Sales']; // Define department options

  function getStatusDot(status) {
    const colors = { true: 'green', false: 'red' };
    const statusText = status ? 'Active' : 'Inactive';
    return `<span class="status-dot" style="background-color:${colors[status]}"></span> ${statusText}`;
  }

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  function renderTable(data) {
    tbody.innerHTML = '';
    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td>${emp.department}</td>
        <td>${emp.dateHired}</td>
        <td>${getStatusDot(emp.status)}</td>
      `;
      row.addEventListener('click', () => showModal(emp));
      tbody.appendChild(row);
    });
  }

  function filterByName(nameQuery) {
    filteredEmployees = employees.filter(emp => {
      const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
      return fullName.includes(nameQuery.toLowerCase());
    });
    renderTable(filteredEmployees);
  }

  searchInput.addEventListener('input', (e) => {
    filterByName(e.target.value);
  });

  const removeBtn = modal.querySelector('#removeBtn');

  removeBtn.addEventListener('click', () => {
    const empId = modal.dataset.id;
    if (!empId) return;

    if (!confirm('Are you sure you want to remove this employee?')) return;

    const empIndex = employees.findIndex(e => e.id === Number(empId));

    if (empIndex !== -1) {
      employees.splice(empIndex, 1);
      filteredEmployees = filteredEmployees.filter(e => e.id !== Number(empId));
      renderTable(filteredEmployees);
      modal.classList.add('hidden');
    }
  });

  function showModal(emp) {
    modal.dataset.id = emp.id;
    modalDetails.innerHTML = `
      <li><strong>ID:</strong> <span class="value" data-key="id">${emp.id}</span></li>
      <li><strong>First Name:</strong> <span class="value" data-key="firstName">${emp.firstName}</span></li>
      <li><strong>Last Name:</strong> <span class="value" data-key="lastName">${emp.lastName}</span></li>
      <li><strong>Department:</strong> <span class="value" data-key="department">${emp.department}</span></li>
      <li><strong>Date Hired:</strong> <span class="value" data-key="dateHired">${emp.dateHired}</span></li>
      <li><strong>Status:</strong> <span class="value" data-key="status">${emp.status ? 'Active' : 'Inactive'}</span></li>
    `;

    let uploadedImg = modal.querySelector('.uploaded-profile-img');
    if (emp.profile) {
      if (!uploadedImg) {
        uploadedImg = document.createElement('img');
        uploadedImg.classList.add('uploaded-profile-img');
        uploadedImg.style.width = '120px';
        uploadedImg.style.borderRadius = '8px';
        uploadedImg.style.marginTop = '8px';
        profile.appendChild(uploadedImg);
      }
      uploadedImg.src = emp.profile;
      uploadedImg.style.display = 'block';
      maleImg.style.display = 'none';
      femaleImg.style.display = 'none';
    } else {
      if (uploadedImg) uploadedImg.style.display = 'none';
      if (emp.gender === 'male') {
        maleImg.style.display = 'block';
        femaleImg.style.display = 'none';
      } else if (emp.gender === 'female') {
        maleImg.style.display = 'none';
        femaleImg.style.display = 'block';
      } else {
        maleImg.style.display = 'none';
        femaleImg.style.display = 'none';
      }
    }

    modal.classList.remove('hidden');
    isEditing = false;
    editBtn.textContent = 'Edit';
    profile.style.display = 'flex';
  }

  // === EDIT BUTTON LOGIC ===
  editBtn.addEventListener('click', () => {
    if (!isEditing) {
      isEditing = true;
      editBtn.textContent = 'Save';

      modalDetails.querySelectorAll('li').forEach(li => {
        const span = li.querySelector('.value');
        if (!span) return;

        const key = span.dataset.key;
        let inputElem;

        if (key === 'id') {
          inputElem = document.createElement('input');
          inputElem.type = 'text';
          inputElem.value = span.textContent.trim();
          inputElem.readOnly = true;
          
        } else if (key === 'department') {
          inputElem = document.createElement('select');
            inputElem.className = 'inputEdit';
          departments.forEach(dep => {
            const option = document.createElement('option');
            option.value = dep;
            option.textContent = dep;
            if (dep === span.textContent.trim()) option.selected = true;
            inputElem.appendChild(option);
          });
        } else if (key === 'status') {
          inputElem = document.createElement('select');
          inputElem.className = 'inputEdit';
          ['Active', 'Inactive'].forEach(statusText => {
            const option = document.createElement('option');
            option.value = statusText.toLowerCase();
            option.textContent = statusText;
            if (statusText === span.textContent.trim()) option.selected = true;
            inputElem.appendChild(option);
          });
        } else {
          inputElem = document.createElement('input');
          inputElem.type = 'text';
          inputElem.value = span.textContent.trim();
        }

        inputElem.dataset.key = key;
        span.replaceWith(inputElem);
      });

    } else {
      // Save data
      const empId = Number(modal.dataset.id);
      const empIndex = employees.findIndex(e => e.id === empId);
      if (empIndex === -1) return;

      const inputs = modalDetails.querySelectorAll('input, select');

      inputs.forEach(input => {
        const key = input.dataset.key;
        let value = input.value.trim();

        if (key === 'status') {
          value = value === 'active';
        } else if (key === 'id' || key === 'age') {
          value = Number(value);
        }
        employees[empIndex][key] = value;
      });

      // Replace inputs back to spans
      inputs.forEach(input => {
        const span = document.createElement('span');
        span.className = 'value';
        span.dataset.key = input.dataset.key;

        if (input.dataset.key === 'status') {
          span.textContent = employees[empIndex].status ? 'Active' : 'Inactive';
        } else {
          span.textContent = input.value;
        }
        input.replaceWith(span);
      });

      isEditing = false;
      editBtn.textContent = 'Edit';

      // Update table and modal view
      filterByName(searchInput.value);
      showModal(employees[empIndex]);
    }
  });

  // ... rest of your unchanged code, e.g., sortBy, uploadBtn, fileInput, etc.

  function sortBy(key) {
    currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
    currentSort.key = key;

    const sorted = [...filteredEmployees].sort((a, b) => {
      if (key === 'dateHired') {
        return currentSort.asc
          ? new Date(a.dateHired) - new Date(b.dateHired)
          : new Date(b.dateHired) - new Date(a.dateHired);
      } else if (key === 'status') {
        return currentSort.asc
          ? Number(a.status) - Number(b.status)
          : Number(b.status) - Number(a.status);
      } else if (key === 'name') {
        const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
        const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
        return currentSort.asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        return currentSort.asc
          ? a[key].toString().localeCompare(b[key].toString())
          : b[key].toString().localeCompare(a[key].toString());
      }
    });

    renderTable(sorted);
  }

  div.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => sortBy(btn.dataset.sort));
  });

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const loader = document.createElement('div');
    loader.className = 'profile-loader';
    profile.appendChild(loader);

    const reader = new FileReader();
    reader.onload = (e) => {
      const newProfileSrc = e.target.result;
      if (confirm('Do you want to upload this profile image?')) {
        maleImg.style.display = 'none';
        femaleImg.style.display = 'none';

        let uploadedImg = modal.querySelector('.uploaded-profile-img');
        if (!uploadedImg) {
          uploadedImg = document.createElement('img');
          uploadedImg.classList.add('uploaded-profile-img');
          uploadedImg.style.width = '120px';
          uploadedImg.style.borderRadius = '8px';
          uploadedImg.style.marginTop = '8px';
          profile.appendChild(uploadedImg);
        }

        uploadedImg.src = newProfileSrc;
        uploadedImg.style.display = 'block';

        const empId = modal.dataset.id;
        const empIndex = employees.findIndex(e => e.id == empId);
        if (empIndex !== -1) {
          employees[empIndex].profile = newProfileSrc;
        }
        filterByName(searchInput.value);
      }

      loader.remove();
      fileInput.value = '';
    };

    reader.onerror = () => {
      alert('Failed to read the file.');
      loader.remove();
    };

    reader.readAsDataURL(file);
  });

  renderTable(filteredEmployees);
  return div;
}
