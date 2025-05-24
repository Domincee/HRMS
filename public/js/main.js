import { saveEmployees, loadEmployees } from './storage.js';
import { employeesFromRecord } from './record.js';

let employees = loadEmployees() || [...employeesFromRecord];
let editingIndex = -1;
let deleteIndex = -1;

const totalEmployee = document.getElementById("totalEmployee");
const employee = document.getElementById("employee");
const tableBody = document.getElementById("employeeTableBody");
const departmentFilter = document.getElementById("departmentFilter");
const chart = document.getElementById("chart");

/* FORM ELEMENTS */
const formModal = document.getElementById("formModal");
const formEmp = document.getElementById("employeeForm");
const fNameInput = document.getElementById("firstName");
const lNameInput = document.getElementById("lastName");
const depInput = document.getElementById("department");
const dateInput = document.getElementById("dateHired");
const status = document.getElementById("status");
const dateHiredLabel = document.getElementById("dateHiredLabel");
const statusLabel = document.getElementById("statusLabel");
const cancelAdd = document.querySelector(".cancel-add");
const addNew = document.querySelector(".add-new");

/* MODALS & ALERTS */
const alertModal = document.getElementById("alertModal");
const alertMessage = document.getElementById("alertMessage");
const alertClose = document.getElementById("alertClose");
const confiModal = document.getElementById("confirmationModal");
const confirmBtns = document.getElementById("confirmationModal");
const confirmMess = document.getElementById("confirm-message");

/* ADD NEW DEPARTMENT */
const prompt = document.getElementById("promptNewDep");
const promptContainer = document.getElementById("promptContainer");
const departmentSelect = document.getElementById("department");
const checkDep = document.getElementById("checkDep");
const closeDep = document.getElementById("closeDep");

/* --- FUNCTIONS --- */

// Show extra fields when editing
function showEditFields() {
  dateInput.style.display = "inline-block";
  status.style.display = "inline-block";
  dateHiredLabel.style.display = "block";
  statusLabel.style.display = "block";
}

// Hide extra fields when adding
function hideEditFields() {
  dateInput.style.display = "none";
  status.style.display = "none";
  dateHiredLabel.style.display = "none";
  statusLabel.style.display = "none";
}

// Populate department dropdown filter
function populateDepartmentFilter() {
  const uniqueDepartments = new Set(employees.map(emp => emp.department.trim()));
  departmentFilter.innerHTML = `<option value="All">All</option>`;
  uniqueDepartments.forEach(dept => {
    const option = document.createElement("option");
    option.value = dept;
    option.textContent = dept;
    departmentFilter.appendChild(option);
  });
}

