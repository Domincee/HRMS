/* for BAR CHART */

import { employeesFromRecord } from '/public/js/record.js';
  import { loadEmployees } from '/public/js/storage.js';

  let employees = loadEmployees() || [...employeesFromRecord];

  function generateBarChart(containerId, employeeData) {
    const chart = document.getElementById(containerId);

    const counts = {};
    employeeData.forEach(emp => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });


    /* media screen */
   const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    let departmentColors = JSON.parse(localStorage.getItem('departmentColors')) || {};

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function saveDepartmentColors() {
      localStorage.setItem('departmentColors', JSON.stringify(departmentColors));
    }
    const data = Object.entries(counts).map(([label, value]) => ({ label, value }));
    const max = Math.max(...data.map(d => d.value));

    chart.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('div');
      row.className = 'bar-row';

      const label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = item.label;

      const container = document.createElement('div');
      container.className = 'bar-container';

      const fill = document.createElement('div');

      fill.className = 'bar-fill';

       if (isDesktop) {
    fill.style.height = `${(item.value / max) * 100}%`;  // vertical bars on desktop
        fill.style.width = '100%'; // full width for vertical bars
      } else {
        fill.style.width = `${(item.value / max) * 100}%`;  // horizontal bars on mobile
        fill.style.height = '100%'; // full height for horizontal bars
      }

      
    if (!departmentColors[item.label]) {
      departmentColors[item.label] = getRandomColor();
       saveDepartmentColors();
    }
    fill.style.backgroundColor = departmentColors[item.label];
      const value = document.createElement('span');
      value.className = 'bar-value';
      value.textContent = item.value;

      container.appendChild(fill);
      container.appendChild(value);
      row.appendChild(label);
      row.appendChild(container);
      chart.appendChild(row);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    generateBarChart('barChart', employees);
  });




function updateDashboardStats() {
  const employees = loadEmployees() || [...employeesFromRecord];

  // 1. Total employees
  const totalEmployees = employees.length;

  // 2. New employees this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newEmployeesThisMonth = employees.filter(emp => {
    if (!emp.dateHired) return false; // skip if date is missing
    const date = new Date(emp.dateHired);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // 3. Unique departments
  const departments = new Set(employees.map(emp => emp.department));
  const totalDepartments = departments.size;

  // Update DOM
  document.getElementById('totalEmployee').textContent = totalEmployees;
  document.getElementById('newEmpTotal').textContent = newEmployeesThisMonth.length;
  document.getElementById('totalDepartments').textContent = totalDepartments;
}

// Call on page load
window.addEventListener('DOMContentLoaded', () => {
  updateDashboardStats();
});
