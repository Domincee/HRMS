 

import { employees } from '/employees.js';
import { attendanceRecords } from '/attendance.js';

const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

export function render() {
  const div = document.createElement('div');
  div.className = 'attendance-manager';

  div.innerHTML = `
    <h2>Employee Attendance Manager</h2>
    <p>Mark attendance for <strong>${today}</strong>.</p>

    <table class="attendance-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${employees.map(emp => {
          const record = attendanceRecords.find(
            r => r.employeeId === emp.id && r.date === today
          );
          const status = record ? record.status : '';

          return `
            <tr data-employee-id="${emp.id}">
              <td>${emp.name}</td>
              <td>${emp.department}</td>
              <td>
                <select class="attendance-select">
                  <option value="">-- Select --</option>
                  <option value="Present" ${status === 'Present' ? 'selected' : ''}>Present</option>
                  <option value="Absent" ${status === 'Absent' ? 'selected' : ''}>Absent</option>
                  <option value="Late" ${status === 'Late' ? 'selected' : ''}>Late</option>
                  <option value="On Leave" ${status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                </select>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <button class="save-attendance-btn">💾 Save Attendance</button>
    <p class="save-message" style="color: green; display: none;">Attendance saved!</p>
  `;

  // Save logic (in-memory simulation)
  div.querySelector('.save-attendance-btn').addEventListener('click', () => {
    const rows = div.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const employeeId = parseInt(row.getAttribute('data-employee-id'));
      const status = row.querySelector('.attendance-select').value;

      const existingRecord = attendanceRecords.find(
        r => r.employeeId === employeeId && r.date === today
      );

      if (existingRecord) {
        existingRecord.status = status; // Update
      } else {
        attendanceRecords.push({ employeeId, date: today, status }); // Add new
      }
    });

    const msg = div.querySelector('.save-message');
    msg.style.display = 'block';
    setTimeout(() => (msg.style.display = 'none'), 2000);
  });

  return div;
}
