/* import { employeesFromRecord } from '/data/employee.js';
import { render as renderEmployeeTable } from '/modules/employeeTable.js';

let selectedGender = null;
let selectedStatus = 'Active';

const form = document.getElementById('employeeForm');
const genderButtons = form.querySelectorAll('.gender-btn button');
const statusButtons = form.querySelectorAll('.status-btn button');
const statusText = document.getElementById('statusText');
const departmentDropdown = document.getElementById('department');

// Gender selection
genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedGender = btn.dataset.gender;
    genderButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Status selection
statusButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedStatus = btn.dataset.status;
    statusText.textContent = selectedStatus;
    statusButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Add new employee
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newEmp = {
    id: generateUniqueId(), // implement this function
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    age: parseInt(document.getElementById('Age').value),
    gender: selectedGender,
    status: selectedStatus === 'Active',
    department: departmentDropdown.value,
    dateHired: form.querySelector('input[type="date"]').value
  };

  employeesFromRecord.push(newEmp);

  // Update table
  const root = document.querySelector('.employee-table').closest('.employee');
  root.replaceWith(renderEmployeeTable());

  // Refresh dropdown
  populateDepartmentDropdown();

  // Reset form
  form.reset();
  selectedGender = null;
  selectedStatus = 'Active';
  statusText.textContent = 'Active';
});

// Helper
function populateDepartmentDropdown() {
  const departments = [
    ...new Set(employeesFromRecord.map(emp => emp.department))
  ];

  departmentDropdown.innerHTML = `<option value="">Select</option>`;
  departments.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep;
    option.textContent = dep;
    departmentDropdown.appendChild(option);
  });
}

// Call on load
populateDepartmentDropdown();
 */