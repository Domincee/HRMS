import { employeesFromRecord } from '/public/js/record.js';

export function openModal(employee = null, index = null) {
  modal.classList.remove('hidden');

  if (employee) {
    form.firsName.value = employee.firstName;
    form.lastName.value = employee.lastName;
    form.department.value = employee.department;
    editingIndex = index;
  } else {
    form.reset();
    editingIndex = null;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('addEmployeeModal');
  const closeButton = document.querySelector('.close-button');
  const form = document.getElementById('addEmployeeForm');
  const addedNewModal = document.querySelector('.addedNewModal');
  const closeNewModal = document.querySelector('.closeAddedNewModal');
  const addedNewText = document.querySelector('.addedNewText');

  let editingIndex = null;

  form.onsubmit = (e) => {
    e.preventDefault();
    console.log("🟢 Form submitted");

    const updatedEmployee = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      department: form.department.value.trim(),
    };

    if (editingIndex !== null) {
      employeesFromRecord[editingIndex] = updatedEmployee;
      console.log(`✅ Updated employee at index ${editingIndex}:`, updatedEmployee);
    } else {
      employeesFromRecord.push(updatedEmployee);
      addedNewText.textContent = `Added new employee: ${updatedEmployee.firstName} ${updatedEmployee.lastName}`;
      console.log("✅ Added new employee:", updatedEmployee);

    }

    console.log("📋 Current Employee List:", employeesFromRecord);
    modal.classList.add('hidden');
    editingIndex = null;
    addedNewModal.classList.remove('hidden');
  };

  closeButton.addEventListener('click', () => modal.classList.add('hidden'));
  closeNewModal.addEventListener('click', () => addedNewModal.classList.add('hidden'));
  // Expose these to your modal logic
  window._modal = modal;
  window._form = form;
  window._editingIndex = editingIndex;
});



const tableBody = document.getElementById("employeeTableBody");


// Populate department filter

// Render employee table
function renderTable(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No employees found.</td></tr>`;
    return;
  }
  data.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.age}</td>
      <td>${emp.department}</td>
      <td>${emp.dateHired}</td>
     <td>
      <div class="status-indicator ${emp.status ? 'active' : 'inactive'}"></div>
    </td>
    `;
    tableBody.appendChild(row);
  });
}
renderTable(employeesFromRecord);