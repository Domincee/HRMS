import { employeesFromRecord } from '/public/js/record.js';
import { initDepartmentSuggestions } from '/public/js/departmentSuggest.js';
import { saveEmployees, loadEmployees } from '/public/js/storage.js';

// Load employees (localStorage or fallback)
let employees = loadEmployees() || [...employeesFromRecord];

// Modal elements
const addButton = document.querySelector(".add-new");
const modal = document.getElementById("addEmployeeModal");
const closeBtn = modal.querySelector(".close");
const form = document.getElementById("addEmployeeForm");

// Initialize department suggestions independently
initDepartmentSuggestions("department", employees);

// Open modal on Add click
addButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Close modal on close button click or outside click
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const department = document.getElementById("department").value.trim();

  if (!firstName || !lastName || !department) {
    alert("All fields are required.");
    return;
  }

  const newEmployee = {
    id: `EMP-${Date.now()}`,
    firstName,
    lastName,
    age: "-", // placeholder
    department,
    dateHired: new Date().toISOString().split('T')[0],
    active: true
  };

  employees.push(newEmployee);
  saveEmployees(employees);

  // Dispatch event so other modules (like dashboard.js) can update
  window.dispatchEvent(new CustomEvent("employeeAdded", { detail: newEmployee }));

  // Reset and close modal
  form.reset();
  modal.classList.add("hidden");

  // Re-init department suggestions with updated list
  initDepartmentSuggestions("department", employees);
});
