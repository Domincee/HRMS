
import { saveEmployees, loadEmployees } from './storage.js';
import { employeesFromRecord } from './record.js';
let employees = loadEmployees() || [...employeesFromRecord];

const totalEmployee = document.getElementById("totalEmployee");
const employee = document.getElementById("employee");
let editingIndex = -1;

/* ALERT MODAL */
const alertModal = document.getElementById("alertModal");
const alertMessage = document.getElementById("alertMessage");
const alertClose = document.getElementById("alertClose");

/* FOR ADD OPTION */
const prompt = document.getElementById("promptNewDep");
const promptContainer = document.getElementById("promptContainer");
const departmentSelect = document.getElementById("department");
const checkDep = document.getElementById("checkDep");
const closeDep = document.getElementById("closeDep");

/* ALERT  */
const confirmBtns = document.getElementById("confirmationModal");
const confirmMess = document.getElementById("confirm-message");

/* MODALS */
const formModal = document.getElementById("formModal");
const confiModal = document.getElementById("confirmationModal");

/*SHOW FORM EMPLOYEE */
const addNew = document.querySelector(".add-new");
const cancelAdd = document.querySelector(".cancel-add");
const dateInput = document.getElementById("dateHired");
const status = document.getElementById("status");
const dateHiredLabel = document.getElementById("dateHiredLabel");
const statusLabel = document.getElementById("statusLabel");

const formEmp = document.getElementById("employeeForm");
const fNameInput = document.getElementById("firstName");
const lNameInput = document.getElementById("lastName");
const depInput = document.getElementById("department");

// Cancel form modal
cancelAdd.addEventListener("click", function(e) {
  e.preventDefault();
  formModal.style.display = "none"; 
});

// Show Add New Employee Form (only firstName, lastName, department)
addNew.addEventListener("click", function(e) {
  e.preventDefault();
  editingIndex = -1;
  formEmp.reset();
  
  // Hide extra fields on Add
  hideEditFields();

  confiModal.style.display = "none"; 
  formModal.style.display = "flex"; 
  formEmp.style.flexDirection = "column";  
});

