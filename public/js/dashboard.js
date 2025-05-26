import { saveEmployees, loadEmployees } from '/public/js/storage.js';
import { employeesFromRecord } from '/public/js/record.js';

import { initDepartmentSuggestions } from '/public/js/departmentSuggest.js';

// After loading employees:
initDepartmentSuggestions("department", employees);


let employees = loadEmployees() || [...employeesFromRecord];

// Color map
const departmentColorMap = {};
const colorPalette = [
  "#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0",
  "#FF5722", "#607D8B", "#3F51B5", "#009688", "#795548", "#07ff6afe"
];

function getColorForDepartment(dept) {
  if (!departmentColorMap[dept]) {
    const usedColors = Object.values(departmentColorMap);
    const availableColors = colorPalette.filter(c => !usedColors.includes(c));
    departmentColorMap[dept] = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : `#${Math.floor(Math.random()*16777215).toString(16)}`; // fallback
  }
  return departmentColorMap[dept];
}

// Main dashboard initializer
export function initDashboard() {
  const tableBody = document.getElementById("employeeTableBody");
  const departmentFilter = document.getElementById("departmentFilter");
  const chart = document.getElementById("chart");
  const searchInput = document.getElementById("searchInput");

  if (!tableBody || !departmentFilter || !chart || !searchInput) {
    console.error("One or more dashboard elements not found.");
    return;
  }

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

  function renderTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No employees found.</td></tr>`;
      return;
    }
    data.forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><b>${emp.id}</b></td>
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
      bar.style.backgroundColor = getColorForDepartment(dept);
      bar.style.height = `${(count / maxCount) * 50}%`;
      if (count === maxCount) bar.classList.add("highlight");

      const value = document.createElement("div");
      value.className = "bar-value";
      value.textContent = count;
      bar.appendChild(value);

      const label = document.createElement("div");
      label.className = "bar-label";
      bar.appendChild(label);

      chart.appendChild(bar);
    });
  }

  function renderDepartmentColors() {
    const container = document.getElementById("departmentColor");
    if (!container) return;
    container.innerHTML = "";
    Object.entries(departmentColorMap).forEach(([dept, color]) => {
      const item = document.createElement("div");
      item.className = "dep-color-item";

      const circle = document.createElement("div");
      circle.className = "dep-color-circle";
      circle.style.backgroundColor = color;

      const label = document.createElement("span");
      label.textContent = dept;

      item.appendChild(circle);
      item.appendChild(label);
      container.appendChild(item);
    });
  }

  departmentFilter.addEventListener("change", () => {
    const selected = departmentFilter.value;
    const filtered = selected === "All"
      ? employees
      : employees.filter(emp => emp.department.trim() === selected);
    renderTable(filtered);
    renderChart(filtered);
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = employees.filter(emp =>
      emp.firstName.toLowerCase().startsWith(query) ||
      emp.lastName.toLowerCase().startsWith(query) ||
      emp.department.toLowerCase().startsWith(query)
    );
    renderTable(filtered);
    renderChart(filtered); // ✅ FIXED from renderBarGraph
  });

  function addEmployee(employee) {
    employees.push(employee);
    populateDepartmentFilter();
    const selected = departmentFilter.value;
    const filtered = selected === "All"
      ? employees
      : employees.filter(emp => emp.department.trim() === selected);
    renderTable(filtered);
    renderChart(filtered);
    updateDashboardCounters(); 
  }


  function updateDashboardCounters() {
  const totalEmployeeElem = document.getElementById("totalEmployee");
  const newEmpTotalElem = document.getElementById("newEmpTotal");
  const totalDepartmentsElem = document.getElementById("totalDepartments");

  // Total employees
  if (totalEmployeeElem) {
    totalEmployeeElem.textContent = employees.length;
  }

  // New employees (hired in last 7 days)
  const recentThreshold = new Date();
  recentThreshold.setDate(recentThreshold.getDate() - 7);

  const newEmployees = employees.filter(emp => {
    const hiredDate = new Date(emp.dateHired);
    return hiredDate >= recentThreshold;
  });

  if (newEmpTotalElem) {
    newEmpTotalElem.textContent = newEmployees.length;
  }

  // Total departments
  const uniqueDepartments = new Set(employees.map(emp => emp.department.trim()));
  if (totalDepartmentsElem) {
    totalDepartmentsElem.textContent = uniqueDepartments.size;
  }
}



  // Initial calls
  populateDepartmentFilter();
  renderTable(employees);
  renderChart(employees);
  renderDepartmentColors();
  updateDashboardCounters();
}