// Render employee table (filtered)
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
      <td>${emp.age || '-'}</td>
      <td>${emp.department}</td>
      <td>${emp.dateHired}</td>
      <td>${emp.active ? "Yes" : "No"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Render department chart
function renderChart(data) {
  chart.innerHTML = "";
  const departmentCounts = {};

  data.forEach(emp => {
    const dept = emp.department.trim();
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const sortedDepartments = Object.entries(departmentCounts).sort((a, b) => a[1] - b[1]);
  const maxCount = Math.max(...Object.values(departmentCounts));

  sortedDepartments.forEach(([dept, count]) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(count / maxCount) * 100}%`;
    if (count === maxCount) bar.classList.add("highlight");

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = count;
    bar.appendChild(value);

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = dept;
    bar.appendChild(label);

    chart.appendChild(bar);
  });
}

// Update main employee list (used by management table)
function updateTable() {
  const table = document.getElementById("employeeTable");
  table.innerHTML = "";

  if (employees.length === 0) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center;">No employees found.</td></tr>`;
    totalEmployee.textContent = "0";
    employee.textContent = "Employees";
    return;
  }

[...employees].reverse().forEach((emp, i) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${i + 1}</td>
    <td>${emp.firstName}</td>
    <td>${emp.lastName}</td>
    <td>${emp.department}</td>
    <td>${emp.active ? "Active" : "Inactive"}</td>
    <td>${emp.dateHired || ""}</td>
    <td>
      <button class="btn btn-primary" data-edit="${employees.length - 1 - i}">Edit</button>
      <button class="btn btn-danger" data-delete="${employees.length - 1 - i}">Delete</button>
    </td>
  `;
  table.appendChild(tr);
});

  totalEmployee.textContent = employees.length;
  employee.textContent = employees.length === 1 ? "Employee" : "Employees";

  // Bind buttons
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", e => editEmployee(+e.target.dataset.edit));
  });
  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", e => confirmDeleteEmployee(+e.target.dataset.delete));
  });
}

// Refresh all views
function refreshDashboardViews() {
  updateTable();
  populateDepartmentFilter();
  const selected = departmentFilter.value;
  const filtered = selected === "All"
    ? employees
    : employees.filter(emp => emp.department.trim() === selected);
  renderTable(filtered);
  renderChart(filtered);

  // 🟢 Update "New Employees"
  const today = new Date().toISOString().split('T')[0];
  const newEmployees = employees.filter(emp => emp.dateHired === today);
  newEmpTotal.textContent = newEmployees.length;
  newEmp.textContent = newEmployees.length === 1 ? "New Employee" : "New Employees";
}

/* --- EVENT LISTENERS --- */

// Form submit (add/edit)
formEmp.addEventListener("submit", function (e) {
  e.preventDefault();
  const firstName = fNameInput.value.trim();
  const lastName = lNameInput.value.trim();
  const department = depInput.value.trim();

  if (!firstName || !lastName || !department) {
    alertModal.style.display = "flex";
    alertMessage.textContent = "Please fill out all required fields.";
    return;
  }

  // Duplicate check
  const exists = employees.some((emp, index) =>
    index !== editingIndex &&
    emp.firstName.toLowerCase() === firstName.toLowerCase() &&
    emp.lastName.toLowerCase() === lastName.toLowerCase() &&
    emp.department.toLowerCase() === department.toLowerCase()
  );

  if (exists) {
    alertModal.style.display = "flex";
    alertMessage.textContent = `Employee "${firstName} ${lastName}" already exists.`;
    return;
  }

  if (editingIndex >= 0) {
    employees[editingIndex] = {
      ...employees[editingIndex],
      firstName,
      lastName,
      department,
      active: status.checked,
      dateHired: dateInput.value || new Date().toISOString().split('T')[0]
    };
    alertMessage.textContent = "Employee updated successfully.";
  } else {
    if (department === "AddOption") {
      alertModal.style.display = "flex";
      alertMessage.textContent = "Please select a valid department or add a new one.";
      return;
    }
    employees.push({
      id: employees.length ? employees[employees.length - 1].id + 1 : 1,
      firstName,
      lastName,
      department,
      active: false,
      dateHired: new Date().toISOString().split('T')[0]
    });
    alertMessage.textContent = "Employee added successfully.";
  }

  saveEmployees(employees);
  alertModal.style.display = "flex";
  formModal.style.display = "none";
  refreshDashboardViews();
});

// Edit employee
function editEmployee(index) {
  editingIndex = index;
  const emp = employees[index];
  fNameInput.value = emp.firstName;
  lNameInput.value = emp.lastName;
  depInput.value = emp.department;
  dateInput.value = emp.dateHired || "";
  status.checked = emp.active || false;

  showEditFields();
  formModal.style.display = "flex";
  formEmp.style.flexDirection = "column";
}

// Delete employee
function confirmDeleteEmployee(index) {
  confiModal.style.display = "flex";
  confirmMess.textContent = "Are you sure you want to delete this employee?";
  deleteIndex = index;
}

confirmBtns.querySelector(".btn-yes").addEventListener("click", () => {
  if (deleteIndex >= 0) {
    employees.splice(deleteIndex, 1);
    saveEmployees(employees);
    refreshDashboardViews();
  }
  confiModal.style.display = "none";
  deleteIndex = -1;
});

confirmBtns.querySelector(".btn-no").addEventListener("click", () => {
  confiModal.style.display = "none";
  deleteIndex = -1;
});

// Add new button
addNew.addEventListener("click", (e) => {
  e.preventDefault();
  editingIndex = -1;
  formEmp.reset();
  hideEditFields();
  formModal.style.display = "flex";
  formEmp.style.flexDirection = "column";
});

// Cancel add
cancelAdd.addEventListener("click", function(e) {
  e.preventDefault();
  formModal.style.display = "none"; 
});

// Alert modal close
alertClose.addEventListener("click", () => {
  alertModal.style.display = "none";
});

// Add new department
depInput.addEventListener("change", () => {
  if (depInput.value === "AddOption") {
    promptContainer.style.display = "flex";
    prompt.value = "";
  }
});

checkDep.addEventListener("click", () => {
  const newDep = prompt.value.trim();
  if (!newDep) {
    alertModal.style.display = "flex";
    alertMessage.textContent = "Please enter a valid department name.";
    return;
  }
  if ([...departmentSelect.options].some(opt => opt.value.toLowerCase() === newDep.toLowerCase())) {
    alertModal.style.display = "flex";
    alertMessage.textContent = `Department "${newDep}" already exists.`;
    return;
  }

  const newOption = document.createElement("option");
  newOption.value = newDep;
  newOption.textContent = newDep;
  departmentSelect.insertBefore(newOption, departmentSelect.querySelector('option[value="AddOption"]'));
  departmentSelect.value = newDep;
  promptContainer.style.display = "none";
});

closeDep.addEventListener("click", () => {
  promptContainer.style.display = "none";
  departmentSelect.value = "";
});

// Department filter change
departmentFilter.addEventListener("change", () => {
  const selected = departmentFilter.value;
  const filtered = selected === "All"
    ? employees
    : employees.filter(emp => emp.department.trim() === selected);
  renderTable(filtered);
  renderChart(filtered);
});

const editBtn = document.querySelector(".edit-employee");

// Edit button click
editBtn.addEventListener("click", () => {
  if (employees.length === 0) {
    alertModal.style.display = "flex";
    alertMessage.textContent = "No employees to edit.";
    return;
  }
  // Edit the most recent employee (or adjust index logic as needed)
  const latestIndex = employees.length - 1;
  editEmployee(latestIndex);
});




/* Initial Load */
refreshDashboardViews();
