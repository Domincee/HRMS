export function render() {
  const div = document.createElement('div');
  div.className = 'dashboard-container';

  div.innerHTML = `
    <h2 class="dashboard-heading">Dashboard</h2>
    <p class="dashboard-subtext">Welcome to your daily HR overview.</p>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card">
        <h3>Total Employees</h3>
        <p class="count text-indigo">120</p>
      </div>
      <div class="card">
        <h3>Present Today</h3>
        <p class="count text-green">98</p>
      </div>
      <div class="card">
        <h3>Absent Today</h3>
        <p class="count text-red">22</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="btn-center">
      <div class="quick-actions">
        <button class="add-btn">➕ Add Employee</button>
        <button class="edit-btn">✏️ Edit Records</button>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-box">
        <h4>🏆 Top Attendance</h4>
        <ul>
          <li>John Doe - <span class="highlight green">98%</span></li>
          <li>Jane Smith - <span class="highlight green">96%</span></li>
          <li>Mike Reyes - <span class="highlight green">95%</span></li>
        </ul>
      </div>
      <div class="stat-box">
        <h4>💼 Top Performer</h4>
        <ul>
          <li>Maria Cruz - ⭐⭐⭐⭐⭐</li>
          <li>Leo Tan - ⭐⭐⭐⭐</li>
          <li>Ann Lim - ⭐⭐⭐⭐</li>
        </ul>
      </div>
    </div>

    <!-- Graphs Section -->
    <div class="charts-row">
      <div class="chart-wrapper">
            <canvas id="departmentChart" class="department-chart"></canvas>
      </div>
      <div class="chart-wrapper">
                <canvas id="attendanceChart" class="attendance-chart"></canvas>
        </div>
    </div>
  `;

  // Chart rendering remains unchanged
  setTimeout(() => {
    const departmentCtx = div.querySelector('#departmentChart');
    const attendanceCtx = div.querySelector('#attendanceChart');

    if (departmentCtx) {
      new Chart(departmentCtx, {
        type: 'bar',
        data: {
          labels: ['IT', 'HR', 'Finance', 'Marketing', 'Operations'],
          datasets: [{
            label: 'Employee Count',
            data: [40, 15, 20, 25, 20],
            backgroundColor: ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Employees per Department', font: { size: 16 } }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 5 } }
          }
        }
      });
    }

    if (attendanceCtx) {
      new Chart(attendanceCtx, {
        type: 'pie',
        data: {
          labels: ['Present', 'Absent', 'Late', 'On Leave'],
          datasets: [{
            data: [98, 22, 5, 10],
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B', '#3B82F6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 14 } } },
            title: { display: true, text: 'Attendance Status Breakdown', font: { size: 16 } }
          }
        }
      });
    }
  }, 0);

  return div;
}
