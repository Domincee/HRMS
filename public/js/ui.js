document.addEventListener("DOMContentLoaded", () => {
  /* ------------------- ACCOUNT DROPDOWN ------------------- */
  const toggleDrop = document.getElementById("toggle-drop");
  const accountDrop = document.querySelector('.accout-dropdown');

  document.addEventListener("click", (event) => {
    if (!toggleDrop.contains(event.target) && !accountDrop.contains(event.target)) {
      accountDrop.classList.add("hidden");
    }
  });

  toggleDrop.addEventListener("click", () => {
    accountDrop.classList.toggle("hidden");
  });

  /* ------------------- QUICK MANAGE ------------------- */
  const showQuickManage = document.getElementById("showQuickManage");
  const manageShow = document.querySelector('.manage-show');

  document.addEventListener("click", (event) => {
    if (showQuickManage && manageShow && !showQuickManage.contains(event.target) && !manageShow.contains(event.target)) {
      manageShow.classList.add("hidden");
    }
  });

  if (showQuickManage) {
    showQuickManage.addEventListener("click", () => {
      manageShow.classList.toggle("hidden");
    });
  }

  /* ------------------- NAVIGATION ACTIVE STATE ------------------- */
  const listItems = document.querySelectorAll('.navigator-container .list-icon');
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      listItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ------------------- SLIDER SECTION ------------------- */
  const sections = ['container1', 'container2'];
  let currentIndex = 0;

  function showSection(index) {
    sections.forEach((id, i) => {
      const section = document.getElementById(id);
      if (section) section.classList.toggle('active', i === index);
    });
  }

  showSection(currentIndex);

  document.getElementById('arrowLeft').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sections.length) % sections.length;
    showSection(currentIndex);
  });

  document.getElementById('arrowRight').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sections.length;
    showSection(currentIndex);
  });

  /* ------------------- MODAL OPEN ------------------- */
  const modal = document.getElementById("addEmployeeModal");
  const addNewBtn = document.getElementById("addNewBtn");

  if (addNewBtn && modal) {
    addNewBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  /* ------------------- PANEL TOGGLE ------------------- */
  const dashboardPanel = document.querySelector('.dashboard-section');
  const btnDashboard = document.getElementById("dashboardBtn");
  const employeeBtn = document.getElementById("toggleEmployee");
  const employeePanel = document.querySelector('.employee-section'); // same as dashboardPanel?

  btnDashboard.addEventListener('click', () => {
     dashboardPanel.classList.remove('hidden');
      employeePanel.classList.add('hidden');
    if (!btnDashboard.classList.contains('active')) {
      btnDashboard.classList.add('active');
     
    }
  });

  employeeBtn.addEventListener('click', () => {
     dashboardPanel.classList.add('hidden');
      employeePanel.classList.remove('hidden');
    if (btnDashboard.classList.contains('active')) {
      btnDashboard.classList.remove('active');
      dashboardPanel.classList.add('hidden');
    }

    if (!employeeBtn.classList.contains('active')) {
      employeeBtn.classList.add('active');
      employeePanel.classList.remove('hidden');
    }
  });

  /* ------------------- DRAG SCROLL - TABLE ------------------- */
  const tableContainer = document.querySelector('.table-container');
  let isTableDown = false;
  let tableStartX, tableStartY;
  let tableScrollLeft, tableScrollTop;

  tableContainer?.addEventListener('mousedown', (e) => {
    isTableDown = true;
    tableContainer.classList.add('active');
    tableStartX = e.pageX - tableContainer.offsetLeft;
    tableStartY = e.pageY - tableContainer.offsetTop;
    tableScrollLeft = tableContainer.scrollLeft;
    tableScrollTop = tableContainer.scrollTop;
  });

  tableContainer?.addEventListener('mouseleave', () => {
    isTableDown = false;
    tableContainer.classList.remove('active');
  });

  tableContainer?.addEventListener('mouseup', () => {
    isTableDown = false;
    tableContainer.classList.remove('active');
  });

  tableContainer?.addEventListener('mousemove', (e) => {
    if (!isTableDown) return;
    e.preventDefault();
    const x = e.pageX - tableContainer.offsetLeft;
    const y = e.pageY - tableContainer.offsetTop;
    const walkX = (x - tableStartX) * 1.5;
    const walkY = (y - tableStartY) * 1.5;
    tableContainer.scrollLeft = tableScrollLeft - walkX;
    tableContainer.scrollTop = tableScrollTop - walkY;
  });

  tableContainer?.addEventListener('touchstart', (e) => {
    isTableDown = true;
    tableStartX = e.touches[0].pageX - tableContainer.offsetLeft;
    tableStartY = e.touches[0].pageY - tableContainer.offsetTop;
    tableScrollLeft = tableContainer.scrollLeft;
    tableScrollTop = tableContainer.scrollTop;
  });

  tableContainer?.addEventListener('touchmove', (e) => {
    if (!isTableDown) return;
    const x = e.touches[0].pageX - tableContainer.offsetLeft;
    const y = e.touches[0].pageY - tableContainer.offsetTop;
    const walkX = (x - tableStartX) * 1.5;
    const walkY = (y - tableStartY) * 1.5;
    tableContainer.scrollLeft = tableScrollLeft - walkX;
    tableContainer.scrollTop = tableScrollTop - walkY;
  });

  /* ------------------- DRAG SCROLL - BAR CHART ------------------- */
  const barChart = document.getElementById('barChart');
  let isDragging = false;
  let chartStartY, chartScrollTop;

  barChart?.addEventListener('mousedown', (e) => {
    isDragging = true;
    chartStartY = e.pageY - barChart.offsetTop;
    chartScrollTop = barChart.scrollTop;
    barChart.classList.add('active');
  });

  barChart?.addEventListener('mouseleave', () => {
    isDragging = false;
    barChart.classList.remove('active');
  });

  barChart?.addEventListener('mouseup', () => {
    isDragging = false;
    barChart.classList.remove('active');
  });

  barChart?.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY - barChart.offsetTop;
    const walk = (y - chartStartY) * 1.5;
    barChart.scrollTop = chartScrollTop - walk;
  });

  barChart?.addEventListener('touchstart', (e) => {
    isDragging = true;
    chartStartY = e.touches[0].pageY - barChart.offsetTop;
    chartScrollTop = barChart.scrollTop;
  });

  barChart?.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const y = e.touches[0].pageY - barChart.offsetTop;
    const walk = (y - chartStartY) * 1.5;
    barChart.scrollTop = chartScrollTop - walk;
  });
});