// Submit form (Add or Edit)
formEmp.addEventListener('submit', function (e) {
  e.preventDefault();
  const firstName = fNameInput.value.trim();
  const lastName = lNameInput.value.trim();
  const department = depInput.value.trim();

  if (!firstName || !lastName || !department) {
    alertModal.style.display = "flex";
    alertMessage.textContent = "Please fill out all required fields.";
    return;
  }

  // Check duplicates except for currently editing employee
  const exists = employees.some((emp, index) => {
    return (
      index !== editingIndex &&
      emp.firstName.toLowerCase() === firstName.toLowerCase() &&
      emp.lastName.toLowerCase() === lastName.toLowerCase() &&
      emp.department.toLowerCase() === department.toLowerCase()
    );
  });

  if (exists) {
    alertModal.style.display = "flex";
    alertMessage.textContent = `Employee "${firstName} ${lastName}" already exists.`;
    return;
  }

  if (editingIndex >= 0) {
    // Editing employee, include date and active status fields
    const activeValue = status.checked;
    const dateHiredValue = dateInput.value || new Date().toISOString().split('T')[0];
    
    employees[editingIndex] = {
      ...employees[editingIndex],
      firstName,
      lastName,
      department,
      active: activeValue,
      dateHired: dateHiredValue
    };
    alertMessage.textContent = "Employee updated successfully.";
  } else {
    // Adding new employee
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

  saveEmployees(employees);  // <-- Save updated list here

  alertModal.style.display = "flex";
  formModal.style.display = "none";
  updateTable();
});

// Department "AddOption" handler
depInput.addEventListener("change", () => {
  if (depInput.value === "AddOption") {
    promptContainer.style.display = "flex";
    prompt.value = "";
  }
});

// Add new department prompt buttons
checkDep.addEventListener("click", () => {
  const newDep = prompt.value.trim();
  if (newDep === "") {
    alertModal.style.display = "flex";
    alertMessage.textContent = "Please enter a valid department name.";
    return;
  }
  if (Array.from(departmentSelect.options).some(opt => opt.value.toLowerCase() === newDep.toLowerCase())) {
    alertModal.style.display = "flex";
    alertMessage.textContent = `Department "${newDep}" already exists.`;
    return;
  }
  // Add new department option before AddOption
  const newOption = document.createElement("option");
  newOption.value = newDep;
  newOption.textContent = newDep;
  departmentSelect.insertBefore(newOption, departmentSelect.querySelector('option[value="AddOption"]'));

  // Select new department and close prompt
  departmentSelect.value = newDep;
  promptContainer.style.display = "none";
});

closeDep.addEventListener("click", () => {
  promptContainer.style.display = "none";
  departmentSelect.value = "";
});

// Alert modal close button
alertClose.addEventListener("click", () => {
  alertModal.style.display = "none";
});

/* Confirm delete employee */
let deleteIndex = -1;
function confirmDeleteEmployee(index) {
  confiModal.style.display = "flex";
  confirmMess.textContent = "Are you sure you want to delete this employee?";
  deleteIndex = index;
}
confirmBtns.querySelector(".btn-yes").addEventListener("click", () => {
  if (deleteIndex >= 0) {
    employees.splice(deleteIndex, 1);
    saveEmployees(employees); // <-- Save after delete
    updateTable();
  }
  confiModal.style.display = "none";
  deleteIndex = -1;
});
confirmBtns.querySelector(".btn-no").addEventListener("click", () => {
  confiModal.style.display = "none";
  deleteIndex = -1;
});

/* Edit employee */
function editEmployee(index) {
  editingIndex = index;
  const emp = employees[index];

  fNameInput.value = emp.firstName;
  lNameInput.value = emp.lastName;
  depInput.value = emp.department;

  // Show date and status fields on edit
  showEditFields();

  dateInput.value = emp.dateHired || "";
  status.checked = emp.active || false;

  confiModal.style.display = "none";
  formModal.style.display = "flex";
  formEmp.style.flexDirection = "column";
}

/* Show/Hide extra fields */
function showEditFields() {
  dateInput.style.display = "inline-block";
  status.style.display = "inline-block";
  dateHiredLabel.style.display = "block";
  statusLabel.style.display = "block";
}
function hideEditFields() {
  dateInput.style.display = "none";
  status.style.display = "none";
  dateHiredLabel.style.display = "none";
  statusLabel.style.display = "none";
}

/* Render employee list */
function updateTable() {
  const tableBody = document.getElementById("employeeTable");
  tableBody.innerHTML = "";

  if (employees.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No employees found.</td></tr>`;
    totalEmployee.textContent = "0";
    employee.textContent = "Employees";
    return;
  }

  employees.forEach((emp, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.department}</td>
      <td>${emp.active ? "Active" : "Inactive"}</td>
      <td>${emp.dateHired || ""}</td>
      <td>
        <button class="btn btn-primary" data-edit="${i}">Edit</button>
        <button class="btn btn-danger" data-delete="${i}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  totalEmployee.textContent = employees.length;
  employee.textContent = employees.length === 1 ? "Employee" : "Employees";

  // Bind edit/delete buttons
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = +e.target.getAttribute("data-edit");
      editEmployee(idx);
    });
  });
  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = +e.target.getAttribute("data-delete");
      confirmDeleteEmployee(idx);
    });
  });
}

/* Initial render */
updateTable();



const tableBody = document.getElementById("employeeTableBody");
const departmentFilter = document.getElementById("departmentFilter");
const chart = document.getElementById("chart");

// Populate department filter
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
      <td>${emp.active ? "Yes" : "No"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Render chart with sorted and filtered data
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

// Department dropdown change event
departmentFilter.addEventListener("change", () => {
  const selected = departmentFilter.value;
  const filtered = selected === "All"
    ? employees
    : employees.filter(emp => emp.department.trim() === selected);
  renderTable(filtered);
  renderChart(filtered);
});

// For live updates
function addEmployee(employee) {
  employees.push(employee);
  populateDepartmentFilter();
  const selected = departmentFilter.value;
  const filtered = selected === "All"
    ? employees
    : employees.filter(emp => emp.department.trim() === selected);
  renderTable(filtered);
  renderChart(filtered);
}

// Initial render
populateDepartmentFilter();
renderTable(employees);
renderChart(employees);