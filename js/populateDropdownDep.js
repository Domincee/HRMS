import { employeesFromRecord } from '/data/employee.js';

export function populateDepartmentDropdown() {
  const departmentSelect = document.getElementById('department');
  if (!departmentSelect) return;

  departmentSelect.innerHTML = '<option value="">Select Department</option>';

  const departments = [...new Set(employeesFromRecord.map(emp => emp.department))];

  departments.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep;
    option.textContent = dep;
    departmentSelect.appendChild(option);
  });
}
